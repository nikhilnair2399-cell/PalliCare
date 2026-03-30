import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class NotificationsRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'NotificationsRepository');
  }

  /** List notifications for a user */
  async findByUser(userId: string, params: {
    unreadOnly?: boolean;
    type?: string;
    page?: number;
    perPage?: number;
  }) {
    const { unreadOnly, type, page = 1, perPage = 20 } = params;
    const offset = (page - 1) * perPage;
    const conditions = ['user_id = $1'];
    const values: any[] = [userId];
    let paramIndex = 2;

    if (unreadOnly) {
      conditions.push('is_read = FALSE');
    }
    if (type) {
      conditions.push(`type = $${paramIndex}`);
      values.push(type);
      paramIndex++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const countResult = await this.query(
      `SELECT COUNT(*)::int AS total FROM notifications ${whereClause}`,
      values,
    );

    const dataResult = await this.query(
      `SELECT * FROM notifications ${whereClause}
       ORDER BY
         CASE priority
           WHEN 'critical' THEN 0
           WHEN 'high' THEN 1
           WHEN 'normal' THEN 2
           ELSE 3
         END,
         created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, perPage, offset],
    );

    return {
      data: dataResult.rows,
      pagination: this.buildPagination(countResult.rows[0].total, page, perPage),
    };
  }

  /** Mark a notification as read */
  async markAsRead(notificationId: string, userId: string) {
    return this.queryOne(
      `UPDATE notifications
       SET is_read = TRUE, read_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [notificationId, userId],
    );
  }

  /** Mark all notifications as read for a user */
  async markAllAsRead(userId: string) {
    const result = await this.query(
      `UPDATE notifications
       SET is_read = TRUE, read_at = NOW()
       WHERE user_id = $1 AND is_read = FALSE`,
      [userId],
    );
    return { updated: result.rowCount };
  }

  /** Register or update a device token */
  async upsertDeviceToken(data: {
    userId: string;
    fcmToken: string;
    platform: string;
    deviceId?: string;
  }) {
    const { userId, fcmToken, platform, deviceId } = data;

    if (deviceId) {
      return this.queryOne(
        `INSERT INTO devices (user_id, device_id, platform, fcm_token, last_active_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (device_id)
         DO UPDATE SET
           fcm_token = EXCLUDED.fcm_token,
           last_active_at = NOW(),
           is_active = TRUE
         RETURNING *`,
        [userId, deviceId, platform, fcmToken],
      );
    }

    // Without device_id, just insert
    return this.queryOne(
      `INSERT INTO devices (user_id, device_id, platform, fcm_token, last_active_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [userId, `${platform}-${Date.now()}`, platform, fcmToken],
    );
  }

  /** Get notification preferences for a user */
  async getPreferences(userId: string) {
    const result = await this.query(
      `SELECT * FROM notification_preferences WHERE user_id = $1`,
      [userId],
    );
    return result.rows;
  }

  /** Upsert a notification preference */
  async upsertPreference(userId: string, type: string, data: Record<string, any>) {
    return this.queryOne(
      `INSERT INTO notification_preferences (user_id, type, enabled, channels, quiet_hours_start, quiet_hours_end)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, type)
       DO UPDATE SET
         enabled = EXCLUDED.enabled,
         channels = EXCLUDED.channels,
         quiet_hours_start = EXCLUDED.quiet_hours_start,
         quiet_hours_end = EXCLUDED.quiet_hours_end
       RETURNING *`,
      [
        userId,
        type,
        data.enabled ?? true,
        data.channels ?? ['push'],
        data.quiet_hours_start ?? '22:00',
        data.quiet_hours_end ?? '07:00',
      ],
    );
  }

  /** Create a notification record */
  async create(userId: string, data: {
    type: string;
    title: string;
    body: string;
    data?: Record<string, string>;
    priority?: string;
  }) {
    return this.queryOne(
      `INSERT INTO notifications (user_id, type, title_en, body_en, priority, payload, channel, is_sent, sent_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'push', TRUE, NOW())
       RETURNING *`,
      [
        userId,
        data.type,
        data.title,
        data.body,
        data.priority ?? 'normal',
        JSON.stringify(data.data ?? {}),
      ],
    );
  }

  /** Unread count */
  async unreadCount(userId: string): Promise<number> {
    const result = await this.queryOne<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM notifications
       WHERE user_id = $1 AND is_read = FALSE`,
      [userId],
    );
    return result?.count || 0;
  }
}
