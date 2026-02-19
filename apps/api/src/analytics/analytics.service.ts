import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepo: AnalyticsRepository) {}

  async getDepartmentSummary() {
    return this.analyticsRepo.getDepartmentSummary();
  }

  async getPainDistribution() {
    return this.analyticsRepo.getPainDistribution();
  }

  async getMedicationAdherence(weeks?: number) {
    return this.analyticsRepo.getMedicationAdherenceTrend(weeks || 8);
  }

  async getMeddDistribution() {
    return this.analyticsRepo.getMeddDistribution();
  }

  async getQualityMetrics() {
    return this.analyticsRepo.getQualityMetrics();
  }
}
