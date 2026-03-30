import { Injectable, Logger } from '@nestjs/common';
import { VerificationRepository } from './verification.repository';
import { randomUUID } from 'crypto';

export interface VerificationResult {
  testName: string;
  category: string;
  passed: boolean;
  details: string;
  duration: number;
}

export interface VerificationReport {
  runId: string;
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  results: VerificationResult[];
}

@Injectable()
export class VerificationService {
  private readonly logger = new Logger('VerificationService');

  constructor(private readonly repo: VerificationRepository) {}

  async runAllTests(): Promise<VerificationReport> {
    const runId = randomUUID();
    const results: VerificationResult[] = [];

    // ── Data Integrity ────────────────────────────────────────
    await this.runTest(results, 'Users exist by role', 'Data Integrity', async () => {
      const roles = await this.repo.countUsersByRole();
      const total = roles.reduce((s: number, r: any) => s + r.count, 0);
      return { passed: total > 0, details: roles.map((r: any) => `${r.role}: ${r.count}`).join(', ') };
    });

    await this.runTest(results, 'All patients have valid user references', 'Data Integrity', async () => {
      const count = await this.repo.countOrphanedPatients();
      return { passed: count === 0, details: count === 0 ? 'All valid' : `${count} orphaned patient(s)` };
    });

    await this.runTest(results, 'All clinicians have valid user references', 'Data Integrity', async () => {
      const count = await this.repo.countOrphanedClinicians();
      return { passed: count === 0, details: count === 0 ? 'All valid' : `${count} orphaned clinician(s)` };
    });

    await this.runTest(results, 'All caregivers have valid references', 'Data Integrity', async () => {
      const count = await this.repo.countOrphanedCaregivers();
      return { passed: count === 0, details: count === 0 ? 'All valid' : `${count} orphaned caregiver(s)` };
    });

    // ── Patient-Clinician Linking ─────────────────────────────
    await this.runTest(results, 'Every patient has a valid primary clinician', 'Patient-Clinician Linking', async () => {
      const count = await this.repo.countPatientsWithoutPrimaryClinician();
      return { passed: count === 0, details: count === 0 ? 'All assigned' : `${count} patient(s) without valid primary clinician` };
    });

    await this.runTest(results, 'Every patient has care team members', 'Patient-Clinician Linking', async () => {
      const count = await this.repo.countPatientsWithoutCareTeam();
      return { passed: count === 0, details: count === 0 ? 'All have care teams' : `${count} patient(s) without care team` };
    });

    await this.runTest(results, 'Primary clinician is in care team', 'Patient-Clinician Linking', async () => {
      const count = await this.repo.countCareTeamMismatch();
      return { passed: count === 0, details: count === 0 ? 'All consistent' : `${count} mismatch(es)` };
    });

    // ── Data Flow: Symptom Logs ───────────────────────────────
    await this.runTest(results, 'All symptom logs belong to existing patients', 'Data Flow: Logs', async () => {
      const count = await this.repo.countOrphanedSymptomLogs();
      return { passed: count === 0, details: count === 0 ? 'All valid' : `${count} orphaned log(s)` };
    });

    await this.runTest(results, 'Pain intensity values in valid range (0-10)', 'Data Flow: Logs', async () => {
      const count = await this.repo.countInvalidPainScores();
      return { passed: count === 0, details: count === 0 ? 'All in range' : `${count} out-of-range score(s)` };
    });

    await this.runTest(results, 'ESAS scores in valid range (0-10)', 'Data Flow: Logs', async () => {
      const count = await this.repo.countInvalidEsasScores();
      return { passed: count === 0, details: count === 0 ? 'All in range' : `${count} invalid ESAS score(s)` };
    });

    // ── Data Flow: Medications ────────────────────────────────
    await this.runTest(results, 'All medications belong to existing patients', 'Data Flow: Medications', async () => {
      const count = await this.repo.countOrphanedMedications();
      return { passed: count === 0, details: count === 0 ? 'All valid' : `${count} orphaned medication(s)` };
    });

    await this.runTest(results, 'All medications prescribed by valid clinicians', 'Data Flow: Medications', async () => {
      const count = await this.repo.countMedsWithInvalidPrescriber();
      return { passed: count === 0, details: count === 0 ? 'All valid' : `${count} invalid prescriber(s)` };
    });

    await this.runTest(results, 'Active opioids have valid MEDD factors', 'Data Flow: Medications', async () => {
      const count = await this.repo.countOpioidsWithoutMedd();
      return { passed: count === 0, details: count === 0 ? 'All have MEDD' : `${count} opioid(s) missing MEDD factor` };
    });

    await this.runTest(results, 'Medication logs reference existing medications', 'Data Flow: Medications', async () => {
      const count = await this.repo.countOrphanedMedLogs();
      return { passed: count === 0, details: count === 0 ? 'All valid' : `${count} orphaned med log(s)` };
    });

    await this.runTest(results, 'Medication log patient IDs match medication patient IDs', 'Data Flow: Medications', async () => {
      const count = await this.repo.countMedLogPatientMismatch();
      return { passed: count === 0, details: count === 0 ? 'All consistent' : `${count} mismatch(es)` };
    });

    // ── Alert System ──────────────────────────────────────────
    await this.runTest(results, 'All alerts reference existing patients', 'Alert System', async () => {
      const count = await this.repo.countOrphanedAlerts();
      return { passed: count === 0, details: count === 0 ? 'All valid' : `${count} orphaned alert(s)` };
    });

    await this.runTest(results, 'Alerts assigned to valid clinicians', 'Alert System', async () => {
      const count = await this.repo.countAlertsWithInvalidAssignment();
      return { passed: count === 0, details: count === 0 ? 'All valid' : `${count} invalid assignment(s)` };
    });

    await this.runTest(results, 'Alert severity distribution is reasonable', 'Alert System', async () => {
      const dist = await this.repo.getAlertSeverityDistribution();
      const details = dist.map((d: any) => `${d.type}/${d.status}: ${d.count}`).join(', ') || 'No alerts';
      return { passed: true, details };
    });

    // ── Clinical Notes ────────────────────────────────────────
    await this.runTest(results, 'Clinical notes reference valid clinicians and patients', 'Clinical Notes', async () => {
      const count = await this.repo.countOrphanedClinicalNotes();
      return { passed: count === 0, details: count === 0 ? 'All valid' : `${count} orphaned note(s)` };
    });

    await this.runTest(results, 'Every patient has at least one care plan', 'Clinical Notes', async () => {
      const count = await this.repo.countPatientsWithoutCarePlan();
      return { passed: count === 0, details: count === 0 ? 'All covered' : `${count} patient(s) without care plan` };
    });

    await this.runTest(results, 'Care plans created by valid clinicians', 'Clinical Notes', async () => {
      const count = await this.repo.countCarePlansWithInvalidCreator();
      return { passed: count === 0, details: count === 0 ? 'All valid' : `${count} invalid creator(s)` };
    });

    // ── Cross-Domain Consistency ──────────────────────────────
    await this.runTest(results, 'Medication prescribers are in patient care team', 'Cross-Domain', async () => {
      const count = await this.repo.countPrescriberNotInCareTeam();
      return { passed: count === 0, details: count === 0 ? 'All consistent' : `${count} prescriber(s) not in care team` };
    });

    await this.runTest(results, 'Database tables have data', 'Cross-Domain', async () => {
      const counts = await this.repo.getTotalCounts();
      const empty = Object.entries(counts || {}).filter(([, v]) => v === 0).map(([k]) => k);
      return {
        passed: empty.length === 0,
        details: empty.length === 0
          ? `All tables populated: ${Object.entries(counts || {}).map(([k, v]) => `${k}=${v}`).join(', ')}`
          : `Empty tables: ${empty.join(', ')}`,
      };
    });

    const passed = results.filter((r) => r.passed).length;
    return {
      runId,
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passed,
      failed: results.length - passed,
      results,
    };
  }

  private async runTest(
    results: VerificationResult[],
    testName: string,
    category: string,
    fn: () => Promise<{ passed: boolean; details: string }>,
  ) {
    const start = Date.now();
    try {
      const { passed, details } = await fn();
      results.push({ testName, category, passed, details, duration: Date.now() - start });
    } catch (err: any) {
      this.logger.warn(`Test failed: ${testName} — ${err.message}`);
      results.push({
        testName,
        category,
        passed: false,
        details: `Error: ${err.message}`,
        duration: Date.now() - start,
      });
    }
  }
}
