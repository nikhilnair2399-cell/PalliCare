// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'advance_directive.freezed.dart';
part 'advance_directive.g.dart';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Patient's treatment choice for a specific intervention.
enum TreatmentChoice {
  @JsonValue('want')
  want,
  @JsonValue('do_not_want')
  doNotWant,
  @JsonValue('undecided')
  undecided,
  @JsonValue('discuss_with_doctor')
  discussWithDoctor,
}

/// Status of the advance directive document.
enum DirectiveStatus {
  @JsonValue('draft')
  draft,
  @JsonValue('active')
  active,
  @JsonValue('revoked')
  revoked,
  @JsonValue('superseded')
  superseded,
}

/// Relationship of the surrogate decision maker to the patient.
enum SurrogateRelationship {
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
  @JsonValue('legal_guardian')
  legalGuardian,
  @JsonValue('other')
  other,
}

/// Preferred location for end-of-life care.
enum PreferredCareLocation {
  @JsonValue('home')
  home,
  @JsonValue('hospital')
  hospital,
  @JsonValue('hospice')
  hospice,
  @JsonValue('no_preference')
  noPreference,
}

// ---------------------------------------------------------------------------
// Data Models
// ---------------------------------------------------------------------------

/// A person designated to make medical decisions if the patient is unable.
@freezed
class SurrogateDecisionMaker with _$SurrogateDecisionMaker {
  const factory SurrogateDecisionMaker({
    /// Full name of the surrogate.
    required String name,

    /// Relationship to the patient.
    required SurrogateRelationship relationship,

    /// Contact phone number.
    required String phone,

    /// Contact email address.
    String? email,

    /// Whether this is the primary surrogate decision maker.
    @JsonKey(name: 'is_primary') @Default(false) bool isPrimary,

    /// Whether the surrogate has been informed of their role.
    @Default(false) bool informed,

    /// Date on which the surrogate was informed.
    @JsonKey(name: 'informed_date') DateTime? informedDate,
  }) = _SurrogateDecisionMaker;

  factory SurrogateDecisionMaker.fromJson(Map<String, dynamic> json) =>
      _$SurrogateDecisionMakerFromJson(json);
}

/// Patient preferences for specific life-sustaining treatments.
@freezed
class TreatmentPreferences with _$TreatmentPreferences {
  const factory TreatmentPreferences({
    /// Cardiopulmonary resuscitation.
    TreatmentChoice? cpr,

    /// Mechanical ventilation / intubation.
    @JsonKey(name: 'mechanical_ventilation') TreatmentChoice? mechanicalVentilation,

    /// Artificial nutrition (tube feeding).
    @JsonKey(name: 'artificial_nutrition') TreatmentChoice? artificialNutrition,

    /// Intravenous hydration.
    @JsonKey(name: 'iv_hydration') TreatmentChoice? ivHydration,

    /// Dialysis.
    TreatmentChoice? dialysis,

    /// Blood transfusions.
    @JsonKey(name: 'blood_transfusion') TreatmentChoice? bloodTransfusion,

    /// Antibiotic therapy for infections.
    TreatmentChoice? antibiotics,

    /// ICU admission.
    @JsonKey(name: 'icu_admission') TreatmentChoice? icuAdmission,

    /// Surgical interventions.
    @JsonKey(name: 'surgical_intervention') TreatmentChoice? surgicalIntervention,

    /// Chemotherapy / radiation therapy.
    TreatmentChoice? chemotherapy,

    /// Comfort-focused / palliative sedation.
    @JsonKey(name: 'palliative_sedation') TreatmentChoice? palliativeSedation,

    /// Organ / tissue donation.
    @JsonKey(name: 'organ_donation') TreatmentChoice? organDonation,
  }) = _TreatmentPreferences;

  factory TreatmentPreferences.fromJson(Map<String, dynamic> json) =>
      _$TreatmentPreferencesFromJson(json);
}

/// An advance directive document capturing the patient's wishes
/// for future medical care, surrogate decision makers, and treatment
/// preferences.
@freezed
class AdvanceDirective with _$AdvanceDirective {
  const factory AdvanceDirective({
    /// Unique directive identifier.
    required String id,

    /// Reference to the patient record.
    @JsonKey(name: 'patient_id') required String patientId,

    /// Document status.
    required DirectiveStatus status,

    /// Date the directive was created or signed.
    @JsonKey(name: 'directive_date') required DateTime directiveDate,

    /// Date the directive was last reviewed with the patient.
    @JsonKey(name: 'last_reviewed_date') DateTime? lastReviewedDate,

    /// Clinician who witnessed or facilitated the directive.
    @JsonKey(name: 'witnessed_by') String? witnessedBy,

    /// Designated surrogate decision makers.
    @JsonKey(name: 'surrogate_decision_makers') List<SurrogateDecisionMaker>? surrogateDecisionMakers,

    /// Patient's treatment preferences.
    @JsonKey(name: 'treatment_preferences') TreatmentPreferences? treatmentPreferences,

    /// Preferred location for end-of-life care.
    @JsonKey(name: 'preferred_care_location') PreferredCareLocation? preferredCareLocation,

    /// Patient's personal values statement (free-text).
    @JsonKey(name: 'values_statement') String? valuesStatement,

    /// Spiritual or religious considerations.
    @JsonKey(name: 'spiritual_considerations') String? spiritualConsiderations,

    /// Additional wishes or instructions (free-text).
    @JsonKey(name: 'additional_wishes') String? additionalWishes,

    /// URL to scanned copy of the signed document.
    @JsonKey(name: 'document_url') String? documentUrl,

    /// Record creation timestamp.
    @JsonKey(name: 'created_at') required DateTime createdAt,

    /// Last update timestamp.
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _AdvanceDirective;

  factory AdvanceDirective.fromJson(Map<String, dynamic> json) =>
      _$AdvanceDirectiveFromJson(json);
}
