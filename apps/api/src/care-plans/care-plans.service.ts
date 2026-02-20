import { Injectable, NotFoundException } from '@nestjs/common';
import { CarePlansRepository } from './care-plans.repository';

@Injectable()
export class CarePlansService {
  constructor(private readonly repo: CarePlansRepository) {}

  async getByPatient(patientId: string, status?: string) {
    return this.repo.findByPatient(patientId, status);
  }

  async getById(planId: string) {
    const plan = await this.repo.findById(planId);
    if (!plan) throw new NotFoundException('Care plan not found');
    return plan;
  }

  async getActivePlan(patientId: string) {
    return this.repo.findActivePlan(patientId);
  }

  async create(createdBy: string, patientId: string, data: Record<string, any>) {
    return this.repo.create(createdBy, patientId, data);
  }

  async update(planId: string, data: Record<string, any>) {
    const plan = await this.repo.findById(planId);
    if (!plan) throw new NotFoundException('Care plan not found');
    return this.repo.update(planId, data);
  }

  async createNewVersion(planId: string, createdBy: string) {
    const plan = await this.repo.findById(planId);
    if (!plan) throw new NotFoundException('Care plan not found');
    // Archive current version
    await this.repo.update(planId, { status: 'archived' });
    return this.repo.createNewVersion(planId, createdBy);
  }
}
