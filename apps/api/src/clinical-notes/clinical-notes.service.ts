import { Injectable, NotFoundException } from '@nestjs/common';
import { ClinicalNotesRepository } from './clinical-notes.repository';

@Injectable()
export class ClinicalNotesService {
  constructor(private readonly repo: ClinicalNotesRepository) {}

  async getByPatient(
    patientId: string,
    params: { noteType?: string; page?: number; perPage?: number },
  ) {
    return this.repo.findByPatient(patientId, {
      noteType: params.noteType,
      page: params.page || 1,
      perPage: params.perPage || 20,
    });
  }

  async getById(noteId: string) {
    const note = await this.repo.findById(noteId);
    if (!note) throw new NotFoundException('Clinical note not found');
    return note;
  }

  async create(clinicianId: string, patientId: string, data: Record<string, any>) {
    return this.repo.create(clinicianId, patientId, data);
  }

  async update(noteId: string, data: Record<string, any>) {
    const note = await this.repo.findById(noteId);
    if (!note) throw new NotFoundException('Clinical note not found');
    return this.repo.update(noteId, data);
  }

  async getMyNotes(clinicianId: string, page?: number, perPage?: number) {
    return this.repo.findByClinician(clinicianId, page || 1, perPage || 20);
  }
}
