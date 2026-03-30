import { Test, TestingModule } from '@nestjs/testing';
import { SyncService } from './sync.service';
import { SyncRepository, SyncRecord, SyncResult } from './sync.repository';

describe('SyncService', () => {
  let service: SyncService;
  let syncRepo: jest.Mocked<SyncRepository>;

  const mockSyncRepo = {
    processBatch: jest.fn(),
    getPending: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        { provide: SyncRepository, useValue: mockSyncRepo },
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
    syncRepo = module.get(SyncRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processSync', () => {
    const userId = 'user-abc-123';
    const deviceId = 'device-xyz-789';

    it('should accept device_id + records array and delegate to repository', async () => {
      const records: SyncRecord[] = [
        {
          type: 'symptom_log',
          data: { pain_intensity: 7, log_type: 'quick' },
          local_id: 'local-001',
          created_at: '2026-03-01T10:00:00Z',
        },
        {
          type: 'medication_log',
          data: { medication_id: 'med-123', status: 'taken' },
          local_id: 'local-002',
          created_at: '2026-03-01T10:05:00Z',
        },
      ];

      const expectedResult: SyncResult = {
        synced: 2,
        conflicts: [],
        failed: [],
      };

      mockSyncRepo.processBatch.mockResolvedValue(expectedResult);

      const result = await service.processSync(userId, deviceId, records);

      expect(mockSyncRepo.processBatch).toHaveBeenCalledWith(
        userId,
        deviceId,
        records,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should use local_id as idempotency key and report conflicts', async () => {
      const records: SyncRecord[] = [
        {
          type: 'symptom_log',
          data: { pain_intensity: 5 },
          local_id: 'local-duplicate-001',
          created_at: '2026-03-01T10:00:00Z',
        },
      ];

      const resultWithConflict: SyncResult = {
        synced: 0,
        conflicts: [
          {
            local_id: 'local-duplicate-001',
            server_id: 'server-abc-123',
            resolution: 'server_wins',
          },
        ],
        failed: [],
      };

      mockSyncRepo.processBatch.mockResolvedValue(resultWithConflict);

      const result = await service.processSync(userId, deviceId, records);

      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0].local_id).toBe('local-duplicate-001');
      expect(result.conflicts[0].resolution).toBe('server_wins');
      expect(result.synced).toBe(0);
    });

    it('should return per-record status with synced/conflict/failed breakdown', async () => {
      const records: SyncRecord[] = [
        {
          type: 'symptom_log',
          data: { pain_intensity: 3 },
          local_id: 'local-001',
          created_at: '2026-03-01T10:00:00Z',
        },
        {
          type: 'symptom_log',
          data: { pain_intensity: 8 },
          local_id: 'local-002',
          created_at: '2026-03-01T10:05:00Z',
        },
        {
          type: 'medication_log',
          data: { medication_id: 'med-bad', status: 'taken' },
          local_id: 'local-003',
          created_at: '2026-03-01T10:10:00Z',
        },
      ];

      const mixedResult: SyncResult = {
        synced: 1,
        conflicts: [
          {
            local_id: 'local-002',
            server_id: 'server-002',
            resolution: 'server_wins',
          },
        ],
        failed: [
          {
            local_id: 'local-003',
            error: 'Invalid medication reference',
          },
        ],
      };

      mockSyncRepo.processBatch.mockResolvedValue(mixedResult);

      const result = await service.processSync(userId, deviceId, records);

      expect(result.synced).toBe(1);
      expect(result.conflicts).toHaveLength(1);
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0].error).toBe('Invalid medication reference');
    });

    it('should detect conflict when server updated_at > incoming created_at', async () => {
      const records: SyncRecord[] = [
        {
          type: 'symptom_log',
          data: { pain_intensity: 4 },
          local_id: 'local-stale-001',
          created_at: '2026-02-28T08:00:00Z', // older timestamp
        },
      ];

      const conflictResult: SyncResult = {
        synced: 0,
        conflicts: [
          {
            local_id: 'local-stale-001',
            server_id: 'server-fresh-001',
            resolution: 'server_wins',
          },
        ],
        failed: [],
      };

      mockSyncRepo.processBatch.mockResolvedValue(conflictResult);

      const result = await service.processSync(userId, deviceId, records);

      expect(result.synced).toBe(0);
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0].resolution).toBe('server_wins');
    });

    it('should handle empty records array gracefully', async () => {
      const emptyResult: SyncResult = {
        synced: 0,
        conflicts: [],
        failed: [],
      };

      mockSyncRepo.processBatch.mockResolvedValue(emptyResult);

      const result = await service.processSync(userId, deviceId, []);

      expect(mockSyncRepo.processBatch).toHaveBeenCalledWith(
        userId,
        deviceId,
        [],
      );
      expect(result.synced).toBe(0);
      expect(result.conflicts).toHaveLength(0);
      expect(result.failed).toHaveLength(0);
    });

    it('should pass all record types correctly', async () => {
      const records: SyncRecord[] = [
        {
          type: 'symptom_log',
          data: {
            pain_intensity: 6,
            pain_locations: ['chest'],
            mood: 'anxious',
            esas_scores: { pain: 6, nausea: 2 },
          },
          local_id: 'local-symptom-001',
          created_at: '2026-03-01T12:00:00Z',
        },
        {
          type: 'medication_log',
          data: {
            medication_id: 'med-456',
            scheduled_time: '2026-03-01T08:00:00Z',
            actual_time: '2026-03-01T08:15:00Z',
            status: 'taken',
            notes: 'Taken with food',
          },
          local_id: 'local-med-001',
          created_at: '2026-03-01T08:15:00Z',
        },
      ];

      const successResult: SyncResult = {
        synced: 2,
        conflicts: [],
        failed: [],
      };

      mockSyncRepo.processBatch.mockResolvedValue(successResult);

      const result = await service.processSync(userId, deviceId, records);

      expect(result.synced).toBe(2);
      const callArgs = mockSyncRepo.processBatch.mock.calls[0];
      expect(callArgs[2]).toHaveLength(2);
      expect(callArgs[2][0].type).toBe('symptom_log');
      expect(callArgs[2][1].type).toBe('medication_log');
    });
  });

  describe('getPendingRecords', () => {
    it('should return pending records for a device', async () => {
      const pendingRows = [
        { id: 'sq-1', device_id: 'device-1', status: 'pending', entity_type: 'symptom_log' },
        { id: 'sq-2', device_id: 'device-1', status: 'pending', entity_type: 'medication_log' },
      ];

      mockSyncRepo.getPending.mockResolvedValue(pendingRows);

      const result = await service.getPendingRecords('device-1');

      expect(mockSyncRepo.getPending).toHaveBeenCalledWith('device-1');
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no pending records', async () => {
      mockSyncRepo.getPending.mockResolvedValue([]);

      const result = await service.getPendingRecords('device-new');

      expect(result).toEqual([]);
    });
  });
});
