/**
 * PalliCare Symptom Log
 *
 * Schema for a single symptom logging entry. Supports Quick Log (3 fields),
 * Full Log (all fields), and Breakthrough mode.
 *
 * Generated from: schemas/symptom_log.schema.json
 */

// ---------------------------------------------------------------------------
// Enums (as union types)
// ---------------------------------------------------------------------------

/** Type of logging session */
export type LogType = 'quick' | 'full' | 'breakthrough';

/** How the data was obtained */
export type DataConfidence = 'self_reported' | 'observed' | 'estimated' | 'proxy_reported';

/** Body map zone identifier (28 zones: 14 front + 14 back) */
export type BodyZoneId =
  | 'head_front'
  | 'head_back'
  | 'face'
  | 'neck_front'
  | 'neck_back'
  | 'chest_left'
  | 'chest_right'
  | 'upper_back_left'
  | 'upper_back_right'
  | 'abdomen_upper'
  | 'abdomen_lower'
  | 'lower_back_left'
  | 'lower_back_right'
  | 'shoulder_left'
  | 'shoulder_right'
  | 'upper_arm_left'
  | 'upper_arm_right'
  | 'forearm_left'
  | 'forearm_right'
  | 'hand_left'
  | 'hand_right'
  | 'hip_left'
  | 'hip_right'
  | 'thigh_left'
  | 'thigh_right'
  | 'knee_left'
  | 'knee_right'
  | 'lower_leg_left'
  | 'lower_leg_right'
  | 'foot_left'
  | 'foot_right';

/** Descriptors of pain quality */
export type PainQuality =
  | 'aching'
  | 'sharp'
  | 'burning'
  | 'throbbing'
  | 'stabbing'
  | 'shooting'
  | 'tingling'
  | 'cramping'
  | 'dull'
  | 'pressure'
  | 'electric'
  | 'gnawing'
  | 'radiating'
  | 'squeezing'
  | 'other';

/** 5-point emoji mood scale */
export type Mood = 'great' | 'good' | 'okay' | 'low' | 'distressed';

/** Subjective sleep quality last night */
export type SleepQuality = 'well' | 'okay' | 'poorly';

/** Offline sync status */
export type SyncStatus = 'pending' | 'synced' | 'conflict' | 'failed';

// ---------------------------------------------------------------------------
// Nested interfaces
// ---------------------------------------------------------------------------

/** Pain location entry on the body map */
export interface PainLocation {
  /** Body map zone identifier */
  zone_id: BodyZoneId;
  /** Pain intensity at this specific location (0-10) */
  intensity?: number;
  /** Whether this is the primary pain site */
  is_primary?: boolean;
}

/** Aggravating and relieving factors */
export interface Triggers {
  /** What makes pain worse */
  aggravators?: string[];
  /** What helps reduce pain */
  relievers?: string[];
}

/**
 * Edmonton Symptom Assessment System - Revised (ESAS-r) scores.
 * All scores range 0-10.
 */
export interface EsasScores {
  pain?: number;
  tiredness?: number;
  nausea?: number;
  depression?: number;
  anxiety?: number;
  drowsiness?: number;
  appetite?: number;
  wellbeing?: number;
  shortness_of_breath?: number;
}

/** Sleep information */
export interface SleepInfo {
  /** Subjective sleep quality last night */
  quality?: SleepQuality;
  /** Approximate hours of sleep (0-24) */
  hours?: number;
}

/** Notes attached to a symptom log entry */
export interface LogNotes {
  /** Free text notes (max 1000 chars) */
  text?: string;
  /** URL to uploaded voice recording */
  voice_note_url?: string;
  /** Auto-transcribed text from voice note */
  voice_note_transcript?: string;
  /** URLs to uploaded photos (max 3) */
  photo_urls?: string[];
}

/** Breakthrough-specific fields */
export interface BreakthroughInfo {
  /** Did patient take rescue/PRN medication */
  rescue_medication_taken?: boolean;
  /** Reference to the rescue medication taken */
  rescue_medication_id?: string;
  /** When the 30-minute follow-up check is scheduled */
  follow_up_scheduled?: string;
  /** Pain score at follow-up (0-10) */
  follow_up_pain?: number;
}

/**
 * PAINAD assessment for non-communicative patients.
 * Each sub-score ranges 0-2; total ranges 0-10.
 */
export interface PainadAssessment {
  breathing?: number;
  vocalization?: number;
  facial_expression?: number;
  body_language?: number;
  consolability?: number;
  total_score?: number;
}

/** Weather information at the time of logging */
export interface WeatherContext {
  temperature_c?: number;
  humidity_pct?: number;
  condition?: string;
  pressure_hpa?: number;
}

/** Automatically captured context */
export interface LogContext {
  device_id?: string;
  app_version?: string;
  os_version?: string;
  /** City-level only, if permitted */
  location_approx?: string;
  weather?: WeatherContext;
  /** How long the logging took (seconds) */
  time_to_complete_seconds?: number;
}

// ---------------------------------------------------------------------------
// Root interface
// ---------------------------------------------------------------------------

/**
 * A single symptom logging entry. Supports Quick Log (3 fields),
 * Full Log (all fields), and Breakthrough mode.
 */
export interface SymptomLog {
  /** Unique identifier for this log entry */
  id: string;
  /** Reference to the patient who this log belongs to */
  patient_id: string;
  /** User ID of who created this entry (patient, caregiver, or clinician) */
  logged_by?: string;
  /** Type of logging session */
  log_type: LogType;
  /** How the data was obtained */
  data_confidence?: DataConfidence;
  /** Was the patient present when this was logged (relevant for caregiver entries) */
  patient_present?: boolean;
  /** ISO 8601 timestamp of when symptoms were experienced */
  timestamp: string;
  /** ISO 8601 timestamp of when this entry was created (may differ from timestamp) */
  created_at?: string;
  /** Numeric Rating Scale (NRS) pain score 0-10 */
  pain_intensity: number;
  /** Array of affected body zones with per-zone intensity */
  pain_locations?: PainLocation[];
  /** Descriptors of pain quality */
  pain_qualities?: PainQuality[];
  /** Aggravating and relieving factors */
  triggers?: Triggers;
  /** ESAS-r scores */
  esas_scores?: EsasScores;
  /** 5-point emoji mood scale */
  mood?: Mood;
  /** Sleep information */
  sleep?: SleepInfo;
  /** Notes (text, voice, photos) */
  notes?: LogNotes;
  /** Breakthrough-specific fields */
  breakthrough?: BreakthroughInfo;
  /** PAINAD assessment for non-communicative patients */
  painad?: PainadAssessment;
  /** Automatically captured context */
  context?: LogContext;
  /** Offline sync status */
  sync_status?: SyncStatus;
  updated_at?: string;
  /** Soft delete timestamp */
  deleted_at?: string | null;
}
