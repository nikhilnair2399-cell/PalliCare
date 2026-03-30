import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ClinicalAlertsService } from './clinical-alerts.service';
import { ClinicalAlertsRepository } from './clinical-alerts.repository';

describe('ClinicalAlertsService', () => {
  let service: ClinicalAlertsService;

  const mockAlertsRepo = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByPatient: jest.fn(),
    acknowledge: jest.fn(),
    resolve: jest.fn(),
    escalate: jest.fn(),
    countBySeverity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicalAlertsService,
        { provide: ClinicalAlertsRepository, useValue: mockAlertsRepo },
      ],
    }).compile();

    service = module.get<ClinicalAlertsService>(ClinicalAlertsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── Alert Listing & Retrieval ─────────────────────────────

  describe('list', () => {
    it('should return paginated alerts', async () => {
      const mockResult = {
        data: [
          {
            id: 'alert-1',
            type: 'critical',
            status: 'active',
            patient_name: 'Ramesh Kumar',
            created_at: '2026-03-01T10:00:00Z',
          },
          {
            id: 'alert-2',
            type: 'warning',
            status: 'active',
            patient_name: 'Priya Sharma',
            created_at: '2026-03-01T09:30:00Z',
          },
        ],
        pagination: { total: 2, page: 1, per_page: 20, total_pages: 1 },
      };

      mockAlertsRepo.findAll.mockResolvedValue(mockResult);

      const result = await service.list({ page: 1, perPage: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter alerts by severity', async () => {
      mockAlertsRepo.findAll.mockResolvedValue({
        data: [{ id: 'alert-1', type: 'critical' }],
        pagination: { total: 1, page: 1, per_page: 20, total_pages: 1 },
      });

      await service.list({ severity: 'critical' });

      expect(mockAlertsRepo.findAll).toHaveBeenCalledWith({ severity: 'critical' });
    });

    it('should filter alerts by status', async () => {
      mockAlertsRepo.findAll.mockResolvedValue({
        data: [],
        pagination: { total: 0, page: 1, per_page: 20, total_pages: 0 },
      });

      await service.list({ status: 'acknowledged' });

      expect(mockAlertsRepo.findAll).toHaveBeenCalledWith({ status: 'acknowledged' });
    });
  });

  describe('getById', () => {
    it('should return alert by ID', async () => {
      const mockAlert = {
        id: 'alert-1',
        type: 'critical',
        status: 'active',
        patient_name: 'Ramesh Kumar',
        primary_diagnosis: 'Lung Cancer',
      };

      mockAlertsRepo.findById.mockResolvedValue(mockAlert);

      const result = await service.getById('alert-1');

      expect(result.id).toBe('alert-1');
      expect(result.type).toBe('critical');
    });

    it('should throw NotFoundException when alert not found', async () => {
      mockAlertsRepo.findById.mockResolvedValue(null);

      await expect(service.getById('alert-missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getByPatient', () => {
    it('should return active alerts for a patient by default', async () => {
      const patientAlerts = [
        { id: 'alert-1', type: 'warning', status: 'active' },
        { id: 'alert-2', type: 'critical', status: 'active' },
      ];

      mockAlertsRepo.findByPatient.mockResolvedValue(patientAlerts);

      const result = await service.getByPatient('patient-1');

      expect(result).toHaveLength(2);
      expect(mockAlertsRepo.findByPatient).toHaveBeenCalledWith('patient-1', 'active');
    });

    it('should allow filtering by custom status', async () => {
      mockAlertsRepo.findByPatient.mockResolvedValue([]);

      await service.getByPatient('patient-1', 'resolved');

      expect(mockAlertsRepo.findByPatient).toHaveBeenCalledWith('patient-1', 'resolved');
    });
  });

  // ── Alert Lifecycle (active -> acknowledged -> resolved) ──

  describe('acknowledge', () => {
    it('should acknowledge an active alert', async () => {
      const acknowledgedAlert = {
        id: 'alert-1',
        type: 'critical',
        status: 'acknowledged',
        acknowledged_by: 'clinician-1',
        acknowledged_at: '2026-03-01T10:30:00Z',
      };

      mockAlertsRepo.acknowledge.mockResolvedValue(acknowledgedAlert);

      const result = await service.acknowledge('alert-1', 'clinician-1');

      expect(result.status).toBe('acknowledged');
      expect(result.acknowledged_by).toBe('clinician-1');
      expect(mockAlertsRepo.acknowledge).toHaveBeenCalledWith('alert-1', 'clinician-1');
    });

    it('should throw NotFoundException when alert not found or already handled', async () => {
      mockAlertsRepo.acknowledge.mockResolvedValue(null);

      await expect(
        service.acknowledge('alert-already-resolved', 'clinician-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('resolve', () => {
    it('should resolve an acknowledged alert with notes', async () => {
      const resolvedAlert = {
        id: 'alert-1',
        type: 'warning',
        status: 'resolved',
        resolved_by: 'clinician-1',
        resolved_at: '2026-03-01T11:00:00Z',
        resolution_notes: 'Pain managed with breakthrough dose',
      };

      mockAlertsRepo.resolve.mockResolvedValue(resolvedAlert);

      const result = await service.resolve(
        'alert-1',
        'clinician-1',
        'Pain managed with breakthrough dose',
      );

      expect(result.status).toBe('resolved');
      expect(result.resolution_notes).toBe('Pain managed with breakthrough dose');
      expect(mockAlertsRepo.resolve).toHaveBeenCalledWith(
        'alert-1',
        'clinician-1',
        'Pain managed with breakthrough dose',
      );
    });

    it('should resolve an alert without notes', async () => {
      const resolvedAlert = {
        id: 'alert-2',
        status: 'resolved',
        resolved_by: 'clinician-2',
      };

      mockAlertsRepo.resolve.mockResolvedValue(resolvedAlert);

      const result = await service.resolve('alert-2', 'clinician-2');

      expect(result.status).toBe('resolved');
      expect(mockAlertsRepo.resolve).toHaveBeenCalledWith(
        'alert-2',
        'clinician-2',
        undefined,
      );
    });

    it('should resolve directly from active status (skipping acknowledge)', async () => {
      const resolvedAlert = {
        id: 'alert-3',
        status: 'resolved',
        resolved_by: 'clinician-1',
      };

      mockAlertsRepo.resolve.mockResolvedValue(resolvedAlert);

      const result = await service.resolve('alert-3', 'clinician-1', 'Resolved urgently');

      expect(result.status).toBe('resolved');
    });

    it('should throw NotFoundException when alert not found or already resolved', async () => {
      mockAlertsRepo.resolve.mockResolvedValue(null);

      await expect(
        service.resolve('alert-gone', 'clinician-1', 'notes'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('escalate', () => {
    it('should escalate an alert to another clinician', async () => {
      const escalatedAlert = {
        id: 'alert-1',
        status: 'escalated',
        escalated_to: 'senior-doc-1',
        escalated_at: '2026-03-01T11:30:00Z',
      };

      mockAlertsRepo.escalate.mockResolvedValue(escalatedAlert);

      const result = await service.escalate('alert-1', 'senior-doc-1');

      expect(result.status).toBe('escalated');
      expect(result.escalated_to).toBe('senior-doc-1');
      expect(mockAlertsRepo.escalate).toHaveBeenCalledWith('alert-1', 'senior-doc-1');
    });

    it('should throw NotFoundException when alert not found', async () => {
      mockAlertsRepo.escalate.mockResolvedValue(null);

      await expect(
        service.escalate('alert-missing', 'senior-doc-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── Severity Classification ───────────────────────────────

  describe('countBySeverity', () => {
    it('should return active alert counts grouped by severity', async () => {
      const counts = [
        { type: 'critical', count: 3 },
        { type: 'warning', count: 8 },
        { type: 'info', count: 12 },
      ];

      mockAlertsRepo.countBySeverity.mockResolvedValue(counts);

      const result = await service.countBySeverity();

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ type: 'critical', count: 3 });
      expect(result[1]).toEqual({ type: 'warning', count: 8 });
      expect(result[2]).toEqual({ type: 'info', count: 12 });
    });

    it('should return empty array when no active alerts', async () => {
      mockAlertsRepo.countBySeverity.mockResolvedValue([]);

      const result = await service.countBySeverity();

      expect(result).toEqual([]);
    });
  });

  // ── Full Lifecycle Integration ────────────────────────────

  describe('alert lifecycle flow', () => {
    it('should support full active -> acknowledged -> resolved lifecycle', async () => {
      // Step 1: Alert starts as active
      mockAlertsRepo.findById.mockResolvedValue({
        id: 'alert-lifecycle',
        type: 'critical',
        status: 'active',
      });
      const activeAlert = await service.getById('alert-lifecycle');
      expect(activeAlert.status).toBe('active');

      // Step 2: Clinician acknowledges
      mockAlertsRepo.acknowledge.mockResolvedValue({
        id: 'alert-lifecycle',
        status: 'acknowledged',
        acknowledged_by: 'clinician-1',
      });
      const ackedAlert = await service.acknowledge('alert-lifecycle', 'clinician-1');
      expect(ackedAlert.status).toBe('acknowledged');

      // Step 3: Clinician resolves
      mockAlertsRepo.resolve.mockResolvedValue({
        id: 'alert-lifecycle',
        status: 'resolved',
        resolved_by: 'clinician-1',
        resolution_notes: 'Dose adjusted',
      });
      const resolvedAlert = await service.resolve(
        'alert-lifecycle',
        'clinician-1',
        'Dose adjusted',
      );
      expect(resolvedAlert.status).toBe('resolved');
    });
  });
});
