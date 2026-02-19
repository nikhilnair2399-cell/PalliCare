import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

/** Standard MEDD conversion factors (mg oral morphine equivalent per unit dose) */
const MEDD_FACTORS: Record<string, number> = {
  morphine_oral: 1,
  morphine_iv: 3,
  morphine_sc: 3,
  oxycodone: 1.5,
  hydromorphone_oral: 4,
  hydromorphone_iv: 20,
  fentanyl_patch: 2.4,   // mcg/hr -> MEDD
  fentanyl_iv: 100,
  methadone: 4.7,         // variable, conservative
  codeine: 0.15,
  tramadol: 0.1,
  tapentadol: 0.4,
  buprenorphine_sl: 30,
};

@Injectable()
export class MedicationsRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'MedicationsRepository');
  }

  /** List active medications for a patient */
  async findByPatient(patientId: string, status: string = 'active') {
    const statusFilter = status === 'all' ? '' : `AND m.status = $2`;
    const params: any[] = [patientId];
    if (status !== 'all') params.push(status);

    const result = await this.query(
      `SELECT m.*, u.name AS prescribed_by_name
       FROM medications m
       LEFT JOIN users u ON u.id = m.prescribed_by
       WHERE m.patient_id = $1 ${statusFilter}
       ORDER BY m.category, m.name`,
      params,
    );
    return result.rows;
  }

  /** Get single medication */
  async findById(medicationId: string) {
    return this.queryOne(
      `SELECT m.*, u.name AS prescribed_by_name
       FROM medications m
       LEFT JOIN users u ON u.id = m.prescribed_by
       WHERE m.id = $1`,
      [medicationId],
    );
  }

  /** Log medication administration */
  async createMedLog(data: {
    medication_id: string;
    patient_id: string;
    scheduled_time?: string;
    actual_time?: string;
    status: string;
    administered_by?: string;
    notes?: string;
    skip_reason?: string;
    pain_before?: number;
    pain_after?: number;
  }) {
    const {
      medication_id, patient_id, scheduled_time, actual_time,
      status, administered_by, notes, skip_reason,
      pain_before, pain_after,
    } = data;

    return this.queryOneOrFail(
      `INSERT INTO medication_logs
         (medication_id, patient_id, scheduled_time, actual_time,
          status, administered_by, notes, skip_reason,
          pain_before, pain_after)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        medication_id, patient_id, scheduled_time,
        actual_time || new Date().toISOString(),
        status, administered_by, notes, skip_reason,
        pain_before, pain_after,
      ],
    );
  }

  /** Get medication logs for a specific medication */
  async findMedLogs(medicationId: string, page = 1, perPage = 20) {
    const offset = (page - 1) * perPage;

    const countResult = await this.query(
      `SELECT COUNT(*)::int AS total FROM medication_logs WHERE medication_id = $1`,
      [medicationId],
    );

    const dataResult = await this.query(
      `SELECT ml.*, u.name AS administered_by_name
       FROM medication_logs ml
       LEFT JOIN users u ON u.id = ml.administered_by
       WHERE ml.medication_id = $1
       ORDER BY ml.created_at DESC
       LIMIT $2 OFFSET $3`,
      [medicationId, perPage, offset],
    );

    return {
      data: dataResult.rows,
      pagination: this.buildPagination(countResult.rows[0].total, page, perPage),
    };
  }

  /** Today's medication schedule for a patient */
  async getTodaySchedule(patientId: string) {
    const result = await this.query(
      `SELECT
          m.id AS medication_id,
          m.name,
          m.name_hi,
          m.dose,
          m.unit,
          m.route,
          m.category,
          m.is_prn,
          m.instructions,
          m.instructions_hi,
          sched.value::text AS scheduled_time,
          ml.id AS log_id,
          ml.status AS log_status,
          ml.actual_time
       FROM medications m
       CROSS JOIN LATERAL jsonb_array_elements(m.schedule_times) AS sched
       LEFT JOIN medication_logs ml
         ON ml.medication_id = m.id
         AND ml.scheduled_time::date = CURRENT_DATE
         AND ml.scheduled_time::time = (sched.value #>> '{}')::time
       WHERE m.patient_id = $1
         AND m.status = 'active'
         AND m.is_prn = FALSE
       ORDER BY (sched.value #>> '{}')::time`,
      [patientId],
    );
    return result.rows;
  }

  /** Calculate MEDD for a patient's active opioid medications */
  async calculateMedd(patientId: string) {
    const opioids = await this.query(
      `SELECT name, generic_name, dose, unit, frequency, medd_factor, route
       FROM medications
       WHERE patient_id = $1
         AND status = 'active'
         AND category = 'opioid'`,
      [patientId],
    );

    let totalMedd = 0;
    const breakdown = opioids.rows.map((med) => {
      // Use stored medd_factor or lookup from table
      const factor = med.medd_factor
        ? parseFloat(med.medd_factor)
        : this.lookupMeddFactor(med.generic_name || med.name, med.route);

      // Estimate daily dose from frequency
      const dailyDose = this.estimateDailyDose(med.dose, med.frequency);
      const meddContribution = dailyDose * factor;
      totalMedd += meddContribution;

      return {
        medication_name: med.name,
        dose: `${med.dose} ${med.unit}`,
        frequency: med.frequency,
        medd_contribution_mg: Math.round(meddContribution * 10) / 10,
      };
    });

    return {
      total_medd_mg: Math.round(totalMedd * 10) / 10,
      breakdown,
    };
  }

  /** Clinician view: patient medications */
  async findByPatientForClinician(patientId: string) {
    const result = await this.query(
      `SELECT m.*, u.name AS prescribed_by_name
       FROM medications m
       LEFT JOIN users u ON u.id = m.prescribed_by
       WHERE m.patient_id = $1
       ORDER BY
         CASE m.status WHEN 'active' THEN 0 WHEN 'paused' THEN 1 ELSE 2 END,
         m.category, m.name`,
      [patientId],
    );
    return result.rows;
  }

  // ─── Private helpers ──────────────────────────────────────

  private lookupMeddFactor(drugName: string, route: string): number {
    const normalised = drugName
      .toLowerCase()
      .replace(/[^a-z]/g, '_')
      .replace(/_+/g, '_');

    // Try exact match
    if (MEDD_FACTORS[normalised]) return MEDD_FACTORS[normalised];

    // Try with route suffix
    const withRoute = `${normalised}_${route}`;
    if (MEDD_FACTORS[withRoute]) return MEDD_FACTORS[withRoute];

    // Partial match
    for (const [key, value] of Object.entries(MEDD_FACTORS)) {
      if (normalised.includes(key) || key.includes(normalised)) {
        return value;
      }
    }

    return 1; // default factor
  }

  private estimateDailyDose(dose: number, frequency: string): number {
    const freq = frequency.toLowerCase();
    if (freq.includes('od') || freq.includes('once daily') || freq.includes('qd'))
      return dose;
    if (freq.includes('bd') || freq.includes('bid') || freq.includes('twice'))
      return dose * 2;
    if (freq.includes('tds') || freq.includes('tid') || freq.includes('three'))
      return dose * 3;
    if (freq.includes('qid') || freq.includes('four'))
      return dose * 4;
    if (freq.includes('q4h') || freq.includes('4 hourly'))
      return dose * 6;
    if (freq.includes('q8h') || freq.includes('8 hourly'))
      return dose * 3;
    if (freq.includes('q12h') || freq.includes('12 hourly'))
      return dose * 2;
    if (freq.includes('72h') || freq.includes('every 3 day'))
      return dose / 3;
    if (freq.includes('weekly'))
      return dose / 7;
    if (freq.includes('prn') || freq.includes('as needed'))
      return dose; // assume once daily for PRN
    return dose; // default: once daily
  }
}
