// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';
import 'symptom_log.dart' show SyncStatus;

part 'exercise_plan.freezed.dart';
part 'exercise_plan.g.dart';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Category of prescribed exercise.
enum ExerciseType {
  @JsonValue('walking')
  walking,
  @JsonValue('breathing')
  breathing,
  @JsonValue('stretching')
  stretching,
  @JsonValue('strengthening')
  strengthening,
  @JsonValue('balance')
  balance,
  @JsonValue('yoga')
  yoga,
  @JsonValue('stair_climbing')
  stairClimbing,
  @JsonValue('cycling')
  cycling,
  @JsonValue('pelvic_floor')
  pelvicFloor,
  @JsonValue('inspiratory_muscle')
  inspiratoryMuscle,
  @JsonValue('other')
  other,
}

/// Difficulty level of the exercise plan.
enum DifficultyLevel {
  @JsonValue('very_low')
  veryLow,
  @JsonValue('low')
  low,
  @JsonValue('moderate')
  moderate,
  @JsonValue('high')
  high,
}

/// Exercise intensity during a logged session.
enum ExerciseIntensity {
  @JsonValue('light')
  light,
  @JsonValue('moderate')
  moderate,
  @JsonValue('vigorous')
  vigorous,
}

/// Status of an exercise plan.
enum ExercisePlanStatus {
  @JsonValue('active')
  active,
  @JsonValue('paused')
  paused,
  @JsonValue('completed')
  completed,
  @JsonValue('cancelled')
  cancelled,
}

/// Role of the person who logged the exercise.
enum ExerciseLoggedByRole {
  @JsonValue('patient')
  patient,
  @JsonValue('caregiver')
  caregiver,
  @JsonValue('physiotherapist')
  physiotherapist,
}

/// Reason for skipping a scheduled exercise session.
enum ExerciseSkipReason {
  @JsonValue('pain')
  pain,
  @JsonValue('fatigue')
  fatigue,
  @JsonValue('nausea')
  nausea,
  @JsonValue('breathlessness')
  breathlessness,
  @JsonValue('not_feeling_well')
  notFeelingWell,
  @JsonValue('no_time')
  noTime,
  @JsonValue('forgot')
  forgot,
  @JsonValue('other')
  other,
}

// ---------------------------------------------------------------------------
// Data Models
// ---------------------------------------------------------------------------

/// A single exercise prescription within an exercise plan.
@freezed
class PrescribedExercise with _$PrescribedExercise {
  const factory PrescribedExercise({
    /// Category of exercise.
    required ExerciseType type,

    /// Display name of the exercise.
    required String name,

    /// Hindi translation of the exercise name.
    @JsonKey(name: 'name_hi') String? nameHi,

    /// Duration per session in minutes.
    @JsonKey(name: 'duration_minutes') int? durationMinutes,

    /// Recommended sessions per week.
    @JsonKey(name: 'frequency_per_week') int? frequencyPerWeek,

    /// Number of sets per session.
    int? sets,

    /// Number of reps per set.
    int? reps,

    /// Recommended intensity.
    ExerciseIntensity? intensity,

    /// URL to instructional video.
    @JsonKey(name: 'video_url') String? videoUrl,

    /// Free-text instructions for the patient.
    String? instructions,
  }) = _PrescribedExercise;

  factory PrescribedExercise.fromJson(Map<String, dynamic> json) =>
      _$PrescribedExerciseFromJson(json);
}

/// A physiotherapist-prescribed exercise plan linked to a surgical pathway.
@freezed
class ExercisePlan with _$ExercisePlan {
  const factory ExercisePlan({
    /// Unique plan identifier.
    required String id,

    /// Reference to the patient record.
    @JsonKey(name: 'patient_id') required String patientId,

    /// Reference to the surgical pathway.
    @JsonKey(name: 'pathway_id') required String pathwayId,

    /// Clinician who prescribed the plan.
    @JsonKey(name: 'prescribed_by') required String prescribedBy,

    /// Difficulty tier of the plan.
    @JsonKey(name: 'difficulty_level') required DifficultyLevel difficultyLevel,

    /// List of prescribed exercises.
    required List<PrescribedExercise> exercises,

    /// Plan start date.
    @JsonKey(name: 'start_date') required DateTime startDate,

    /// Plan end date.
    @JsonKey(name: 'end_date') DateTime? endDate,

    /// Current plan status.
    required ExercisePlanStatus status,

    /// Record creation timestamp.
    @JsonKey(name: 'created_at') required DateTime createdAt,

    /// Last update timestamp.
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _ExercisePlan;

  factory ExercisePlan.fromJson(Map<String, dynamic> json) =>
      _$ExercisePlanFromJson(json);
}

/// A patient-reported exercise session log entry.
@freezed
class ExerciseLog with _$ExerciseLog {
  const factory ExerciseLog({
    /// Unique log identifier (server-assigned).
    required String id,

    /// Reference to the patient record.
    @JsonKey(name: 'patient_id') required String patientId,

    /// Reference to the exercise plan.
    @JsonKey(name: 'plan_id') required String planId,

    /// Type of exercise performed.
    @JsonKey(name: 'exercise_type') required ExerciseType exerciseType,

    /// Who logged this entry.
    @JsonKey(name: 'logged_by') required String loggedBy,

    /// Role of the person who logged this entry.
    @JsonKey(name: 'logged_by_role') required ExerciseLoggedByRole loggedByRole,

    /// When the exercise was performed.
    required DateTime timestamp,

    /// Actual duration of the session in minutes.
    @JsonKey(name: 'duration_minutes') int? durationMinutes,

    /// Perceived intensity during the session.
    ExerciseIntensity? intensity,

    /// Pain score during exercise (0-10).
    @JsonKey(name: 'pain_during') int? painDuring,

    /// Whether the prescribed exercise was completed.
    required bool completed,

    /// Reason for skipping (if not completed).
    @JsonKey(name: 'skip_reason') ExerciseSkipReason? skipReason,

    /// Free-text notes about the session.
    String? notes,

    /// Client-generated UUID for offline-first sync.
    @JsonKey(name: 'local_id') String? localId,

    /// Sync status for offline-first architecture.
    @JsonKey(name: 'sync_status') @Default(SyncStatus.pending) SyncStatus syncStatus,
  }) = _ExerciseLog;

  factory ExerciseLog.fromJson(Map<String, dynamic> json) =>
      _$ExerciseLogFromJson(json);
}
