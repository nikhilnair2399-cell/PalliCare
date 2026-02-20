import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class CaregiversRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'CaregiversRepository');
  }

  // ─── Caregiver Management ─────────────────────────────────

  async findByPatient(patientId: string) {
    const result = await this.query(
      `SELECT c.*, u.name, u.phone, u.avatar_url
       FROM caregivers c
       JOIN users u ON u.id = c.user_id
       WHERE c.patient_id = $1
       ORDER BY c.status = 'active' DESC, c.created_at`,
      [patientId],
    );
    return result.rows;
  }

  async findByUserId(userId: string) {
    const result = await this.query(
      `SELECT c.*,
              p.id AS patient_record_id,
              u_patient.name AS patient_name,
              p.primary_diagnosis
       FROM caregivers c
       JOIN patients p ON p.id = c.patient_id
       JOIN users u_patient ON u_patient.id = p.user_id
       WHERE c.user_id = $1 AND c.status = 'active'`,
      [userId],
    );
    return result.rows;
  }

  async findById(caregiverId: string) {
    return this.queryOne(
      `SELECT c.*, u.name, u.phone
       FROM caregivers c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = $1`,
      [caregiverId],
    );
  }

  async updateCaregiver(caregiverId: string, data: Record<string, any>) {
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;
    const allowed = [
      'permission_level', 'can_log_symptoms', 'can_manage_meds',
      'can_view_legacy', 'can_message_team', 'status', 'relationship',
    ];
    for (const [key, value] of Object.entries(data)) {
      if (allowed.includes(key)) {
        fields.push(`${key} = $${idx}`);
        params.push(value);
        idx++;
      }
    }
    if (data.status === 'active' && !fields.some((f) => f.startsWith('activated_at'))) {
      fields.push(`activated_at = NOW()`);
    }
    if (data.notification_prefs) {
      fields.push(`notification_prefs = $${idx}`);
      params.push(JSON.stringify(data.notification_prefs));
      idx++;
    }
    if (fields.length === 0) return this.findById(caregiverId);
    params.push(caregiverId);
    return this.queryOne(
      `UPDATE caregivers SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params,
    );
  }

  // ─── Care Schedules ───────────────────────────────────────

  async findSchedules(patientId: string, startDate?: string, endDate?: string) {
    const conditions = ['cs.patient_id = $1'];
    const params: any[] = [patientId];
    if (startDate) {
      params.push(startDate);
      conditions.push(`cs.date >= $${params.length}`);
    }
    if (endDate) {
      params.push(endDate);
      conditions.push(`cs.date <= $${params.length}`);
    }
    const result = await this.query(
      `SELECT cs.*,
              u.name AS caregiver_name
       FROM care_schedules cs
       JOIN caregivers cg ON cg.id = cs.caregiver_id
       JOIN users u ON u.id = cg.user_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY cs.date, cs.start_time`,
      params,
    );
    return result.rows;
  }

  async createSchedule(data: Record<string, any>) {
    return this.queryOne(
      `INSERT INTO care_schedules (patient_id, caregiver_id, date, start_time, end_time, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.patient_id,
        data.caregiver_id,
        data.date,
        data.start_time,
        data.end_time,
        data.notes || null,
      ],
    );
  }

  async updateSchedule(scheduleId: string, data: Record<string, any>) {
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;
    for (const [key, value] of Object.entries(data)) {
      if (['date', 'start_time', 'end_time', 'notes', 'caregiver_id'].includes(key)) {
        fields.push(`${key} = $${idx}`);
        params.push(value);
        idx++;
      }
    }
    if (fields.length === 0) return null;
    params.push(scheduleId);
    return this.queryOne(
      `UPDATE care_schedules SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params,
    );
  }

  async deleteSchedule(scheduleId: string) {
    await this.query(`DELETE FROM care_schedules WHERE id = $1`, [scheduleId]);
  }

  // ─── Handover Notes ───────────────────────────────────────

  async findHandoverNotes(patientId: string, limit: number = 20) {
    const result = await this.query(
      `SELECT hn.*,
              u_from.name AS from_name,
              u_to.name AS to_name
       FROM handover_notes hn
       JOIN users u_from ON u_from.id = hn.from_caregiver_id
       LEFT JOIN users u_to ON u_to.id = hn.to_caregiver_id
       WHERE hn.patient_id = $1
       ORDER BY hn.created_at DESC
       LIMIT $2`,
      [patientId, limit],
    );
    return result.rows;
  }

  async createHandoverNote(data: Record<string, any>) {
    return this.queryOne(
      `INSERT INTO handover_notes (from_caregiver_id, to_caregiver_id, patient_id, content, voice_note_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.from_caregiver_id,
        data.to_caregiver_id || null,
        data.patient_id,
        data.content,
        data.voice_note_url || null,
      ],
    );
  }
}
