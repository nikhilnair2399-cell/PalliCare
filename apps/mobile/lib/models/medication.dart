// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'medication.freezed.dart';
part 'medication.g.dart';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Unit of measurement for medication dose.
enum DoseUnit {
  @JsonValue('mg')
  mg,
  @JsonValue('mcg')
  mcg,
  @JsonValue('g')
  g,
  @JsonValue('ml')
  ml,
  @JsonValue('drops')
  drops,
  @JsonValue('puffs')
  puffs,
  @JsonValue('units')
  units,
  @JsonValue('tablets')
  tablets,
  @JsonValue('capsules')
  capsules,
  @JsonValue('patches')
  patches,
}

/// Medication administration frequency.
enum MedicationFrequency {
  @JsonValue('once_daily')
  onceDaily,
  @JsonValue('twice_daily')
  twiceDaily,
  @JsonValue('three_times_daily')
  threeTimesDaily,
  @JsonValue('four_times_daily')
  fourTimesDaily,
  @JsonValue('every_4_hours')
  every4Hours,
  @JsonValue('every_6_hours')
  every6Hours,
  @JsonValue('every_8_hours')
  every8Hours,
  @JsonValue('every_12_hours')
  every12Hours,
  @JsonValue('once_weekly')
  onceWeekly,
  @JsonValue('twice_weekly')
  twiceWeekly,
  @JsonValue('as_needed')
  asNeeded,
  @JsonValue('other')
  other,
}

/// Route of medication administration.
enum MedicationRoute {
  @JsonValue('oral')
  oral,
  @JsonValue('sublingual')
  sublingual,
  @JsonValue('buccal')
  buccal,
  @JsonValue('topical')
  topical,
  @JsonValue('transdermal')
  transdermal,
  @JsonValue('subcutaneous')
  subcutaneous,
  @JsonValue('intramuscular')
  intramuscular,
  @JsonValue('intravenous')
  intravenous,
  @JsonValue('rectal')
  rectal,
  @JsonValue('inhalation')
  inhalation,
  @JsonValue('nasal')
  nasal,
  @JsonValue('ophthalmic')
  ophthalmic,
  @JsonValue('other')
  other,
}

/// WHO analgesic ladder and palliative care medication category.
enum MedicationCategory {
  @JsonValue('opioid')
  opioid,
  @JsonValue('non_opioid_analgesic')
  nonOpioidAnalgesic,
  @JsonValue('adjuvant')
  adjuvant,
  @JsonValue('antiemetic')
  antiemetic,
  @JsonValue('laxative')
  laxative,
  @JsonValue('anxiolytic')
  anxiolytic,
  @JsonValue('antidepressant')
  antidepressant,
  @JsonValue('steroid')
  steroid,
  @JsonValue('other')
  other,
}

/// Time block category for grouped medication display.
enum TimeBlock {
  @JsonValue('morning')
  morning,
  @JsonValue('afternoon')
  afternoon,
  @JsonValue('evening')
  evening,
  @JsonValue('night')
  night,
}

/// Medication status.
enum MedicationStatus {
  @JsonValue('active')
  active,
  @JsonValue('paused')
  paused,
  @JsonValue('discontinued')
  discontinued,
  @JsonValue('completed')
  completed,
}

/// How the medication record was created.
enum MedicationSource {
  @JsonValue('manual_entry')
  manualEntry,
  @JsonValue('abha_import')
  abhaImport,
  @JsonValue('clinician_prescribed')
  clinicianPrescribed,
  @JsonValue('pharmacy_sync')
  pharmacySync,
}

// ---------------------------------------------------------------------------
// Data Models
// ---------------------------------------------------------------------------

/// A medication entry in a patient's regimen, including scheduling,
/// MEDD calculation, and administration tracking.
@freezed
class Medication with _$Medication {
  const factory Medication({
    /// Unique medication identifier.
    required String id,

    /// Reference to the patient.
    @JsonKey(name: 'patient_id') required String patientId,

    /// Brand or generic medication name.
    required String name,

    /// Numeric dose value.
    required double dose,

    /// Unit of measurement for dose.
    @JsonKey(name: 'dose_unit') required DoseUnit doseUnit,

    /// Administration frequency.
    required MedicationFrequency frequency,

    /// Route of administration.
    required MedicationRoute route,

    /// WHO analgesic ladder / palliative care category.
    required MedicationCategory category,

    /// Medication status.
    required MedicationStatus status,

    /// INN / generic name.
    @JsonKey(name: 'generic_name') String? genericName,

    /// Hindi transliteration of the medication name.
    @JsonKey(name: 'name_hindi') String? nameHindi,

    /// Pro re nata (as-needed) medication flag.
    @JsonKey(name: 'is_prn') @Default(false) bool isPrn,

    /// When to take PRN medication.
    @JsonKey(name: 'prn_indication') String? prnIndication,

    /// Maximum number of PRN doses allowed per day.
    @JsonKey(name: 'prn_max_daily_doses') int? prnMaxDailyDoses,

    /// Scheduled administration times.
    List<MedicationScheduleEntry>? schedule,

    /// General instructions for the patient/caregiver.
    String? instructions,

    /// General instructions in Hindi.
    @JsonKey(name: 'instructions_hindi') String? instructionsHindi,

    /// Why this medication is prescribed, in patient-friendly language.
    @JsonKey(name: 'purpose_plain_language') String? purposePlainLanguage,

    /// Purpose in Hindi.
    @JsonKey(name: 'purpose_plain_language_hindi') String? purposePlainLanguageHindi,

    /// Common expected side effects to watch for.
    @JsonKey(name: 'side_effects_common') List<String>? sideEffectsCommon,

    /// Morphine Equivalent Daily Dose calculation data.
    MeddInfo? medd,

    /// WHO analgesic ladder step (1=non-opioid, 2=weak opioid, 3=strong opioid).
    @JsonKey(name: 'who_ladder_step') int? whoLadderStep,

    /// Clinician who prescribed this medication.
    @JsonKey(name: 'prescribed_by') String? prescribedBy,

    /// Start date of the medication.
    @JsonKey(name: 'start_date') DateTime? startDate,

    /// End date (null = ongoing medication).
    @JsonKey(name: 'end_date') DateTime? endDate,

    /// Why medication was stopped.
    @JsonKey(name: 'discontinuation_reason') String? discontinuationReason,

    /// Days before running out to remind about refill.
    @JsonKey(name: 'refill_reminder_days') int? refillReminderDays,

    /// How the medication record was created.
    @Default(MedicationSource.manualEntry) MedicationSource? source,

    /// National List of Essential Medicines reference code.
    @JsonKey(name: 'nlem_code') String? nlemCode,

    /// Record creation timestamp.
    @JsonKey(name: 'created_at') DateTime? createdAt,

    /// Last updated timestamp.
    @JsonKey(name: 'updated_at') DateTime? updatedAt,

    /// Soft delete timestamp.
    @JsonKey(name: 'deleted_at') DateTime? deletedAt,
  }) = _Medication;

  factory Medication.fromJson(Map<String, dynamic> json) =>
      _$MedicationFromJson(json);
}

/// A single scheduled administration time for a medication.
@freezed
class MedicationScheduleEntry with _$MedicationScheduleEntry {
  const factory MedicationScheduleEntry({
    /// Scheduled time in HH:MM format.
    required String time,

    /// Time block category for grouped display.
    @JsonKey(name: 'time_block') TimeBlock? timeBlock,

    /// Whether to take with food.
    @JsonKey(name: 'with_food') @Default(false) bool withFood,

    /// Special instructions (e.g., 'Crush and mix with water').
    @JsonKey(name: 'special_instructions') String? specialInstructions,
  }) = _MedicationScheduleEntry;

  factory MedicationScheduleEntry.fromJson(Map<String, dynamic> json) =>
      _$MedicationScheduleEntryFromJson(json);
}

/// Morphine Equivalent Daily Dose (MEDD) calculation data.
@freezed
class MeddInfo with _$MeddInfo {
  const factory MeddInfo({
    /// Conversion factor to oral morphine equivalent.
    @JsonKey(name: 'conversion_factor') double? conversionFactor,

    /// This medication's contribution to daily MEDD in mg.
    @JsonKey(name: 'daily_medd_mg') double? dailyMeddMg,
  }) = _MeddInfo;

  factory MeddInfo.fromJson(Map<String, dynamic> json) =>
      _$MeddInfoFromJson(json);
}
