// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'symptom_log.freezed.dart';
part 'symptom_log.g.dart';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Type of symptom logging session.
enum LogType {
  @JsonValue('quick')
  quick,
  @JsonValue('full')
  full,
  @JsonValue('breakthrough')
  breakthrough,
}

/// How the symptom data was obtained.
enum DataConfidence {
  @JsonValue('self_reported')
  selfReported,
  @JsonValue('observed')
  observed,
  @JsonValue('estimated')
  estimated,
  @JsonValue('proxy_reported')
  proxyReported,
}

/// Body map zone identifier (28 zones: 14 front + 14 back).
enum BodyZone {
  @JsonValue('head_front')
  headFront,
  @JsonValue('head_back')
  headBack,
  @JsonValue('face')
  face,
  @JsonValue('neck_front')
  neckFront,
  @JsonValue('neck_back')
  neckBack,
  @JsonValue('chest_left')
  chestLeft,
  @JsonValue('chest_right')
  chestRight,
  @JsonValue('upper_back_left')
  upperBackLeft,
  @JsonValue('upper_back_right')
  upperBackRight,
  @JsonValue('abdomen_upper')
  abdomenUpper,
  @JsonValue('abdomen_lower')
  abdomenLower,
  @JsonValue('lower_back_left')
  lowerBackLeft,
  @JsonValue('lower_back_right')
  lowerBackRight,
  @JsonValue('shoulder_left')
  shoulderLeft,
  @JsonValue('shoulder_right')
  shoulderRight,
  @JsonValue('upper_arm_left')
  upperArmLeft,
  @JsonValue('upper_arm_right')
  upperArmRight,
  @JsonValue('forearm_left')
  forearmLeft,
  @JsonValue('forearm_right')
  forearmRight,
  @JsonValue('hand_left')
  handLeft,
  @JsonValue('hand_right')
  handRight,
  @JsonValue('hip_left')
  hipLeft,
  @JsonValue('hip_right')
  hipRight,
  @JsonValue('thigh_left')
  thighLeft,
  @JsonValue('thigh_right')
  thighRight,
  @JsonValue('knee_left')
  kneeLeft,
  @JsonValue('knee_right')
  kneeRight,
  @JsonValue('lower_leg_left')
  lowerLegLeft,
  @JsonValue('lower_leg_right')
  lowerLegRight,
  @JsonValue('foot_left')
  footLeft,
  @JsonValue('foot_right')
  footRight,
}

/// Descriptor of pain quality.
enum PainQuality {
  @JsonValue('aching')
  aching,
  @JsonValue('sharp')
  sharp,
  @JsonValue('burning')
  burning,
  @JsonValue('throbbing')
  throbbing,
  @JsonValue('stabbing')
  stabbing,
  @JsonValue('shooting')
  shooting,
  @JsonValue('tingling')
  tingling,
  @JsonValue('cramping')
  cramping,
  @JsonValue('dull')
  dull,
  @JsonValue('pressure')
  pressure,
  @JsonValue('electric')
  electric,
  @JsonValue('gnawing')
  gnawing,
  @JsonValue('radiating')
  radiating,
  @JsonValue('squeezing')
  squeezing,
  @JsonValue('other')
  other,
}

/// 5-point emoji mood scale.
enum Mood {
  @JsonValue('great')
  great,
  @JsonValue('good')
  good,
  @JsonValue('okay')
  okay,
  @JsonValue('low')
  low,
  @JsonValue('distressed')
  distressed,
}

/// Subjective sleep quality.
enum SleepQuality {
  @JsonValue('well')
  well,
  @JsonValue('okay')
  okay,
  @JsonValue('poorly')
  poorly,
}

/// Offline sync status.
enum SyncStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('synced')
  synced,
  @JsonValue('conflict')
  conflict,
  @JsonValue('failed')
  failed,
}

// ---------------------------------------------------------------------------
// Data Models
// ---------------------------------------------------------------------------

/// A single symptom logging entry. Supports Quick Log (3 fields),
/// Full Log (all fields), and Breakthrough mode.
@freezed
class SymptomLog with _$SymptomLog {
  const factory SymptomLog({
    /// Unique identifier for this log entry.
    required String id,

    /// Reference to the patient who this log belongs to.
    @JsonKey(name: 'patient_id') required String patientId,

    /// Type of logging session.
    @JsonKey(name: 'log_type') required LogType logType,

    /// ISO 8601 timestamp of when symptoms were experienced.
    required DateTime timestamp,

    /// Numeric Rating Scale (NRS) pain score 0-10.
    @JsonKey(name: 'pain_intensity') required int painIntensity,

    /// User ID of who created this entry (patient, caregiver, or clinician).
    @JsonKey(name: 'logged_by') String? loggedBy,

    /// How the data was obtained.
    @JsonKey(name: 'data_confidence') DataConfidence? dataConfidence,

    /// Was the patient present when this was logged.
    @JsonKey(name: 'patient_present') bool? patientPresent,

    /// ISO 8601 timestamp of when this entry was created.
    @JsonKey(name: 'created_at') DateTime? createdAt,

    /// Array of affected body zones with per-zone intensity.
    @JsonKey(name: 'pain_locations') List<PainLocation>? painLocations,

    /// Descriptors of pain quality.
    @JsonKey(name: 'pain_qualities') List<PainQuality>? painQualities,

    /// Aggravators and relievers.
    SymptomTriggers? triggers,

    /// Edmonton Symptom Assessment System - Revised (ESAS-r) scores.
    @JsonKey(name: 'esas_scores') EsasScores? esasScores,

    /// 5-point emoji mood scale.
    Mood? mood,

    /// Sleep quality and hours.
    SleepInfo? sleep,

    /// Free text notes, voice notes, and photos.
    SymptomNotes? notes,

    /// Breakthrough-specific fields.
    BreakthroughInfo? breakthrough,

    /// PAINAD assessment for non-communicative patients.
    PainadAssessment? painad,

    /// Automatically captured context.
    LogContext? context,

    /// Offline sync status.
    @JsonKey(name: 'sync_status') SyncStatus? syncStatus,

    /// Last updated timestamp.
    @JsonKey(name: 'updated_at') DateTime? updatedAt,

    /// Soft delete timestamp.
    @JsonKey(name: 'deleted_at') DateTime? deletedAt,
  }) = _SymptomLog;

  factory SymptomLog.fromJson(Map<String, dynamic> json) =>
      _$SymptomLogFromJson(json);
}

/// A single pain location entry on the body map.
@freezed
class PainLocation with _$PainLocation {
  const factory PainLocation({
    /// Body map zone identifier.
    @JsonKey(name: 'zone_id') required BodyZone zoneId,

    /// Pain intensity at this specific location (0-10).
    int? intensity,

    /// Whether this is the primary pain site.
    @JsonKey(name: 'is_primary') @Default(false) bool isPrimary,
  }) = _PainLocation;

  factory PainLocation.fromJson(Map<String, dynamic> json) =>
      _$PainLocationFromJson(json);
}

/// What aggravates and relieves pain.
@freezed
class SymptomTriggers with _$SymptomTriggers {
  const factory SymptomTriggers({
    /// What makes pain worse.
    List<String>? aggravators,

    /// What helps reduce pain.
    List<String>? relievers,
  }) = _SymptomTriggers;

  factory SymptomTriggers.fromJson(Map<String, dynamic> json) =>
      _$SymptomTriggersFromJson(json);
}

/// Edmonton Symptom Assessment System - Revised (ESAS-r) scores.
/// Each score ranges from 0 (no symptom) to 10 (worst possible).
@freezed
class EsasScores with _$EsasScores {
  const factory EsasScores({
    int? pain,
    int? tiredness,
    int? nausea,
    int? depression,
    int? anxiety,
    int? drowsiness,
    int? appetite,
    int? wellbeing,
    @JsonKey(name: 'shortness_of_breath') int? shortnessOfBreath,
  }) = _EsasScores;

  factory EsasScores.fromJson(Map<String, dynamic> json) =>
      _$EsasScoresFromJson(json);
}

/// Sleep quality and duration information.
@freezed
class SleepInfo with _$SleepInfo {
  const factory SleepInfo({
    /// Subjective sleep quality last night.
    SleepQuality? quality,

    /// Approximate hours of sleep.
    double? hours,
  }) = _SleepInfo;

  factory SleepInfo.fromJson(Map<String, dynamic> json) =>
      _$SleepInfoFromJson(json);
}

/// Free text notes, voice notes, and photo attachments.
@freezed
class SymptomNotes with _$SymptomNotes {
  const factory SymptomNotes({
    /// Free text notes (max 1000 chars).
    String? text,

    /// URL to uploaded voice recording.
    @JsonKey(name: 'voice_note_url') String? voiceNoteUrl,

    /// Auto-transcribed text from voice note.
    @JsonKey(name: 'voice_note_transcript') String? voiceNoteTranscript,

    /// URLs to uploaded photos (max 3).
    @JsonKey(name: 'photo_urls') List<String>? photoUrls,
  }) = _SymptomNotes;

  factory SymptomNotes.fromJson(Map<String, dynamic> json) =>
      _$SymptomNotesFromJson(json);
}

/// Breakthrough pain episode-specific fields.
@freezed
class BreakthroughInfo with _$BreakthroughInfo {
  const factory BreakthroughInfo({
    /// Did patient take rescue/PRN medication.
    @JsonKey(name: 'rescue_medication_taken') bool? rescueMedicationTaken,

    /// Reference to the rescue medication taken.
    @JsonKey(name: 'rescue_medication_id') String? rescueMedicationId,

    /// When the 30-minute follow-up check is scheduled.
    @JsonKey(name: 'follow_up_scheduled') DateTime? followUpScheduled,

    /// Pain score at follow-up (0-10).
    @JsonKey(name: 'follow_up_pain') int? followUpPain,
  }) = _BreakthroughInfo;

  factory BreakthroughInfo.fromJson(Map<String, dynamic> json) =>
      _$BreakthroughInfoFromJson(json);
}

/// PAINAD (Pain Assessment in Advanced Dementia) for non-communicative patients.
/// Each dimension is scored 0-2; total 0-10.
@freezed
class PainadAssessment with _$PainadAssessment {
  const factory PainadAssessment({
    /// Breathing independent of vocalization (0-2).
    int? breathing,

    /// Negative vocalization (0-2).
    int? vocalization,

    /// Facial expression (0-2).
    @JsonKey(name: 'facial_expression') int? facialExpression,

    /// Body language (0-2).
    @JsonKey(name: 'body_language') int? bodyLanguage,

    /// Consolability (0-2).
    int? consolability,

    /// Total PAINAD score (0-10).
    @JsonKey(name: 'total_score') int? totalScore,
  }) = _PainadAssessment;

  factory PainadAssessment.fromJson(Map<String, dynamic> json) =>
      _$PainadAssessmentFromJson(json);
}

/// Automatically captured device and environmental context.
@freezed
class LogContext with _$LogContext {
  const factory LogContext({
    /// Device identifier.
    @JsonKey(name: 'device_id') String? deviceId,

    /// App version string.
    @JsonKey(name: 'app_version') String? appVersion,

    /// Operating system version.
    @JsonKey(name: 'os_version') String? osVersion,

    /// City-level location, if permitted.
    @JsonKey(name: 'location_approx') String? locationApprox,

    /// Weather conditions at time of logging.
    WeatherInfo? weather,

    /// How long the logging took, in seconds.
    @JsonKey(name: 'time_to_complete_seconds') int? timeToCompleteSeconds,
  }) = _LogContext;

  factory LogContext.fromJson(Map<String, dynamic> json) =>
      _$LogContextFromJson(json);
}

/// Weather conditions captured at the time of symptom logging.
@freezed
class WeatherInfo with _$WeatherInfo {
  const factory WeatherInfo({
    /// Temperature in degrees Celsius.
    @JsonKey(name: 'temperature_c') double? temperatureC,

    /// Relative humidity percentage.
    @JsonKey(name: 'humidity_pct') double? humidityPct,

    /// Weather condition description.
    String? condition,

    /// Barometric pressure in hectopascals.
    @JsonKey(name: 'pressure_hpa') double? pressureHpa,
  }) = _WeatherInfo;

  factory WeatherInfo.fromJson(Map<String, dynamic> json) =>
      _$WeatherInfoFromJson(json);
}
