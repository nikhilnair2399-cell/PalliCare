/**
 * PalliCare Medication
 *
 * Schema for a medication entry in a patient's regimen, including scheduling,
 * MEDD calculation, and administration tracking.
 *
 * Generated from: schemas/medication.schema.json
 */

// ---------------------------------------------------------------------------
// Enums (as union types)
// ---------------------------------------------------------------------------

/** Unit of measurement for dose */
export type DoseUnit =
  | 'mg'
  | 'mcg'
  | 'g'
  | 'ml'
  | 'drops'
  | 'puffs'
  | 'units'
  | 'tablets'
  | 'capsules'
  | 'patches';

/** Medication administration frequency */
export type MedicationFrequency =
  | 'once_daily'
  | 'twice_daily'
  | 'three_times_daily'
  | 'four_times_daily'
  | 'every_4_hours'
  | 'every_6_hours'
  | 'every_8_hours'
  | 'every_12_hours'
  | 'once_weekly'
  | 'twice_weekly'
  | 'as_needed'
  | 'other';

/** Route of administration */
export type MedicationRoute =
  | 'oral'
  | 'sublingual'
  | 'buccal'
  | 'topical'
  | 'transdermal'
  | 'subcutaneous'
  | 'intramuscular'
  | 'intravenous'
  | 'rectal'
  | 'inhalation'
  | 'nasal'
  | 'ophthalmic'
  | 'other';

/** WHO analgesic ladder and palliative care medication categories */
export type MedicationCategory =
  | 'opioid'
  | 'non_opioid_analgesic'
  | 'adjuvant'
  | 'antiemetic'
  | 'laxative'
  | 'anxiolytic'
  | 'antidepressant'
  | 'steroid'
  | 'other';

/** Medication lifecycle status */
export type MedicationStatus = 'active' | 'paused' | 'discontinued' | 'completed';

/** Time block category for grouped display */
export type TimeBlock = 'morning' | 'afternoon' | 'evening' | 'night';

/** How the medication record was created */
export type MedicationSource =
  | 'manual_entry'
  | 'abha_import'
  | 'clinician_prescribed'
  | 'pharmacy_sync';

// ---------------------------------------------------------------------------
// Nested interfaces
// ---------------------------------------------------------------------------

/** A single scheduled administration time */
export interface MedicationScheduleEntry {
  /** Scheduled time in HH:MM format */
  time: string;
  /** Time block category for grouped display */
  time_block?: TimeBlock;
  with_food?: boolean;
  /** e.g., "Crush and mix with water", "Take 30 min before food" */
  special_instructions?: string | null;
}

/** Morphine Equivalent Daily Dose calculation data */
export interface MeddInfo {
  /** Conversion factor to oral morphine equivalent */
  conversion_factor?: number | null;
  /** This medication's contribution to daily MEDD in mg */
  daily_medd_mg?: number | null;
}

// ---------------------------------------------------------------------------
// Root interface
// ---------------------------------------------------------------------------

/**
 * A medication entry in a patient's regimen, including scheduling,
 * MEDD calculation, and administration tracking.
 */
export interface Medication {
  id: string;
  patient_id: string;
  /** Brand or generic medication name */
  name: string;
  /** INN/generic name */
  generic_name?: string | null;
  /** Hindi transliteration of the medication name */
  name_hindi?: string | null;
  /** Numeric dose value */
  dose: number;
  /** Unit of measurement for dose */
  dose_unit: DoseUnit;
  frequency: MedicationFrequency;
  route: MedicationRoute;
  /** WHO analgesic ladder and palliative care medication categories */
  category: MedicationCategory;
  /** Pro re nata (as-needed) medication */
  is_prn?: boolean;
  /** When to take PRN medication (e.g., "For breakthrough pain") */
  prn_indication?: string | null;
  /** Maximum number of PRN doses allowed per day */
  prn_max_daily_doses?: number | null;
  /** Scheduled administration times */
  schedule?: MedicationScheduleEntry[];
  /** General instructions for the patient/caregiver */
  instructions?: string | null;
  instructions_hindi?: string | null;
  /** Why this medication is prescribed, in patient-friendly language */
  purpose_plain_language?: string | null;
  purpose_plain_language_hindi?: string | null;
  /** Common expected side effects to watch for */
  side_effects_common?: string[];
  /** Morphine Equivalent Daily Dose calculation data */
  medd?: MeddInfo;
  /** WHO analgesic ladder step (1=non-opioid, 2=weak opioid, 3=strong opioid) */
  who_ladder_step?: number | null;
  /** Clinician who prescribed this medication */
  prescribed_by?: string | null;
  start_date?: string;
  /** null = ongoing medication */
  end_date?: string | null;
  status: MedicationStatus;
  /** Why medication was stopped */
  discontinuation_reason?: string | null;
  /** Days before running out to remind about refill */
  refill_reminder_days?: number | null;
  /** How the medication record was created */
  source?: MedicationSource;
  /** National List of Essential Medicines reference code */
  nlem_code?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
