import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PatientsRepository } from './patients.repository';
import { ClinicalAlertsService } from '../clinical-alerts/clinical-alerts.service';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger('PatientsService');

  constructor(
    private readonly patientsRepo: PatientsRepository,
    private readonly alertsService: ClinicalAlertsService,
  ) {}

  // ── Clinician endpoints ───────────────────────────────────

  async listForClinician(params: {
    statusFilter?: string;
    sortBy?: string;
    search?: string;
    page?: number;
    perPage?: number;
    clinicianUserId?: string;
    role?: string;
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
    const log = await this.patientsRepo.createSymptomLog({
      patient_id: patientId,
      logged_by: userId,
      ...data,
    });
    // Evaluate clinical alert rules after new symptom data
    try {
      await this.alertsService.evaluateRules(patientId);
    } catch (err) {
      this.logger.warn(`Alert evaluation failed after symptom log: ${err}`);
    }
    return log;
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

  // ── Clinician Assignment ────────────────────────────────

  async assignClinician(patientId: string, clinicianUserId: string) {
    return this.patientsRepo.createAssignment(patientId, clinicianUserId);
  }

  async getAssignmentStatus(patientId: string, clinicianUserId: string) {
    return this.patientsRepo.findAssignment(patientId, clinicianUserId);
  }

  async approveAssignment(patientId: string, clinicianUserId: string) {
    return this.patientsRepo.updateAssignmentStatus(patientId, clinicianUserId, 'active');
  }

  async getPatientUserIdFromPatientId(patientId: string) {
    return this.patientsRepo.getPatientUserIdFromPatientId(patientId);
  }
}
