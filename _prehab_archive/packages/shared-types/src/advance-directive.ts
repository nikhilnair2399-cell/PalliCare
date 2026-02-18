/**
 * PalliCare Advance Directive
 *
 * Schema for advance directive documents capturing patient wishes for
 * future medical care, surrogate decision makers, and treatment preferences.
 * Aligned with India Supreme Court 2018 ruling on advance directives.
 *
 * Generated from: schemas/advance_directive.schema.json
 */

// ---------------------------------------------------------------------------
// Enums (as union types)
// ---------------------------------------------------------------------------

/** Patient's treatment choice for a specific intervention */
export type TreatmentChoice = 'want' | 'do_not_want' | 'undecided' | 'discuss_with_doctor';

/** Status of the advance directive document */
export type DirectiveStatus = 'draft' | 'active' | 'revoked' | 'superseded';

/** Relationship of the surrogate decision maker to the patient */
export type SurrogateRelationship =
  | 'spouse'
  | 'child'
  | 'parent'
  | 'sibling'
  | 'relative'
  | 'friend'
  | 'legal_guardian'
  | 'other';

/** Preferred location for end-of-life care */
export type PreferredCareLocation = 'home' | 'hospital' | 'hospice' | 'no_preference';

// ---------------------------------------------------------------------------
// Nested interfaces
// ---------------------------------------------------------------------------

/** A person designated to make medical decisions if the patient is unable */
export interface SurrogateDecisionMaker {
  /** Full name of the surrogate */
  name: string;
  /** Relationship to the patient */
  relationship: SurrogateRelationship;
  /** Contact phone number */
  phone: string;
  /** Contact email address */
  email?: string | null;
  /** Whether this is the primary surrogate decision maker */
  is_primary?: boolean;
  /** Whether the surrogate has been informed of their role */
  informed?: boolean;
  /** Date on which the surrogate was informed (ISO 8601) */
  informed_date?: string | null;
}

/** Patient preferences for specific life-sustaining treatments */
export interface TreatmentPreferences {
  /** Cardiopulmonary resuscitation */
  cpr?: TreatmentChoice | null;
  /** Mechanical ventilation / intubation */
  mechanical_ventilation?: TreatmentChoice | null;
  /** Artificial nutrition (tube feeding) */
  artificial_nutrition?: TreatmentChoice | null;
  /** Intravenous hydration */
  iv_hydration?: TreatmentChoice | null;
  /** Dialysis */
  dialysis?: TreatmentChoice | null;
  /** Blood transfusions */
  blood_transfusion?: TreatmentChoice | null;
  /** Antibiotic therapy for infections */
  antibiotics?: TreatmentChoice | null;
  /** ICU admission */
  icu_admission?: TreatmentChoice | null;
  /** Surgical interventions */
  surgical_intervention?: TreatmentChoice | null;
  /** Chemotherapy / radiation therapy */
  chemotherapy?: TreatmentChoice | null;
  /** Comfort-focused / palliative sedation */
  palliative_sedation?: TreatmentChoice | null;
  /** Organ / tissue donation */
  organ_donation?: TreatmentChoice | null;
}

// ---------------------------------------------------------------------------
// Root interface
// ---------------------------------------------------------------------------

/**
 * An advance directive document capturing the patient's wishes for future
 * medical care, surrogate decision makers, and treatment preferences.
 */
export interface AdvanceDirective {
  id: string;
  patient_id: string;
  /** Document status */
  status: DirectiveStatus;
  /** Date the directive was created or signed (ISO 8601) */
  directive_date: string;
  /** Date the directive was last reviewed with the patient (ISO 8601) */
  last_reviewed_date?: string | null;
  /** Clinician who witnessed or facilitated the directive */
  witnessed_by?: string | null;
  /** Designated surrogate decision makers */
  surrogate_decision_makers?: SurrogateDecisionMaker[] | null;
  /** Patient's treatment preferences */
  treatment_preferences?: TreatmentPreferences | null;
  /** Preferred location for end-of-life care */
  preferred_care_location?: PreferredCareLocation | null;
  /** Patient's personal values statement (free-text) */
  values_statement?: string | null;
  /** Spiritual or religious considerations */
  spiritual_considerations?: string | null;
  /** Additional wishes or instructions (free-text) */
  additional_wishes?: string | null;
  /** URL to scanned copy of the signed document */
  document_url?: string | null;
  created_at: string;
  updated_at: string;
}
