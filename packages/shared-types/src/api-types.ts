/**
 * PalliCare API Request / Response Types
 *
 * Interfaces for the REST API serving the clinician web dashboard (React).
 * Derived from the OpenAPI 3.1 specification (openapi.yaml).
 */

import type { Patient } from './patient';
import type { SymptomLog, LogType, Mood, EsasScores, DataConfidence } from './symptom-log';
import type { Medication, MedicationStatus } from './medication';
import type { MedicationLog, MedicationLogStatus } from './medication-log';
import type { Notification, NotificationType } from './notification';
import type { ClinicalAlert, AlertSeverity, AlertStatus } from './clinical-alert';
import type { DoctorReport, ReportFormat } from './doctor-report';

// ═══════════════════════════════════════════════════════════════════════════
// Common / Shared
// ═══════════════════════════════════════════════════════════════════════════

/** Standard API error response */
export interface ApiError {
  error: string;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/** Pagination metadata returned with list endpoints */
export interface Pagination {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/** Generic paginated wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/** User role within the PalliCare system */
export type UserRole = 'patient' | 'caregiver' | 'clinician';

/** Clinician sub-role within the care team */
export type ClinicianRole =
  | 'physician'
  | 'nurse'
  | 'psychologist'
  | 'social_worker'
  | 'physiotherapist'
  | 'spiritual_care'
  | 'dietitian'
  | 'research_coordinator'
  | 'admin';

/** Permission flags from the clinicians table */
export interface ClinicianPermissions {
  canPrescribe: boolean;
  canExportResearch: boolean;
  canManageUsers: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// Auth
// ═══════════════════════════════════════════════════════════════════════════

/** POST /auth/otp/request - Request body */
export interface OtpRequestBody {
  /** Indian mobile number with country code (+91XXXXXXXXXX) */
  phone: string;
}

/** POST /auth/otp/request - Response */
export interface OtpRequestResponse {
  message: string;
  /** OTP validity in seconds */
  expires_in: number;
}

/** POST /auth/otp/verify - Request body */
export interface OtpVerifyBody {
  phone: string;
  /** 6-digit OTP */
  otp: string;
}

/** Authenticated user info embedded in token response */
export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
}

/** Extended auth user with clinician-specific fields */
export interface AuthUserExtended extends AuthUser {
  clinicianRole?: ClinicianRole;
  permissions?: ClinicianPermissions;
  department?: string;
  designation?: string;
}

/** POST /auth/otp/verify | POST /auth/token/refresh - Response */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  /** Access token expiry in seconds */
  expires_in: number;
  user: AuthUserExtended;
}

/** POST /auth/token/refresh - Request body */
export interface TokenRefreshBody {
  refresh_token: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Patients
// ═══════════════════════════════════════════════════════════════════════════

/** PATCH /patients/me - Request body (partial update) */
export interface PatientUpdateBody {
  name?: {
    first?: string;
    last?: string;
    display?: string;
  };
  language_preference?: string;
  preferences?: Record<string, unknown>;
}

/** POST /patients/me/onboarding - Request body */
export interface OnboardingBody {
  setup_mode?: 'patient_self' | 'caregiver_helping' | 'together';
  emotional_checkin?: string;
  what_helps?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Symptom Logs
// ═══════════════════════════════════════════════════════════════════════════

/** POST /patients/me/logs - Create symptom log request body */
export interface SymptomLogCreateBody {
  log_type: LogType;
  /** NRS pain score 0-10 */
  pain_intensity: number;
  pain_locations?: Array<{
    zone_id: string;
    intensity?: number;
    is_primary?: boolean;
  }>;
  pain_qualities?: string[];
  triggers?: {
    aggravators?: string[];
    relievers?: string[];
  };
  esas_scores?: EsasScores;
  mood?: Mood;
  sleep?: {
    quality?: 'well' | 'okay' | 'poorly';
    hours?: number;
  };
  notes?: {
    text?: string;
  };
  data_confidence?: DataConfidence;
  patient_present?: boolean;
  timestamp?: string;
}

/** GET /patients/me/logs - Query parameters */
export interface SymptomLogListParams {
  start_date?: string;
  end_date?: string;
  log_type?: LogType;
  page?: number;
  per_page?: number;
}

/** GET /patients/me/logs - Response */
export type SymptomLogListResponse = PaginatedResponse<SymptomLog>;

/** Daily summary entry returned by GET /patients/me/logs/summary/daily */
export interface DailySummary {
  date: string;
  pain_avg: number;
  pain_max: number;
  pain_min: number;
  entries_count: number;
  mood_most_common?: string;
  medications_adherence_pct?: number;
  esas_worst?: string;
  esas_worst_score?: number;
}

/** GET /patients/me/logs/summary/daily - Response */
export interface DailySummaryResponse {
  summaries: DailySummary[];
}

/** GET /patients/me/logs/summary/daily - Query parameters */
export interface DailySummaryParams {
  start_date: string;
  end_date: string;
}

/** GET /patients/me/logs/trends/weekly - Query parameters */
export interface WeeklyTrendParams {
  weeks?: number;
}

/** GET /patients/me/logs/correlations - Query parameters */
export interface CorrelationParams {
  period_days?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// Medications
// ═══════════════════════════════════════════════════════════════════════════

/** GET /patients/me/medications - Query parameters */
export interface MedicationListParams {
  status?: 'active' | 'all' | 'discontinued';
}

/** GET /patients/me/medications - Response */
export type MedicationListResponse = PaginatedResponse<Medication>;

/** POST /patients/me/medications/{med_id}/logs - Log administration request */
export interface MedicationAdminLogBody {
  status: 'taken' | 'skipped' | 'missed';
  actual_time?: string;
  notes?: string;
}

/** GET /patients/me/medications/medd - Response */
export interface MeddCalculationResponse {
  total_medd_mg: number;
  breakdown: Array<{
    medication_name: string;
    dose: string;
    frequency: string;
    medd_contribution_mg: number;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// Notifications
// ═══════════════════════════════════════════════════════════════════════════

/** GET /notifications - Query parameters */
export interface NotificationListParams {
  unread_only?: boolean;
  type?: NotificationType;
}

/** GET /notifications - Response */
export type NotificationListResponse = PaginatedResponse<Notification>;

/** POST /notifications/device - Request body */
export interface DeviceTokenBody {
  fcm_token: string;
  platform: 'android' | 'ios';
  device_id?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Reports
// ═══════════════════════════════════════════════════════════════════════════

/** POST /patients/me/reports/doctor - Request body */
export interface DoctorReportGenerateBody {
  start_date?: string;
  end_date?: string;
  format?: 'pdf' | 'json';
}

/** POST /patients/me/reports/doctor - Response */
export interface DoctorReportGenerateResponse {
  report_id: string;
  pdf_url?: string;
}

/** POST /patients/me/reports/{report_id}/share - Request body */
export interface ReportShareBody {
  clinician_id?: string;
  method?: 'in_app' | 'whatsapp' | 'email';
}

// ═══════════════════════════════════════════════════════════════════════════
// Clinician Dashboard
// ═══════════════════════════════════════════════════════════════════════════

/** Traffic-light status filter for the clinician patient list */
export type PatientStatusFilter = 'all' | 'critical' | 'warning' | 'stable';

/** Sort options for the clinician patient list */
export type PatientSortBy = 'name' | 'last_log' | 'pain_score' | 'adherence';

/** GET /clinician/patients - Query parameters */
export interface ClinicianPatientListParams {
  status_filter?: PatientStatusFilter;
  sort_by?: PatientSortBy;
  search?: string;
}

/** GET /clinician/patients - A single patient row in the clinician list view */
export interface ClinicianPatientSummary {
  id: string;
  name: {
    first: string;
    last: string;
    display?: string;
  };
  /** Traffic-light status indicator */
  status: PatientStatusFilter;
  /** Most recent pain score */
  latest_pain_score?: number;
  /** Average pain in the last 7 days */
  pain_avg_7d?: number;
  /** Medication adherence percentage */
  adherence_pct?: number;
  /** Current MEDD in mg */
  current_medd_mg?: number;
  /** Timestamp of the most recent symptom log */
  last_log_at?: string;
  /** Count of active alerts for this patient */
  active_alerts_count?: number;
  primary_diagnosis?: string;
}

/** GET /clinician/patients - Response */
export interface ClinicianPatientListResponse {
  data: ClinicianPatientSummary[];
  pagination: Pagination;
}

/** GET /clinician/patients/{patient_id} - Full patient detail for clinician */
export interface ClinicianPatientDetail {
  patient: Patient;
  recent_logs: SymptomLog[];
  medications: Medication[];
  medication_logs: MedicationLog[];
  active_alerts: ClinicalAlert[];
  recent_reports: DoctorReport[];
}

/** POST /clinician/patients/{patient_id}/notes - Request body */
export interface ClinicalNoteBody {
  content: string;
  note_type?: string;
}

/** GET /clinician/alerts - Query parameters */
export interface ClinicalAlertListParams {
  severity?: AlertSeverity | 'all';
  status?: AlertStatus | 'all';
}

/** GET /clinician/alerts - Response */
export type ClinicalAlertListResponse = PaginatedResponse<ClinicalAlert>;

/** Analytics period options */
export type AnalyticsPeriod = 'week' | 'month' | 'quarter' | 'year';

/** GET /clinician/analytics/department - Query parameters */
export interface DepartmentAnalyticsParams {
  period?: AnalyticsPeriod;
}

// ═══════════════════════════════════════════════════════════════════════════
// FHIR Interoperability
// ═══════════════════════════════════════════════════════════════════════════

/** FHIR resource types supported for export */
export type FhirResourceType =
  | 'Patient'
  | 'Observation'
  | 'MedicationRequest'
  | 'MedicationAdministration'
  | 'CarePlan'
  | 'Flag'
  | 'DocumentReference';

/** POST /fhir/Bundle/export - Request body */
export interface FhirExportBody {
  patient_id: string;
  resource_types?: FhirResourceType[];
  date_range?: {
    start?: string;
    end?: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Files
// ═══════════════════════════════════════════════════════════════════════════

/** File upload type */
export type FileUploadType = 'voice_note' | 'photo' | 'document';

/** POST /files/upload - Response */
export interface FileUploadResponse {
  file_id: string;
  url: string;
  /** Auto-transcript for voice notes */
  transcript?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Sync
// ═══════════════════════════════════════════════════════════════════════════

/** POST /sync - Batch sync offline records */
export interface SyncRequest {
  records: Array<{
    type: 'symptom_log' | 'medication_log';
    data: Record<string, unknown>;
    local_id: string;
    created_at: string;
  }>;
}

/** POST /sync - Response */
export interface SyncResponse {
  synced: number;
  conflicts: Array<{
    local_id: string;
    server_id: string;
    resolution: 'local_wins' | 'server_wins' | 'merged';
  }>;
  failed: Array<{
    local_id: string;
    error: string;
  }>;
}
