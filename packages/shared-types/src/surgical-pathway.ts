/**
 * PalliCare Surgical Pathway
 *
 * Schema for a surgical pathway representing a planned or completed
 * palliative surgical procedure along with its prehabilitation lifecycle.
 *
 * Generated from: schemas/surgical_pathway.schema.json
 */

// ---------------------------------------------------------------------------
// Enums (as union types)
// ---------------------------------------------------------------------------

/** Type of surgical procedure in a palliative context */
export type ProcedureType =
  | 'debulking'
  | 'stenting'
  | 'fracture_fixation'
  | 'bowel_obstruction'
  | 'tracheostomy'
  | 'gastrostomy'
  | 'nephrostomy'
  | 'pleurodesis'
  | 'nerve_block'
  | 'biopsy'
  | 'wound_debridement'
  | 'other';

/** Clinical intent of the surgery */
export type SurgicalIntent = 'palliative' | 'curative' | 'diagnostic' | 'emergency';

/** Anaesthetic technique used or planned */
export type AnaestheticTechnique =
  | 'general'
  | 'spinal'
  | 'epidural'
  | 'regional_block'
  | 'local'
  | 'sedation'
  | 'combined';

/** Post-operative patient disposition */
export type PostOpDisposition = 'icu' | 'hdu' | 'ward' | 'day_care' | 'home';

/** Lifecycle status of the surgical pathway */
export type SurgicalPathwayStatus =
  | 'planned'
  | 'prehab_active'
  | 'pre_op'
  | 'intra_op'
  | 'post_op'
  | 'discharged'
  | 'cancelled';

// ---------------------------------------------------------------------------
// Root interface
// ---------------------------------------------------------------------------

/**
 * A surgical pathway representing a planned or completed palliative
 * surgical procedure along with its prehabilitation lifecycle.
 */
export interface SurgicalPathway {
  id: string;
  patient_id: string;
  /** Name of the planned surgical procedure */
  procedure_name: string;
  /** Hindi translation of the procedure name */
  procedure_name_hi?: string | null;
  /** Category of surgical procedure */
  procedure_type: ProcedureType;
  /** Clinical intent of the surgery */
  surgical_intent: SurgicalIntent;
  /** Operating surgeon identifier */
  surgeon_id?: string | null;
  /** Anaesthesiologist identifier */
  anaesthesiologist_id?: string | null;
  /** Planned surgery date and time (ISO 8601) */
  surgery_date?: string | null;
  /** Facility where the surgery will take place */
  surgery_facility?: string;
  /** ASA physical status score (1-5) */
  asa_score?: number | null;
  /** Estimated prehabilitation days before surgery */
  estimated_prehab_days?: number | null;
  /** Actual prehabilitation days completed */
  actual_prehab_days?: number | null;
  /** Nil per os (fasting) start time (ISO 8601) */
  npo_start_time?: string | null;
  /** Anaesthetic technique used or planned */
  anaesthetic_technique?: AnaestheticTechnique | null;
  /** Where the patient goes after surgery */
  post_op_disposition?: PostOpDisposition | null;
  /** Post-operative pain management plan summary */
  post_op_pain_plan?: string | null;
  /** Current lifecycle status of the pathway */
  status: SurgicalPathwayStatus;
  /** Reason for cancellation (if cancelled) */
  cancellation_reason?: string | null;
  /** Clinician notes on surgical outcomes */
  outcome_notes?: string | null;
  created_at: string;
  updated_at: string;
}
