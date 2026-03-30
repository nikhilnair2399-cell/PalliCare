import { Injectable, NotFoundException } from '@nestjs/common';
import { EducationRepository } from './education.repository';

@Injectable()
export class EducationService {
  constructor(private readonly repo: EducationRepository) {}

  // ─── Learn Modules ─────────────────────────────────────────

  async getModules(filters: {
    phase?: number;
    contentType?: string;
    audience?: string;
  }) {
    return this.repo.findModules(filters);
  }

  async getModuleById(moduleId: string) {
    const mod = await this.repo.findModuleById(moduleId);
    if (!mod) throw new NotFoundException('Module not found');
    return mod;
  }

  async getModulesWithProgress(patientId: string, phase?: number) {
    return this.repo.findModulesWithProgress(patientId, phase);
  }

  // ─── Learn Progress ────────────────────────────────────────

  async getProgress(patientId: string, moduleId: string) {
    return this.repo.getProgress(patientId, moduleId);
  }

  async updateProgress(
    patientId: string,
    moduleId: string,
    data: Record<string, any>,
  ) {
    // Verify module exists
    const mod = await this.repo.findModuleById(moduleId);
    if (!mod) throw new NotFoundException('Module not found');
    return this.repo.upsertProgress(patientId, moduleId, data);
  }

  async getOverallProgress(patientId: string) {
    return this.repo.getOverallProgress(patientId);
  }

  // ─── Content Attributions ─────────────────────────────────

  async getModuleAttributions(moduleId: string) {
    return this.repo.findAttributionsByModule(moduleId);
  }

  async addAttribution(data: {
    contentType: string;
    contentId: string;
    sourceName: string;
    sourceAuthors?: string;
    sourceYear?: number;
    sourceUrl?: string;
    licenseSpdx?: string;
    usageType: string;
    notes?: string;
  }) {
    return this.repo.addAttribution(data);
  }

  // ─── Breathe Sessions ─────────────────────────────────────

  async createBreatheSession(patientId: string, data: Record<string, any>) {
    return this.repo.createBreatheSession(patientId, data);
  }

  async getBreatheSessions(patientId: string, limit?: number) {
    return this.repo.findBreatheSessions(patientId, limit);
  }

  async getBreathingStats(patientId: string, days?: number) {
    return this.repo.getBreathingStats(patientId, days);
  }
}
