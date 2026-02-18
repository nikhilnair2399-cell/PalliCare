// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';
import 'symptom_log.dart' show SyncStatus;

part 'nutrition_log.freezed.dart';
part 'nutrition_log.g.dart';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Meal type classification.
enum MealType {
  @JsonValue('breakfast')
  breakfast,
  @JsonValue('lunch')
  lunch,
  @JsonValue('dinner')
  dinner,
  @JsonValue('snack')
  snack,
  @JsonValue('supplement')
  supplement,
  @JsonValue('tube_feed')
  tubeFeed,
}

/// Portion size relative to a standard serving.
enum PortionSize {
  @JsonValue('less_than_quarter')
  lessThanQuarter,
  @JsonValue('quarter')
  quarter,
  @JsonValue('half')
  half,
  @JsonValue('three_quarter')
  threeQuarter,
  @JsonValue('full')
  full,
  @JsonValue('more_than_full')
  moreThanFull,
}

/// Appetite score on a 5-point scale.
enum AppetiteScore {
  @JsonValue('none')
  none,
  @JsonValue('poor')
  poor,
  @JsonValue('fair')
  fair,
  @JsonValue('good')
  good,
  @JsonValue('excellent')
  excellent,
}

/// Nausea severity level.
enum NauseaLevel {
  @JsonValue('none')
  none,
  @JsonValue('mild')
  mild,
  @JsonValue('moderate')
  moderate,
  @JsonValue('severe')
  severe,
}

/// Dietary preference or restriction.
enum DietaryPreference {
  @JsonValue('vegetarian')
  vegetarian,
  @JsonValue('non_vegetarian')
  nonVegetarian,
  @JsonValue('vegan')
  vegan,
  @JsonValue('eggetarian')
  eggetarian,
  @JsonValue('jain')
  jain,
  @JsonValue('halal')
  halal,
  @JsonValue('gluten_free')
  glutenFree,
  @JsonValue('lactose_free')
  lactoseFree,
  @JsonValue('diabetic')
  diabetic,
  @JsonValue('renal')
  renal,
  @JsonValue('low_sodium')
  lowSodium,
  @JsonValue('other')
  other,
}

// ---------------------------------------------------------------------------
// Data Models
// ---------------------------------------------------------------------------

/// A single food item consumed during a meal.
@freezed
class FoodItem with _$FoodItem {
  const factory FoodItem({
    /// Name of the food item.
    required String name,

    /// Hindi translation of the food name.
    @JsonKey(name: 'name_hi') String? nameHi,

    /// Estimated protein content in grams.
    @JsonKey(name: 'estimated_protein_g') double? estimatedProteinG,

    /// Estimated calorie content.
    @JsonKey(name: 'estimated_calories') double? estimatedCalories,
  }) = _FoodItem;

  factory FoodItem.fromJson(Map<String, dynamic> json) =>
      _$FoodItemFromJson(json);
}

/// A patient-reported nutrition log entry for a single meal or supplement.
@freezed
class NutritionLog with _$NutritionLog {
  const factory NutritionLog({
    /// Unique log identifier (server-assigned).
    required String id,

    /// Reference to the patient record.
    @JsonKey(name: 'patient_id') required String patientId,

    /// Who logged this entry (patient or caregiver ID).
    @JsonKey(name: 'logged_by') required String loggedBy,

    /// When the meal was consumed.
    required DateTime timestamp,

    /// Type of meal.
    @JsonKey(name: 'meal_type') required MealType mealType,

    /// Individual food items consumed.
    @JsonKey(name: 'food_items') List<FoodItem>? foodItems,

    /// Total estimated protein in grams.
    @JsonKey(name: 'estimated_protein_g') double? estimatedProteinG,

    /// Total estimated calories.
    @JsonKey(name: 'estimated_calories') double? estimatedCalories,

    /// Self-reported appetite score.
    @JsonKey(name: 'appetite_score') AppetiteScore? appetiteScore,

    /// Nausea severity at time of eating.
    @JsonKey(name: 'nausea_level') NauseaLevel? nauseaLevel,

    /// Portion size relative to a standard serving.
    @JsonKey(name: 'portion_size') PortionSize? portionSize,

    /// URL to photo of the meal.
    @JsonKey(name: 'photo_url') String? photoUrl,

    /// Free-text notes.
    String? notes,

    /// Client-generated UUID for offline-first sync.
    @JsonKey(name: 'local_id') String? localId,

    /// Sync status for offline-first architecture.
    @JsonKey(name: 'sync_status') @Default(SyncStatus.pending) SyncStatus syncStatus,
  }) = _NutritionLog;

  factory NutritionLog.fromJson(Map<String, dynamic> json) =>
      _$NutritionLogFromJson(json);
}

/// Clinician-set nutritional targets for prehabilitation.
@freezed
class NutritionTarget with _$NutritionTarget {
  const factory NutritionTarget({
    /// Unique target identifier.
    required String id,

    /// Reference to the patient record.
    @JsonKey(name: 'patient_id') required String patientId,

    /// Reference to the surgical pathway.
    @JsonKey(name: 'pathway_id') required String pathwayId,

    /// Daily protein target in grams.
    @JsonKey(name: 'protein_target_g') double? proteinTargetG,

    /// Daily calorie target.
    @JsonKey(name: 'calorie_target') double? calorieTarget,

    /// Daily hydration target in millilitres.
    @JsonKey(name: 'hydration_target_ml') double? hydrationTargetMl,

    /// Target body weight in kg.
    @JsonKey(name: 'weight_target_kg') double? weightTargetKg,

    /// List of prescribed nutritional supplements.
    List<String>? supplements,

    /// Dietary preferences or restrictions.
    @JsonKey(name: 'dietary_preferences') List<DietaryPreference>? dietaryPreferences,

    /// Record creation timestamp.
    @JsonKey(name: 'created_at') required DateTime createdAt,

    /// Last update timestamp.
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _NutritionTarget;

  factory NutritionTarget.fromJson(Map<String, dynamic> json) =>
      _$NutritionTargetFromJson(json);
}
