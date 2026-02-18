/**
 * PalliCare Nutrition Log & Nutrition Target
 *
 * Schema for patient-reported nutrition logs and clinician-set nutritional
 * targets within the prehabilitation pathway.
 *
 * Generated from: schemas/nutrition_log.schema.json
 */

// ---------------------------------------------------------------------------
// Enums (as union types)
// ---------------------------------------------------------------------------

/** Meal type classification */
export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'supplement'
  | 'tube_feed';

/** Portion size relative to a standard serving */
export type PortionSize =
  | 'less_than_quarter'
  | 'quarter'
  | 'half'
  | 'three_quarter'
  | 'full'
  | 'more_than_full';

/** Appetite score on a 5-point scale */
export type AppetiteScore = 'none' | 'poor' | 'fair' | 'good' | 'excellent';

/** Nausea severity level */
export type NauseaLevel = 'none' | 'mild' | 'moderate' | 'severe';

/** Dietary preference or restriction */
export type DietaryPreference =
  | 'vegetarian'
  | 'non_vegetarian'
  | 'vegan'
  | 'eggetarian'
  | 'jain'
  | 'halal'
  | 'gluten_free'
  | 'lactose_free'
  | 'diabetic'
  | 'renal'
  | 'low_sodium'
  | 'other';

// ---------------------------------------------------------------------------
// Nested interfaces
// ---------------------------------------------------------------------------

/** A single food item consumed during a meal */
export interface FoodItem {
  /** Name of the food item */
  name: string;
  /** Hindi translation of the food name */
  name_hi?: string | null;
  /** Estimated protein content in grams */
  estimated_protein_g?: number | null;
  /** Estimated calorie content */
  estimated_calories?: number | null;
}

// ---------------------------------------------------------------------------
// Root interfaces
// ---------------------------------------------------------------------------

/**
 * A patient-reported nutrition log entry for a single meal or supplement.
 */
export interface NutritionLog {
  id: string;
  patient_id: string;
  /** Who logged this entry (patient or caregiver ID) */
  logged_by: string;
  /** When the meal was consumed (ISO 8601) */
  timestamp: string;
  /** Type of meal */
  meal_type: MealType;
  /** Individual food items consumed */
  food_items?: FoodItem[] | null;
  /** Total estimated protein in grams */
  estimated_protein_g?: number | null;
  /** Total estimated calories */
  estimated_calories?: number | null;
  /** Self-reported appetite score */
  appetite_score?: AppetiteScore | null;
  /** Nausea severity at time of eating */
  nausea_level?: NauseaLevel | null;
  /** Portion size relative to a standard serving */
  portion_size?: PortionSize | null;
  /** URL to photo of the meal */
  photo_url?: string | null;
  /** Free-text notes */
  notes?: string | null;
  /** Client-generated UUID for offline-first sync */
  local_id?: string | null;
  /** Sync status for offline-first architecture */
  sync_status?: 'pending' | 'synced' | 'conflict';
}

/**
 * Clinician-set nutritional targets for prehabilitation.
 */
export interface NutritionTarget {
  id: string;
  patient_id: string;
  /** Reference to the surgical pathway */
  pathway_id: string;
  /** Daily protein target in grams */
  protein_target_g?: number | null;
  /** Daily calorie target */
  calorie_target?: number | null;
  /** Daily hydration target in millilitres */
  hydration_target_ml?: number | null;
  /** Target body weight in kg */
  weight_target_kg?: number | null;
  /** List of prescribed nutritional supplements */
  supplements?: string[] | null;
  /** Dietary preferences or restrictions */
  dietary_preferences?: DietaryPreference[] | null;
  created_at: string;
  updated_at: string;
}
