import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PatientsRepository } from './patients.repository';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger('PatientsService');

  constructor(private readonly patientsRepo: PatientsRepository) {}

  // ── Clinician endpoints ───────────────────────────────────

  async listForClinician(params: {
    statusFilter?: string;
    sortBy?: string;
    search?: string;
    page?: number;
    perPage?: number;
  }) {
    return this.patientsRepo.findAllForClinician(params);
  }

  async getDetailForClinician(patientId: string) {
    const result = await this.patientsRepo.findOneForClinician(patientId);
    if (!result) {
      throw new NotFoundException(`Patient ${patientId} not found`);
    }
    return result;
  }

  // ── Patient self endpoints (mobile) ───────────────────────

  async getMyProfile(userId: string) {
    const patient = await this.patientsRepo.findByUserId(userId);
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }
    return patient;
  }

  async updateMyProfile(userId: string, data: Record<string, any>) {
    const patient = await this.patientsRepo.findByUserId(userId);
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }
    return this.patientsRepo.update(patient.id, data);
  }

  // ── Symptom Logs ──────────────────────────────────────────

  async createSymptomLog(patientId: string, userId: string, data: Record<string, any>) {
    return this.patientsRepo.createSymptomLog({
      patient_id: patientId,
      logged_by: userId,
      ...data,
    });
  }

  async getSymptomLogs(patientId: string, params: {
    startDate?: string;
    endDate?: string;
    logType?: string;
    page?: number;
    perPage?: number;
  }) {
    return this.patientsRepo.findSymptomLogs(patientId, params);
  }

  async getDailyPainSummary(patientId: string, startDate: string, endDate: string) {
    return this.patientsRepo.getDailyPainSummary(patientId, startDate, endDate);
  }

  async getPainTrends(patientId: string, days: number = 30) {
    return this.patientsRepo.getPainTrends(patientId, days);
  }
}
