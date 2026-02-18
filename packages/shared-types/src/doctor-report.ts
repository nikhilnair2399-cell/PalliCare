/**
 * PalliCare Doctor Report
 *
 * Schema for the one-page doctor visit report generated from patient data.
 * Designed to be consumed in under 60 seconds during a clinical encounter.
 *
 * Generated from: schemas/doctor_report.schema.json
 */

import type { Mood, SleepQuality } from './symptom-log';

// ---------------------------------------------------------------------------
// Enums (as union types)
// ---------------------------------------------------------------------------

/** Pain trend direction based on regression analysis */
export type PainTrend = 'improving' | 'stable' | 'worsening';

/** Medication change type during the reporting period */
export type MedicationChangeType =
  | 'started'
  | 'stopped'
  | 'dose_increased'
  | 'dose_decreased'
  | 'frequency_changed';

/** Algorithmically detected pattern type */
export type PatternType =
  | 'time_of_day_pattern'
  | 'day_of_week_pattern'
  | 'medication_correlation'
  | 'trigger_correlation'
  | 'sleep_pain_correlation'
  | 'mood_pain_correlation'
  | 'breakthrough_pattern'
  | 'flare_episode';

/** Confidence level of a detected pattern */
export type PatternConfidence = 'low' | 'moderate' | 'high';

/** Report output format */
export type ReportFormat = 'json' | 'pdf' | 'fhir_bundle';

/** Report sharing method */
export type ShareMethod = 'in_app' | 'whatsapp' | 'email' | 'print';

// ---------------------------------------------------------------------------
// Nested interfaces
// ---------------------------------------------------------------------------

/** Reporting period date range */
export interface ReportPeriod {
  start_date: string;
  end_date: string;
  days_covered?: number;
  days_with_data?: number;
}

/** Pain summary statistics for the reporting period */
export interface PainSummary {
  /** Average pain score (0-10) */
  average?: number;
  /** Minimum pain score (0-10) */
  minimum?: number;
  /** Maximum pain score (0-10) */
  maximum?: number;
  median?: number;
  /** Trend direction based on regression analysis */
  trend?: PainTrend;
  /** Percentage change from previous period */
  trend_change_pct?: number;
  previous_period_average?: number | null;
  total_entries?: number;
  breakthrough_count?: number;
  /** Days pain exceeded patient's target score */
  days_above_target?: number;
  /** Patient's stated acceptable pain level */
  pain_target?: number | null;
}

/** Medication adherence statistics */
export interface MedicationAdherenceSummary {
  /** Overall adherence percentage (0-100) */
  overall_pct?: number;
  scheduled_doses?: number;
  taken_doses?: number;
  missed_doses?: number;
  skipped_doses?: number;
  prn_doses_taken?: number;
  prn_avg_daily?: number;
}

/** MEDD calculation breakdown per medication */
export interface MeddBreakdownItem {
  medication_name?: string;
  dose?: string;
  frequency?: string;
  medd_contribution_mg?: number;
}

/** MEDD summary for the reporting period */
export interface MeddSummary {
  current_daily_mg?: number;
  previous_period_mg?: number | null;
  change_pct?: number | null;
  calculation_breakdown?: MeddBreakdownItem[];
}

/** Average ESAS-r scores for the period */
export interface EsasSummary {
  pain?: number | null;
  tiredness?: number | null;
  nausea?: number | null;
  depression?: number | null;
  anxiety?: number | null;
  drowsiness?: number | null;
  appetite?: number | null;
  wellbeing?: number | null;
  shortness_of_breath?: number | null;
  worst_symptom?: string | null;
  worst_symptom_avg?: number | null;
}

/** Mood distribution counts */
export interface MoodDistribution {
  great?: number;
  good?: number;
  okay?: number;
  low?: number;
  distressed?: number;
}

/** Mood summary for the reporting period */
export interface MoodSummary {
  distribution?: MoodDistribution;
  distressed_days?: number;
}

/** Sleep quality distribution counts */
export interface SleepQualityDistribution {
  well?: number;
  okay?: number;
  poorly?: number;
}

/** Sleep summary for the reporting period */
export interface SleepSummary {
  average_hours?: number;
  nights_poor_sleep?: number;
  quality_distribution?: SleepQualityDistribution;
}

/** Key metrics summary for the reporting period */
export interface ReportSummary {
  pain?: PainSummary;
  medication_adherence?: MedicationAdherenceSummary;
  medd?: MeddSummary;
  /** Average ESAS-r scores for the period */
  esas?: EsasSummary;
  mood?: MoodSummary;
  sleep?: SleepSummary;
}

/** Data point for rendering the pain trend chart */
export interface PainChartDataPoint {
  date?: string;
  avg_pain?: number;
  max_pain?: number;
  min_pain?: number;
  entries_count?: number;
}

/** A medication change during the reporting period */
export interface MedicationChange {
  date?: string;
  medication_name?: string;
  change_type?: MedicationChangeType;
  details?: string;
}

/** An algorithmically detected pattern for clinician review */
export interface NotablePattern {
  pattern_type?: PatternType;
  description?: string;
  confidence?: PatternConfidence;
}

/** A flare episode detected during the reporting period */
export interface FlareEpisode {
  start_date?: string;
  end_date?: string;
  peak_severity?: number;
  duration_days?: number;
  patient_reported_trigger?: string | null;
}

/** Report share record */
export interface ReportShareRecord {
  clinician_id?: string;
  shared_at?: string;
  method?: ShareMethod;
}

// ---------------------------------------------------------------------------
// Root interface
// ---------------------------------------------------------------------------

/**
 * One-page doctor visit report generated from patient data.
 * Designed to be consumed in under 60 seconds during a clinical encounter.
 */
export interface DoctorReport {
  id: string;
  patient_id: string;
  /** User who generated the report */
  generated_by?: string;
  generated_at: string;
  report_period: ReportPeriod;
  /** Key metrics summary for the reporting period */
  summary?: ReportSummary;
  /** Data points for rendering the pain trend chart */
  pain_chart_data?: PainChartDataPoint[];
  /** Medication changes during the reporting period */
  medication_changes?: MedicationChange[];
  /** Algorithmically detected patterns for clinician review */
  notable_patterns?: NotablePattern[];
  flare_episodes?: FlareEpisode[];
  /** Pre-visit questions logged by patient/caregiver */
  patient_questions?: string[];
  /** Summary of caregiver-reported observations */
  caregiver_observations?: string | null;
  format?: ReportFormat;
  /** URL to the generated PDF report */
  pdf_url?: string | null;
  shared_with?: ReportShareRecord[];
}
