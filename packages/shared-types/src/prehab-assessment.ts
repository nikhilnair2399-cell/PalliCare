/**
 * PalliCare Prehabilitation Assessment
 *
 * Schema for prehabilitation assessments measuring patient surgical
 * readiness across functional, nutritional, psychological, and medical
 * domains.
 *
 * Generated from: schemas/prehab_assessment.schema.json
 */

// ---------------------------------------------------------------------------
// Enums (as union types)
// ---------------------------------------------------------------------------

/** Type of prehabilitation assessment */
export type AssessmentType =
  | 'baseline'
  | 'weekly'
  | 'pre_op_final'
  | 'post_op'
  | 'functional_capacity'
  | 'nutritional'
  | 'psychological'
  | 'medical_clearance';

/** Overall readiness verdict from the assessment */
export type ReadinessVerdict = 'ready' | 'conditionally_ready' | 'not_ready' | 'deferred';

// ---------------------------------------------------------------------------
// Nested interfaces
// ---------------------------------------------------------------------------

/** Functional capacity assessment scores */
export interface FunctionalScores {
  /** Six-minute walk test distance in metres */
  six_min_walk_metres?: number | null;
  /** Timed Up and Go test in seconds */
  tug_seconds?: number | null;
  /** Hand grip strength in kg */
  grip_strength_kg?: number | null;
  /** Sit-to-stand repetitions in 30 seconds */
  sit_to_stand_reps?: number | null;
  /** ECOG performance status (0-4) */
  ecog_score?: number | null;
  /** Karnofsky Performance Scale (0-100) */
  karnofsky_score?: number | null;
}

/** Nutritional assessment scores */
export interface NutritionalScores {
  /** Body weight in kg */
  weight_kg?: number | null;
  /** Body Mass Index */
  bmi?: number | null;
  /** Serum albumin in g/dL */
  albumin_g_dl?: number | null;
  /** Serum pre-albumin in mg/dL */
  prealbumin_mg_dl?: number | null;
  /** Subjective Global Assessment rating (A/B/C) */
  sga_rating?: string | null;
  /** Patient-Generated SGA score */
  pg_sga_score?: number | null;
  /** Mid-upper arm circumference in cm */
  muac_cm?: number | null;
  /** Percentage of unintentional weight loss */
  weight_loss_percent?: number | null;
}

/** Psychological assessment scores */
export interface PsychologicalScores {
  /** Hospital Anxiety and Depression Scale - Anxiety (0-21) */
  hads_anxiety?: number | null;
  /** Hospital Anxiety and Depression Scale - Depression (0-21) */
  hads_depression?: number | null;
  /** Distress Thermometer (0-10) */
  distress_thermometer?: number | null;
  /** Patient Health Questionnaire-9 score (0-27) */
  phq9_score?: number | null;
  /** Generalized Anxiety Disorder-7 score (0-21) */
  gad7_score?: number | null;
  /** Patient understanding of surgical procedure */
  patient_understanding?: string | null;
  /** Whether patient has expressed fears about surgery */
  surgical_anxiety_noted?: boolean | null;
}

/** Medical clearance assessment scores */
export interface MedicalScores {
  /** Haemoglobin in g/dL */
  haemoglobin_g_dl?: number | null;
  /** Platelet count (x10^3/uL) */
  platelet_count?: number | null;
  /** International Normalized Ratio */
  inr?: number | null;
  /** Serum creatinine in mg/dL */
  creatinine_mg_dl?: number | null;
  /** Blood glucose (fasting) in mg/dL */
  fasting_glucose_mg_dl?: number | null;
  /** Whether ECG is within acceptable limits */
  ecg_acceptable?: boolean | null;
  /** Whether chest X-ray is within acceptable limits */
  cxr_acceptable?: boolean | null;
  /** ASA physical status score (1-5) */
  asa_score?: number | null;
  /** Cardiopulmonary clearance received */
  cardiopulmonary_clearance?: boolean | null;
  /** Active infections present */
  active_infections?: string[];
}

// ---------------------------------------------------------------------------
// Root interface
// ---------------------------------------------------------------------------

/**
 * A prehabilitation assessment measuring a patient's surgical readiness
 * across functional, nutritional, psychological, and medical domains.
 */
export interface PrehabAssessment {
  id: string;
  patient_id: string;
  /** Reference to the surgical pathway */
  pathway_id: string;
  /** Type of assessment performed */
  assessment_type: AssessmentType;
  /** Clinician or team member who performed the assessment */
  assessed_by: string;
  /** Date the assessment was performed (ISO 8601) */
  assessment_date: string;
  /** Domain-specific assessment scores (flexible key-value) */
  scores?: Record<string, unknown> | null;
  /** Functional capacity sub-scores */
  functional_scores?: FunctionalScores | null;
  /** Nutritional sub-scores */
  nutritional_scores?: NutritionalScores | null;
  /** Psychological sub-scores */
  psychological_scores?: PsychologicalScores | null;
  /** Medical clearance sub-scores */
  medical_scores?: MedicalScores | null;
  /** Overall readiness score (0-100) */
  readiness_score?: number | null;
  /** Overall readiness verdict */
  readiness_verdict?: ReadinessVerdict | null;
  /** Free-text clinical notes */
  notes?: string | null;
  created_at: string;
}
