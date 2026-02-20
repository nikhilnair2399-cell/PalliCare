import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class ClinicalNotesRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'ClinicalNotesRepository');
  }

  async findByPatient(
    patientId: string,
    params: { noteType?: string; page: number; perPage: number },
  ) {
    const conditions = ['cn.patient_id = $1'];
    const queryParams: any[] = [patientId];
    if (params.noteType) {
      queryParams.push(params.noteType);
      conditions.push(`cn.note_type = $${queryParams.length}`);
    }

    const countResult = await this.query(
      `SELECT COUNT(*)::int AS total FROM clinical_notes cn WHERE ${conditions.join(' AND ')}`,
      queryParams,
    );

    const offset = (params.page - 1) * params.perPage;
    queryParams.push(params.perPage, offset);
    const result = await this.query(
      `SELECT cn.*,
              u.name AS clinician_name,
              u.type AS clinician_type
       FROM clinical_notes cn
       JOIN users u ON u.id = cn.clinician_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY cn.created_at DESC
       LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
      queryParams,
    );

    return {
      data: result.rows,
      pagination: this.buildPagination(
        countResult.rows[0].total,
        params.page,
        params.perPage,
      ),
    };
  }

  async findById(noteId: string) {
    return this.queryOne(
      `SELECT cn.*,
              u.name AS clinician_name
       FROM clinical_notes cn
       JOIN users u ON u.id = cn.clinician_id
       WHERE cn.id = $1`,
      [noteId],
    );
  }

  async create(clinicianId: string, patientId: string, data: Record<string, any>) {
    return this.queryOne(
      `INSERT INTO clinical_notes
       (clinician_id, patient_id, note_type, content, structured_data, attachments, is_addendum, parent_note_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        clinicianId,
        patientId,
        data.note_type,
        data.content,
        data.structured_data ? JSON.stringify(data.structured_data) : null,
        data.attachments ? JSON.stringify(data.attachments) : '[]',
        data.is_addendum || false,
        data.parent_note_id || null,
      ],
    );
  }

  async update(noteId: string, data: Record<string, any>) {
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (data.content !== undefined) {
      fields.push(`content = $${idx}`);
      params.push(data.content);
      idx++;
    }
    if (data.structured_data !== undefined) {
      fields.push(`structured_data = $${idx}`);
      params.push(JSON.stringify(data.structured_data));
      idx++;
    }
    if (data.attachments !== undefined) {
      fields.push(`attachments = $${idx}`);
      params.push(JSON.stringify(data.attachments));
      idx++;
    }

    if (fields.length === 0) return this.findById(noteId);
    params.push(noteId);
    return this.queryOne(
      `UPDATE clinical_notes SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params,
    );
  }

  async findByClinician(clinicianId: string, page: number, perPage: number) {
    const countResult = await this.query(
      `SELECT COUNT(*)::int AS total FROM clinical_notes WHERE clinician_id = $1`,
      [clinicianId],
    );

    const offset = (page - 1) * perPage;
    const result = await this.query(
      `SELECT cn.*,
              p.user_id AS patient_user_id,
              u_patient.name AS patient_name
       FROM clinical_notes cn
       JOIN patients p ON p.id = cn.patient_id
       JOIN users u_patient ON u_patient.id = p.user_id
       WHERE cn.clinician_id = $1
       ORDER BY cn.created_at DESC
       LIMIT $2 OFFSET $3`,
      [clinicianId, perPage, offset],
    );

    return {
      data: result.rows,
      pagination: this.buildPagination(countResult.rows[0].total, page, perPage),
    };
  }
}
