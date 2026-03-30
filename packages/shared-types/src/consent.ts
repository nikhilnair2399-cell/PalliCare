/**
 * PalliCare Consent System Types
 *
 * DPDPA 2023 (Digital Personal Data Protection Act, India) compliant
 * consent management types shared between API and mobile clients.
 */

// ---------------------------------------------------------------------------
// Consent type categories
// ---------------------------------------------------------------------------

/** All possible consent categories in the platform */
export type ConsentType =
  | 'data_collection'
  | 'clinician_access'
  | 'caregiver_access'
  | 'research_participation'
  | 'anonymized_analytics'
  | 'push_notifications'
  | 'sms_notifications'
  | 'whatsapp_notifications'
  | 'email_communications'
  | 'data_sharing_abdm'
  | 'voice_recording'
  | 'photo_upload'
  | 'location_data'
  | 'legacy_messages'
  | 'third_party_integrations';

/** How the consent was captured */
export type ConsentMethod = 'in_app' | 'paper' | 'verbal_witnessed';

// ---------------------------------------------------------------------------
// Consent record (persisted in DB)
// ---------------------------------------------------------------------------

/** A single consent record as stored in the consent_records table */
export interface ConsentRecord {
  id: string;
  user_id: string;
  consent_type: ConsentType;
  granted: boolean;
  version: string;
  granted_at: string | null;
  revoked_at: string | null;
  ip_address: string | null;
  method: ConsentMethod;
  purpose: string | null;
  description_en: string | null;
  description_hi: string | null;
  consent_document_version: string | null;
  witness_name: string | null;
  witness_role: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Consent request (API input)
// ---------------------------------------------------------------------------

/** Payload for granting a new consent */
export interface ConsentRequest {
  consent_type: ConsentType;
  /** Consent policy version being agreed to (e.g. "1.0", "2.1") */
  version: string;
  method?: ConsentMethod;
  /** Human-readable purpose shown to the user */
  purpose?: string;
  /** Witness name (required when method is 'verbal_witnessed' or 'paper') */
  witness_name?: string;
  /** Witness role (e.g. 'nurse', 'social_worker') */
  witness_role?: string;
}

// ---------------------------------------------------------------------------
// Consent status (aggregated view)
// ---------------------------------------------------------------------------

/** Status of a single consent type for a user */
export interface ConsentTypeStatus {
  granted: boolean;
  version: string;
  granted_at: string | null;
  method: ConsentMethod;
}

/** Map of all consent types to their current status for a user */
export type ConsentStatus = Partial<Record<ConsentType, ConsentTypeStatus>>;

// ---------------------------------------------------------------------------
// Consent summary (API response)
// ---------------------------------------------------------------------------

/** Summary returned by the consent status endpoint */
export interface ConsentSummary {
  user_id: string;
  consents: ConsentStatus;
  /** Whether all mandatory consents are granted */
  all_mandatory_granted: boolean;
  /** List of mandatory consent types that are still missing */
  missing_mandatory: ConsentType[];
  last_updated: string;
}
