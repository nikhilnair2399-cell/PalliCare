import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class DevicesRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'DevicesRepository');
  }

  async findByUser(userId: string) {
    const result = await this.query(
      `SELECT * FROM devices
       WHERE user_id = $1 AND is_active = TRUE
       ORDER BY last_active_at DESC NULLS LAST`,
      [userId],
    );
    return result.rows;
  }

  async upsert(userId: string, data: Record<string, any>) {
    return this.queryOne(
      `INSERT INTO devices
       (user_id, device_id, device_name, platform, os_version, app_version, fcm_token, apns_token, last_active_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (device_id) DO UPDATE SET
         user_id = $1,
         device_name = COALESCE($3, devices.device_name),
         os_version = COALESCE($5, devices.os_version),
         app_version = COALESCE($6, devices.app_version),
         fcm_token = COALESCE($7, devices.fcm_token),
         apns_token = COALESCE($8, devices.apns_token),
         last_active_at = NOW(),
         is_active = TRUE
       RETURNING *`,
      [
        userId,
        data.device_id,
        data.device_name || null,
        data.platform,
        data.os_version || null,
        data.app_version || null,
        data.fcm_token || null,
        data.apns_token || null,
      ],
    );
  }

  async updateSyncTime(deviceId: string) {
    return this.queryOne(
      `UPDATE devices SET last_sync_at = NOW(), last_active_at = NOW()
       WHERE device_id = $1 RETURNING *`,
      [deviceId],
    );
  }

  async deactivate(userId: string, deviceId: string) {
    return this.queryOne(
      `UPDATE devices SET is_active = FALSE, fcm_token = NULL, apns_token = NULL
       WHERE user_id = $1 AND device_id = $2 RETURNING *`,
      [userId, deviceId],
    );
  }

  async getActiveTokens(userId: string) {
    const result = await this.query(
      `SELECT fcm_token, apns_token, platform FROM devices
       WHERE user_id = $1 AND is_active = TRUE
         AND (fcm_token IS NOT NULL OR apns_token IS NOT NULL)`,
      [userId],
    );
    return result.rows;
  }
}
