import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class ClinicalAlertsRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'ClinicalAlertsRepository');
  }

  /** List alerts with optional filters */
  async findAll(params: {
    severity?: string;
    status?: string;
    page?: number;
    perPage?: number;
  }) {
    const { severity, status, page = 1, perPage = 20 } = params;
    const offset = (page - 1) * perPage;
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (severity && severity !== 'all') {
      conditions.push(`a.type = $${paramIndex}`);
      values.push(severity);
      paramIndex++;
    }
    if (status && status !== 'all') {
      conditions.push(`a.status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const countResult = await this.query(
      `SELECT COUNT(*)::int AS total FROM alerts a ${whereClause}`,
      values,
    );

    const dataResult = await this.query(
      `SELECT a.*,
              u.name AS patient_name,
              u.name_hi AS patient_name_hi,
              ack_u.name AS acknowledged_by_name,
              res_u.name AS resolved_by_name
       FROM alerts a
       JOIN patients p ON p.id = a.patient_id
       JOIN users u ON u.id = p.user_id
       LEFT JOIN users ack_u ON ack_u.id = a.acknowledged_by
       LEFT JOIN users res_u ON res_u.id = a.resolved_by
       ${whereClause}
       ORDER BY
         CASE a.type WHEN 'critical' THEN 0 WHEN 'warning' THEN 1 ELSE 2 END,
         a.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, perPage, offset],
    );

    return {
      data: dataResult.rows,
      pagination: this.buildPagination(countResult.rows[0].total, page, perPage),
    };
  }

  /** Find alerts for a specific patient */
  async findByPatient(patientId: string, status: string = 'active') {
    const result = await this.query(
      `SELECT * FROM alerts
       WHERE patient_id = $1 AND status = $2
       ORDER BY created_at DESC`,
      [patientId, status],
    );
    return result.rows;
  }

  /** Find alert by ID */
  async findById(alertId: string) {
    return this.queryOne(
      `SELECT a.*,
              u.name AS patient_name,
              p.primary_diagnosis
       FROM alerts a
       JOIN patients p ON p.id = a.patient_id
       JOIN users u ON u.id = p.user_id
       WHERE a.id = $1`,
      [alertId],
    );
  }

  /** Acknowledge an alert */
  async acknowledge(alertId: string, clinicianId: string) {
    return this.queryOne(
      `UPDATE alerts
       SET status = 'acknowledged',
           acknowledged_by = $2,
           acknowledged_at = NOW()
       WHERE id = $1 AND status = 'active'
       RETURNING *`,
      [alertId, clinicianId],
    );
  }

  /** Resolve an alert */
  async resolve(alertId: string, clinicianId: string, notes?: string) {
    return this.queryOne(
      `UPDATE alerts
       SET status = 'resolved',
           resolved_by = $2,
           resolved_at = NOW(),
           resolution_notes = $3
       WHERE id = $1 AND status IN ('active', 'acknowledged')
       RETURNING *`,
      [alertId, clinicianId, notes || null],
    );
  }

  /** Escalate an alert */
  async escalate(alertId: string, escalateTo: string) {
    return this.queryOne(
      `UPDATE alerts
       SET status = 'escalated',
           escalated_to = $2,
           escalated_at = NOW()
       WHERE id = $1 AND status IN ('active', 'acknowledged')
       RETURNING *`,
      [alertId, escalateTo],
    );
  }

  /** Count active alerts by severity */
  async countBySeverity() {
    const result = await this.query(
      `SELECT type, COUNT(*)::int AS count
       FROM alerts
       WHERE status = 'active'
       GROUP BY type`,
    );
    return result.rows;
  }

  // ── Alert Rule Engine Queries ────────────────────────────────

  /** Check if an active alert of this trigger rule already exists */
  async hasActiveAlert(patientId: string, triggerRule: string): Promise<boolean> {
    const result = await this.queryOne(
      `SELECT 1 FROM alerts
       WHERE patient_id = $1 AND trigger_rule = $2 AND status = 'active'
       LIMIT 1`,
      [patientId, triggerRule],
    );
    return !!result;
  }

  /** Create an auto-generated alert, assigned to patient's primary clinician */
  async createAutoAlert(data: {
    patientId: string;
    type: 'critical' | 'warning' | 'info';
    triggerRule: string;
    message: string;
    details: Record<string, unknown>;
  }) {
    return this.queryOne(
      `INSERT INTO alerts (patient_id, type, trigger_rule, message, details, status, auto_generated, assigned_to)
       SELECT $1, $2, $3, $4, $5::jsonb, 'active', TRUE, p.primary_clinician_id
       FROM patients p WHERE p.id = $1
       RETURNING *`,
      [data.patientId, data.type, data.triggerRule, data.message, JSON.stringify(data.details)],
    );
  }

  /** Get recent symptom logs for rule evaluation */
  async getRecentSymptomLogs(patientId: string, days: number) {
    const result = await this.query(
      `SELECT * FROM symptom_logs
       WHERE patient_id = $1 AND timestamp >= NOW() - make_interval(days => $2)
       ORDER BY timestamp DESC`,
      [patientId, days],
    );
    return result.rows;
  }

  /** Get medication adherence stats over N days */
  async getMedAdherenceData(patientId: string, days: number): Promise<{ taken: number; total: number }> {
    const result = await this.queryOne(
      `SELECT
         COUNT(*) FILTER (WHERE status IN ('taken', 'taken_late'))::int AS taken,
         COUNT(*)::int AS total
       FROM medication_logs
       WHERE patient_id = $1 AND scheduled_time >= NOW() - make_interval(days => $2)`,
      [patientId, days],
    );
    return { taken: result?.taken || 0, total: result?.total || 0 };
  }

  /** Calculate total daily MEDD from active opioid medications */
  async getTotalMedd(patientId: string): Promise<number> {
    const result = await this.queryOne(
      `SELECT COALESCE(SUM(
         dose * COALESCE(medd_factor, 0) * CASE frequency
           WHEN 'once_daily' THEN 1 WHEN 'twice_daily' THEN 2 WHEN 'thrice_daily' THEN 3
           WHEN 'four_times_daily' THEN 4 WHEN 'every_4h' THEN 6 WHEN 'every_6h' THEN 4
           WHEN 'every_8h' THEN 3 WHEN 'every_12h' THEN 2 WHEN 'prn' THEN 2
           WHEN 'weekly' THEN 0.143 WHEN 'alternate_days' THEN 0.5 WHEN 'stat' THEN 1
           ELSE 1 END
       ), 0)::float AS total_medd
       FROM medications
       WHERE patient_id = $1 AND status = 'active' AND category = 'opioid'`,
      [patientId],
    );
    return Math.round((result?.total_medd || 0) * 100) / 100;
  }

  /** Get clinician user IDs who should be notified about a patient's alerts */
  async getClinicianIdsForPatient(patientId: string): Promise<string[]> {
    const result = await this.query(
      `SELECT DISTINCT uid FROM (
         SELECT primary_clinician_id AS uid FROM patients WHERE id = $1 AND primary_clinician_id IS NOT NULL
         UNION
         SELECT UNNEST(care_team_ids) AS uid FROM patients WHERE id = $1
       ) sub WHERE uid IS NOT NULL`,
      [patientId],
    );
    return result.rows.map((r: any) => r.uid);
  }

  /** Get all active patient IDs (for cron-based rule evaluation) */
  async getActivePatientIds(): Promise<string[]> {
    const result = await this.query(
      `SELECT p.id FROM patients p
       JOIN users u ON u.id = p.user_id
       WHERE u.is_active = TRUE`,
    );
    return result.rows.map((r: any) => r.id);
  }
}
