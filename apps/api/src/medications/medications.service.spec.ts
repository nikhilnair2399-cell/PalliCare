import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { MedicationsRepository } from './medications.repository';

describe('MedicationsService', () => {
  let service: MedicationsService;

  const mockMedsRepo = {
    findByPatient: jest.fn(),
    findById: jest.fn(),
    createMedLog: jest.fn(),
    findMedLogs: jest.fn(),
    getTodaySchedule: jest.fn(),
    calculateMedd: jest.fn(),
    findByPatientForClinician: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationsService,
        { provide: MedicationsRepository, useValue: mockMedsRepo },
      ],
    }).compile();

    service = module.get<MedicationsService>(MedicationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── Medication CRUD ────────────────────────────────────────

  describe('listForPatient', () => {
    it('should return active medications by default', async () => {
      const mockMeds = [
        { id: 'med-1', name: 'Morphine Oral', dose: 15, unit: 'mg', status: 'active' },
        { id: 'med-2', name: 'Paracetamol', dose: 500, unit: 'mg', status: 'active' },
      ];

      mockMedsRepo.findByPatient.mockResolvedValue(mockMeds);

      const result = await service.listForPatient('patient-1');

      expect(mockMedsRepo.findByPatient).toHaveBeenCalledWith('patient-1', 'active');
      expect(result).toHaveLength(2);
    });

    it('should filter by specified status', async () => {
      mockMedsRepo.findByPatient.mockResolvedValue([]);

      await service.listForPatient('patient-1', 'paused');

      expect(mockMedsRepo.findByPatient).toHaveBeenCalledWith('patient-1', 'paused');
    });

    it('should list all medications when status is "all"', async () => {
      const allMeds = [
        { id: 'med-1', status: 'active' },
        { id: 'med-2', status: 'paused' },
        { id: 'med-3', status: 'discontinued' },
      ];

      mockMedsRepo.findByPatient.mockResolvedValue(allMeds);

      const result = await service.listForPatient('patient-1', 'all');

      expect(mockMedsRepo.findByPatient).toHaveBeenCalledWith('patient-1', 'all');
      expect(result).toHaveLength(3);
    });
  });

  describe('getById', () => {
    it('should return medication when found', async () => {
      const mockMed = {
        id: 'med-1',
        name: 'Morphine Oral',
        dose: 15,
        unit: 'mg',
        route: 'oral',
        frequency: 'Q4H',
        category: 'opioid',
        prescribed_by_name: 'Dr. Gupta',
      };

      mockMedsRepo.findById.mockResolvedValue(mockMed);

      const result = await service.getById('med-1');

      expect(result.name).toBe('Morphine Oral');
      expect(mockMedsRepo.findById).toHaveBeenCalledWith('med-1');
    });

    it('should throw NotFoundException when medication not found', async () => {
      mockMedsRepo.findById.mockResolvedValue(null);

      await expect(service.getById('med-nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('listForClinician', () => {
    it('should return all medications (any status) for clinician view', async () => {
      const meds = [
        { id: 'med-1', name: 'Morphine', status: 'active' },
        { id: 'med-2', name: 'Gabapentin', status: 'paused' },
      ];

      mockMedsRepo.findByPatientForClinician.mockResolvedValue(meds);

      const result = await service.listForClinician('patient-1');

      expect(result).toHaveLength(2);
      expect(mockMedsRepo.findByPatientForClinician).toHaveBeenCalledWith('patient-1');
    });
  });

  // ── Dose Log Creation ─────────────────────────────────────

  describe('logAdministration', () => {
    it('should create a dose log with full details', async () => {
      const logData = {
        medication_id: 'med-1',
        patient_id: 'patient-1',
        scheduled_time: '2026-03-01T08:00:00Z',
        actual_time: '2026-03-01T08:15:00Z',
        status: 'taken',
        administered_by: 'user-123',
        notes: 'Taken with food',
        pain_before: 7,
        pain_after: 4,
      };

      const createdLog = {
        id: 'medlog-1',
        ...logData,
        created_at: '2026-03-01T08:15:00Z',
      };

      mockMedsRepo.createMedLog.mockResolvedValue(createdLog);

      const result = await service.logAdministration(logData);

      expect(mockMedsRepo.createMedLog).toHaveBeenCalledWith(logData);
      expect(result.id).toBe('medlog-1');
      expect(result.pain_before).toBe(7);
      expect(result.pain_after).toBe(4);
    });

    it('should create a skipped dose log', async () => {
      const skipData = {
        medication_id: 'med-1',
        patient_id: 'patient-1',
        scheduled_time: '2026-03-01T12:00:00Z',
        status: 'skipped',
        skip_reason: 'Patient sleeping',
      };

      const createdLog = { id: 'medlog-2', ...skipData };
      mockMedsRepo.createMedLog.mockResolvedValue(createdLog);

      const result = await service.logAdministration(skipData);

      expect(result.status).toBe('skipped');
      expect(result.skip_reason).toBe('Patient sleeping');
    });
  });

  describe('getMedLogs', () => {
    it('should return paginated medication logs', async () => {
      const mockLogs = {
        data: [
          { id: 'medlog-1', status: 'taken', actual_time: '2026-03-01T08:15:00Z' },
          { id: 'medlog-2', status: 'taken', actual_time: '2026-03-01T20:10:00Z' },
        ],
        pagination: { total: 2, page: 1, per_page: 20, total_pages: 1 },
      };

      mockMedsRepo.findMedLogs.mockResolvedValue(mockLogs);

      const result = await service.getMedLogs('med-1', 1, 20);

      expect(result.data).toHaveLength(2);
      expect(mockMedsRepo.findMedLogs).toHaveBeenCalledWith('med-1', 1, 20);
    });

    it('should work without pagination parameters', async () => {
      mockMedsRepo.findMedLogs.mockResolvedValue({
        data: [],
        pagination: { total: 0, page: 1, per_page: 20, total_pages: 0 },
      });

      await service.getMedLogs('med-1');

      expect(mockMedsRepo.findMedLogs).toHaveBeenCalledWith(
        'med-1',
        undefined,
        undefined,
      );
    });
  });

  describe('getTodaySchedule', () => {
    it('should return today schedule for a patient', async () => {
      const schedule = [
        {
          medication_id: 'med-1',
          name: 'Morphine Oral',
          dose: 15,
          unit: 'mg',
          scheduled_time: '08:00',
          log_id: 'medlog-1',
          log_status: 'taken',
        },
        {
          medication_id: 'med-1',
          name: 'Morphine Oral',
          dose: 15,
          unit: 'mg',
          scheduled_time: '12:00',
          log_id: null,
          log_status: null,
        },
      ];

      mockMedsRepo.getTodaySchedule.mockResolvedValue(schedule);

      const result = await service.getTodaySchedule('patient-1');

      expect(result).toHaveLength(2);
      expect(result[0].log_status).toBe('taken');
      expect(result[1].log_status).toBeNull();
      expect(mockMedsRepo.getTodaySchedule).toHaveBeenCalledWith('patient-1');
    });
  });

  // ── MEDD Calculation ──────────────────────────────────────

  describe('calculateMedd', () => {
    it('should return MEDD total and breakdown from repository', async () => {
      const meddResult = {
        total_medd_mg: 120,
        breakdown: [
          {
            medication_name: 'Morphine Oral',
            dose: '15 mg',
            frequency: 'Q4H',
            medd_contribution_mg: 90,
          },
          {
            medication_name: 'Oxycodone',
            dose: '10 mg',
            frequency: 'BD',
            medd_contribution_mg: 30,
          },
        ],
      };

      mockMedsRepo.calculateMedd.mockResolvedValue(meddResult);

      const result = await service.calculateMedd('patient-1');

      expect(result.total_medd_mg).toBe(120);
      expect(result.breakdown).toHaveLength(2);
      expect(result.breakdown[0].medd_contribution_mg).toBe(90);
      expect(result.breakdown[1].medd_contribution_mg).toBe(30);
    });

    it('should return zero MEDD when patient has no opioids', async () => {
      mockMedsRepo.calculateMedd.mockResolvedValue({
        total_medd_mg: 0,
        breakdown: [],
      });

      const result = await service.calculateMedd('patient-no-opioids');

      expect(result.total_medd_mg).toBe(0);
      expect(result.breakdown).toHaveLength(0);
    });

    it('should handle single high-dose opioid correctly', async () => {
      const meddResult = {
        total_medd_mg: 60,
        breakdown: [
          {
            medication_name: 'Fentanyl Patch',
            dose: '25 mcg',
            frequency: 'Q72H',
            medd_contribution_mg: 60,
          },
        ],
      };

      mockMedsRepo.calculateMedd.mockResolvedValue(meddResult);

      const result = await service.calculateMedd('patient-fentanyl');

      expect(result.total_medd_mg).toBe(60);
      expect(result.breakdown).toHaveLength(1);
    });
  });
});
