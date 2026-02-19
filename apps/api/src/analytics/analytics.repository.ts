import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class AnalyticsRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'AnalyticsRepository');
  }

  /** Department-level summary metrics */
  async getDepartmentSummary() {
    const [patients, alerts, logs, meds] = await Promise.all([
      // Patient counts by phase
      this.query(`
        SELECT
          COUNT(*)::int AS total_patients,
          COUNT(*) FILTER (WHERE phase_of_illness = 'stable')::int AS stable,
          COUNT(*) FILTER (WHERE phase_of_illness = 'unstable')::int AS unstable,
          COUNT(*) FILTER (WHERE phase_of_illness = 'deteriorating')::int AS deteriorating,
          COUNT(*) FILTER (WHERE phase_of_illness = 'terminal')::int AS terminal,
          COUNT(*) FILTER (WHERE care_setting = 'inpatient')::int AS inpatient,
          COUNT(*) FILTER (WHERE care_setting = 'outpatient')::int AS outpatient,
          COUNT(*) FILTER (WHERE care_setting = 'home_care')::int AS home_care
        FROM patients
      `),
      // Alert metrics
      this.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'active')::int AS active_alerts,
          COUNT(*) FILTER (WHERE type = 'critical' AND status = 'active')::int AS critical_alerts,
          COUNT(*) FILTER (WHERE status = 'resolved' AND resolved_at > NOW() - INTERVAL '24 hours')::int AS resolved_today,
          AVG(EXTRACT(EPOCH FROM (acknowledged_at - created_at)))::int AS avg_ack_time_seconds
        FROM alerts
        WHERE created_at > NOW() - INTERVAL '30 days'
      `),
      // Symptom log activity
      this.query(`
        SELECT
          COUNT(*)::int AS logs_today,
          COUNT(DISTINCT patient_id)::int AS patients_logging_today
        FROM symptom_logs
        WHERE timestamp::date = CURRENT_DATE
      `),
      // Medication adherence (last 7 days)
      this.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'taken')::int AS taken,
          COUNT(*) FILTER (WHERE status IN ('missed', 'skipped'))::int AS missed,
          COUNT(*)::int AS total
        FROM medication_logs
        WHERE created_at > NOW() - INTERVAL '7 days'
      `),
    ]);

    const medData = meds.rows[0];
    const adherenceRate = medData.total > 0
      ? Math.round((medData.taken / medData.total) * 100)
      : 0;

    return {
      patients: patients.rows[0],
      alerts: alerts.rows[0],
      logging: logs.rows[0],
      medication_adherence: {
        rate_pct: adherenceRate,
        taken: medData.taken,
        missed: medData.missed,
        total: medData.total,
      },
    };
  }

  /** Pain score distribution across all active patients */
  async getPainDistribution() {
    const result = await this.query(`
      WITH latest_pain AS (
        SELECT DISTINCT ON (patient_id)
          patient_id,
          pain_intensity
        FROM symptom_logs
        WHERE pain_intensity IS NOT NULL
        ORDER BY patient_id, timestamp DESC
      )
      SELECT
        CASE
          WHEN pain_intensity = 0 THEN 'none'
          WHEN pain_intensity BETWEEN 1 AND 3 THEN 'mild'
          WHEN pain_intensity BETWEEN 4 AND 6 THEN 'moderate'
          WHEN pain_intensity BETWEEN 7 AND 10 THEN 'severe'
        END AS category,
        COUNT(*)::int AS count
      FROM latest_pain
      GROUP BY category
      ORDER BY
        CASE category
          WHEN 'none' THEN 0
          WHEN 'mild' THEN 1
          WHEN 'moderate' THEN 2
          WHEN 'severe' THEN 3
        END
    `);
    return result.rows;
  }

  /** Overall medication adherence trend (weekly) */
  async getMedicationAdherenceTrend(weeks: number = 8) {
    const result = await this.query(`
      SELECT
        date_trunc('week', created_at)::date::text AS week,
        COUNT(*) FILTER (WHERE status = 'taken')::int AS taken,
        COUNT(*) FILTER (WHERE status IN ('missed', 'skipped'))::int AS missed,
        COUNT(*)::int AS total,
        ROUND(
          COUNT(*) FILTER (WHERE status = 'taken')::numeric /
          NULLIF(COUNT(*)::numeric, 0) * 100
        )::int AS adherence_pct
      FROM medication_logs
      WHERE created_at > NOW() - make_interval(weeks => $1)
      GROUP BY date_trunc('week', created_at)
      ORDER BY date_trunc('week', created_at)
    `, [weeks]);
    return result.rows;
  }

  /** MEDD distribution across patients */
  async getMeddDistribution() {
    const result = await this.query(`
      WITH patient_medd AS (
        SELECT
          patient_id,
          SUM(dose * COALESCE(medd_factor, 1))::numeric(10,1) AS total_medd
        FROM medications
        WHERE status = 'active' AND category = 'opioid'
        GROUP BY patient_id
      )
      SELECT
        CASE
          WHEN total_medd = 0 THEN '0 (no opioids)'
          WHEN total_medd BETWEEN 0.1 AND 30 THEN '1-30 mg'
          WHEN total_medd BETWEEN 30.1 AND 60 THEN '31-60 mg'
          WHEN total_medd BETWEEN 60.1 AND 120 THEN '61-120 mg'
          WHEN total_medd > 120 THEN '>120 mg'
        END AS medd_range,
        COUNT(*)::int AS patient_count
      FROM patient_medd
      GROUP BY medd_range
      ORDER BY MIN(total_medd)
    `);
    return result.rows;
  }

  /** Quality metrics for the dashboard */
  async getQualityMetrics() {
    const result = await this.query(`
      SELECT
        (SELECT AVG(pain_intensity)::numeric(4,1) FROM symptom_logs
         WHERE timestamp > NOW() - INTERVAL '7 days' AND pain_intensity IS NOT NULL
        ) AS avg_pain_7d,
        (SELECT COUNT(DISTINCT patient_id)::int FROM symptom_logs
         WHERE timestamp > NOW() - INTERVAL '24 hours'
        ) AS patients_logged_24h,
        (SELECT COUNT(*)::int FROM patients) AS total_patients,
        (SELECT COUNT(*)::int FROM alerts
         WHERE status = 'active' AND type = 'critical'
        ) AS critical_alerts
    `);
    return result.rows[0];
  }
}
