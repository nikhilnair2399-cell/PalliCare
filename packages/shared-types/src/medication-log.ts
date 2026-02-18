/**
 * PalliCare Medication Log Entry
 *
 * Schema for tracking individual medication administration events.
 *
 * Generated from: schemas/medication_log.schema.json
 */

import type { SyncStatus } from './symptom-log';

// ---------------------------------------------------------------------------
// Enums (as union types)
// ---------------------------------------------------------------------------

/** Current status of this dose */
export type MedicationLogStatus =
  | 'upcoming'
  | 'due'
  | 'taken'
  | 'taken_late'
  | 'missed'
  | 'skipped';

/** Role of the person who administered the medication */
export type AdministeredByRole = 'patient' | 'caregiver' | 'nurse' | 'unknown';

/** Reason for skipping a dose */
export type SkipReason =
  | 'side_effects'
  | 'ran_out'
  | 'forgot'
  | 'felt_better'
  | 'doctor_advised'
  | 'other';

/** Side effect type */
export type SideEffectType =
  | 'nausea'
  | 'vomiting'
  | 'constipation'
  | 'drowsiness'
  | 'dizziness'
  | 'dry_mouth'
  | 'itching'
  | 'confusion'
  | 'headache'
  | 'loss_of_appetite'
  | 'rash'
  | 'difficulty_breathing'
  | 'other';

/** Side effect severity */
export type SideEffectSeverity = 'mild' | 'moderate' | 'severe';

// ---------------------------------------------------------------------------
// Nested interfaces
// ---------------------------------------------------------------------------

/** Context for PRN (as-needed) medications only */
export interface PrnContext {
  /** Pain score before taking PRN medication (0-10) */
  pain_before?: number | null;
  /** Pain score after taking PRN medication (0-10, logged at follow-up) */
  pain_after?: number | null;
  /** How many minutes until pain relief */
  minutes_to_relief?: number | null;
  /** Did the PRN dose provide adequate relief */
  relief_adequate?: boolean | null;
  /** How many times this PRN has been taken today */
  daily_dose_count?: number;
}

/** A reported side effect */
export interface SideEffectReport {
  effect?: SideEffectType;
  severity?: SideEffectSeverity;
  notes?: string | null;
}

// ---------------------------------------------------------------------------
// Root interface
// ---------------------------------------------------------------------------

/**
 * A single medication administration event, tracking when and how
 * a dose was taken (or missed/skipped).
 */
export interface MedicationLog {
  id: string;
  /** Reference to the medication record */
  medication_id: string;
  patient_id: string;
  /** When the medication was supposed to be taken */
  scheduled_time: string;
  /** When the medication was actually taken (null if missed/skipped) */
  actual_time?: string | null;
  /** Current status of this dose */
  status: MedicationLogStatus;
  /** User ID of who administered (patient self or caregiver) */
  administered_by?: string | null;
  administered_by_role?: AdministeredByRole;
  skip_reason?: SkipReason | null;
  /** Caregiver notes (e.g., "Swallowed well", "Nausea after") */
  observation_notes?: string | null;
  /** Context for PRN medications only */
  prn_context?: PrnContext;
  /** Reported side effects */
  side_effects_reported?: SideEffectReport[];
  created_at?: string;
  updated_at?: string;
  sync_status?: SyncStatus;
}
