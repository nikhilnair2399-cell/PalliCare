import { Injectable, NotFoundException } from '@nestjs/common';
import { CaregiversRepository } from './caregivers.repository';

@Injectable()
export class CaregiversService {
  constructor(private readonly repo: CaregiversRepository) {}

  // ─── Caregiver Management ─────────────────────────────────

  async getByPatient(patientId: string) {
    return this.repo.findByPatient(patientId);
  }

  async getMyPatients(userId: string) {
    return this.repo.findByUserId(userId);
  }

  async getById(caregiverId: string) {
    const cg = await this.repo.findById(caregiverId);
    if (!cg) throw new NotFoundException('Caregiver not found');
    return cg;
  }

  async updateCaregiver(caregiverId: string, data: Record<string, any>) {
    const cg = await this.repo.findById(caregiverId);
    if (!cg) throw new NotFoundException('Caregiver not found');
    return this.repo.updateCaregiver(caregiverId, data);
  }

  // ─── Care Schedules ───────────────────────────────────────

  async getSchedules(patientId: string, startDate?: string, endDate?: string) {
    return this.repo.findSchedules(patientId, startDate, endDate);
  }

  async createSchedule(data: Record<string, any>) {
    return this.repo.createSchedule(data);
  }

  async updateSchedule(scheduleId: string, data: Record<string, any>) {
    return this.repo.updateSchedule(scheduleId, data);
  }

  async deleteSchedule(scheduleId: string) {
    return this.repo.deleteSchedule(scheduleId);
  }

  // ─── Handover Notes ───────────────────────────────────────

  async getHandoverNotes(patientId: string, limit?: number) {
    return this.repo.findHandoverNotes(patientId, limit);
  }

  async createHandoverNote(data: Record<string, any>) {
    return this.repo.createHandoverNote(data);
  }
}
