// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'surgical_pathway.freezed.dart';
part 'surgical_pathway.g.dart';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Type of surgical procedure in a palliative context.
enum ProcedureType {
  @JsonValue('debulking')
  debulking,
  @JsonValue('stenting')
  stenting,
  @JsonValue('fracture_fixation')
  fractureFixation,
  @JsonValue('bowel_obstruction')
  bowelObstruction,
  @JsonValue('tracheostomy')
  tracheostomy,
  @JsonValue('gastrostomy')
  gastrostomy,
  @JsonValue('nephrostomy')
  nephrostomy,
  @JsonValue('pleurodesis')
  pleurodesis,
  @JsonValue('nerve_block')
  nerveBlock,
  @JsonValue('biopsy')
  biopsy,
  @JsonValue('wound_debridement')
  woundDebridement,
  @JsonValue('other')
  other,
}

/// Clinical intent of the surgery.
enum SurgicalIntent {
  @JsonValue('palliative')
  palliative,
  @JsonValue('curative')
  curative,
  @JsonValue('diagnostic')
  diagnostic,
  @JsonValue('emergency')
  emergency,
}

/// Anaesthetic technique used.
enum AnaestheticTechnique {
  @JsonValue('general')
  general,
  @JsonValue('spinal')
  spinal,
  @JsonValue('epidural')
  epidural,
  @JsonValue('regional_block')
  regionalBlock,
  @JsonValue('local')
  local,
  @JsonValue('sedation')
  sedation,
  @JsonValue('combined')
  combined,
}

/// Post-operative patient disposition.
enum PostOpDisposition {
  @JsonValue('icu')
  icu,
  @JsonValue('hdu')
  hdu,
  @JsonValue('ward')
  ward,
  @JsonValue('day_care')
  dayCare,
  @JsonValue('home')
  home,
}

/// Lifecycle status of the surgical pathway.
enum SurgicalPathwayStatus {
  @JsonValue('planned')
  planned,
  @JsonValue('prehab_active')
  prehabActive,
  @JsonValue('pre_op')
  preOp,
  @JsonValue('intra_op')
  intraOp,
  @JsonValue('post_op')
  postOp,
  @JsonValue('discharged')
  discharged,
  @JsonValue('cancelled')
  cancelled,
}

// ---------------------------------------------------------------------------
// Data Model
// ---------------------------------------------------------------------------

/// A surgical pathway representing a planned or completed palliative
/// surgical procedure along with its prehabilitation lifecycle.
@freezed
class SurgicalPathway with _$SurgicalPathway {
  const factory SurgicalPathway({
    /// Unique pathway identifier.
    required String id,

    /// Reference to the patient record.
    @JsonKey(name: 'patient_id') required String patientId,

    /// Name of the planned surgical procedure.
    @JsonKey(name: 'procedure_name') required String procedureName,

    /// Hindi translation of the procedure name.
    @JsonKey(name: 'procedure_name_hi') String? procedureNameHi,

    /// Category of surgical procedure.
    @JsonKey(name: 'procedure_type') required ProcedureType procedureType,

    /// Clinical intent of the surgery.
    @JsonKey(name: 'surgical_intent') required SurgicalIntent surgicalIntent,

    /// Operating surgeon identifier.
    @JsonKey(name: 'surgeon_id') String? surgeonId,

    /// Anaesthesiologist identifier.
    @JsonKey(name: 'anaesthesiologist_id') String? anaesthesiologistId,

    /// Planned surgery date and time.
    @JsonKey(name: 'surgery_date') DateTime? surgeryDate,

    /// Facility where the surgery will take place.
    @JsonKey(name: 'surgery_facility') @Default('AIIMS Bhopal') String surgeryFacility,

    /// ASA physical status score (1-5).
    @JsonKey(name: 'asa_score') int? asaScore,

    /// Estimated prehabilitation days before surgery.
    @JsonKey(name: 'estimated_prehab_days') int? estimatedPrehabDays,

    /// Actual prehabilitation days completed.
    @JsonKey(name: 'actual_prehab_days') int? actualPrehabDays,

    /// Nil per os (fasting) start time.
    @JsonKey(name: 'npo_start_time') DateTime? npoStartTime,

    /// Anaesthetic technique used or planned.
    @JsonKey(name: 'anaesthetic_technique') AnaestheticTechnique? anaestheticTechnique,

    /// Where the patient goes after surgery.
    @JsonKey(name: 'post_op_disposition') PostOpDisposition? postOpDisposition,

    /// Post-operative pain management plan summary.
    @JsonKey(name: 'post_op_pain_plan') String? postOpPainPlan,

    /// Current lifecycle status of the pathway.
    required SurgicalPathwayStatus status,

    /// Reason for cancellation (if cancelled).
    @JsonKey(name: 'cancellation_reason') String? cancellationReason,

    /// Clinician notes on surgical outcomes.
    @JsonKey(name: 'outcome_notes') String? outcomeNotes,

    /// Record creation timestamp.
    @JsonKey(name: 'created_at') required DateTime createdAt,

    /// Last update timestamp.
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _SurgicalPathway;

  factory SurgicalPathway.fromJson(Map<String, dynamic> json) =>
      _$SurgicalPathwayFromJson(json);
}
