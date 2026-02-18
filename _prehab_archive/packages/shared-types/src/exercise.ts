/**
 * PalliCare Exercise Plan & Exercise Log
 *
 * Schema for physiotherapist-prescribed exercise plans and patient-reported
 * exercise session logs within the prehabilitation pathway.
 *
 * Generated from: schemas/exercise_plan.schema.json
 */

// ---------------------------------------------------------------------------
// Enums (as union types)
// ---------------------------------------------------------------------------

/** Category of prescribed exercise */
export type ExerciseType =
  | 'walking'
  | 'breathing'
  | 'stretching'
  | 'strengthening'
  | 'balance'
  | 'yoga'
  | 'stair_climbing'
  | 'cycling'
  | 'pelvic_floor'
  | 'inspiratory_muscle'
  | 'other';

/** Difficulty level of the exercise plan */
export type DifficultyLevel = 'very_low' | 'low' | 'moderate' | 'high';

/** Exercise intensity during a session */
export type ExerciseIntensity = 'light' | 'moderate' | 'vigorous';

/** Status of an exercise plan */
export type ExercisePlanStatus = 'active' | 'paused' | 'completed' | 'cancelled';

/** Role of the person who logged the exercise */
export type ExerciseLoggedByRole = 'patient' | 'caregiver' | 'physiotherapist';

/** Reason for skipping a scheduled exercise session */
export type ExerciseSkipReason =
  | 'pain'
  | 'fatigue'
  | 'nausea'
  | 'breathlessness'
  | 'not_feeling_well'
  | 'no_time'
  | 'forgot'
  | 'other';

// ---------------------------------------------------------------------------
// Nested interfaces
// ---------------------------------------------------------------------------

/** A single exercise prescription within an exercise plan */
export interface PrescribedExercise {
  /** Category of exercise */
  type: ExerciseType;
  /** Display name of the exercise */
  name: string;
  /** Hindi translation of the exercise name */
  name_hi?: string | null;
  /** Duration per session in minutes */
  duration_minutes?: number | null;
  /** Recommended sessions per week */
  frequency_per_week?: number | null;
  /** Number of sets per session */
  sets?: number | null;
  /** Number of reps per set */
  reps?: number | null;
  /** Recommended intensity */
  intensity?: ExerciseIntensity | null;
  /** URL to instructional video */
  video_url?: string | null;
  /** Free-text instructions for the patient */
  instructions?: string | null;
}

// ---------------------------------------------------------------------------
// Root interfaces
// ---------------------------------------------------------------------------

/**
 * A physiotherapist-prescribed exercise plan linked to a surgical pathway.
 */
export interface ExercisePlan {
  id: string;
  patient_id: string;
  /** Reference to the surgical pathway */
  pathway_id: string;
  /** Clinician who prescribed the plan */
  prescribed_by: string;
  /** Difficulty tier of the plan */
  difficulty_level: DifficultyLevel;
  /** List of prescribed exercises */
  exercises: PrescribedExercise[];
  /** Plan start date (ISO 8601) */
  start_date: string;
  /** Plan end date (ISO 8601) */
  end_date?: string | null;
  /** Current plan status */
  status: ExercisePlanStatus;
  created_at: string;
  updated_at: string;
}

/**
 * A patient-reported exercise session log entry.
 */
export interface ExerciseLog {
  id: string;
  patient_id: string;
  /** Reference to the exercise plan */
  plan_id: string;
  /** Type of exercise performed */
  exercise_type: ExerciseType;
  /** Who logged this entry */
  logged_by: string;
  /** Role of the person who logged this entry */
  logged_by_role: ExerciseLoggedByRole;
  /** When the exercise was performed (ISO 8601) */
  timestamp: string;
  /** Actual duration of the session in minutes */
  duration_minutes?: number | null;
  /** Perceived intensity during the session */
  intensity?: ExerciseIntensity | null;
  /** Pain score during exercise (0-10) */
  pain_during?: number | null;
  /** Whether the prescribed exercise was completed */
  completed: boolean;
  /** Reason for skipping (if not completed) */
  skip_reason?: ExerciseSkipReason | null;
  /** Free-text notes about the session */
  notes?: string | null;
  /** Client-generated UUID for offline-first sync */
  local_id?: string | null;
  /** Sync status for offline-first architecture */
  sync_status?: 'pending' | 'synced' | 'conflict';
}
