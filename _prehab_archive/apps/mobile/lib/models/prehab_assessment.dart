// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'prehab_assessment.freezed.dart';
part 'prehab_assessment.g.dart';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Type of prehabilitation assessment.
enum AssessmentType {
  @JsonValue('baseline')
  baseline,
  @JsonValue('weekly')
  weekly,
  @JsonValue('pre_op_final')
  preOpFinal,
  @JsonValue('post_op')
  postOp,
  @JsonValue('functional_capacity')
  functionalCapacity,
  @JsonValue('nutritional')
  nutritional,
  @JsonValue('psychological')
  psychological,
  @JsonValue('medical_clearance')
  medicalClearance,
}

/// Overall readiness verdict from the assessment.
enum ReadinessVerdict {
  @JsonValue('ready')
  ready,
  @JsonValue('conditionally_ready')
  conditionallyReady,
  @JsonValue('not_ready')
  notReady,
  @JsonValue('deferred')
  deferred,
}

// ---------------------------------------------------------------------------
// Data Models
// ---------------------------------------------------------------------------

/// A prehabilitation assessment measuring a patient's surgical readiness
/// across functional, nutritional, psychological, and medical domains.
@freezed
class PrehabAssessment with _$PrehabAssessment {
  const factory PrehabAssessment({
    /// Unique assessment identifier.
    required String id,

    /// Reference to the patient record.
    @JsonKey(name: 'patient_id') required String patientId,

    /// Reference to the surgical pathway.
    @JsonKey(name: 'pathway_id') required String pathwayId,

    /// Type of assessment performed.
    @JsonKey(name: 'assessment_type') required AssessmentType assessmentType,

    /// Clinician or team member who performed the assessment.
    @JsonKey(name: 'assessed_by') required String assessedBy,

    /// Date the assessment was performed.
    @JsonKey(name: 'assessment_date') required DateTime assessmentDate,

    /// Domain-specific assessment scores (flexible key-value).
    Map<String, dynamic>? scores,

    /// Functional capacity sub-scores.
    @JsonKey(name: 'functional_scores') FunctionalScores? functionalScores,

    /// Nutritional sub-scores.
    @JsonKey(name: 'nutritional_scores') NutritionalScores? nutritionalScores,

    /// Psychological sub-scores.
    @JsonKey(name: 'psychological_scores') PsychologicalScores? psychologicalScores,

    /// Medical clearance sub-scores.
    @JsonKey(name: 'medical_scores') MedicalScores? medicalScores,

    /// Overall readiness score (0-100).
    @JsonKey(name: 'readiness_score') int? readinessScore,

    /// Overall readiness verdict.
    @JsonKey(name: 'readiness_verdict') ReadinessVerdict? readinessVerdict,

    /// Free-text clinical notes.
    String? notes,

    /// Record creation timestamp.
    @JsonKey(name: 'created_at') required DateTime createdAt,
  }) = _PrehabAssessment;

  factory PrehabAssessment.fromJson(Map<String, dynamic> json) =>
      _$PrehabAssessmentFromJson(json);
}

/// Functional capacity assessment scores.
@freezed
class FunctionalScores with _$FunctionalScores {
  const factory FunctionalScores({
    /// Six-minute walk test distance in metres.
    @JsonKey(name: 'six_min_walk_metres') double? sixMinWalkMetres,

    /// Timed Up and Go test in seconds.
    @JsonKey(name: 'tug_seconds') double? tugSeconds,

    /// Hand grip strength in kg.
    @JsonKey(name: 'grip_strength_kg') double? gripStrengthKg,

    /// Sit-to-stand repetitions in 30 seconds.
    @JsonKey(name: 'sit_to_stand_reps') int? sitToStandReps,

    /// ECOG performance status (0-4).
    @JsonKey(name: 'ecog_score') int? ecogScore,

    /// Karnofsky Performance Scale (0-100).
    @JsonKey(name: 'karnofsky_score') int? karnofskyScore,
  }) = _FunctionalScores;

  factory FunctionalScores.fromJson(Map<String, dynamic> json) =>
      _$FunctionalScoresFromJson(json);
}

/// Nutritional assessment scores.
@freezed
class NutritionalScores with _$NutritionalScores {
  const factory NutritionalScores({
    /// Body weight in kg.
    @JsonKey(name: 'weight_kg') double? weightKg,

    /// Body Mass Index.
    double? bmi,

    /// Serum albumin in g/dL.
    @JsonKey(name: 'albumin_g_dl') double? albuminGDl,

    /// Serum pre-albumin in mg/dL.
    @JsonKey(name: 'prealbumin_mg_dl') double? prealbuminMgDl,

    /// Subjective Global Assessment rating (A/B/C).
    @JsonKey(name: 'sga_rating') String? sgaRating,

    /// Patient-Generated SGA score.
    @JsonKey(name: 'pg_sga_score') int? pgSgaScore,

    /// Mid-upper arm circumference in cm.
    @JsonKey(name: 'muac_cm') double? muacCm,

    /// Percentage of unintentional weight loss.
    @JsonKey(name: 'weight_loss_percent') double? weightLossPercent,
  }) = _NutritionalScores;

  factory NutritionalScores.fromJson(Map<String, dynamic> json) =>
      _$NutritionalScoresFromJson(json);
}

/// Psychological assessment scores.
@freezed
class PsychologicalScores with _$PsychologicalScores {
  const factory PsychologicalScores({
    /// Hospital Anxiety and Depression Scale - Anxiety (0-21).
    @JsonKey(name: 'hads_anxiety') int? hadsAnxiety,

    /// Hospital Anxiety and Depression Scale - Depression (0-21).
    @JsonKey(name: 'hads_depression') int? hadsDepression,

    /// Distress Thermometer (0-10).
    @JsonKey(name: 'distress_thermometer') int? distressThermometer,

    /// Patient Health Questionnaire-9 score (0-27).
    @JsonKey(name: 'phq9_score') int? phq9Score,

    /// Generalized Anxiety Disorder-7 score (0-21).
    @JsonKey(name: 'gad7_score') int? gad7Score,

    /// Patient understanding of surgical procedure.
    @JsonKey(name: 'patient_understanding') String? patientUnderstanding,

    /// Whether patient has expressed fears about surgery.
    @JsonKey(name: 'surgical_anxiety_noted') bool? surgicalAnxietyNoted,
  }) = _PsychologicalScores;

  factory PsychologicalScores.fromJson(Map<String, dynamic> json) =>
      _$PsychologicalScoresFromJson(json);
}

/// Medical clearance assessment scores.
@freezed
class MedicalScores with _$MedicalScores {
  const factory MedicalScores({
    /// Haemoglobin in g/dL.
    @JsonKey(name: 'haemoglobin_g_dl') double? haemoglobinGDl,

    /// Platelet count (x10^3/uL).
    @JsonKey(name: 'platelet_count') int? plateletCount,

    /// International Normalized Ratio.
    double? inr,

    /// Serum creatinine in mg/dL.
    @JsonKey(name: 'creatinine_mg_dl') double? creatinineMgDl,

    /// Blood glucose (fasting) in mg/dL.
    @JsonKey(name: 'fasting_glucose_mg_dl') double? fastingGlucoseMgDl,

    /// Whether ECG is within acceptable limits.
    @JsonKey(name: 'ecg_acceptable') bool? ecgAcceptable,

    /// Whether chest X-ray is within acceptable limits.
    @JsonKey(name: 'cxr_acceptable') bool? cxrAcceptable,

    /// ASA physical status score (1-5).
    @JsonKey(name: 'asa_score') int? asaScore,

    /// Cardiopulmonary clearance received.
    @JsonKey(name: 'cardiopulmonary_clearance') bool? cardiopulmonaryClearance,

    /// Active infections present.
    @JsonKey(name: 'active_infections') List<String>? activeInfections,
  }) = _MedicalScores;

  factory MedicalScores.fromJson(Map<String, dynamic> json) =>
      _$MedicalScoresFromJson(json);
}
