import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class CarePlansRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'CarePlansRepository');
  }

  async findByPatient(patientId: string, status?: string) {
    const conditions = ['cp.patient_id = $1'];
    const params: any[] = [patientId];
    if (status) {
      params.push(status);
      conditions.push(`cp.status = $${params.length}`);
    }
    const result = await this.query(
      `SELECT cp.*,
              u.name AS created_by_name
       FROM care_plans cp
       JOIN users u ON u.id = cp.created_by
       WHERE ${conditions.join(' AND ')}
       ORDER BY cp.version DESC, cp.created_at DESC`,
      params,
    );
    return result.rows;
  }

  async findById(planId: string) {
    return this.queryOne(
      `SELECT cp.*,
              u.name AS created_by_name
       FROM care_plans cp
       JOIN users u ON u.id = cp.created_by
       WHERE cp.id = $1`,
      [planId],
    );
  }

  async findActivePlan(patientId: string) {
    return this.queryOne(
      `SELECT cp.*,
              u.name AS created_by_name
       FROM care_plans cp
       JOIN users u ON u.id = cp.created_by
       WHERE cp.patient_id = $1 AND cp.status = 'active'
       ORDER BY cp.version DESC
       LIMIT 1`,
      [patientId],
    );
  }

  async create(createdBy: string, patientId: string, data: Record<string, any>) {
    return this.queryOne(
      `INSERT INTO care_plans
       (patient_id, created_by, title, goals_of_care, goals, interventions, tasks, review_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        patientId,
        createdBy,
        data.title || null,
        data.goals_of_care || null,
        data.goals ? JSON.stringify(data.goals) : '[]',
        data.interventions ? JSON.stringify(data.interventions) : '[]',
        data.tasks ? JSON.stringify(data.tasks) : '[]',
        data.review_date || null,
        data.status || 'draft',
      ],
    );
  }

  async update(planId: string, data: Record<string, any>) {
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;

    const allowedFields = ['title', 'goals_of_care', 'review_date', 'status'];
    const jsonFields = ['goals', 'interventions', 'tasks'];

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${idx}`);
        params.push(value);
        idx++;
      } else if (jsonFields.includes(key)) {
        fields.push(`${key} = $${idx}`);
        params.push(JSON.stringify(value));
        idx++;
      }
    }

    if (fields.length === 0) return this.findById(planId);
    params.push(planId);
    return this.queryOne(
      `UPDATE care_plans SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params,
    );
  }

  async createNewVersion(planId: string, createdBy: string) {
    // Copy existing plan as new version
    return this.queryOne(
      `INSERT INTO care_plans
       (patient_id, created_by, title, goals_of_care, goals, interventions, tasks, review_date, status, version, previous_version_id)
       SELECT patient_id, $2, title, goals_of_care, goals, interventions, tasks, review_date, 'draft', version + 1, $1
       FROM care_plans WHERE id = $1
       RETURNING *`,
      [planId, createdBy],
    );
  }
}
