import { Injectable, Logger } from '@nestjs/common';
import { SyncRepository, SyncRecord } from './sync.repository';

@Injectable()
export class SyncService {
  private readonly logger = new Logger('SyncService');

  constructor(private readonly syncRepo: SyncRepository) {}

  async processSync(
    userId: string,
    deviceId: string,
    records: SyncRecord[],
  ) {
    this.logger.log(
      `Processing sync batch: ${records.length} records from device ${deviceId}`,
    );

    const result = await this.syncRepo.processBatch(userId, deviceId, records);

    this.logger.log(
      `Sync complete: ${result.synced} synced, ${result.conflicts.length} conflicts, ${result.failed.length} failed`,
    );

    return result;
  }

  async getPendingRecords(deviceId: string) {
    return this.syncRepo.getPending(deviceId);
  }
}
