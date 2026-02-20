import { Injectable, NotFoundException } from '@nestjs/common';
import { MedicationDbRepository } from './medication-db.repository';

@Injectable()
export class MedicationDbService {
  constructor(private readonly repo: MedicationDbRepository) {}

  async search(query: string, limit?: number) {
    return this.repo.search(query, limit);
  }

  async getById(id: string) {
    const med = await this.repo.findById(id);
    if (!med) throw new NotFoundException('Medication not found in database');
    return med;
  }

  async getByCategory(category: string) {
    return this.repo.findByCategory(category);
  }

  async getPalliativeMedications() {
    return this.repo.findPalliativeOnly();
  }

  async getOpioidReference() {
    return this.repo.findOpioids();
  }
}
