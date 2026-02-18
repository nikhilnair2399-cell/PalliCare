/**
 * PalliCare Web Dashboard - TypeScript Type Definitions
 *
 * Barrel file re-exporting all interfaces, types, and enums from the
 * domain schemas and API layer.
 *
 * Usage:
 *   import { Patient, SymptomLog, ClinicalAlert } from '@/types';
 *   import type { ApiError, PaginatedResponse } from '@/types';
 */

// ── Patient ────────────────────────────────────────────────────────────────
export type {
  Gender,
  LanguagePreference,
  FunctionalStatus,
  PrognosisCategory,
  AllergySeverity,
  CareTeamRole,
  CaregiverRelationship,
  CaregiverStatus,
  SetupMode,
  EmotionalCheckinResponse,
  DefaultLogMode,
  DarkMode,
  SpiritualTradition,
  PatientName,
  Allergy,
  PatientMedical,
  CareTeamMember,
  CareTeam,
  CaregiverPermissions,
  Caregiver,
  Onboarding,
  QuietHours,
  NotificationPreferences,
  PatientPreferences,
  EducationProgress,
  JourneyStats,
  PrivacySettings,
  Patient,
} from './patient';

// ── Symptom Log ────────────────────────────────────────────────────────────
export type {
  LogType,
  DataConfidence,
  BodyZoneId,
  PainQuality,
  Mood,
  SleepQuality,
  SyncStatus,
  PainLocation,
  Triggers,
  EsasScores,
  SleepInfo,
  LogNotes,
  BreakthroughInfo,
  PainadAssessment,
  WeatherContext,
  LogContext,
  SymptomLog,
} from './symptom-log';

// ── Medication ─────────────────────────────────────────────────────────────
export type {
  DoseUnit,
  MedicationFrequency,
  MedicationRoute,
  MedicationCategory,
  MedicationStatus,
  TimeBlock,
  MedicationSource,
  MedicationScheduleEntry,
  MeddInfo,
  Medication,
} from './medication';

// ── Medication Log ─────────────────────────────────────────────────────────
export type {
  MedicationLogStatus,
  AdministeredByRole,
  SkipReason,
  SideEffectType,
  SideEffectSeverity,
  PrnContext,
  SideEffectReport,
  MedicationLog,
} from './medication-log';

// ── Notification ───────────────────────────────────────────────────────────
export type {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
  NotificationSound,
  DeliveryStatus,
  SuppressionReason,
  NotificationActionButton,
  NotificationEscalation,
  NotificationMetadata,
  Notification,
} from './notification';

// ── Clinical Alert ─────────────────────────────────────────────────────────
export type {
  AlertSeverity,
  ClinicalAlertType,
  AlertStatus,
  TriggerRule,
  PainScoreDataPoint,
  SupportingData,
  ClinicalAlert,
} from './clinical-alert';

// ── Doctor Report ──────────────────────────────────────────────────────────
export type {
  PainTrend,
  MedicationChangeType,
  PatternType,
  PatternConfidence,
  ReportFormat,
  ShareMethod,
  ReportPeriod,
  PainSummary,
  MedicationAdherenceSummary,
  MeddBreakdownItem,
  MeddSummary,
  EsasSummary,
  MoodDistribution,
  MoodSummary,
  SleepQualityDistribution,
  SleepSummary,
  ReportSummary,
  PainChartDataPoint,
  MedicationChange,
  NotablePattern,
  FlareEpisode,
  ReportShareRecord,
  DoctorReport,
} from './doctor-report';

// ── API Types ──────────────────────────────────────────────────────────────
export type {
  // Common
  ApiError,
  Pagination,
  PaginatedResponse,
  UserRole,
  // Auth
  OtpRequestBody,
  OtpRequestResponse,
  OtpVerifyBody,
  AuthUser,
  TokenResponse,
  TokenRefreshBody,
  // Patients
  PatientUpdateBody,
  OnboardingBody,
  // Symptom Logs
  SymptomLogCreateBody,
  SymptomLogListParams,
  SymptomLogListResponse,
  DailySummary,
  DailySummaryResponse,
  DailySummaryParams,
  WeeklyTrendParams,
  CorrelationParams,
  // Medications
  MedicationListParams,
  MedicationListResponse,
  MedicationAdminLogBody,
  MeddCalculationResponse,
  // Notifications
  NotificationListParams,
  NotificationListResponse,
  DeviceTokenBody,
  // Reports
  DoctorReportGenerateBody,
  DoctorReportGenerateResponse,
  ReportShareBody,
  // Clinician Dashboard
  PatientStatusFilter,
  PatientSortBy,
  ClinicianPatientListParams,
  ClinicianPatientSummary,
  ClinicianPatientListResponse,
  ClinicianPatientDetail,
  ClinicalNoteBody,
  ClinicalAlertListParams,
  ClinicalAlertListResponse,
  AnalyticsPeriod,
  DepartmentAnalyticsParams,
  // FHIR
  FhirResourceType,
  FhirExportBody,
  // Files
  FileUploadType,
  FileUploadResponse,
  // Sync
  SyncRequest,
  SyncResponse,
} from './api-types';
