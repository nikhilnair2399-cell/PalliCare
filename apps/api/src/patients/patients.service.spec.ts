import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsRepository } from './patients.repository';

describe('PatientsService', () => {
  let service: PatientsService;

  const mockPatientsRepo = {
    findAllForClinician: jest.fn(),
    findOneForClinician: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    createSymptomLog: jest.fn(),
    findSymptomLogs: jest.fn(),
    getDailyPainSummary: jest.fn(),
    getPainTrends: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: PatientsRepository, useValue: mockPatientsRepo },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── Clinician Endpoints ────────────────────────────────────

  describe('listForClinician', () => {
    it('should return paginated patient list', async () => {
      const mockResult = {
        data: [
          {
            id: 'patient-1',
            name: 'Ramesh Kumar',
            primary_diagnosis: 'Lung Cancer',
            latest_pain: 6,
            pain_avg_7d: 5.2,
            active_alerts_count: 1,
          },
          {
            id: 'patient-2',
            name: 'Priya Sharma',
            primary_diagnosis: 'Breast Cancer',
            latest_pain: 3,
            pain_avg_7d: 3.8,
            active_alerts_count: 0,
          },
        ],
        pagination: {
          total: 2,
          page: 1,
          per_page: 20,
          total_pages: 1,
        },
      };

      mockPatientsRepo.findAllForClinician.mockResolvedValue(mockResult);

      const result = await service.listForClinician({ page: 1, perPage: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(mockPatientsRepo.findAllForClinician).toHaveBeenCalledWith({
        page: 1,
        perPage: 20,
      });
    });

    it('should pass search and sort parameters through', async () => {
      mockPatientsRepo.findAllForClinician.mockResolvedValue({
        data: [],
        pagination: { total: 0, page: 1, per_page: 20, total_pages: 0 },
      });

      await service.listForClinician({
        search: 'Kumar',
        sortBy: 'pain_score',
        page: 2,
        perPage: 10,
      });

      expect(mockPatientsRepo.findAllForClinician).toHaveBeenCalledWith({
        search: 'Kumar',
        sortBy: 'pain_score',
        page: 2,
        perPage: 10,
      });
    });

    it('should pass status filter when provided', async () => {
      mockPatientsRepo.findAllForClinician.mockResolvedValue({
        data: [],
        pagination: { total: 0, page: 1, per_page: 20, total_pages: 0 },
      });

      await service.listForClinician({ statusFilter: 'active' });

      expect(mockPatientsRepo.findAllForClinician).toHaveBeenCalledWith({
        statusFilter: 'active',
      });
    });
  });

  describe('getDetailForClinician', () => {
    it('should return patient detail with recent logs, medications, and alerts', async () => {
      const mockDetail = {
        patient: {
          id: 'patient-1',
          name: 'Ramesh Kumar',
          primary_diagnosis: 'Lung Cancer',
          phase_of_illness: 'stable',
          pps_score: 70,
        },
        recent_logs: [
          { id: 'log-1', pain_intensity: 6, timestamp: '2026-03-01T10:00:00Z' },
        ],
        medications: [
          { id: 'med-1', name: 'Morphine Oral', dose: 15, status: 'active' },
        ],
        active_alerts: [
          { id: 'alert-1', type: 'warning', status: 'active' },
        ],
      };

      mockPatientsRepo.findOneForClinician.mockResolvedValue(mockDetail);

      const result = await service.getDetailForClinician('patient-1');

      expect(result.patient.id).toBe('patient-1');
      expect(result.recent_logs).toHaveLength(1);
      expect(result.medications).toHaveLength(1);
      expect(result.active_alerts).toHaveLength(1);
    });

    it('should throw NotFoundException when patient does not exist', async () => {
      mockPatientsRepo.findOneForClinician.mockResolvedValue(null);

      await expect(
        service.getDetailForClinician('nonexistent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── Patient Self Endpoints (Mobile) ────────────────────────

  describe('getMyProfile', () => {
    it('should return patient profile by userId', async () => {
      const mockProfile = {
        id: 'patient-1',
        name: 'Ramesh Kumar',
        phone: '+919876543210',
        primary_diagnosis: 'Lung Cancer',
        care_setting: 'home',
      };

      mockPatientsRepo.findByUserId.mockResolvedValue(mockProfile);

      const result = await service.getMyProfile('user-123');

      expect(result.id).toBe('patient-1');
      expect(mockPatientsRepo.findByUserId).toHaveBeenCalledWith('user-123');
    });

    it('should throw NotFoundException when patient profile not found', async () => {
      mockPatientsRepo.findByUserId.mockResolvedValue(null);

      await expect(service.getMyProfile('user-nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateMyProfile', () => {
    it('should update patient profile', async () => {
      const existingProfile = { id: 'patient-1', name: 'Ramesh Kumar' };
      const updatedProfile = { id: 'patient-1', name: 'Ramesh Kumar', care_setting: 'hospice' };

      mockPatientsRepo.findByUserId.mockResolvedValue(existingProfile);
      mockPatientsRepo.update.mockResolvedValue(updatedProfile);

      const result = await service.updateMyProfile('user-123', {
        care_setting: 'hospice',
      });

      expect(mockPatientsRepo.update).toHaveBeenCalledWith('patient-1', {
        care_setting: 'hospice',
      });
      expect(result.care_setting).toBe('hospice');
    });

    it('should throw NotFoundException when user profile not found for update', async () => {
      mockPatientsRepo.findByUserId.mockResolvedValue(null);

      await expect(
        service.updateMyProfile('user-bad', { care_setting: 'home' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── Symptom Logs ───────────────────────────────────────────

  describe('createSymptomLog', () => {
    it('should create a symptom log entry', async () => {
      const createdLog = {
        id: 'log-new-1',
        patient_id: 'patient-1',
        logged_by: 'user-123',
        pain_intensity: 7,
        log_type: 'detailed',
      };

      mockPatientsRepo.createSymptomLog.mockResolvedValue(createdLog);

      const result = await service.createSymptomLog('patient-1', 'user-123', {
        pain_intensity: 7,
        log_type: 'detailed',
        mood: 'anxious',
      });

      expect(mockPatientsRepo.createSymptomLog).toHaveBeenCalledWith({
        patient_id: 'patient-1',
        logged_by: 'user-123',
        pain_intensity: 7,
        log_type: 'detailed',
        mood: 'anxious',
      });
      expect(result.id).toBe('log-new-1');
    });
  });

  describe('getSymptomLogs', () => {
    it('should return paginated symptom logs with filters', async () => {
      const mockLogs = {
        data: [
          { id: 'log-1', pain_intensity: 6, timestamp: '2026-03-01T10:00:00Z' },
          { id: 'log-2', pain_intensity: 4, timestamp: '2026-03-01T14:00:00Z' },
        ],
        pagination: { total: 2, page: 1, per_page: 20, total_pages: 1 },
      };

      mockPatientsRepo.findSymptomLogs.mockResolvedValue(mockLogs);

      const result = await service.getSymptomLogs('patient-1', {
        startDate: '2026-03-01',
        endDate: '2026-03-05',
        logType: 'quick',
        page: 1,
        perPage: 20,
      });

      expect(result.data).toHaveLength(2);
      expect(mockPatientsRepo.findSymptomLogs).toHaveBeenCalledWith('patient-1', {
        startDate: '2026-03-01',
        endDate: '2026-03-05',
        logType: 'quick',
        page: 1,
        perPage: 20,
      });
    });
  });

  describe('getDailyPainSummary', () => {
    it('should return daily aggregated pain data', async () => {
      const summaryData = [
        { date: '2026-03-01', avg_pain: 5.5, max_pain: 8, min_pain: 3, entry_count: 4, breakthrough_count: 1 },
        { date: '2026-03-02', avg_pain: 4.2, max_pain: 6, min_pain: 2, entry_count: 3, breakthrough_count: 0 },
      ];

      mockPatientsRepo.getDailyPainSummary.mockResolvedValue(summaryData);

      const result = await service.getDailyPainSummary(
        'patient-1',
        '2026-03-01',
        '2026-03-02',
      );

      expect(result).toHaveLength(2);
      expect(result[0].avg_pain).toBe(5.5);
      expect(mockPatientsRepo.getDailyPainSummary).toHaveBeenCalledWith(
        'patient-1',
        '2026-03-01',
        '2026-03-02',
      );
    });
  });

  describe('getPainTrends', () => {
    it('should return pain trends for the last N days', async () => {
      const trendData = [
        { date: '2026-02-28', avg_pain: 5.0, max_pain: 7, min_pain: 3, entries: 5 },
        { date: '2026-03-01', avg_pain: 4.5, max_pain: 6, min_pain: 2, entries: 4 },
      ];

      mockPatientsRepo.getPainTrends.mockResolvedValue(trendData);

      const result = await service.getPainTrends('patient-1', 7);

      expect(result).toHaveLength(2);
      expect(mockPatientsRepo.getPainTrends).toHaveBeenCalledWith('patient-1', 7);
    });

    it('should default to 30 days when no parameter provided', async () => {
      mockPatientsRepo.getPainTrends.mockResolvedValue([]);

      await service.getPainTrends('patient-1');

      expect(mockPatientsRepo.getPainTrends).toHaveBeenCalledWith('patient-1', 30);
    });
  });
});
