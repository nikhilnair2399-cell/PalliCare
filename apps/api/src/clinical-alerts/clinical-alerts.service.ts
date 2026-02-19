import { Injectable, NotFoundException } from '@nestjs/common';
import { ClinicalAlertsRepository } from './clinical-alerts.repository';

@Injectable()
export class ClinicalAlertsService {
  constructor(private readonly alertsRepo: ClinicalAlertsRepository) {}

  async list(params: {
    severity?: string;
    status?: string;
    page?: number;
    perPage?: number;
  }) {
    return this.alertsRepo.findAll(params);
  }

  async getById(alertId: string) {
    const alert = await this.alertsRepo.findById(alertId);
    if (!alert) throw new NotFoundException(`Alert ${alertId} not found`);
    return alert;
  }

  async getByPatient(patientId: string, status?: string) {
    return this.alertsRepo.findByPatient(patientId, status || 'active');
  }

  async acknowledge(alertId: string, clinicianId: string) {
    const alert = await this.alertsRepo.acknowledge(alertId, clinicianId);
    if (!alert) throw new NotFoundException(`Alert ${alertId} not found or already handled`);
    return alert;
  }

  async resolve(alertId: string, clinicianId: string, notes?: string) {
    const alert = await this.alertsRepo.resolve(alertId, clinicianId, notes);
    if (!alert) throw new NotFoundException(`Alert ${alertId} not found or already resolved`);
    return alert;
  }

  async escalate(alertId: string, escalateTo: string) {
    const alert = await this.alertsRepo.escalate(alertId, escalateTo);
    if (!alert) throw new NotFoundException(`Alert ${alertId} not found`);
    return alert;
  }

  async countBySeverity() {
    return this.alertsRepo.countBySeverity();
  }
}
