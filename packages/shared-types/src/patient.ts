/**
 * PalliCare Patient
 *
 * Complete patient profile schema including demographics, medical info,
 * preferences, and care team links.
 *
 * Generated from: schemas/patient.schema.json
 */

// ---------------------------------------------------------------------------
// Enums (as union types)
// ---------------------------------------------------------------------------

/** Patient gender options */
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

/** Supported language preferences */
export type LanguagePreference = 'en' | 'hi' | 'both';

/** ECOG/Karnofsky-equivalent functional status */
export type FunctionalStatus =
  | 'fully_ambulatory'
  | 'limited_activity'
  | 'bed_bound_less_50'
  | 'bed_bound_more_50'
  | 'completely_bed_bound';

/** Broad prognostic category (clinician-set, not shown to patient) */
export type PrognosisCategory = 'months_to_years' | 'weeks_to_months' | 'days_to_weeks';

/** Allergy severity levels */
export type AllergySeverity = 'mild' | 'moderate' | 'severe';

/** Care team member role */
export type CareTeamRole =
  | 'palliative_physician'
  | 'oncologist'
  | 'nurse'
  | 'psychologist'
  | 'social_worker'
  | 'physiotherapist'
  | 'chaplain';

/** Relationship between caregiver and patient */
export type CaregiverRelationship =
  | 'spouse'
  | 'child'
  | 'parent'
  | 'sibling'
  | 'relative'
  | 'friend'
  | 'professional_caregiver'
  | 'other';

/** Caregiver link status */
export type CaregiverStatus = 'invited' | 'active' | 'removed';

/** How the app was set up during onboarding */
export type SetupMode = 'patient_self' | 'caregiver_helping' | 'together';

/** Initial emotional check-in response from onboarding */
export type EmotionalCheckinResponse = 'doing_okay' | 'managing' | 'tough_day';

/** Default symptom-log mode preference */
export type DefaultLogMode = 'quick' | 'full';

/** Dark mode preference */
export type DarkMode = 'off' | 'on' | 'auto';

/** Spiritual tradition */
export type SpiritualTradition =
  | 'hindu'
  | 'muslim'
  | 'christian'
  | 'sikh'
  | 'buddhist'
  | 'secular'
  | 'other';

// ---------------------------------------------------------------------------
// Nested interfaces
// ---------------------------------------------------------------------------

/** Patient name fields */
export interface PatientName {
  first: string;
  last: string;
  /** How the patient wants to be addressed */
  display?: string;
}

/** Allergy record */
export interface Allergy {
  allergen?: string;
  reaction?: string;
  severity?: AllergySeverity;
}

/** Medical information for the patient */
export interface PatientMedical {
  /** Primary palliative care diagnosis */
  primary_diagnosis?: string;
  /** ICD-10 code */
  diagnosis_icd10?: string | null;
  diagnosis_date?: string | null;
  secondary_diagnoses?: string[];
  allergies?: Allergy[];
  comorbidities?: string[];
  /** ECOG/Karnofsky equivalent */
  functional_status?: FunctionalStatus;
  /** Broad prognostic category (clinician-set, not shown to patient) */
  prognosis_category?: PrognosisCategory;
}

/** Care team member reference */
export interface CareTeamMember {
  clinician_id?: string;
  role?: CareTeamRole;
}

/** Care team configuration */
export interface CareTeam {
  primary_clinician_id?: string;
  institution?: string;
  department?: string;
  team_members?: CareTeamMember[];
}

/** Caregiver permission set */
export interface CaregiverPermissions {
  view_pain_logs?: boolean;
  log_symptoms?: boolean;
  view_medications?: boolean;
  administer_medications?: boolean;
  view_reports?: boolean;
  view_legacy_messages?: boolean;
  communicate_with_team?: boolean;
  receive_alerts?: boolean;
  delete_data?: boolean;
  modify_privacy?: boolean;
}

/** Linked caregiver record */
export interface Caregiver {
  caregiver_user_id: string;
  relationship: CaregiverRelationship;
  status: CaregiverStatus;
  name?: string;
  phone?: string;
  permissions?: CaregiverPermissions;
  linked_at?: string;
}

/** Onboarding state */
export interface Onboarding {
  completed?: boolean;
  completed_at?: string | null;
  /** How the app was set up (from onboarding screen 2C) */
  setup_mode?: SetupMode;
  /** Initial emotional check-in from onboarding */
  emotional_checkin_response?: EmotionalCheckinResponse | null;
  /** What patient said helps them cope (from onboarding) */
  what_helps?: string[];
}

/** Quiet hours configuration */
export interface QuietHours {
  enabled?: boolean;
  /** HH:MM format (default "22:00") */
  start?: string;
  /** HH:MM format (default "07:00") */
  end?: string;
}

/** Per-category notification preferences */
export interface NotificationPreferences {
  medication_reminders?: boolean;
  logging_prompts?: boolean;
  education_content?: boolean;
  milestone_celebrations?: boolean;
  goal_reminders?: boolean;
  wellness_tips?: boolean;
}

/** Patient app preferences */
export interface PatientPreferences {
  default_log_mode?: DefaultLogMode;
  dark_mode?: DarkMode;
  /** Font scale factor (1.0 - 2.0) */
  font_scale?: number;
  high_contrast?: boolean;
  reduce_motion?: boolean;
  haptic_feedback?: boolean;
  voice_input_enabled?: boolean;
  quiet_hours?: QuietHours;
  notifications?: NotificationPreferences;
}

/** Education module tracking */
export interface EducationProgress {
  /** Education phase (1-3) */
  current_phase?: number;
  modules_completed?: number;
  spiritual_care_opted_in?: boolean;
  spiritual_tradition?: SpiritualTradition | null;
}

/** Journey / engagement statistics */
export interface JourneyStats {
  total_logs?: number;
  total_breathe_sessions?: number;
  total_gratitude_entries?: number;
  goals_completed?: number;
  legacy_opted_in?: boolean;
  days_active?: number;
  current_streak?: number;
}

/** Privacy and consent settings */
export interface PrivacySettings {
  data_sharing_consent?: boolean;
  research_consent?: boolean;
  anonymized_analytics?: boolean;
  clinician_data_access?: boolean;
  /** Data retention period in years */
  data_retention_years?: number;
}

// ---------------------------------------------------------------------------
// Root interface
// ---------------------------------------------------------------------------

/**
 * Complete patient profile including demographics, medical info,
 * preferences, and care team links.
 */
export interface Patient {
  id: string;
  /** Reference to the auth/user record */
  user_id: string;
  name: PatientName;
  /** Indian mobile number with country code (+91XXXXXXXXXX) */
  phone: string;
  email?: string | null;
  date_of_birth?: string | null;
  /** Patient age (0-150) */
  age?: number | null;
  gender?: Gender;
  language_preference?: LanguagePreference;
  /** 14-digit Ayushman Bharat Health Account number */
  abha_id?: string | null;
  abha_linked?: boolean;
  avatar_url?: string | null;
  medical?: PatientMedical;
  care_team?: CareTeam;
  /** Linked caregivers (max 5) */
  caregivers?: Caregiver[];
  onboarding?: Onboarding;
  preferences?: PatientPreferences;
  education?: EducationProgress;
  journey?: JourneyStats;
  privacy?: PrivacySettings;
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
}
