import { Injectable } from '@nestjs/common';
import { ConsentRepository } from './consent.repository';

@Injectable()
export class ConsentService {
  constructor(private readonly repo: ConsentRepository) {}

  async getMyConsents(userId: string) {
    return this.repo.findByUser(userId);
  }

  async getActiveConsents(userId: string) {
    return this.repo.findActiveConsents(userId);
  }

  async grantConsent(userId: string, data: Record<string, any>) {
    return this.repo.grantConsent(userId, data);
  }

  async revokeConsent(userId: string, consentType: string) {
    return this.repo.revokeConsent(userId, consentType);
  }

  async getHistory(userId: string, consentType: string) {
    return this.repo.getConsentHistory(userId, consentType);
  }
}
