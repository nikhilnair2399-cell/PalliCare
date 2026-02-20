import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class ConsentRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'ConsentRepository');
  }

  async findByUser(userId: string) {
    const result = await this.query(
      `SELECT * FROM consent_records
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  async findActiveConsents(userId: string) {
    const result = await this.query(
      `SELECT DISTINCT ON (consent_type) *
       FROM consent_records
       WHERE user_id = $1
       ORDER BY consent_type, created_at DESC`,
      [userId],
    );
    return result.rows.filter((r: any) => r.granted && !r.revoked_at);
  }

  async grantConsent(userId: string, data: Record<string, any>) {
    return this.queryOne(
      `INSERT INTO consent_records
       (user_id, consent_type, granted, version, granted_at, ip_address, method)
       VALUES ($1, $2, TRUE, $3, NOW(), $4, $5)
       RETURNING *`,
      [
        userId,
        data.consent_type,
        data.version,
        data.ip_address || null,
        data.method || 'in_app',
      ],
    );
  }

  async revokeConsent(userId: string, consentType: string) {
    // Record revocation as new entry
    const latest = await this.queryOne(
      `SELECT * FROM consent_records
       WHERE user_id = $1 AND consent_type = $2 AND granted = TRUE AND revoked_at IS NULL
       ORDER BY created_at DESC LIMIT 1`,
      [userId, consentType],
    );
    if (!latest) return null;

    // Mark existing as revoked
    await this.query(
      `UPDATE consent_records SET revoked_at = NOW()
       WHERE id = $1`,
      [latest.id],
    );

    // Create revocation record
    return this.queryOne(
      `INSERT INTO consent_records
       (user_id, consent_type, granted, version, method)
       VALUES ($1, $2, FALSE, $3, 'in_app')
       RETURNING *`,
      [userId, consentType, latest.version],
    );
  }

  async getConsentHistory(userId: string, consentType: string) {
    const result = await this.query(
      `SELECT * FROM consent_records
       WHERE user_id = $1 AND consent_type = $2
       ORDER BY created_at DESC`,
      [userId, consentType],
    );
    return result.rows;
  }
}
