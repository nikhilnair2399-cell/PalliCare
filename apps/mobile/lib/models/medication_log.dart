// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';
import 'symptom_log.dart' show SyncStatus;

part 'medication_log.freezed.dart';
part 'medication_log.g.dart';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Current status of a scheduled medication dose.
enum MedicationDoseStatus {
  @JsonValue('upcoming')
  upcoming,
  @JsonValue('due')
  due,
  @JsonValue('taken')
  taken,
  @JsonValue('taken_late')
  takenLate,
  @JsonValue('missed')
  missed,
  @JsonValue('skipped')
  skipped,
}

/// Who administered the medication.
enum AdministeredByRole {
  @JsonValue('patient')
  patient,
  @JsonValue('caregiver')
  caregiver,
  @JsonValue('nurse')
  nurse,
  @JsonValue('unknown')
  unknown,
}

/// Reason for skipping a medication dose.
enum SkipReason {
  @JsonValue('side_effects')
  sideEffects,
  @JsonValue('ran_out')
  ranOut,
  @JsonValue('forgot')
  forgot,
  @JsonValue('felt_better')
  feltBetter,
  @JsonValue('doctor_advised')
  doctorAdvised,
  @JsonValue('other')
  other,
}

/// Specific side effect reported after taking a medication.
enum SideEffectType {
  @JsonValue('nausea')
  nausea,
  @JsonValue('vomiting')
  vomiting,
  @JsonValue('constipation')
  constipation,
  @JsonValue('drowsiness')
  drowsiness,
  @JsonValue('dizziness')
  dizziness,
  @JsonValue('dry_mouth')
  dryMouth,
  @JsonValue('itching')
  itching,
  @JsonValue('confusion')
  confusion,
  @JsonValue('headache')
  headache,
  @JsonValue('loss_of_appetite')
  lossOfAppetite,
  @JsonValue('rash')
  rash,
  @JsonValue('difficulty_breathing')
  difficultyBreathing,
  @JsonValue('other')
  other,
}

/// Severity of a reported side effect.
enum SideEffectSeverity {
  @JsonValue('mild')
  mild,
  @JsonValue('moderate')
  moderate,
  @JsonValue('severe')
  severe,
}

// ---------------------------------------------------------------------------
// Data Models
// ---------------------------------------------------------------------------

/// A single medication administration event, tracking whether a scheduled
/// dose was taken, missed, or skipped along with side effects and PRN context.
@freezed
class MedicationLog with _$MedicationLog {
  const factory MedicationLog({
    /// Unique log entry identifier.
    required String id,

    /// Reference to the medication record.
    @JsonKey(name: 'medication_id') required String medicationId,

    /// Reference to the patient.
    @JsonKey(name: 'patient_id') required String patientId,

    /// When the medication was supposed to be taken.
    @JsonKey(name: 'scheduled_time') required DateTime scheduledTime,

    /// Current status of this dose.
    required MedicationDoseStatus status,

    /// When the medication was actually taken (null if missed/skipped).
    @JsonKey(name: 'actual_time') DateTime? actualTime,

    /// User ID of who administered (patient self or caregiver).
    @JsonKey(name: 'administered_by') String? administeredBy,

    /// Role of the person who administered.
    @JsonKey(name: 'administered_by_role') @Default(AdministeredByRole.patient) AdministeredByRole administeredByRole,

    /// Reason for skipping the dose.
    @JsonKey(name: 'skip_reason') SkipReason? skipReason,

    /// Caregiver observation notes.
    @JsonKey(name: 'observation_notes') String? observationNotes,

    /// Context for PRN (as-needed) medications only.
    @JsonKey(name: 'prn_context') PrnContext? prnContext,

    /// Side effects reported after taking this dose.
    @JsonKey(name: 'side_effects_reported') List<SideEffectReport>? sideEffectsReported,

    /// Record creation timestamp.
    @JsonKey(name: 'created_at') DateTime? createdAt,

    /// Last updated timestamp.
    @JsonKey(name: 'updated_at') DateTime? updatedAt,

    /// Offline sync status.
    @JsonKey(name: 'sync_status') @Default(SyncStatus.pending) SyncStatus syncStatus,
  }) = _MedicationLog;

  factory MedicationLog.fromJson(Map<String, dynamic> json) =>
      _$MedicationLogFromJson(json);
}

/// Context captured for PRN (as-needed) medication doses.
@freezed
class PrnContext with _$PrnContext {
  const factory PrnContext({
    /// Pain score before taking PRN medication (0-10).
    @JsonKey(name: 'pain_before') int? painBefore,

    /// Pain score after taking PRN medication (0-10).
    @JsonKey(name: 'pain_after') int? painAfter,

    /// How many minutes until pain relief.
    @JsonKey(name: 'minutes_to_relief') int? minutesToRelief,

    /// Did the PRN dose provide adequate relief.
    @JsonKey(name: 'relief_adequate') bool? reliefAdequate,

    /// How many times this PRN has been taken today.
    @JsonKey(name: 'daily_dose_count') int? dailyDoseCount,
  }) = _PrnContext;

  factory PrnContext.fromJson(Map<String, dynamic> json) =>
      _$PrnContextFromJson(json);
}

/// A single side effect reported after medication administration.
@freezed
class SideEffectReport with _$SideEffectReport {
  const factory SideEffectReport({
    /// The side effect type.
    SideEffectType? effect,

    /// Severity of the side effect.
    SideEffectSeverity? severity,

    /// Additional notes about the side effect.
    String? notes,
  }) = _SideEffectReport;

  factory SideEffectReport.fromJson(Map<String, dynamic> json) =>
      _$SideEffectReportFromJson(json);
}
