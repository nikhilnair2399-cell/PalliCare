import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class PatientsRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'PatientsRepository');
  }

  /** Clinician list view — aggregated patient summaries */
  async findAllForClinician(params: {
    statusFilter?: string;
    sortBy?: string;
    search?: string;
    page?: number;
    perPage?: number;
    clinicianUserId?: string;
    role?: string;
  }) {
    const { statusFilter, sortBy, search, page = 1, perPage = 20, clinicianUserId, role } = params;
    const offset = (page - 1) * perPage;
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // When clinicianUserId is provided and the user is not an admin,
    // restrict to patients assigned to this clinician
    let assignmentJoin = '';
    if (clinicianUserId && role !== 'admin') {
      assignmentJoin = `JOIN patient_clinician_assignments pca ON pca.patient_id = p.id AND pca.clinician_user_id = $${paramIndex} AND pca.status = 'active'`;
      values.push(clinicianUserId);
      paramIndex++;
    }

    if (search) {
      conditions.push(`(u.name ILIKE $${paramIndex} OR u.phone ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderClause = 'ORDER BY u.name ASC';
    switch (sortBy) {
      case 'last_log':
        orderClause = 'ORDER BY last_log_at DESC NULLS LAST';
        break;
      case 'pain_score':
        orderClause = 'ORDER BY latest_pain DESC NULLS LAST';
        break;
      case 'name':
      default:
        orderClause = 'ORDER BY u.name ASC';
    }

    // Count total
    const countResult = await this.query(
      `SELECT COUNT(*)::int as total
       FROM patients p
       JOIN users u ON u.id = p.user_id
       ${assignmentJoin}
       ${whereClause}`,
      values,
    );
    const total = countResult.rows[0].total;

    // Fetch page with aggregated metrics
    const dataResult = await this.query(
      `SELECT
          p.id,
          u.name,
          u.name_hi,
          p.primary_diagnosis,
          p.phase_of_illness,
          p.pps_score,
          p.care_setting,
          (SELECT pain_intensity FROM symptom_logs sl
           WHERE sl.patient_id = p.id ORDER BY sl.timestamp DESC LIMIT 1
          ) AS latest_pain,
          (SELECT AVG(pain_intensity) FROM symptom_logs sl
           WHERE sl.patient_id = p.id AND sl.timestamp > NOW() - INTERVAL '7 days'
             AND sl.pain_intensity IS NOT NULL
          )::numeric(4,1) AS pain_avg_7d,
          (SELECT MAX(sl.timestamp) FROM symptom_logs sl
           WHERE sl.patient_id = p.id
          ) AS last_log_at,
          (SELECT COUNT(*)::int FROM alerts a
           WHERE a.patient_id = p.id AND a.status = 'active'
          ) AS active_alerts_count
       FROM patients p
       JOIN users u ON u.id = p.user_id
       ${assignmentJoin}
       ${whereClause}
       ${orderClause}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, perPage, offset],
    );

    return {
      data: dataResult.rows,
      pagination: this.buildPagination(total, page, perPage),
    };
  }

  /** Single patient full detail for clinician view */
  async findOneForClinician(patientId: string) {
    const patient = await this.queryOne(
      `SELECT
          p.*,
          u.name, u.name_hi, u.phone, u.email,
          u.gender, u.date_of_birth, u.language_pref, u.abha_id
       FROM patients p
       JOIN users u ON u.id = p.user_id
       WHERE p.id = $1`,
      [patientId],
    );

    if (!patient) return null;

    // Fetch recent logs, medications, alerts in parallel
    const [recentLogs, medications, activeAlerts] = await Promise.all([
      this.query(
        `SELECT * FROM symptom_logs
         WHERE patient_id = $1
         ORDER BY timestamp DESC LIMIT 30`,
        [patientId],
      ),
      this.query(
        `SELECT * FROM medications
         WHERE patient_id = $1 AND status = 'active'
         ORDER BY category, name`,
        [patientId],
      ),
      this.query(
        `SELECT * FROM alerts
         WHERE patient_id = $1 AND status IN ('active', 'acknowledged')
         ORDER BY created_at DESC`,
        [patientId],
      ),
    ]);

    return {
      patient,
      recent_logs: recentLogs.rows,
      medications: medications.rows,
      active_alerts: activeAlerts.rows,
    };
  }

  /** Patient self-view (mobile app) */
  async findByUserId(userId: string) {
    return this.queryOne(
      `SELECT p.*, u.name, u.name_hi, u.phone, u.language_pref
       FROM patients p
       JOIN users u ON u.id = p.user_id
       WHERE p.user_id = $1`,
      [userId],
    );
  }

  /** Update patient profile */
  async update(patientId: string, data: Record<string, any>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields
      .map((f, i) => `${f} = $${i + 2}`)
      .join(', ');

    return this.queryOne(
      `UPDATE patients SET ${setClause} WHERE id = $1 RETURNING *`,
      [patientId, ...values],
    );
  }

  // ── Symptom Logs ─────────────────────────────────────────

  async createSymptomLog(data: Record<string, any>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');

    return this.queryOneOrFail(
      `INSERT INTO symptom_logs (${fields.join(', ')})
       VALUES (${placeholders})
       RETURNING *`,
      values,
    );
  }

  async findSymptomLogs(
    patientId: string,
    params: { startDate?: string; endDate?: string; logType?: string; page?: number; perPage?: number },
  ) {
    const { startDate, endDate, logType, page = 1, perPage = 20 } = params;
    const offset = (page - 1) * perPage;
    const conditions = ['patient_id = $1'];
    const values: any[] = [patientId];
    let paramIndex = 2;

    if (startDate) {
      conditions.push(`timestamp >= $${paramIndex}`);
      values.push(startDate);
      paramIndex++;
    }
    if (endDate) {
      conditions.push(`timestamp <= $${paramIndex}`);
      values.push(endDate);
      paramIndex++;
    }
    if (logType) {
      conditions.push(`log_type = $${paramIndex}`);
      values.push(logType);
      paramIndex++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const countResult = await this.query(
      `SELECT COUNT(*)::int as total FROM symptom_logs ${whereClause}`,
      values,
    );

    const dataResult = await this.query(
      `SELECT * FROM symptom_logs ${whereClause}
       ORDER BY timestamp DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, perPage, offset],
    );

    return {
      data: dataResult.rows,
      pagination: this.buildPagination(countResult.rows[0].total, page, perPage),
    };
  }

  /** Daily pain summary from TimescaleDB continuous aggregate */
  async getDailyPainSummary(patientId: string, startDate: string, endDate: string) {
    const result = await this.query(
      `SELECT day::text as date, avg_pain, max_pain, min_pain, entry_count, breakthrough_count
       FROM daily_pain_summary
       WHERE patient_id = $1 AND day >= $2::date AND day <= $3::date
       ORDER BY day`,
      [patientId, startDate, endDate],
    );
    return result.rows;
  }

  /** Pain trends for the chart (last N days) */
  async getPainTrends(patientId: string, days: number = 30) {
    const result = await this.query(
      `SELECT
          date_trunc('day', timestamp)::date::text AS date,
          AVG(pain_intensity)::numeric(4,1) AS avg_pain,
          MAX(pain_intensity) AS max_pain,
          MIN(pain_intensity) AS min_pain,
          COUNT(*)::int AS entries
       FROM symptom_logs
       WHERE patient_id = $1
         AND pain_intensity IS NOT NULL
         AND timestamp > NOW() - make_interval(days => $2)
       GROUP BY date_trunc('day', timestamp)
       ORDER BY date_trunc('day', timestamp)`,
      [patientId, days],
    );
    return result.rows;
  }

  // ── Patient-Clinician Assignments ──────────────────────

  async createAssignment(patientId: string, clinicianUserId: string) {
    return this.queryOne(
      `INSERT INTO patient_clinician_assignments (patient_id, clinician_user_id, status, assigned_at)
       VALUES ($1, $2, 'pending_consent', NOW())
       ON CONFLICT (patient_id, clinician_user_id) WHERE status = 'active' OR status = 'pending_consent'
       DO NOTHING
       RETURNING *`,
      [patientId, clinicianUserId],
    );
  }

  async findAssignment(patientId: string, clinicianUserId: string) {
    return this.queryOne(
      `SELECT * FROM patient_clinician_assignments
       WHERE patient_id = $1 AND clinician_user_id = $2
       AND status IN ('active', 'pending_consent')
       ORDER BY assigned_at DESC LIMIT 1`,
      [patientId, clinicianUserId],
    );
  }

  async updateAssignmentStatus(patientId: string, clinicianUserId: string, status: string) {
    return this.queryOne(
      `UPDATE patient_clinician_assignments
       SET status = $3, consent_granted_at = CASE WHEN $3 = 'active' THEN NOW() ELSE consent_granted_at END
       WHERE patient_id = $1 AND clinician_user_id = $2 AND status = 'pending_consent'
       RETURNING *`,
      [patientId, clinicianUserId, status],
    );
  }

  async getPatientUserIdFromPatientId(patientId: string) {
    const result = await this.queryOne(
      `SELECT user_id FROM patients WHERE id = $1`,
      [patientId],
    );
    return result?.user_id;
  }
}
