import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class VerificationRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'VerificationRepository');
  }

  // ── Data Integrity ──────────────────────────────────────────

  async countUsersByRole() {
    const result = await this.query(
      `SELECT role, COUNT(*)::int AS count FROM users GROUP BY role`,
    );
    return result.rows;
  }

  async countOrphanedPatients() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM patients p
       LEFT JOIN users u ON u.id = p.user_id
       WHERE u.id IS NULL`,
    );
    return result?.count || 0;
  }

  async countOrphanedClinicians() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM clinicians c
       LEFT JOIN users u ON u.id = c.user_id
       WHERE u.id IS NULL`,
    );
    return result?.count || 0;
  }

  async countOrphanedCaregivers() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM caregivers cg
       LEFT JOIN users u ON u.id = cg.user_id
       LEFT JOIN patients p ON p.id = cg.patient_id
       WHERE u.id IS NULL OR p.id IS NULL`,
    );
    return result?.count || 0;
  }

  // ── Patient-Clinician Linking ───────────────────────────────

  async countPatientsWithoutPrimaryClinician() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM patients p
       WHERE p.primary_clinician_id IS NULL
          OR NOT EXISTS (SELECT 1 FROM clinicians c WHERE c.id = p.primary_clinician_id)`,
    );
    return result?.count || 0;
  }

  async countPatientsWithoutCareTeam() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM patients p
       WHERE NOT EXISTS (
         SELECT 1 FROM care_team_members ct WHERE ct.patient_id = p.id
       )`,
    );
    return result?.count || 0;
  }

  async countCareTeamMismatch() {
    // Patients whose primary clinician is NOT in their care team
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM patients p
       WHERE p.primary_clinician_id IS NOT NULL
         AND NOT EXISTS (
           SELECT 1 FROM care_team_members ct
           WHERE ct.patient_id = p.id AND ct.clinician_id = p.primary_clinician_id
         )`,
    );
    return result?.count || 0;
  }

  // ── Data Flow: Symptom Logs ─────────────────────────────────

  async countOrphanedSymptomLogs() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM symptom_logs sl
       LEFT JOIN patients p ON p.id = sl.patient_id
       WHERE p.id IS NULL`,
    );
    return result?.count || 0;
  }

  async countInvalidPainScores() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM symptom_logs
       WHERE pain_intensity IS NOT NULL
         AND (pain_intensity < 0 OR pain_intensity > 10)`,
    );
    return result?.count || 0;
  }

  async countInvalidEsasScores() {
    // ESAS stored as JSONB — check each dimension for 0-10 range
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM symptom_logs
       WHERE esas_scores IS NOT NULL
         AND EXISTS (
           SELECT 1 FROM jsonb_each_text(esas_scores) AS kv
           WHERE kv.value::int < 0 OR kv.value::int > 10
         )`,
    );
    return result?.count || 0;
  }

  // ── Data Flow: Medications ──────────────────────────────────

  async countOrphanedMedications() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM medications m
       LEFT JOIN patients p ON p.id = m.patient_id
       WHERE p.id IS NULL`,
    );
    return result?.count || 0;
  }

  async countMedsWithInvalidPrescriber() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM medications m
       WHERE m.prescribed_by IS NOT NULL
         AND NOT EXISTS (SELECT 1 FROM clinicians c WHERE c.id = m.prescribed_by)`,
    );
    return result?.count || 0;
  }

  async countOpioidsWithoutMedd() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM medications
       WHERE category = 'opioid' AND status = 'active'
         AND (medd_factor IS NULL OR medd_factor <= 0)`,
    );
    return result?.count || 0;
  }

  async countOrphanedMedLogs() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM medication_logs ml
       LEFT JOIN medications m ON m.id = ml.medication_id
       WHERE m.id IS NULL`,
    );
    return result?.count || 0;
  }

  async countMedLogPatientMismatch() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM medication_logs ml
       JOIN medications m ON m.id = ml.medication_id
       WHERE ml.patient_id != m.patient_id`,
    );
    return result?.count || 0;
  }

  // ── Alert System ────────────────────────────────────────────

  async countOrphanedAlerts() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM alerts a
       LEFT JOIN patients p ON p.id = a.patient_id
       WHERE p.id IS NULL`,
    );
    return result?.count || 0;
  }

  async countAlertsWithInvalidAssignment() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM alerts a
       WHERE a.assigned_to IS NOT NULL
         AND NOT EXISTS (SELECT 1 FROM clinicians c WHERE c.id = a.assigned_to)`,
    );
    return result?.count || 0;
  }

  async getAlertSeverityDistribution() {
    const result = await this.query(
      `SELECT type, status, COUNT(*)::int AS count
       FROM alerts GROUP BY type, status ORDER BY type, status`,
    );
    return result.rows;
  }

  // ── Clinical Notes ──────────────────────────────────────────

  async countOrphanedClinicalNotes() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM clinical_notes cn
       LEFT JOIN clinicians c ON c.id = cn.clinician_id
       LEFT JOIN patients p ON p.id = cn.patient_id
       WHERE c.id IS NULL OR p.id IS NULL`,
    );
    return result?.count || 0;
  }

  async countPatientsWithoutCarePlan() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM patients p
       WHERE NOT EXISTS (
         SELECT 1 FROM care_plans cp WHERE cp.patient_id = p.id
       )`,
    );
    return result?.count || 0;
  }

  async countCarePlansWithInvalidCreator() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM care_plans cp
       WHERE cp.created_by IS NOT NULL
         AND NOT EXISTS (SELECT 1 FROM clinicians c WHERE c.id = cp.created_by)`,
    );
    return result?.count || 0;
  }

  // ── Cross-Domain Consistency ────────────────────────────────

  async countPrescriberNotInCareTeam() {
    const result = await this.queryOne(
      `SELECT COUNT(*)::int AS count FROM medications m
       WHERE m.prescribed_by IS NOT NULL
         AND m.status = 'active'
         AND NOT EXISTS (
           SELECT 1 FROM care_team_members ct
           WHERE ct.patient_id = m.patient_id AND ct.clinician_id = m.prescribed_by
         )`,
    );
    return result?.count || 0;
  }

  async getTotalCounts() {
    const result = await this.queryOne(
      `SELECT
         (SELECT COUNT(*)::int FROM users) AS users,
         (SELECT COUNT(*)::int FROM patients) AS patients,
         (SELECT COUNT(*)::int FROM clinicians) AS clinicians,
         (SELECT COUNT(*)::int FROM symptom_logs) AS symptom_logs,
         (SELECT COUNT(*)::int FROM medications) AS medications,
         (SELECT COUNT(*)::int FROM medication_logs) AS medication_logs,
         (SELECT COUNT(*)::int FROM alerts) AS alerts,
         (SELECT COUNT(*)::int FROM clinical_notes) AS clinical_notes,
         (SELECT COUNT(*)::int FROM care_plans) AS care_plans`,
    );
    return result;
  }
}
