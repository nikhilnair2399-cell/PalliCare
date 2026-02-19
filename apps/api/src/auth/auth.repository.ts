import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

export interface UserRow {
  id: string;
  type: string;
  phone: string;
  phone_verified: boolean;
  name: string;
  name_hi: string | null;
  language_pref: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'AuthRepository');
  }

  async findUserByPhone(phone: string): Promise<UserRow | null> {
    return this.queryOne<UserRow>(
      `SELECT id, type, phone, phone_verified, name, name_hi,
              language_pref, is_active, last_login_at, created_at
       FROM users
       WHERE phone = $1 AND is_active = TRUE`,
      [phone],
    );
  }

  async findUserById(id: string): Promise<UserRow | null> {
    return this.queryOne<UserRow>(
      `SELECT id, type, phone, phone_verified, name, name_hi,
              language_pref, is_active, last_login_at, created_at
       FROM users
       WHERE id = $1`,
      [id],
    );
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.query(
      `UPDATE users SET last_login_at = NOW() WHERE id = $1`,
      [userId],
    );
  }

  async createUser(
    phone: string,
    name: string,
    type: string = 'patient',
  ): Promise<UserRow> {
    return this.queryOneOrFail<UserRow>(
      `INSERT INTO users (phone, name, type, phone_verified)
       VALUES ($1, $2, $3, TRUE)
       RETURNING id, type, phone, phone_verified, name, name_hi,
                 language_pref, is_active, last_login_at, created_at`,
      [phone, name, type],
    );
  }

  /** Store OTP in a lightweight table or Redis in production.
   *  For development, we use a simple in-memory map. */
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  async storeOtp(phone: string, otp: string, ttlSeconds: number): Promise<void> {
    this.otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const stored = this.otpStore.get(phone);
    if (!stored) return false;
    if (Date.now() > stored.expiresAt) {
      this.otpStore.delete(phone);
      return false;
    }
    if (stored.otp !== otp) return false;
    this.otpStore.delete(phone);
    return true;
  }

  /** Audit log entry for auth events */
  async logAuthEvent(
    userId: string | null,
    action: string,
    details: Record<string, unknown>,
    ip?: string,
  ): Promise<void> {
    await this.query(
      `INSERT INTO audit_log (user_id, user_role, action, entity_type, details, ip_address)
       VALUES ($1, 'system', $2, 'auth', $3, $4)`,
      [userId, action, JSON.stringify(details), ip ?? null],
    );
  }
}
