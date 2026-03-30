import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClinicalAlertsRepository } from './clinical-alerts.repository';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ClinicalAlertsService {
  private readonly logger = new Logger('ClinicalAlertsService');

  constructor(
    private readonly alertsRepo: ClinicalAlertsRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async list(params: {
    severity?: string;
    status?: string;
    page?: number;
    perPage?: number;
  }) {
    return this.alertsRepo.findAll(params);
  }

  async getById(alertId: string) {
    const alert = await this.alertsRepo.findById(alertId);
    if (!alert) throw new NotFoundException(`Alert ${alertId} not found`);
    return alert;
  }

  async getByPatient(patientId: string, status?: string) {
    return this.alertsRepo.findByPatient(patientId, status || 'active');
  }

  async acknowledge(alertId: string, clinicianId: string) {
    const alert = await this.alertsRepo.acknowledge(alertId, clinicianId);
    if (!alert) throw new NotFoundException(`Alert ${alertId} not found or already handled`);
    return alert;
  }

  async resolve(alertId: string, clinicianId: string, notes?: string) {
    const alert = await this.alertsRepo.resolve(alertId, clinicianId, notes);
    if (!alert) throw new NotFoundException(`Alert ${alertId} not found or already resolved`);
    return alert;
  }

  async escalate(alertId: string, escalateTo: string) {
    const alert = await this.alertsRepo.escalate(alertId, escalateTo);
    if (!alert) throw new NotFoundException(`Alert ${alertId} not found`);
    return alert;
  }

  async countBySeverity() {
    return this.alertsRepo.countBySeverity();
  }

  // ── Alert Rule Engine ───────────────────────────────────────

  /** Evaluate all 7 clinical alert rules for a patient */
  async evaluateRules(patientId: string): Promise<any[]> {
    const newAlerts: any[] = [];
    try {
      const results = await Promise.allSettled([
        this.checkPainSpike(patientId),
        this.checkSustainedHighPain(patientId),
        this.checkLowMedAdherence(patientId),
        this.checkNoLog48h(patientId),
        this.checkMoodDecline(patientId),
        this.checkHighMedd(patientId),
        this.checkBreakthroughPain(patientId),
      ]);
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value) newAlerts.push(r.value);
        if (r.status === 'rejected') this.logger.warn(`Rule failed for ${patientId}: ${r.reason}`);
      }
    } catch (err) {
      this.logger.error(`Rule evaluation failed for patient ${patientId}`, err);
    }
    if (newAlerts.length > 0) {
      this.logger.log(`Generated ${newAlerts.length} alert(s) for patient ${patientId}`);
      // Send push notifications to assigned clinicians
      await this.sendAlertNotifications(patientId, newAlerts);
    }
    return newAlerts;
  }

  /** Rule 1: Pain spike — CRITICAL when last pain >= 8 */
  private async checkPainSpike(patientId: string) {
    if (await this.alertsRepo.hasActiveAlert(patientId, 'pain_spike')) return null;
    const logs = await this.alertsRepo.getRecentSymptomLogs(patientId, 1);
    if (logs.length === 0 || logs[0].pain_intensity == null || logs[0].pain_intensity < 8) return null;
    return this.alertsRepo.createAutoAlert({
      patientId,
      type: 'critical',
      triggerRule: 'pain_spike',
      message: `Severe pain reported: ${logs[0].pain_intensity}/10`,
      details: { painScore: logs[0].pain_intensity, logId: logs[0].id },
    });
  }

  /** Rule 2: Sustained high pain — WARNING when avg >= 6 over 3 days (min 3 entries) */
  private async checkSustainedHighPain(patientId: string) {
    if (await this.alertsRepo.hasActiveAlert(patientId, 'pain_sustained_high')) return null;
    const logs = await this.alertsRepo.getRecentSymptomLogs(patientId, 3);
    const withPain = logs.filter((l: any) => l.pain_intensity != null);
    if (withPain.length < 3) return null;
    const avg = withPain.reduce((s: number, l: any) => s + l.pain_intensity, 0) / withPain.length;
    if (avg < 6) return null;
    return this.alertsRepo.createAutoAlert({
      patientId,
      type: 'warning',
      triggerRule: 'pain_sustained_high',
      message: `Sustained high pain: avg ${avg.toFixed(1)}/10 over 3 days`,
      details: { avgPain: Math.round(avg * 10) / 10, entries: withPain.length },
    });
  }

  /** Rule 3: Low medication adherence — WARNING when < 70% over 7 days (min 5 logs) */
  private async checkLowMedAdherence(patientId: string) {
    if (await this.alertsRepo.hasActiveAlert(patientId, 'med_adherence_low')) return null;
    const { taken, total } = await this.alertsRepo.getMedAdherenceData(patientId, 7);
    if (total < 5) return null;
    const rate = (taken / total) * 100;
    if (rate >= 70) return null;
    return this.alertsRepo.createAutoAlert({
      patientId,
      type: 'warning',
      triggerRule: 'med_adherence_low',
      message: `Low medication adherence: ${Math.round(rate)}% over 7 days`,
      details: { adherenceRate: Math.round(rate), taken, total },
    });
  }

  /** Rule 4: No symptom log in 48 hours — INFO */
  private async checkNoLog48h(patientId: string) {
    if (await this.alertsRepo.hasActiveAlert(patientId, 'no_log_48h')) return null;
    const logs = await this.alertsRepo.getRecentSymptomLogs(patientId, 3);
    if (logs.length === 0) {
      // No logs at all — generate alert
      return this.alertsRepo.createAutoAlert({
        patientId,
        type: 'info',
        triggerRule: 'no_log_48h',
        message: 'No symptom logs recorded in over 48 hours',
        details: { hoursSinceLastLog: null },
      });
    }
    const lastLogTime = new Date(logs[0].timestamp).getTime();
    const hoursSince = (Date.now() - lastLogTime) / (1000 * 60 * 60);
    if (hoursSince <= 48) return null;
    return this.alertsRepo.createAutoAlert({
      patientId,
      type: 'info',
      triggerRule: 'no_log_48h',
      message: `No symptom log for ${Math.round(hoursSince)} hours`,
      details: { hoursSinceLastLog: Math.round(hoursSince) },
    });
  }

  /** Rule 5: Mood decline — WARNING when 2+ consecutive low/distressed moods */
  private async checkMoodDecline(patientId: string) {
    if (await this.alertsRepo.hasActiveAlert(patientId, 'mood_decline')) return null;
    const logs = await this.alertsRepo.getRecentSymptomLogs(patientId, 7);
    const withMood = logs.filter((l: any) => l.mood != null).slice(0, 5);
    let consecutiveLow = 0;
    for (const log of withMood) {
      if (log.mood === 'distressed' || log.mood === 'low') {
        consecutiveLow++;
        if (consecutiveLow >= 2) break;
      } else {
        consecutiveLow = 0;
      }
    }
    if (consecutiveLow < 2) return null;
    return this.alertsRepo.createAutoAlert({
      patientId,
      type: 'warning',
      triggerRule: 'mood_decline',
      message: `Mood decline detected: ${consecutiveLow} consecutive low/distressed entries`,
      details: { consecutiveLowMood: consecutiveLow },
    });
  }

  /** Rule 6: High MEDD — WARNING when total daily opioid dose > 120mg morphine equivalent */
  private async checkHighMedd(patientId: string) {
    if (await this.alertsRepo.hasActiveAlert(patientId, 'medd_threshold')) return null;
    const totalMedd = await this.alertsRepo.getTotalMedd(patientId);
    if (totalMedd <= 120) return null;
    return this.alertsRepo.createAutoAlert({
      patientId,
      type: 'warning',
      triggerRule: 'medd_threshold',
      message: `High opioid dose: ${totalMedd}mg MEDD (threshold: 120mg)`,
      details: { totalMedd },
    });
  }

  /** Rule 7: Breakthrough pain — CRITICAL when breakthrough episode in last 24h */
  private async checkBreakthroughPain(patientId: string) {
    if (await this.alertsRepo.hasActiveAlert(patientId, 'breakthrough_pain')) return null;
    const logs = await this.alertsRepo.getRecentSymptomLogs(patientId, 1);
    const btLogs = logs.filter((l: any) => l.log_type === 'breakthrough');
    if (btLogs.length === 0) return null;
    const maxPain = Math.max(...btLogs.map((l: any) => l.pain_intensity || 0));
    return this.alertsRepo.createAutoAlert({
      patientId,
      type: 'critical',
      triggerRule: 'breakthrough_pain',
      message: `Breakthrough pain episode${btLogs.length > 1 ? ` (${btLogs.length} episodes)` : ''}: max ${maxPain}/10`,
      details: { episodes: btLogs.length, maxPain },
    });
  }

  /**
   * Send push notifications for newly created alerts to the patient's
   * primary clinician and assigned clinician (if different).
   */
  private async sendAlertNotifications(patientId: string, alerts: any[]) {
    try {
      // Get clinician IDs who should be notified
      const clinicianIds = await this.alertsRepo.getClinicianIdsForPatient(patientId);
      if (clinicianIds.length === 0) return;

      for (const alert of alerts) {
        const priority = alert.type === 'critical' ? 'high' : 'normal';
        for (const clinicianId of clinicianIds) {
          await this.notificationsService.createAndSend(clinicianId, {
            type: 'clinical_alert',
            title: `${alert.type === 'critical' ? 'CRITICAL' : 'Warning'}: ${alert.trigger_rule}`,
            body: alert.message,
            data: {
              alertId: alert.id,
              patientId,
              alertType: alert.type,
              triggerRule: alert.trigger_rule,
            },
            priority,
          });
        }
      }
    } catch (err) {
      // Don't let notification failure block alert creation
      this.logger.error(`Failed to send alert notifications for patient ${patientId}`, err);
    }
  }

  /** Cron: evaluate time-based rules (no-log-48h) every 15 minutes */
  @Cron('*/15 * * * *')
  async cronEvaluateTimeBasedRules() {
    this.logger.log('Running periodic alert evaluation...');
    try {
      const patientIds = await this.alertsRepo.getActivePatientIds();
      for (const pid of patientIds) {
        await this.checkNoLog48h(pid);
      }
      this.logger.log(`Periodic evaluation complete for ${patientIds.length} patients`);
    } catch (err) {
      this.logger.error('Periodic alert evaluation failed', err);
    }
  }
}
