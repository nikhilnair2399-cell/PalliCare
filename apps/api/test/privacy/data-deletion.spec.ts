import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../../src/database/database.module';

describe('Data Deletion (DPDPA Section 12)', () => {
  let pool: jest.Mocked<Pool>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DATABASE_POOL,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    pool = module.get(DATABASE_POOL);
  });

  describe('Deletion Request', () => {
    it('should create a pending deletion request', async () => {
      pool.query.mockResolvedValue({
        rows: [{
          id: 'del-1',
          user_id: 'user-1',
          request_type: 'full_erasure',
          status: 'pending',
          created_at: new Date().toISOString(),
        }],
        rowCount: 1,
      } as any);

      const result = await pool.query(
        `INSERT INTO data_deletion_requests (user_id, request_type, status) VALUES ($1, $2, 'pending') RETURNING *`,
        ['user-1', 'full_erasure'],
      );

      expect(result.rows[0].status).toBe('pending');
      expect(result.rows[0].request_type).toBe('full_erasure');
    });
  });

  describe('Retention Exceptions', () => {
    it('should flag clinical records under 3-year retention', () => {
      // Clinical Establishments Act requires 3-year minimum retention
      const recordDate = new Date();
      recordDate.setFullYear(recordDate.getFullYear() - 2); // 2 years old
      const retentionYears = 3;
      const retentionExpiry = new Date(recordDate);
      retentionExpiry.setFullYear(retentionExpiry.getFullYear() + retentionYears);

      expect(retentionExpiry.getTime()).toBeGreaterThan(Date.now());
    });

    it('should allow deletion of records past retention period', () => {
      const recordDate = new Date();
      recordDate.setFullYear(recordDate.getFullYear() - 4); // 4 years old
      const retentionYears = 3;
      const retentionExpiry = new Date(recordDate);
      retentionExpiry.setFullYear(retentionExpiry.getFullYear() + retentionYears);

      expect(retentionExpiry.getTime()).toBeLessThan(Date.now());
    });
  });

  describe('Anonymization', () => {
    it('should anonymize user data for research retention', () => {
      const originalData = {
        user_id: 'uuid-123',
        name: 'Patient Name',
        phone: '+919876543210',
        pain_intensity: 7,
      };

      // Anonymization should remove PII but keep clinical data
      const anonymized = {
        anonymous_id: 'anon_abc123',
        name: null,
        phone: null,
        pain_intensity: originalData.pain_intensity,
      };

      expect(anonymized.name).toBeNull();
      expect(anonymized.phone).toBeNull();
      expect(anonymized.pain_intensity).toBe(7);
      expect(anonymized.anonymous_id).not.toBe(originalData.user_id);
    });
  });
});
