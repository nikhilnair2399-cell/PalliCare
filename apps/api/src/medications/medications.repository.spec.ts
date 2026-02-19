import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsRepository } from './medications.repository';
import { DATABASE_POOL } from '../database/database.module';

describe('MedicationsRepository', () => {
  let repository: MedicationsRepository;

  const mockPool = {
    query: jest.fn(),
    connect: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationsRepository,
        { provide: DATABASE_POOL, useValue: mockPool },
      ],
    }).compile();

    repository = module.get<MedicationsRepository>(MedicationsRepository);
    jest.clearAllMocks();
  });

  describe('calculateMedd', () => {
    it('should calculate MEDD for opioid medications', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            name: 'Morphine Oral',
            generic_name: 'morphine',
            dose: 15,
            unit: 'mg',
            frequency: 'Q4H',
            medd_factor: '1',
            route: 'oral',
          },
          {
            name: 'Oxycodone',
            generic_name: 'oxycodone',
            dose: 10,
            unit: 'mg',
            frequency: 'BD',
            medd_factor: '1.5',
            route: 'oral',
          },
        ],
      });

      const result = await repository.calculateMedd('patient-123');

      // Morphine: 15mg x 6 (Q4H) x 1.0 = 90
      // Oxycodone: 10mg x 2 (BD) x 1.5 = 30
      // Total = 120
      expect(result.total_medd_mg).toBe(120);
      expect(result.breakdown).toHaveLength(2);
      expect(result.breakdown[0].medication_name).toBe('Morphine Oral');
      expect(result.breakdown[0].medd_contribution_mg).toBe(90);
      expect(result.breakdown[1].medication_name).toBe('Oxycodone');
      expect(result.breakdown[1].medd_contribution_mg).toBe(30);
    });

    it('should return zero MEDD when no opioids', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const result = await repository.calculateMedd('patient-456');

      expect(result.total_medd_mg).toBe(0);
      expect(result.breakdown).toHaveLength(0);
    });

    it('should handle fentanyl patch calculation', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            name: 'Fentanyl Patch',
            generic_name: 'fentanyl',
            dose: 25,
            unit: 'mcg',
            frequency: 'Q72H',
            medd_factor: '2.4',
            route: 'transdermal',
          },
        ],
      });

      const result = await repository.calculateMedd('patient-789');

      // Fentanyl: 25mcg x (1/3 for Q72H) x 2.4 = 20
      expect(result.total_medd_mg).toBe(20);
      expect(result.breakdown).toHaveLength(1);
    });

    it('should handle tramadol calculation', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            name: 'Tramadol',
            generic_name: 'tramadol',
            dose: 100,
            unit: 'mg',
            frequency: 'TDS',
            medd_factor: '0.1',
            route: 'oral',
          },
        ],
      });

      const result = await repository.calculateMedd('patient-abc');

      // Tramadol: 100mg x 3 (TDS) x 0.1 = 30
      expect(result.total_medd_mg).toBe(30);
    });
  });
});
