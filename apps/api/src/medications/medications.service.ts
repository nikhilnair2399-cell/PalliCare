import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { MedicationsRepository } from './medications.repository';
import { ClinicalAlertsService } from '../clinical-alerts/clinical-alerts.service';

@Injectable()
export class MedicationsService {
  private readonly logger = new Logger('MedicationsService');

  constructor(
    private readonly medsRepo: MedicationsRepository,
    private readonly alertsService: ClinicalAlertsService,
  ) {}

  async listForPatient(patientId: string, status: string = 'active') {
    return this.medsRepo.findByPatient(patientId, status);
  }

  async getById(medicationId: string) {
    const med = await this.medsRepo.findById(medicationId);
    if (!med) throw new NotFoundException(`Medication ${medicationId} not found`);
    return med;
  }

  async logAdministration(data: {
    medication_id: string;
    patient_id: string;
    scheduled_time?: string;
    actual_time?: string;
    status: string;
    administered_by?: string;
    notes?: string;
    skip_reason?: string;
    pain_before?: number;
    pain_after?: number;
  }) {
    const log = await this.medsRepo.createMedLog(data);
    // Evaluate clinical alert rules after medication log (adherence + MEDD rules)
    try {
      await this.alertsService.evaluateRules(data.patient_id);
    } catch (err) {
      this.logger.warn(`Alert evaluation failed after med log: ${err}`);
    }
    return log;
  }

  async getMedLogs(medicationId: string, page?: number, perPage?: number) {
    return this.medsRepo.findMedLogs(medicationId, page, perPage);
  }

  async getTodaySchedule(patientId: string) {
    return this.medsRepo.getTodaySchedule(patientId);
  }

  async calculateMedd(patientId: string) {
    return this.medsRepo.calculateMedd(patientId);
  }

  async listForClinician(patientId: string) {
    return this.medsRepo.findByPatientForClinician(patientId);
  }
}
