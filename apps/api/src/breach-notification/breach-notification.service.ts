import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { BaseRepository } from '../database/base.repository';

@Injectable()
export class BreachNotificationService extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'BreachNotificationService');
  }

  /**
   * Record a new data breach incident.
   */
  async recordBreach(data: {
    breach_type: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    affected_user_count: number;
    data_types_affected: string[];
    discovered_at: string;
  }) {
    const row = await this.queryOneOrFail(
      `INSERT INTO breach_notifications
         (breach_type, description, severity, affected_user_count,
          data_types_affected, discovered_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'recorded')
       RETURNING id, breach_type, description, severity,
                 affected_user_count, data_types_affected,
                 discovered_at, status, created_at`,
      [
        data.breach_type,
        data.description,
        data.severity,
        data.affected_user_count,
        JSON.stringify(data.data_types_affected),
        new Date(data.discovered_at),
      ],
    );

    this.logger.warn(
      `BREACH RECORDED: ${row.id} — type=${data.breach_type}, severity=${data.severity}, affected=${data.affected_user_count}`,
    );

    return row;
  }

  /**
   * List all breach notifications, newest first.
   */
  async listBreaches() {
    const result = await this.query(
      `SELECT id, breach_type, description, severity,
              affected_user_count, data_types_affected,
              discovered_at, status,
              users_notified_at, dpb_notified_at,
              created_at
       FROM breach_notifications
       ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  /**
   * Mark a breach as notified (users or DPB).
   * DPDPA 2023 requires Data Protection Board notification within 72 hours.
   */
  async markNotified(
    breachId: string,
    notificationType: 'users_notified' | 'dpb_notified',
  ) {
    const existing = await this.queryOne(
      `SELECT id, discovered_at FROM breach_notifications WHERE id = $1`,
      [breachId],
    );

    if (!existing) {
      throw new NotFoundException('Breach record not found');
    }

    const column =
      notificationType === 'users_notified'
        ? 'users_notified_at'
        : 'dpb_notified_at';

    const row = await this.queryOneOrFail(
      `UPDATE breach_notifications
       SET ${column} = NOW(),
           status = CASE
             WHEN users_notified_at IS NOT NULL AND dpb_notified_at IS NOT NULL THEN 'fully_notified'
             WHEN '${column}' = 'dpb_notified_at' AND users_notified_at IS NOT NULL THEN 'fully_notified'
             WHEN '${column}' = 'users_notified_at' AND dpb_notified_at IS NOT NULL THEN 'fully_notified'
             ELSE 'partially_notified'
           END
       WHERE id = $1
       RETURNING id, breach_type, severity, status,
                 users_notified_at, dpb_notified_at,
                 discovered_at`,
      [breachId],
    );

    // Check 72-hour DPB notification compliance
    if (notificationType === 'dpb_notified') {
      const discoveredAt = new Date(existing.discovered_at);
      const now = new Date();
      const hoursElapsed =
        (now.getTime() - discoveredAt.getTime()) / (1000 * 60 * 60);

      if (hoursElapsed > 72) {
        this.logger.warn(
          `DPDPA COMPLIANCE WARNING: DPB notification for breach ${breachId} took ${hoursElapsed.toFixed(1)} hours (72hr limit exceeded).`,
        );
      } else {
        this.logger.log(
          `DPB notified for breach ${breachId} within ${hoursElapsed.toFixed(1)} hours (within 72hr limit).`,
        );
      }
    }

    return row;
  }
}
