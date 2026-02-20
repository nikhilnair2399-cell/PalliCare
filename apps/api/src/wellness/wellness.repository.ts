import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class WellnessRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'WellnessRepository');
  }

  // ─── Goals ─────────────────────────────────────────────────

  async findGoals(patientId: string, status?: string) {
    const conditions = ['g.patient_id = $1'];
    const params: any[] = [patientId];
    if (status) {
      conditions.push(`g.status = $${params.length + 1}`);
      params.push(status);
    }
    const result = await this.query(
      `SELECT g.*,
              COALESCE(
                (SELECT COUNT(*) FROM goal_logs gl
                 WHERE gl.goal_id = g.id AND gl.completed = TRUE), 0
              )::int AS completed_count,
              COALESCE(
                (SELECT COUNT(*) FROM goal_logs gl WHERE gl.goal_id = g.id), 0
              )::int AS total_entries,
              (SELECT gl.date FROM goal_logs gl
               WHERE gl.goal_id = g.id AND gl.completed = TRUE
               ORDER BY gl.date DESC LIMIT 1) AS last_completed_date
       FROM goals g
       WHERE ${conditions.join(' AND ')}
       ORDER BY g.status = 'active' DESC, g.created_at DESC`,
      params,
    );
    return result.rows;
  }

  async findGoalById(goalId: string) {
    return this.queryOne(
      `SELECT g.*,
              COALESCE(
                (SELECT COUNT(*) FROM goal_logs gl
                 WHERE gl.goal_id = g.id AND gl.completed = TRUE), 0
              )::int AS completed_count
       FROM goals g WHERE g.id = $1`,
      [goalId],
    );
  }

  async createGoal(patientId: string, data: Record<string, any>) {
    return this.queryOne(
      `INSERT INTO goals (patient_id, category, description, description_hi, frequency, target_count, duration_weeks)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        patientId,
        data.category,
        data.description,
        data.description_hi || null,
        data.frequency,
        data.target_count || 1,
        data.duration_weeks || null,
      ],
    );
  }

  async updateGoal(goalId: string, data: Record<string, any>) {
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;
    for (const [key, value] of Object.entries(data)) {
      if (['status', 'description', 'description_hi', 'frequency', 'target_count', 'duration_weeks'].includes(key)) {
        fields.push(`${key} = $${idx}`);
        params.push(value);
        idx++;
      }
    }
    if (data.status === 'completed') {
      fields.push(`completed_at = NOW()`);
    }
    if (fields.length === 0) return this.findGoalById(goalId);
    params.push(goalId);
    return this.queryOne(
      `UPDATE goals SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params,
    );
  }

  async logGoal(goalId: string, date: string, completed: boolean, notes?: string) {
    return this.queryOne(
      `INSERT INTO goal_logs (goal_id, date, completed, notes)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (goal_id, date) DO UPDATE SET completed = $3, notes = COALESCE($4, goal_logs.notes)
       RETURNING *`,
      [goalId, date, completed, notes || null],
    );
  }

  async getGoalHistory(goalId: string, days: number = 30) {
    const result = await this.query(
      `SELECT * FROM goal_logs
       WHERE goal_id = $1 AND date >= CURRENT_DATE - $2::int
       ORDER BY date DESC`,
      [goalId, days],
    );
    return result.rows;
  }

  // ─── Gratitude ─────────────────────────────────────────────

  async findGratitudeEntries(patientId: string, limit: number = 30) {
    const result = await this.query(
      `SELECT * FROM gratitude_entries
       WHERE patient_id = $1
       ORDER BY date DESC LIMIT $2`,
      [patientId, limit],
    );
    return result.rows;
  }

  async findGratitudeByDate(patientId: string, date: string) {
    return this.queryOne(
      `SELECT * FROM gratitude_entries WHERE patient_id = $1 AND date = $2`,
      [patientId, date],
    );
  }

  async upsertGratitude(patientId: string, content: string, date: string, voiceNoteUrl?: string) {
    return this.queryOne(
      `INSERT INTO gratitude_entries (patient_id, content, date, voice_note_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (patient_id, date)
       DO UPDATE SET content = $2, voice_note_url = COALESCE($4, gratitude_entries.voice_note_url)
       RETURNING *`,
      [patientId, content, date, voiceNoteUrl || null],
    );
  }

  async getGratitudeStreak(patientId: string) {
    // Count consecutive days with entries ending today
    const result = await this.queryOne(
      `WITH dates AS (
         SELECT date, ROW_NUMBER() OVER (ORDER BY date DESC) AS rn
         FROM gratitude_entries
         WHERE patient_id = $1
       )
       SELECT COUNT(*)::int AS streak
       FROM dates
       WHERE date = CURRENT_DATE - (rn - 1)::int`,
      [patientId],
    );
    return result?.streak || 0;
  }

  // ─── Intentions ────────────────────────────────────────────

  async findIntentions(patientId: string, limit: number = 14) {
    const result = await this.query(
      `SELECT * FROM intentions
       WHERE patient_id = $1
       ORDER BY date DESC LIMIT $2`,
      [patientId, limit],
    );
    return result.rows;
  }

  async findIntentionByDate(patientId: string, date: string) {
    return this.queryOne(
      `SELECT * FROM intentions WHERE patient_id = $1 AND date = $2`,
      [patientId, date],
    );
  }

  async upsertIntention(patientId: string, data: Record<string, any>) {
    return this.queryOne(
      `INSERT INTO intentions (patient_id, date, content, content_hi, source)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (patient_id, date)
       DO UPDATE SET content = $3, content_hi = COALESCE($4, intentions.content_hi),
                     source = COALESCE($5, intentions.source)
       RETURNING *`,
      [
        patientId,
        data.date || new Date().toISOString().slice(0, 10),
        data.content,
        data.content_hi || null,
        data.source || 'custom',
      ],
    );
  }

  async updateIntentionStatus(patientId: string, date: string, status: string) {
    return this.queryOne(
      `UPDATE intentions
       SET completed_status = $3,
           completed_at = CASE WHEN $3 IN ('yes', 'partially') THEN NOW() ELSE NULL END
       WHERE patient_id = $1 AND date = $2
       RETURNING *`,
      [patientId, date, status],
    );
  }

  // ─── Milestones ────────────────────────────────────────────

  async findMilestones(patientId: string, unseenOnly: boolean = false) {
    const conditions = ['patient_id = $1'];
    if (unseenOnly) conditions.push('seen = FALSE');
    const result = await this.query(
      `SELECT * FROM milestones
       WHERE ${conditions.join(' AND ')}
       ORDER BY triggered_at DESC`,
      [patientId],
    );
    return result.rows;
  }

  async markMilestoneSeen(milestoneId: string) {
    return this.queryOne(
      `UPDATE milestones SET seen = TRUE, seen_at = NOW()
       WHERE id = $1 RETURNING *`,
      [milestoneId],
    );
  }

  async markAllMilestonesSeen(patientId: string) {
    const result = await this.query(
      `UPDATE milestones SET seen = TRUE, seen_at = NOW()
       WHERE patient_id = $1 AND seen = FALSE
       RETURNING id`,
      [patientId],
    );
    return result.rowCount;
  }

  async getUnseenCount(patientId: string) {
    const result = await this.queryOne<{ count: string }>(
      `SELECT COUNT(*)::int AS count FROM milestones
       WHERE patient_id = $1 AND seen = FALSE`,
      [patientId],
    );
    return result?.count || 0;
  }
}
