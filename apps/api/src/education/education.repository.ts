import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class EducationRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'EducationRepository');
  }

  // ─── Learn Modules ─────────────────────────────────────────

  async findModules(filters: {
    phase?: number;
    contentType?: string;
    audience?: string;
  }) {
    const conditions = ['lm.is_active = TRUE'];
    const params: any[] = [];
    if (filters.phase) {
      params.push(filters.phase);
      conditions.push(`lm.phase = $${params.length}`);
    }
    if (filters.contentType) {
      params.push(filters.contentType);
      conditions.push(`lm.content_type = $${params.length}`);
    }
    if (filters.audience) {
      params.push(filters.audience);
      conditions.push(`lm.target_audience IN ($${params.length}, 'both')`);
    }
    const result = await this.query(
      `SELECT lm.* FROM learn_modules lm
       WHERE ${conditions.join(' AND ')}
       ORDER BY lm.phase, lm.display_order`,
      params,
    );
    return result.rows;
  }

  async findModuleById(moduleId: string) {
    return this.queryOne(
      `SELECT * FROM learn_modules WHERE id = $1`,
      [moduleId],
    );
  }

  async findModulesWithProgress(patientId: string, phase?: number) {
    const conditions = ['lm.is_active = TRUE'];
    const params: any[] = [patientId];
    if (phase) {
      params.push(phase);
      conditions.push(`lm.phase = $${params.length}`);
    }
    const result = await this.query(
      `SELECT lm.*,
              lp.status AS progress_status,
              lp.progress_pct,
              lp.started_at AS progress_started_at,
              lp.completed_at AS progress_completed_at,
              lp.last_position
       FROM learn_modules lm
       LEFT JOIN learn_progress lp ON lp.module_id = lm.id AND lp.patient_id = $1
       WHERE ${conditions.join(' AND ')}
       ORDER BY lm.phase, lm.display_order`,
      params,
    );
    return result.rows;
  }

  // ─── Learn Progress ────────────────────────────────────────

  async getProgress(patientId: string, moduleId: string) {
    return this.queryOne(
      `SELECT * FROM learn_progress
       WHERE patient_id = $1 AND module_id = $2`,
      [patientId, moduleId],
    );
  }

  async upsertProgress(
    patientId: string,
    moduleId: string,
    data: Record<string, any>,
  ) {
    return this.queryOne(
      `INSERT INTO learn_progress (patient_id, module_id, status, progress_pct, started_at, last_position)
       VALUES ($1, $2, $3, $4, CASE WHEN $3 != 'locked' THEN NOW() ELSE NULL END, $5)
       ON CONFLICT (patient_id, module_id) DO UPDATE SET
         status = COALESCE($3, learn_progress.status),
         progress_pct = GREATEST(COALESCE($4, learn_progress.progress_pct), learn_progress.progress_pct),
         last_position = COALESCE($5, learn_progress.last_position),
         completed_at = CASE WHEN $3 = 'completed' THEN NOW() ELSE learn_progress.completed_at END
       RETURNING *`,
      [
        patientId,
        moduleId,
        data.status || 'in_progress',
        data.progress_pct || 0,
        data.last_position ? JSON.stringify(data.last_position) : null,
      ],
    );
  }

  async getOverallProgress(patientId: string) {
    return this.queryOne(
      `SELECT
         COUNT(*)::int AS total_modules,
         COUNT(*) FILTER (WHERE lp.status = 'completed')::int AS completed,
         COUNT(*) FILTER (WHERE lp.status = 'in_progress')::int AS in_progress,
         ROUND(AVG(COALESCE(lp.progress_pct, 0)))::int AS avg_progress
       FROM learn_modules lm
       LEFT JOIN learn_progress lp ON lp.module_id = lm.id AND lp.patient_id = $1
       WHERE lm.is_active = TRUE`,
      [patientId],
    );
  }

  // ─── Content Attributions ─────────────────────────────────

  async findAttributionsByModule(moduleId: string) {
    const result = await this.query(
      `SELECT * FROM content_attributions
       WHERE content_id = $1 AND content_type = 'learn_module'
       ORDER BY created_at`,
      [moduleId],
    );
    return result.rows;
  }

  async addAttribution(data: {
    contentType: string;
    contentId: string;
    sourceName: string;
    sourceAuthors?: string;
    sourceYear?: number;
    sourceUrl?: string;
    licenseSpdx?: string;
    usageType: string;
    notes?: string;
  }) {
    return this.queryOne(
      `INSERT INTO content_attributions
       (content_type, content_id, source_name, source_authors, source_year,
        source_url, license_spdx, usage_type, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        data.contentType,
        data.contentId,
        data.sourceName,
        data.sourceAuthors || null,
        data.sourceYear || null,
        data.sourceUrl || null,
        data.licenseSpdx || null,
        data.usageType,
        data.notes || null,
      ],
    );
  }

  // ─── Breathe Sessions ─────────────────────────────────────

  async createBreatheSession(patientId: string, data: Record<string, any>) {
    return this.queryOne(
      `INSERT INTO breathe_sessions
       (patient_id, exercise_type, duration_seconds, pre_feeling, post_feeling, background_sound, completed, local_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        patientId,
        data.exercise_type,
        data.duration_seconds,
        data.pre_feeling || null,
        data.post_feeling || null,
        data.background_sound || null,
        data.completed !== false,
        data.local_id || null,
      ],
    );
  }

  async findBreatheSessions(patientId: string, limit: number = 30) {
    const result = await this.query(
      `SELECT * FROM breathe_sessions
       WHERE patient_id = $1
       ORDER BY completed_at DESC LIMIT $2`,
      [patientId, limit],
    );
    return result.rows;
  }

  async getBreathingStats(patientId: string, days: number = 30) {
    return this.queryOne(
      `SELECT
         COUNT(*)::int AS total_sessions,
         COALESCE(SUM(duration_seconds), 0)::int AS total_seconds,
         ROUND(AVG(duration_seconds))::int AS avg_duration,
         COUNT(DISTINCT DATE(completed_at))::int AS days_practiced,
         MODE() WITHIN GROUP (ORDER BY exercise_type) AS favourite_exercise,
         COUNT(*) FILTER (WHERE post_feeling IN ('calm', 'relaxed', 'better'))::int AS positive_outcomes
       FROM breathe_sessions
       WHERE patient_id = $1
         AND completed_at >= NOW() - ($2 || ' days')::interval
         AND completed = TRUE`,
      [patientId, days],
    );
  }
}
