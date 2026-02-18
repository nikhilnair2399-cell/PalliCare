// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'doctor_report.freezed.dart';
part 'doctor_report.g.dart';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Pain trend direction based on regression analysis.
enum PainTrend {
  @JsonValue('improving')
  improving,
  @JsonValue('stable')
  stable,
  @JsonValue('worsening')
  worsening,
}

/// Type of medication change during the reporting period.
enum MedicationChangeType {
  @JsonValue('started')
  started,
  @JsonValue('stopped')
  stopped,
  @JsonValue('dose_increased')
  doseIncreased,
  @JsonValue('dose_decreased')
  doseDecreased,
  @JsonValue('frequency_changed')
  frequencyChanged,
}

/// Type of algorithmically detected clinical pattern.
enum PatternType {
  @JsonValue('time_of_day_pattern')
  timeOfDayPattern,
  @JsonValue('day_of_week_pattern')
  dayOfWeekPattern,
  @JsonValue('medication_correlation')
  medicationCorrelation,
  @JsonValue('trigger_correlation')
  triggerCorrelation,
  @JsonValue('sleep_pain_correlation')
  sleepPainCorrelation,
  @JsonValue('mood_pain_correlation')
  moodPainCorrelation,
  @JsonValue('breakthrough_pattern')
  breakthroughPattern,
  @JsonValue('flare_episode')
  flareEpisode,
}

/// Confidence level for a detected pattern.
enum PatternConfidence {
  @JsonValue('low')
  low,
  @JsonValue('moderate')
  moderate,
  @JsonValue('high')
  high,
}

/// Report output format.
enum ReportFormat {
  @JsonValue('json')
  json,
  @JsonValue('pdf')
  pdf,
  @JsonValue('fhir_bundle')
  fhirBundle,
}

/// Method used to share the report with a clinician.
enum ShareMethod {
  @JsonValue('in_app')
  inApp,
  @JsonValue('whatsapp')
  whatsapp,
  @JsonValue('email')
  email,
  @JsonValue('print')
  print,
}

// ---------------------------------------------------------------------------
// Data Models
// ---------------------------------------------------------------------------

/// A one-page doctor visit report generated from patient data.
/// Designed to be consumed in under 60 seconds during a clinical encounter.
@freezed
class DoctorReport with _$DoctorReport {
  const factory DoctorReport({
    /// Unique report identifier.
    required String id,

    /// Reference to the patient.
    @JsonKey(name: 'patient_id') required String patientId,

    /// Reporting period start and end dates.
    @JsonKey(name: 'report_period') required ReportPeriod reportPeriod,

    /// When the report was generated.
    @JsonKey(name: 'generated_at') required DateTime generatedAt,

    /// User who generated the report.
    @JsonKey(name: 'generated_by') String? generatedBy,

    /// Key metrics summary for the reporting period.
    ReportSummary? summary,

    /// Data points for rendering the pain trend chart.
    @JsonKey(name: 'pain_chart_data') List<PainChartPoint>? painChartData,

    /// Medication changes during the reporting period.
    @JsonKey(name: 'medication_changes') List<MedicationChange>? medicationChanges,

    /// Algorithmically detected patterns for clinician review.
    @JsonKey(name: 'notable_patterns') List<NotablePattern>? notablePatterns,

    /// Pain flare episodes detected during the reporting period.
    @JsonKey(name: 'flare_episodes') List<FlareEpisode>? flareEpisodes,

    /// Pre-visit questions logged by patient/caregiver.
    @JsonKey(name: 'patient_questions') List<String>? patientQuestions,

    /// Summary of caregiver-reported observations.
    @JsonKey(name: 'caregiver_observations') String? caregiverObservations,

    /// Report output format.
    @Default(ReportFormat.pdf) ReportFormat? format,

    /// URL to the generated PDF report.
    @JsonKey(name: 'pdf_url') String? pdfUrl,

    /// Clinicians the report has been shared with.
    @JsonKey(name: 'shared_with') List<ReportShare>? sharedWith,
  }) = _DoctorReport;

  factory DoctorReport.fromJson(Map<String, dynamic> json) =>
      _$DoctorReportFromJson(json);
}

/// The date range covered by the report.
@freezed
class ReportPeriod with _$ReportPeriod {
  const factory ReportPeriod({
    /// Period start date.
    @JsonKey(name: 'start_date') required DateTime startDate,

    /// Period end date.
    @JsonKey(name: 'end_date') required DateTime endDate,

    /// Total calendar days in the period.
    @JsonKey(name: 'days_covered') int? daysCovered,

    /// Number of days that have at least one data point.
    @JsonKey(name: 'days_with_data') int? daysWithData,
  }) = _ReportPeriod;

  factory ReportPeriod.fromJson(Map<String, dynamic> json) =>
      _$ReportPeriodFromJson(json);
}

/// Aggregated key metrics for the reporting period.
@freezed
class ReportSummary with _$ReportSummary {
  const factory ReportSummary({
    /// Pain statistics.
    PainSummary? pain,

    /// Medication adherence statistics.
    @JsonKey(name: 'medication_adherence') MedicationAdherenceSummary? medicationAdherence,

    /// MEDD (Morphine Equivalent Daily Dose) summary.
    MeddSummary? medd,

    /// Average ESAS-r scores for the period.
    EsasSummary? esas,

    /// Mood distribution.
    MoodSummary? mood,

    /// Sleep statistics.
    SleepSummary? sleep,
  }) = _ReportSummary;

  factory ReportSummary.fromJson(Map<String, dynamic> json) =>
      _$ReportSummaryFromJson(json);
}

/// Pain statistics for the reporting period.
@freezed
class PainSummary with _$PainSummary {
  const factory PainSummary({
    /// Average pain score over the period.
    double? average,

    /// Minimum pain score recorded.
    int? minimum,

    /// Maximum pain score recorded.
    int? maximum,

    /// Median pain score.
    double? median,

    /// Trend direction based on regression analysis.
    PainTrend? trend,

    /// Percentage change from the previous period.
    @JsonKey(name: 'trend_change_pct') double? trendChangePct,

    /// Average pain from the previous reporting period.
    @JsonKey(name: 'previous_period_average') double? previousPeriodAverage,

    /// Total number of pain log entries.
    @JsonKey(name: 'total_entries') int? totalEntries,

    /// Number of breakthrough pain episodes.
    @JsonKey(name: 'breakthrough_count') int? breakthroughCount,

    /// Days where pain exceeded the patient's target score.
    @JsonKey(name: 'days_above_target') int? daysAboveTarget,

    /// Patient's stated acceptable pain level.
    @JsonKey(name: 'pain_target') int? painTarget,
  }) = _PainSummary;

  factory PainSummary.fromJson(Map<String, dynamic> json) =>
      _$PainSummaryFromJson(json);
}

/// Medication adherence statistics for the reporting period.
@freezed
class MedicationAdherenceSummary with _$MedicationAdherenceSummary {
  const factory MedicationAdherenceSummary({
    /// Overall adherence percentage (0-100).
    @JsonKey(name: 'overall_pct') double? overallPct,

    /// Total scheduled doses in the period.
    @JsonKey(name: 'scheduled_doses') int? scheduledDoses,

    /// Number of doses taken.
    @JsonKey(name: 'taken_doses') int? takenDoses,

    /// Number of missed doses.
    @JsonKey(name: 'missed_doses') int? missedDoses,

    /// Number of skipped doses.
    @JsonKey(name: 'skipped_doses') int? skippedDoses,

    /// Number of PRN doses taken.
    @JsonKey(name: 'prn_doses_taken') int? prnDosesTaken,

    /// Average PRN doses per day.
    @JsonKey(name: 'prn_avg_daily') double? prnAvgDaily,
  }) = _MedicationAdherenceSummary;

  factory MedicationAdherenceSummary.fromJson(Map<String, dynamic> json) =>
      _$MedicationAdherenceSummaryFromJson(json);
}

/// MEDD (Morphine Equivalent Daily Dose) summary.
@freezed
class MeddSummary with _$MeddSummary {
  const factory MeddSummary({
    /// Current total daily MEDD in mg.
    @JsonKey(name: 'current_daily_mg') double? currentDailyMg,

    /// MEDD from the previous reporting period.
    @JsonKey(name: 'previous_period_mg') double? previousPeriodMg,

    /// Percentage change from previous period.
    @JsonKey(name: 'change_pct') double? changePct,

    /// Per-medication MEDD breakdown.
    @JsonKey(name: 'calculation_breakdown') List<MeddBreakdownEntry>? calculationBreakdown,
  }) = _MeddSummary;

  factory MeddSummary.fromJson(Map<String, dynamic> json) =>
      _$MeddSummaryFromJson(json);
}

/// A single medication's contribution to the MEDD total.
@freezed
class MeddBreakdownEntry with _$MeddBreakdownEntry {
  const factory MeddBreakdownEntry({
    /// Medication name.
    @JsonKey(name: 'medication_name') String? medicationName,

    /// Dose description.
    String? dose,

    /// Frequency description.
    String? frequency,

    /// This medication's MEDD contribution in mg.
    @JsonKey(name: 'medd_contribution_mg') double? meddContributionMg,
  }) = _MeddBreakdownEntry;

  factory MeddBreakdownEntry.fromJson(Map<String, dynamic> json) =>
      _$MeddBreakdownEntryFromJson(json);
}

/// Average ESAS-r scores for the reporting period.
@freezed
class EsasSummary with _$EsasSummary {
  const factory EsasSummary({
    double? pain,
    double? tiredness,
    double? nausea,
    double? depression,
    double? anxiety,
    double? drowsiness,
    double? appetite,
    double? wellbeing,
    @JsonKey(name: 'shortness_of_breath') double? shortnessOfBreath,

    /// Name of the worst symptom in the period.
    @JsonKey(name: 'worst_symptom') String? worstSymptom,

    /// Average score for the worst symptom.
    @JsonKey(name: 'worst_symptom_avg') double? worstSymptomAvg,
  }) = _EsasSummary;

  factory EsasSummary.fromJson(Map<String, dynamic> json) =>
      _$EsasSummaryFromJson(json);
}

/// Mood distribution across the reporting period.
@freezed
class MoodSummary with _$MoodSummary {
  const factory MoodSummary({
    /// Count distribution across mood categories.
    MoodDistribution? distribution,

    /// Number of days patient reported being distressed.
    @JsonKey(name: 'distressed_days') int? distressedDays,
  }) = _MoodSummary;

  factory MoodSummary.fromJson(Map<String, dynamic> json) =>
      _$MoodSummaryFromJson(json);
}

/// Count of entries per mood category.
@freezed
class MoodDistribution with _$MoodDistribution {
  const factory MoodDistribution({
    int? great,
    int? good,
    int? okay,
    int? low,
    int? distressed,
  }) = _MoodDistribution;

  factory MoodDistribution.fromJson(Map<String, dynamic> json) =>
      _$MoodDistributionFromJson(json);
}

/// Sleep statistics for the reporting period.
@freezed
class SleepSummary with _$SleepSummary {
  const factory SleepSummary({
    /// Average hours of sleep per night.
    @JsonKey(name: 'average_hours') double? averageHours,

    /// Number of nights with poor sleep.
    @JsonKey(name: 'nights_poor_sleep') int? nightsPoorSleep,

    /// Distribution of sleep quality ratings.
    @JsonKey(name: 'quality_distribution') SleepQualityDistribution? qualityDistribution,
  }) = _SleepSummary;

  factory SleepSummary.fromJson(Map<String, dynamic> json) =>
      _$SleepSummaryFromJson(json);
}

/// Distribution of sleep quality ratings.
@freezed
class SleepQualityDistribution with _$SleepQualityDistribution {
  const factory SleepQualityDistribution({
    int? well,
    int? okay,
    int? poorly,
  }) = _SleepQualityDistribution;

  factory SleepQualityDistribution.fromJson(Map<String, dynamic> json) =>
      _$SleepQualityDistributionFromJson(json);
}

/// A single data point for the pain trend chart.
@freezed
class PainChartPoint with _$PainChartPoint {
  const factory PainChartPoint({
    /// Date for this data point.
    DateTime? date,

    /// Average pain score on this date.
    @JsonKey(name: 'avg_pain') double? avgPain,

    /// Maximum pain score on this date.
    @JsonKey(name: 'max_pain') int? maxPain,

    /// Minimum pain score on this date.
    @JsonKey(name: 'min_pain') int? minPain,

    /// Number of log entries on this date.
    @JsonKey(name: 'entries_count') int? entriesCount,
  }) = _PainChartPoint;

  factory PainChartPoint.fromJson(Map<String, dynamic> json) =>
      _$PainChartPointFromJson(json);
}

/// A medication change event during the reporting period.
@freezed
class MedicationChange with _$MedicationChange {
  const factory MedicationChange({
    /// Date of the change.
    DateTime? date,

    /// Name of the medication.
    @JsonKey(name: 'medication_name') String? medicationName,

    /// Type of change.
    @JsonKey(name: 'change_type') MedicationChangeType? changeType,

    /// Details of the change.
    String? details,
  }) = _MedicationChange;

  factory MedicationChange.fromJson(Map<String, dynamic> json) =>
      _$MedicationChangeFromJson(json);
}

/// An algorithmically detected clinical pattern for clinician review.
@freezed
class NotablePattern with _$NotablePattern {
  const factory NotablePattern({
    /// Type of detected pattern.
    @JsonKey(name: 'pattern_type') PatternType? patternType,

    /// Human-readable description of the pattern.
    String? description,

    /// Confidence level of the detection.
    PatternConfidence? confidence,
  }) = _NotablePattern;

  factory NotablePattern.fromJson(Map<String, dynamic> json) =>
      _$NotablePatternFromJson(json);
}

/// A detected pain flare episode.
@freezed
class FlareEpisode with _$FlareEpisode {
  const factory FlareEpisode({
    /// Start date of the flare episode.
    @JsonKey(name: 'start_date') DateTime? startDate,

    /// End date of the flare episode.
    @JsonKey(name: 'end_date') DateTime? endDate,

    /// Peak pain severity during the episode.
    @JsonKey(name: 'peak_severity') int? peakSeverity,

    /// Duration of the episode in days.
    @JsonKey(name: 'duration_days') int? durationDays,

    /// Trigger reported by the patient.
    @JsonKey(name: 'patient_reported_trigger') String? patientReportedTrigger,
  }) = _FlareEpisode;

  factory FlareEpisode.fromJson(Map<String, dynamic> json) =>
      _$FlareEpisodeFromJson(json);
}

/// A record of sharing the report with a clinician.
@freezed
class ReportShare with _$ReportShare {
  const factory ReportShare({
    /// Clinician identifier.
    @JsonKey(name: 'clinician_id') String? clinicianId,

    /// When the report was shared.
    @JsonKey(name: 'shared_at') DateTime? sharedAt,

    /// How the report was shared.
    ShareMethod? method,
  }) = _ReportShare;

  factory ReportShare.fromJson(Map<String, dynamic> json) =>
      _$ReportShareFromJson(json);
}
