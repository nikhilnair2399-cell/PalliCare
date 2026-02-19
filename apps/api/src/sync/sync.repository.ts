import { Injectable, Inject, Logger } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

export interface SyncRecord {
  type: 'symptom_log' | 'medication_log';
  data: Record<string, unknown>;
  local_id: string;
  created_at: string;
}

export interface SyncResult {
  synced: number;
  conflicts: Array<{
    local_id: string;
    server_id: string;
    resolution: 'local_wins' | 'server_wins' | 'merged';
  }>;
  failed: Array<{
    local_id: string;
    error: string;
  }>;
}

@Injectable()
export class SyncRepository extends BaseRepository {
  private readonly syncLogger = new Logger('SyncRepository');

  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'SyncRepository');
  }

  /**
   * Process a batch of offline records within a single transaction.
   * Implements last-write-wins conflict resolution with detection.
   */
  async processBatch(
    userId: string,
    deviceId: string,
    records: SyncRecord[],
  ): Promise<SyncResult> {
    const result: SyncResult = {
      synced: 0,
      conflicts: [],
      failed: [],
    };

    await this.transaction(async (client) => {
      for (const record of records) {
        try {
          await this.processSingleRecord(client, userId, deviceId, record, result);
        } catch (err: any) {
          result.failed.push({
            local_id: record.local_id,
            error: err.message || 'Unknown error',
          });
          this.syncLogger.warn(
            `Sync failed for ${record.local_id}: ${err.message}`,
          );
        }
      }
    });

    return result;
  }

  private async processSingleRecord(
    client: PoolClient,
    userId: string,
    deviceId: string,
    record: SyncRecord,
    result: SyncResult,
  ): Promise<void> {
    // Check if local_id already exists (duplicate detection)
    const existing = await client.query(
      `SELECT server_id, status FROM sync_queue
       WHERE device_id = $1 AND entity_type = $2 AND entity_id = $3`,
      [deviceId, record.type, record.local_id],
    );

    if (existing.rows.length > 0 && existing.rows[0].status === 'synced') {
      // Already synced — conflict detected
      result.conflicts.push({
        local_id: record.local_id,
        server_id: existing.rows[0].server_id,
        resolution: 'server_wins',
      });
      return;
    }

    // Insert the actual data
    let serverId: string;

    switch (record.type) {
      case 'symptom_log':
        const logResult = await client.query(
          `INSERT INTO symptom_logs (
              patient_id, logged_by, log_type, timestamp,
              pain_intensity, pain_locations, pain_qualities,
              mood, sleep_quality, sleep_hours,
              notes_text, esas_scores, local_id, synced_at
           )
           SELECT
              p.id, $1, $3, $4::timestamptz,
              $5, $6::jsonb, $7::jsonb,
              $8, $9, $10,
              $11, $12::jsonb, $13, NOW()
           FROM patients p WHERE p.user_id = $2
           RETURNING id`,
          [
            userId,
            userId,
            record.data.log_type || 'quick',
            record.created_at,
            record.data.pain_intensity,
            JSON.stringify(record.data.pain_locations || []),
            JSON.stringify(record.data.pain_qualities || []),
            record.data.mood,
            record.data.sleep_quality,
            record.data.sleep_hours,
            record.data.notes_text,
            JSON.stringify(record.data.esas_scores || {}),
            record.local_id,
          ],
        );
        serverId = logResult.rows[0]?.id;
        break;

      case 'medication_log':
        const medResult = await client.query(
          `INSERT INTO medication_logs (
              medication_id, patient_id, scheduled_time, actual_time,
              status, administered_by, notes, local_id, synced_at
           )
           VALUES ($1, (SELECT patient_id FROM medications WHERE id = $1),
                   $2::timestamptz, $3::timestamptz, $4, $5, $6, $7, NOW())
           RETURNING id`,
          [
            record.data.medication_id,
            record.data.scheduled_time,
            record.data.actual_time || record.created_at,
            record.data.status || 'taken',
            userId,
            record.data.notes,
            record.local_id,
          ],
        );
        serverId = medResult.rows[0]?.id;
        break;

      default:
        throw new Error(`Unsupported sync type: ${record.type}`);
    }

    // Record in sync queue
    await client.query(
      `INSERT INTO sync_queue (
          device_id, user_id, operation, entity_type, entity_id,
          server_id, payload, status, synced_at
       )
       VALUES ($1, $2, 'create', $3, $4, $5, $6::jsonb, 'synced', NOW())
       ON CONFLICT (device_id, entity_type, entity_id)
         DO NOTHING`,
      [
        deviceId,
        userId,
        record.type,
        record.local_id,
        serverId,
        JSON.stringify(record.data),
      ],
    );

    result.synced++;
  }

  /** Get pending sync items for a device */
  async getPending(deviceId: string) {
    const result = await this.query(
      `SELECT * FROM sync_queue
       WHERE device_id = $1 AND status = 'pending'
       ORDER BY created_at ASC
       LIMIT 50`,
      [deviceId],
    );
    return result.rows;
  }
}
