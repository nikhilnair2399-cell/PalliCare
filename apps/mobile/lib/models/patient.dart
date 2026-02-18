// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'patient.freezed.dart';
part 'patient.g.dart';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Patient gender.
enum Gender {
  @JsonValue('male')
  male,
  @JsonValue('female')
  female,
  @JsonValue('other')
  other,
  @JsonValue('prefer_not_to_say')
  preferNotToSay,
}

/// Preferred language.
enum LanguagePreference {
  @JsonValue('en')
  en,
  @JsonValue('hi')
  hi,
  @JsonValue('both')
  both,
}

/// Allergy severity level.
enum AllergySeverity {
  @JsonValue('mild')
  mild,
  @JsonValue('moderate')
  moderate,
  @JsonValue('severe')
  severe,
}

/// ECOG / Karnofsky equivalent functional status.
enum FunctionalStatus {
  @JsonValue('fully_ambulatory')
  fullyAmbulatory,
  @JsonValue('limited_activity')
  limitedActivity,
  @JsonValue('bed_bound_less_50')
  bedBoundLess50,
  @JsonValue('bed_bound_more_50')
  bedBoundMore50,
  @JsonValue('completely_bed_bound')
  completelyBedBound,
}

/// Broad prognostic category (clinician-set, not shown to patient).
enum PrognosisCategory {
  @JsonValue('months_to_years')
  monthsToYears,
  @JsonValue('weeks_to_months')
  weeksToMonths,
  @JsonValue('days_to_weeks')
  daysToWeeks,
}

/// Care team member role.
enum CareTeamRole {
  @JsonValue('palliative_physician')
  palliativePhysician,
  @JsonValue('oncologist')
  oncologist,
  @JsonValue('nurse')
  nurse,
  @JsonValue('psychologist')
  psychologist,
  @JsonValue('social_worker')
  socialWorker,
  @JsonValue('physiotherapist')
  physiotherapist,
  @JsonValue('chaplain')
  chaplain,
}

/// Caregiver relationship to the patient.
enum CaregiverRelationship {
  @JsonValue('spouse')
  spouse,
  @JsonValue('child')
  child,
  @JsonValue('parent')
  parent,
  @JsonValue('sibling')
  sibling,
  @JsonValue('relative')
  relative,
  @JsonValue('friend')
  friend,
  @JsonValue('professional_caregiver')
  professionalCaregiver,
  @JsonValue('other')
  other,
}

/// Caregiver link status.
enum CaregiverStatus {
  @JsonValue('invited')
  invited,
  @JsonValue('active')
  active,
  @JsonValue('removed')
  removed,
}

/// How the app was set up during onboarding.
enum SetupMode {
  @JsonValue('patient_self')
  patientSelf,
  @JsonValue('caregiver_helping')
  caregiverHelping,
  @JsonValue('together')
  together,
}

/// Initial emotional check-in response from onboarding.
enum EmotionalCheckinResponse {
  @JsonValue('doing_okay')
  doingOkay,
  @JsonValue('managing')
  managing,
  @JsonValue('tough_day')
  toughDay,
}

/// Default symptom log mode preference.
enum DefaultLogMode {
  @JsonValue('quick')
  quick,
  @JsonValue('full')
  full,
}

/// Dark mode preference.
enum DarkModePreference {
  @JsonValue('off')
  off,
  @JsonValue('on')
  on,
  @JsonValue('auto')
  auto,
}

/// Spiritual tradition preference.
enum SpiritualTradition {
  @JsonValue('hindu')
  hindu,
  @JsonValue('muslim')
  muslim,
  @JsonValue('christian')
  christian,
  @JsonValue('sikh')
  sikh,
  @JsonValue('buddhist')
  buddhist,
  @JsonValue('secular')
  secular,
  @JsonValue('other')
  other,
}

// ---------------------------------------------------------------------------
// Data Models
// ---------------------------------------------------------------------------

/// Complete patient profile including demographics, medical info,
/// preferences, and care team links.
@freezed
class Patient with _$Patient {
  const factory Patient({
    /// Unique patient identifier.
    required String id,

    /// Reference to the auth/user record.
    @JsonKey(name: 'user_id') required String userId,

    /// Patient name.
    required PatientName name,

    /// Indian mobile number with country code (+91XXXXXXXXXX).
    required String phone,

    /// Account creation timestamp.
    @JsonKey(name: 'created_at') required DateTime createdAt,

    /// Email address.
    String? email,

    /// Date of birth.
    @JsonKey(name: 'date_of_birth') DateTime? dateOfBirth,

    /// Age in years.
    int? age,

    /// Gender.
    Gender? gender,

    /// Preferred language.
    @JsonKey(name: 'language_preference') LanguagePreference? languagePreference,

    /// 14-digit Ayushman Bharat Health Account number.
    @JsonKey(name: 'abha_id') String? abhaId,

    /// Whether ABHA account is linked.
    @JsonKey(name: 'abha_linked') @Default(false) bool abhaLinked,

    /// URL to patient avatar image.
    @JsonKey(name: 'avatar_url') String? avatarUrl,

    /// Medical information.
    PatientMedical? medical,

    /// Care team information.
    CareTeam? careTeam,

    /// Linked caregivers (max 5).
    List<Caregiver>? caregivers,

    /// Onboarding state.
    Onboarding? onboarding,

    /// User preferences.
    PatientPreferences? preferences,

    /// Education module progress.
    EducationProgress? education,

    /// Journey / gamification stats.
    JourneyStats? journey,

    /// Privacy and consent settings.
    PrivacySettings? privacy,

    /// Last updated timestamp.
    @JsonKey(name: 'updated_at') DateTime? updatedAt,

    /// Soft delete timestamp.
    @JsonKey(name: 'deleted_at') DateTime? deletedAt,
  }) = _Patient;

  factory Patient.fromJson(Map<String, dynamic> json) =>
      _$PatientFromJson(json);
}

/// Patient name fields.
@freezed
class PatientName with _$PatientName {
  const factory PatientName({
    /// First name.
    required String first,

    /// Last name.
    required String last,

    /// How the patient wants to be addressed.
    String? display,
  }) = _PatientName;

  factory PatientName.fromJson(Map<String, dynamic> json) =>
      _$PatientNameFromJson(json);
}

/// Patient medical information.
@freezed
class PatientMedical with _$PatientMedical {
  const factory PatientMedical({
    /// Primary palliative care diagnosis.
    @JsonKey(name: 'primary_diagnosis') String? primaryDiagnosis,

    /// ICD-10 code.
    @JsonKey(name: 'diagnosis_icd10') String? diagnosisIcd10,

    /// Date of diagnosis.
    @JsonKey(name: 'diagnosis_date') DateTime? diagnosisDate,

    /// Secondary diagnoses.
    @JsonKey(name: 'secondary_diagnoses') List<String>? secondaryDiagnoses,

    /// Known allergies.
    List<Allergy>? allergies,

    /// Comorbid conditions.
    List<String>? comorbidities,

    /// ECOG/Karnofsky equivalent functional status.
    @JsonKey(name: 'functional_status') FunctionalStatus? functionalStatus,

    /// Broad prognostic category (clinician-set, not shown to patient).
    @JsonKey(name: 'prognosis_category') PrognosisCategory? prognosisCategory,
  }) = _PatientMedical;

  factory PatientMedical.fromJson(Map<String, dynamic> json) =>
      _$PatientMedicalFromJson(json);
}

/// A patient allergy record.
@freezed
class Allergy with _$Allergy {
  const factory Allergy({
    /// The allergen substance.
    String? allergen,

    /// The allergic reaction description.
    String? reaction,

    /// Severity level.
    AllergySeverity? severity,
  }) = _Allergy;

  factory Allergy.fromJson(Map<String, dynamic> json) =>
      _$AllergyFromJson(json);
}

/// Care team configuration.
@freezed
class CareTeam with _$CareTeam {
  const factory CareTeam({
    /// Primary clinician identifier.
    @JsonKey(name: 'primary_clinician_id') String? primaryClinicianId,

    /// Medical institution.
    @Default('AIIMS Bhopal') String? institution,

    /// Department name.
    @Default('Palliative Medicine') String? department,

    /// Care team members.
    @JsonKey(name: 'team_members') List<CareTeamMember>? teamMembers,
  }) = _CareTeam;

  factory CareTeam.fromJson(Map<String, dynamic> json) =>
      _$CareTeamFromJson(json);
}

/// A single care team member.
@freezed
class CareTeamMember with _$CareTeamMember {
  const factory CareTeamMember({
    /// Clinician identifier.
    @JsonKey(name: 'clinician_id') String? clinicianId,

    /// Role in the care team.
    CareTeamRole? role,
  }) = _CareTeamMember;

  factory CareTeamMember.fromJson(Map<String, dynamic> json) =>
      _$CareTeamMemberFromJson(json);
}

/// A linked caregiver with permissions.
@freezed
class Caregiver with _$Caregiver {
  const factory Caregiver({
    /// Caregiver user identifier.
    @JsonKey(name: 'caregiver_user_id') required String caregiverUserId,

    /// Relationship to the patient.
    required CaregiverRelationship relationship,

    /// Link status.
    required CaregiverStatus status,

    /// Caregiver display name.
    String? name,

    /// Caregiver phone number.
    String? phone,

    /// Granular permissions.
    CaregiverPermissions? permissions,

    /// When the caregiver was linked.
    @JsonKey(name: 'linked_at') DateTime? linkedAt,
  }) = _Caregiver;

  factory Caregiver.fromJson(Map<String, dynamic> json) =>
      _$CaregiverFromJson(json);
}

/// Granular caregiver permissions.
@freezed
class CaregiverPermissions with _$CaregiverPermissions {
  const factory CaregiverPermissions({
    @JsonKey(name: 'view_pain_logs') @Default(true) bool viewPainLogs,
    @JsonKey(name: 'log_symptoms') @Default(true) bool logSymptoms,
    @JsonKey(name: 'view_medications') @Default(true) bool viewMedications,
    @JsonKey(name: 'administer_medications') @Default(true) bool administerMedications,
    @JsonKey(name: 'view_reports') @Default(true) bool viewReports,
    @JsonKey(name: 'view_legacy_messages') @Default(false) bool viewLegacyMessages,
    @JsonKey(name: 'communicate_with_team') @Default(true) bool communicateWithTeam,
    @JsonKey(name: 'receive_alerts') @Default(true) bool receiveAlerts,
    @JsonKey(name: 'delete_data') @Default(false) bool deleteData,
    @JsonKey(name: 'modify_privacy') @Default(false) bool modifyPrivacy,
  }) = _CaregiverPermissions;

  factory CaregiverPermissions.fromJson(Map<String, dynamic> json) =>
      _$CaregiverPermissionsFromJson(json);
}

/// Onboarding completion state.
@freezed
class Onboarding with _$Onboarding {
  const factory Onboarding({
    /// Whether onboarding has been completed.
    @Default(false) bool completed,

    /// When onboarding was completed.
    @JsonKey(name: 'completed_at') DateTime? completedAt,

    /// How the app was set up.
    @JsonKey(name: 'setup_mode') SetupMode? setupMode,

    /// Initial emotional check-in response.
    @JsonKey(name: 'emotional_checkin_response') EmotionalCheckinResponse? emotionalCheckinResponse,

    /// What patient said helps them cope.
    @JsonKey(name: 'what_helps') List<String>? whatHelps,
  }) = _Onboarding;

  factory Onboarding.fromJson(Map<String, dynamic> json) =>
      _$OnboardingFromJson(json);
}

/// User preferences for the app.
@freezed
class PatientPreferences with _$PatientPreferences {
  const factory PatientPreferences({
    /// Default symptom log mode.
    @JsonKey(name: 'default_log_mode') @Default(DefaultLogMode.quick) DefaultLogMode defaultLogMode,

    /// Dark mode setting.
    @JsonKey(name: 'dark_mode') @Default(DarkModePreference.auto) DarkModePreference darkMode,

    /// Font scale factor (1.0 to 2.0).
    @JsonKey(name: 'font_scale') @Default(1.0) double fontScale,

    /// Whether high contrast mode is enabled.
    @JsonKey(name: 'high_contrast') @Default(false) bool highContrast,

    /// Whether to reduce motion / animations.
    @JsonKey(name: 'reduce_motion') @Default(false) bool reduceMotion,

    /// Whether haptic feedback is enabled.
    @JsonKey(name: 'haptic_feedback') @Default(true) bool hapticFeedback,

    /// Whether voice input is enabled.
    @JsonKey(name: 'voice_input_enabled') @Default(true) bool voiceInputEnabled,

    /// Quiet hours configuration.
    @JsonKey(name: 'quiet_hours') QuietHours? quietHours,

    /// Notification category toggles.
    NotificationPreferences? notifications,
  }) = _PatientPreferences;

  factory PatientPreferences.fromJson(Map<String, dynamic> json) =>
      _$PatientPreferencesFromJson(json);
}

/// Quiet hours (Do Not Disturb) configuration.
@freezed
class QuietHours with _$QuietHours {
  const factory QuietHours({
    /// Whether quiet hours are enabled.
    @Default(true) bool enabled,

    /// Start time in HH:MM format.
    @Default('22:00') String start,

    /// End time in HH:MM format.
    @Default('07:00') String end,
  }) = _QuietHours;

  factory QuietHours.fromJson(Map<String, dynamic> json) =>
      _$QuietHoursFromJson(json);
}

/// Per-category notification preferences.
@freezed
class NotificationPreferences with _$NotificationPreferences {
  const factory NotificationPreferences({
    @JsonKey(name: 'medication_reminders') @Default(true) bool medicationReminders,
    @JsonKey(name: 'logging_prompts') @Default(true) bool loggingPrompts,
    @JsonKey(name: 'education_content') @Default(true) bool educationContent,
    @JsonKey(name: 'milestone_celebrations') @Default(true) bool milestoneCelebrations,
    @JsonKey(name: 'goal_reminders') @Default(true) bool goalReminders,
    @JsonKey(name: 'wellness_tips') @Default(true) bool wellnessTips,
  }) = _NotificationPreferences;

  factory NotificationPreferences.fromJson(Map<String, dynamic> json) =>
      _$NotificationPreferencesFromJson(json);
}

/// Education module progress.
@freezed
class EducationProgress with _$EducationProgress {
  const factory EducationProgress({
    /// Current education phase (1-3).
    @JsonKey(name: 'current_phase') @Default(1) int currentPhase,

    /// Number of modules completed.
    @JsonKey(name: 'modules_completed') @Default(0) int modulesCompleted,

    /// Whether spiritual care content is opted in.
    @JsonKey(name: 'spiritual_care_opted_in') @Default(false) bool spiritualCareOptedIn,

    /// Spiritual tradition preference.
    @JsonKey(name: 'spiritual_tradition') SpiritualTradition? spiritualTradition,
  }) = _EducationProgress;

  factory EducationProgress.fromJson(Map<String, dynamic> json) =>
      _$EducationProgressFromJson(json);
}

/// Gamification / journey statistics.
@freezed
class JourneyStats with _$JourneyStats {
  const factory JourneyStats({
    /// Total symptom log entries.
    @JsonKey(name: 'total_logs') @Default(0) int totalLogs,

    /// Total breathe sessions completed.
    @JsonKey(name: 'total_breathe_sessions') @Default(0) int totalBreatheSessions,

    /// Total gratitude journal entries.
    @JsonKey(name: 'total_gratitude_entries') @Default(0) int totalGratitudeEntries,

    /// Total goals completed.
    @JsonKey(name: 'goals_completed') @Default(0) int goalsCompleted,

    /// Whether legacy messages feature is opted in.
    @JsonKey(name: 'legacy_opted_in') @Default(false) bool legacyOptedIn,

    /// Number of days the patient has been active.
    @JsonKey(name: 'days_active') @Default(0) int daysActive,

    /// Current consecutive-day logging streak.
    @JsonKey(name: 'current_streak') @Default(0) int currentStreak,
  }) = _JourneyStats;

  factory JourneyStats.fromJson(Map<String, dynamic> json) =>
      _$JourneyStatsFromJson(json);
}

/// Privacy and data consent settings.
@freezed
class PrivacySettings with _$PrivacySettings {
  const factory PrivacySettings({
    /// Whether data sharing consent has been given.
    @JsonKey(name: 'data_sharing_consent') @Default(false) bool dataSharingConsent,

    /// Whether research data use consent has been given.
    @JsonKey(name: 'research_consent') @Default(false) bool researchConsent,

    /// Whether anonymized analytics are enabled.
    @JsonKey(name: 'anonymized_analytics') @Default(true) bool anonymizedAnalytics,

    /// Whether clinicians can access patient data.
    @JsonKey(name: 'clinician_data_access') @Default(true) bool clinicianDataAccess,

    /// Data retention period in years.
    @JsonKey(name: 'data_retention_years') @Default(5) int dataRetentionYears,
  }) = _PrivacySettings;

  factory PrivacySettings.fromJson(Map<String, dynamic> json) =>
      _$PrivacySettingsFromJson(json);
}
