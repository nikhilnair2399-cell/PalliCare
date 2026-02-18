/// PalliCare Flutter data models.
///
/// This barrel file re-exports all domain model classes and enums
/// generated from the PalliCare JSON schemas.
///
/// Usage:
/// ```dart
/// import 'package:pallicare/models/models.dart';
/// ```
library models;

export 'symptom_log.dart';
export 'patient.dart';
export 'medication.dart';
export 'medication_log.dart';
export 'notification.dart';
export 'clinical_alert.dart';
export 'doctor_report.dart';

// ── Prehabilitation ──────────────────────────────────────────────────────────
export 'surgical_pathway.dart';
export 'prehab_assessment.dart';
export 'exercise_plan.dart';
export 'nutrition_log.dart';
export 'advance_directive.dart';
