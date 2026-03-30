import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';
import { REDIS_CLIENT } from '../common/redis/redis.module';

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

export interface ClinicianRow {
  id: string;
  user_id: string;
  role: string;
  designation: string | null;
  department: string | null;
  can_prescribe: boolean;
  can_export_research: boolean;
  can_manage_users: boolean;
}

@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(
    @Inject(DATABASE_POOL) pool: Pool,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
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

  /** OTP key prefix (Redis keyPrefix already adds 'pallicare:') */
  private otpKey(phone: string): string {
    return `otp:${phone}`;
  }

  async storeOtp(phone: string, otp: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(this.otpKey(phone), otp, 'EX', ttlSeconds);
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const stored = await this.redis.get(this.otpKey(phone));
    if (!stored) return false;
    if (stored !== otp) return false;
    // Delete after successful verification (one-time use)
    await this.redis.del(this.otpKey(phone));
    return true;
  }

  async findClinicianByUserId(userId: string): Promise<ClinicianRow | null> {
    return this.queryOne<ClinicianRow>(
      `SELECT id, user_id, role, designation, department,
              can_prescribe, can_export_research, can_manage_users
       FROM clinicians
       WHERE user_id = $1`,
      [userId],
    );
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
