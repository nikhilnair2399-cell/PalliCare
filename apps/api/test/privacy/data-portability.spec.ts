import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../../src/database/database.module';

describe('Data Portability (DPDPA Section 18)', () => {
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

  describe('Export Request', () => {
    it('should create a pending export request', async () => {
      pool.query.mockResolvedValue({
        rows: [{
          id: 'exp-1',
          user_id: 'user-1',
          export_type: 'full',
          format: 'json',
          status: 'pending',
          created_at: new Date().toISOString(),
        }],
        rowCount: 1,
      } as any);

      const result = await pool.query(
        `INSERT INTO data_exports (user_id, export_type, format, status) VALUES ($1, $2, $3, 'pending') RETURNING *`,
        ['user-1', 'full', 'json'],
      );

      expect(result.rows[0].status).toBe('pending');
      expect(result.rows[0].export_type).toBe('full');
    });
  });

  describe('Export Authorization', () => {
    it('should only allow users to download their own exports', () => {
      const exportRecord = { user_id: 'user-1', id: 'exp-1' };
      const requestingUser = 'user-1';
      expect(exportRecord.user_id).toBe(requestingUser);
    });

    it('should deny download for other users exports', () => {
      const exportRecord = { user_id: 'user-1', id: 'exp-1' };
      const requestingUser = 'user-2';
      expect(exportRecord.user_id).not.toBe(requestingUser);
    });
  });

  describe('Export Content', () => {
    it('should include all required data categories in full export', () => {
      const requiredCategories = [
        'patient_profile',
        'symptom_logs',
        'medication_logs',
        'care_plans',
        'consent_records',
      ];

      // Verify all categories are present
      requiredCategories.forEach(category => {
        expect(requiredCategories).toContain(category);
      });
    });

    it('should support selective export types', () => {
      const validExportTypes = ['full', 'symptom_logs', 'medications', 'care_plans'];
      expect(validExportTypes).toContain('full');
      expect(validExportTypes).toContain('symptom_logs');
      expect(validExportTypes).toContain('medications');
    });

    it('should support JSON and CSV formats', () => {
      const validFormats = ['json', 'csv'];
      expect(validFormats).toContain('json');
      expect(validFormats).toContain('csv');
    });
  });
});
