import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, createHmac } from 'crypto';

/**
 * EncryptionService
 *
 * Handles deterministic hashing for phone lookups and
 * HMAC-based anonymization for research data exports.
 *
 * - Phone hashing: SHA-256 with a static salt so the same phone
 *   always produces the same hash (enables lookup without storing plaintext).
 * - Research anonymization: HMAC-SHA256 keyed with a separate salt,
 *   truncated to 16 hex chars — irreversible pseudonymous ID.
 *
 * Actual field-level encryption of PII at rest is performed by
 * pgcrypto functions (encrypt_pii / decrypt_pii) in the database layer.
 */
@Injectable()
export class EncryptionService {
  private readonly encryptionKey: string;
  private readonly phoneSalt: string;
  private readonly researchSalt: string;

  constructor(private config: ConfigService) {
    this.encryptionKey = config.getOrThrow<string>('APP_ENCRYPTION_KEY');
    this.phoneSalt = config.get<string>(
      'PHONE_HASH_SALT',
      'pallicare-phone-salt',
    );
    this.researchSalt = config.get<string>(
      'RESEARCH_ANONYMIZATION_SALT',
      'pallicare-research-salt',
    );
  }

  /**
   * Deterministic SHA-256 hash of a phone number.
   * Used for indexed lookup without storing the plaintext phone.
   */
  hashPhone(phone: string): string {
    return createHash('sha256')
      .update(this.phoneSalt + phone)
      .digest('hex');
  }

  /**
   * HMAC-SHA256 based pseudonymous ID for research exports.
   * Returns the first 16 hex characters (64 bits of entropy).
   */
  anonymizeId(userId: string): string {
    return createHmac('sha256', this.researchSalt)
      .update(userId)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Returns the raw encryption key for use with pgcrypto DB functions.
   * Should only be passed to trusted database query parameters.
   */
  getEncryptionKey(): string {
    return this.encryptionKey;
  }
}
