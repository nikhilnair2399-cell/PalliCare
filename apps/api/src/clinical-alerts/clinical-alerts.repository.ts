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
}
