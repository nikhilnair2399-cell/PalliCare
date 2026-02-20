import { Injectable } from '@nestjs/common';
import { DevicesRepository } from './devices.repository';

@Injectable()
export class DevicesService {
  constructor(private readonly repo: DevicesRepository) {}

  async getMyDevices(userId: string) {
    return this.repo.findByUser(userId);
  }

  async registerDevice(userId: string, data: Record<string, any>) {
    return this.repo.upsert(userId, data);
  }

  async updateSyncTime(deviceId: string) {
    return this.repo.updateSyncTime(deviceId);
  }

  async deactivateDevice(userId: string, deviceId: string) {
    return this.repo.deactivate(userId, deviceId);
  }

  async getActiveTokens(userId: string) {
    return this.repo.getActiveTokens(userId);
  }
}
