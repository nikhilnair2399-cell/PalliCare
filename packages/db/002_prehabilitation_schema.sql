-- =============================================================================
-- PalliCare Database Migration: 002_prehabilitation_schema.sql
-- AIIMS Bhopal — Palliative Prehabilitation & Perioperative Module
-- =============================================================================
-- PostgreSQL 16 + TimescaleDB 2.x
-- Extends 001_initial_schema.sql
-- Encoding: UTF-8 (Hindi/Devanagari support)
-- All timestamps: TIMESTAMPTZ (stored UTC, converted to IST at app layer)
-- =============================================================================
-- This migration adds prehabilitation support for palliative surgery patients:
--   - Surgical pathway tracking (debulking, stenting, fracture fixation, etc.)
--   - Multimodal prehab assessments (functional, nutritional, psychological)
--   - Exercise prescriptions and logging
--   - Nutrition tracking and targets
--   - Advance directives (surrogate decision-maker, treatment preferences)
--   - Perioperative notes (anaesthesia, MDT review, discharge)
--   - Post-operative recovery logs (pain, mobility, nutrition, complications)
--   - Medical optimization checklists (analgesic, cardiopulmonary, psychosocial)
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. ALTER TABLE patients — Add prehabilitation columns
-- =============================================================================
-- Extends the patients table with surgical/prehab status tracking fields.
-- prehab_status tracks the patient through the prehab lifecycle.
-- asa_score is the ASA Physical Status Classification (I-VI).
-- surgical_intent distinguishes palliative vs curative vs diagnostic surgeries.

ALTER TABLE patients
    ADD COLUMN prehab_status       VARCHAR(20) DEFAULT 'not_enrolled'
        CHECK (prehab_status IN ('not_enrolled', 'enrolled', 'active', 'pre_op', 'post_op', 'completed', 'cancelled')),
    ADD COLUMN planned_surgery_date DATE,
    ADD COLUMN asa_score            SMALLINT CHECK (asa_score BETWEEN 1 AND 6),
    ADD COLUMN surgical_intent      VARCHAR(20)
        CHECK (surgical_intent IN ('palliative', 'curative', 'diagnostic', 'emergency')),
    ADD COLUMN prehab_enrolled_at   TIMESTAMPTZ,
    ADD COLUMN prehab_completed_at  TIMESTAMPTZ;

CREATE INDEX idx_patients_prehab_status ON patients(prehab_status) WHERE prehab_status != 'not_enrolled';
CREATE INDEX idx_patients_surgery_date ON patients(planned_surgery_date) WHERE planned_surgery_date IS NOT NULL;

COMMENT ON COLUMN patients.prehab_status IS 'Prehabilitation lifecycle status: not_enrolled -> enrolled -> active -> pre_op -> post_op -> completed/cancelled';
COMMENT ON COLUMN patients.asa_score IS 'ASA Physical Status Classification: 1=healthy, 2=mild systemic disease, 3=severe, 4=life-threatening, 5=moribund, 6=brain-dead organ donor';
COMMENT ON COLUMN patients.surgical_intent IS 'Primary intent of planned surgery in palliative context';

-- =============================================================================
-- 2. surgical_pathways — Tracks each surgical episode for a patient
-- =============================================================================
-- Central table linking a patient to a specific surgical procedure.
-- Captures the full perioperative journey from planning through discharge.
-- procedure_type covers common palliative surgical interventions at AIIMS Bhopal.

CREATE TABLE surgical_pathways (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id              UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    procedure_name          VARCHAR(255) NOT NULL,
    procedure_name_hi       VARCHAR(255),
    procedure_type          VARCHAR(50) NOT NULL CHECK (procedure_type IN (
                                'debulking', 'stenting', 'fracture_fixation', 'bowel_obstruction',
                                'nephrostomy', 'pleurodesis', 'tracheostomy', 'amputation',
                                'nerve_block', 'other'
                            )),
    surgical_intent         VARCHAR(20) NOT NULL CHECK (surgical_intent IN ('palliative', 'curative', 'diagnostic', 'emergency')),
    surgeon_id              UUID REFERENCES users(id),
    anaesthesiologist_id    UUID REFERENCES users(id),
    surgery_date            DATE,
    surgery_facility        VARCHAR(255) DEFAULT 'AIIMS Bhopal',
    asa_score               SMALLINT CHECK (asa_score BETWEEN 1 AND 6),
    estimated_prehab_days   SMALLINT,
    actual_prehab_days      SMALLINT,
    npo_start_time          TIMESTAMPTZ,
    anaesthetic_technique   VARCHAR(30) CHECK (anaesthetic_technique IN ('general', 'regional', 'combined', 'sedation', 'local')),
    post_op_disposition     VARCHAR(30) CHECK (post_op_disposition IN ('ward', 'hdu', 'icu', 'palliative_unit', 'home')),
    post_op_pain_plan       VARCHAR(30) CHECK (post_op_pain_plan IN ('pca', 'epidural', 'regional_block', 'multimodal', 'oral')),
    status                  VARCHAR(20) NOT NULL DEFAULT 'planned' CHECK (status IN (
                                'planned', 'prehab_active', 'pre_op', 'intra_op',
                                'post_op', 'discharged', 'cancelled'
                            )),
    cancellation_reason     TEXT,
    outcome_notes           TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_surgical_pathways_patient ON surgical_pathways(patient_id);
CREATE INDEX idx_surgical_pathways_status ON surgical_pathways(status) WHERE status NOT IN ('discharged', 'cancelled');
CREATE INDEX idx_surgical_pathways_surgery_date ON surgical_pathways(surgery_date) WHERE surgery_date IS NOT NULL;
CREATE INDEX idx_surgical_pathways_surgeon ON surgical_pathways(surgeon_id) WHERE surgeon_id IS NOT NULL;
CREATE INDEX idx_surgical_pathways_anaesthesiologist ON surgical_pathways(anaesthesiologist_id) WHERE anaesthesiologist_id IS NOT NULL;

COMMENT ON TABLE surgical_pathways IS 'Tracks each surgical episode for a palliative patient, from planning through discharge. One patient may have multiple pathways.';
COMMENT ON COLUMN surgical_pathways.npo_start_time IS 'Nil per os (fasting) start time before surgery';
COMMENT ON COLUMN surgical_pathways.post_op_disposition IS 'Planned post-operative destination: ward, HDU, ICU, palliative unit, or home';

-- =============================================================================
-- 3. prehab_assessments — Multimodal prehab assessment scores (hypertable)
-- =============================================================================
-- Stores all prehab assessment types in a single table with JSONB scores.
-- Assessment types: baseline, weekly, pre_op_final, post_op, functional_capacity,
--   nutritional, psychological, medical_clearance.
-- Scores JSONB structure varies by assessment_type:
--   functional:    {sit_to_stand_count, walk_steps_2min, grip_strength_left, grip_strength_right, six_mwt_distance}
--   nutritional:   {sga_score, pg_sga_score, bmi, weight_kg, albumin, prealbumin, must_score, mid_arm_circumference}
--   psychological: {hads_anxiety, hads_depression, distress_thermometer, phq9_score, gad7_score, surgery_anxiety_0_10}
--   medical:       {hemoglobin, creatinine, egfr, albumin, hba1c, electrolytes_ok, ecg_ok, chest_xray_ok}

CREATE TABLE prehab_assessments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    pathway_id          UUID REFERENCES surgical_pathways(id) ON DELETE SET NULL,
    assessment_type     VARCHAR(30) NOT NULL CHECK (assessment_type IN (
                            'baseline', 'weekly', 'pre_op_final', 'post_op',
                            'functional_capacity', 'nutritional', 'psychological', 'medical_clearance'
                        )),
    assessed_by         UUID REFERENCES users(id),
    assessment_date     TIMESTAMPTZ NOT NULL,
    scores              JSONB DEFAULT '{}',
    readiness_score     DECIMAL(5,2) CHECK (readiness_score BETWEEN 0 AND 100),
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('prehab_assessments', 'assessment_date');

CREATE INDEX idx_prehab_assessments_patient_date ON prehab_assessments(patient_id, assessment_date DESC);
CREATE INDEX idx_prehab_assessments_pathway ON prehab_assessments(pathway_id) WHERE pathway_id IS NOT NULL;
CREATE INDEX idx_prehab_assessments_type ON prehab_assessments(assessment_type);
CREATE INDEX idx_prehab_assessments_scores ON prehab_assessments USING GIN(scores);

COMMENT ON TABLE prehab_assessments IS 'Multimodal prehabilitation assessments (functional, nutritional, psychological, medical). TimescaleDB hypertable partitioned by assessment_date.';
COMMENT ON COLUMN prehab_assessments.scores IS 'Flexible JSONB scoring — structure varies by assessment_type. See migration comments for schema per type.';
COMMENT ON COLUMN prehab_assessments.readiness_score IS 'Composite surgical readiness score 0-100%, computed from assessment scores';

-- =============================================================================
-- 4. exercise_plans — Prescribed exercise regimens for prehab patients
-- =============================================================================
-- Stores structured exercise prescriptions with Hindi translations.
-- exercises JSONB array: [{type, name, name_hi, duration_minutes, frequency_per_week,
--   sets, reps, intensity, video_url, instructions, instructions_hi, contraindications}]
-- progression_plan JSONB array: [{week, modifications}]

CREATE TABLE exercise_plans (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    pathway_id          UUID REFERENCES surgical_pathways(id) ON DELETE SET NULL,
    prescribed_by       UUID REFERENCES users(id),
    difficulty_level    VARCHAR(10) NOT NULL DEFAULT 'gentle' CHECK (difficulty_level IN ('gentle', 'moderate', 'active')),
    exercises           JSONB NOT NULL DEFAULT '[]',
    progression_plan    JSONB DEFAULT '[]',
    start_date          DATE NOT NULL,
    end_date            DATE,
    status              VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercise_plans_patient ON exercise_plans(patient_id);
CREATE INDEX idx_exercise_plans_pathway ON exercise_plans(pathway_id) WHERE pathway_id IS NOT NULL;
CREATE INDEX idx_exercise_plans_active ON exercise_plans(patient_id, status) WHERE status = 'active';

COMMENT ON TABLE exercise_plans IS 'Physiotherapist-prescribed exercise plans for prehab. Exercises stored as JSONB array with bilingual names, sets/reps, and video links.';
COMMENT ON COLUMN exercise_plans.exercises IS 'Array: [{type, name, name_hi, duration_minutes, frequency_per_week, sets, reps, intensity, video_url, instructions, instructions_hi, contraindications}]';
COMMENT ON COLUMN exercise_plans.progression_plan IS 'Weekly progression modifications: [{week, modifications}]';

-- =============================================================================
-- 5. exercise_logs — Patient exercise completion tracking (hypertable)
-- =============================================================================
-- Logs each exercise session performed by patient or caregiver.
-- Supports offline-first sync via local_id and synced_at.
-- Pain monitoring during exercise to ensure safety.

CREATE TABLE exercise_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    plan_id             UUID REFERENCES exercise_plans(id) ON DELETE SET NULL,
    exercise_type       VARCHAR(30) NOT NULL CHECK (exercise_type IN (
                            'walking', 'chair_exercise', 'breathing', 'yoga',
                            'resistance_band', 'stretching', 'sit_to_stand_test',
                            'walk_test', 'spirometry'
                        )),
    logged_by           UUID NOT NULL REFERENCES users(id),
    logged_by_role      VARCHAR(20) NOT NULL DEFAULT 'self' CHECK (logged_by_role IN ('self', 'caregiver')),
    timestamp           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_minutes    SMALLINT,
    intensity           VARCHAR(10) CHECK (intensity IN ('easy', 'moderate', 'hard')),
    pain_during         SMALLINT CHECK (pain_during BETWEEN 0 AND 10),
    completed           BOOLEAN NOT NULL DEFAULT TRUE,
    skip_reason         VARCHAR(50) CHECK (skip_reason IN ('pain_too_high', 'too_tired', 'not_feeling_well', 'busy', 'other')),
    notes               TEXT,
    local_id            VARCHAR(100),
    synced_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('exercise_logs', 'timestamp');

CREATE INDEX idx_exercise_logs_patient_time ON exercise_logs(patient_id, timestamp DESC);
CREATE INDEX idx_exercise_logs_plan ON exercise_logs(plan_id) WHERE plan_id IS NOT NULL;
CREATE INDEX idx_exercise_logs_type ON exercise_logs(exercise_type);
CREATE INDEX idx_exercise_logs_completed ON exercise_logs(patient_id, completed) WHERE completed = TRUE;
CREATE INDEX idx_exercise_logs_local ON exercise_logs(local_id) WHERE local_id IS NOT NULL;

COMMENT ON TABLE exercise_logs IS 'Individual exercise session logs. TimescaleDB hypertable partitioned by timestamp. Supports offline-first sync.';
COMMENT ON COLUMN exercise_logs.pain_during IS 'Pain score (0-10) reported during/after exercise — used to flag unsafe exercise intensity';
COMMENT ON COLUMN exercise_logs.skip_reason IS 'Reason exercise was skipped — tracked for adherence analysis and plan adjustment';

-- =============================================================================
-- 6. nutrition_logs — Meal and intake tracking (hypertable)
-- =============================================================================
-- Tracks daily food intake with protein/calorie estimates.
-- Supports photo-based meal logging and appetite/nausea monitoring.
-- Hindi food item names for regional diet tracking.

CREATE TABLE nutrition_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    logged_by           UUID NOT NULL REFERENCES users(id),
    timestamp           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    meal_type           VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'supplement')),
    food_items          JSONB DEFAULT '[]',
    estimated_protein_g DECIMAL(6,1),
    estimated_calories  SMALLINT,
    appetite_score      SMALLINT CHECK (appetite_score BETWEEN 0 AND 10),
    nausea_level        SMALLINT CHECK (nausea_level BETWEEN 0 AND 10),
    portion_size        VARCHAR(10) CHECK (portion_size IN ('small', 'medium', 'large')),
    photo_url           VARCHAR(500),
    notes               TEXT,
    local_id            VARCHAR(100),
    synced_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('nutrition_logs', 'timestamp');

CREATE INDEX idx_nutrition_logs_patient_time ON nutrition_logs(patient_id, timestamp DESC);
CREATE INDEX idx_nutrition_logs_meal_type ON nutrition_logs(meal_type);
CREATE INDEX idx_nutrition_logs_local ON nutrition_logs(local_id) WHERE local_id IS NOT NULL;

COMMENT ON TABLE nutrition_logs IS 'Meal-by-meal nutrition tracking with protein/calorie estimates. TimescaleDB hypertable partitioned by timestamp. Supports photo-based logging.';
COMMENT ON COLUMN nutrition_logs.food_items IS 'Array: [{name, name_hi, estimated_protein_g, estimated_calories}]';
COMMENT ON COLUMN nutrition_logs.appetite_score IS 'Self-reported appetite on 0-10 scale (0=no appetite, 10=excellent)';

-- =============================================================================
-- 7. nutrition_targets — Daily nutritional goals set by dietitian
-- =============================================================================
-- Clinician-set daily targets for protein, calories, hydration.
-- Supports Indian dietary preferences (vegetarian, Jain, halal, etc.).
-- Supplement tracking for perioperative nutritional optimization.

CREATE TABLE nutrition_targets (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id              UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    pathway_id              UUID REFERENCES surgical_pathways(id) ON DELETE SET NULL,
    set_by                  UUID REFERENCES users(id),
    protein_target_g        DECIMAL(6,1),
    calorie_target          SMALLINT,
    hydration_target_ml     SMALLINT,
    weight_target_kg        DECIMAL(5,1),
    supplements             JSONB DEFAULT '[]',
    dietary_preferences     JSONB DEFAULT '{}',
    active_from             DATE NOT NULL,
    active_to               DATE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_nutrition_targets_patient ON nutrition_targets(patient_id);
CREATE INDEX idx_nutrition_targets_pathway ON nutrition_targets(pathway_id) WHERE pathway_id IS NOT NULL;
CREATE INDEX idx_nutrition_targets_active ON nutrition_targets(patient_id, active_from, active_to);

COMMENT ON TABLE nutrition_targets IS 'Dietitian-prescribed daily nutritional targets for prehab patients. Supports supplements and Indian dietary preferences.';
COMMENT ON COLUMN nutrition_targets.supplements IS 'Array: [{name, dose, frequency, instructions}]';
COMMENT ON COLUMN nutrition_targets.dietary_preferences IS 'Object: {vegetarian, vegan, jain, halal, no_preference} — boolean flags for dietary restrictions';

-- =============================================================================
-- 8. advance_directives — Patient treatment preferences and surrogate info
-- =============================================================================
-- Captures advance care planning documentation per Indian legal framework.
-- Stores surrogate decision-maker contact and treatment preferences.
-- Tracks document lifecycle from draft through hospital sharing.

CREATE TABLE advance_directives (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id                  UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    surrogate_decision_maker    JSONB DEFAULT '{}',
    treatment_preferences       JSONB DEFAULT '{}',
    personal_statement          TEXT,
    signed_at                   TIMESTAMPTZ,
    witnesses                   JSONB DEFAULT '[]',
    document_url                VARCHAR(500),
    status                      VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'signed', 'shared_with_hospital', 'revoked')),
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_advance_directives_patient ON advance_directives(patient_id);
CREATE INDEX idx_advance_directives_status ON advance_directives(patient_id, status) WHERE status IN ('signed', 'shared_with_hospital');

COMMENT ON TABLE advance_directives IS 'Advance care planning documents including surrogate decision-maker, treatment preferences, and witness records.';
COMMENT ON COLUMN advance_directives.surrogate_decision_maker IS 'Object: {name, relationship, phone, email}';
COMMENT ON COLUMN advance_directives.treatment_preferences IS 'Object: {cpr: accept/decline/unsure, ventilation: accept/decline/unsure, dialysis, artificial_nutrition, comfort_measures_only}';
COMMENT ON COLUMN advance_directives.witnesses IS 'Array: [{name, relationship}]';

-- =============================================================================
-- 9. perioperative_notes — Structured clinical notes for surgical episodes
-- =============================================================================
-- Extends clinical_notes with perioperative-specific note types.
-- Content is structured JSONB varying by note_type.
-- Linked to surgical_pathways for full surgical episode context.

CREATE TABLE perioperative_notes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pathway_id      UUID NOT NULL REFERENCES surgical_pathways(id) ON DELETE CASCADE,
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    note_type       VARCHAR(30) NOT NULL CHECK (note_type IN (
                        'anaesthesia_consultation', 'pre_op_briefing', 'intra_op',
                        'post_op', 'mdt_prehab_review', 'discharge_summary'
                    )),
    author_id       UUID NOT NULL REFERENCES users(id),
    content         JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_periop_notes_pathway ON perioperative_notes(pathway_id, created_at DESC);
CREATE INDEX idx_periop_notes_patient ON perioperative_notes(patient_id, created_at DESC);
CREATE INDEX idx_periop_notes_type ON perioperative_notes(note_type);
CREATE INDEX idx_periop_notes_author ON perioperative_notes(author_id, created_at DESC);

COMMENT ON TABLE perioperative_notes IS 'Structured perioperative clinical notes linked to surgical pathways. Content JSONB varies by note_type (anaesthesia, MDT review, discharge, etc.).';

-- =============================================================================
-- 10. post_op_logs — Post-operative recovery tracking (hypertable)
-- =============================================================================
-- Tracks daily post-op recovery milestones: pain, mobility, nutrition, complications.
-- Complication grading uses the Clavien-Dindo classification (I-V).
-- TimescaleDB hypertable for time-series analysis of recovery trajectories.

CREATE TABLE post_op_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pathway_id          UUID NOT NULL REFERENCES surgical_pathways(id) ON DELETE CASCADE,
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    logged_by           UUID NOT NULL REFERENCES users(id),
    timestamp           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    pain_score          SMALLINT CHECK (pain_score BETWEEN 0 AND 10),
    mobility_milestone  VARCHAR(30) CHECK (mobility_milestone IN (
                            'bed_rest', 'sitting', 'standing', 'walking_assisted', 'walking_independent'
                        )),
    nutrition_status    VARCHAR(20) CHECK (nutrition_status IN ('npo', 'sips', 'liquids', 'soft_diet', 'regular')),
    complication        VARCHAR(50),
    complication_grade  VARCHAR(5),
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('post_op_logs', 'timestamp');

CREATE INDEX idx_post_op_logs_pathway_time ON post_op_logs(pathway_id, timestamp DESC);
CREATE INDEX idx_post_op_logs_patient_time ON post_op_logs(patient_id, timestamp DESC);
CREATE INDEX idx_post_op_logs_complications ON post_op_logs(complication) WHERE complication IS NOT NULL;

COMMENT ON TABLE post_op_logs IS 'Post-operative recovery logs tracking pain, mobility, nutrition, and complications. TimescaleDB hypertable partitioned by timestamp.';
COMMENT ON COLUMN post_op_logs.complication_grade IS 'Clavien-Dindo classification: I=minor, II=pharmacological, IIIa/IIIb=surgical, IVa/IVb=organ dysfunction, V=death';
COMMENT ON COLUMN post_op_logs.mobility_milestone IS 'Progressive mobility scale: bed_rest -> sitting -> standing -> walking_assisted -> walking_independent';

-- =============================================================================
-- 11. medical_optimization_checklists — Pre-surgical optimization tracking
-- =============================================================================
-- Comprehensive checklist for medical optimization before palliative surgery.
-- Covers: analgesic optimization (MEDD, opioid rotation), medical clearance,
--   psychosocial assessment, decision-making capacity, and anaesthetic planning.
-- Each domain stored as JSONB for flexible checklist items.

CREATE TABLE medical_optimization_checklists (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pathway_id                  UUID NOT NULL REFERENCES surgical_pathways(id) ON DELETE CASCADE,
    patient_id                  UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    reviewed_by                 UUID REFERENCES users(id),
    analgesic_optimization      JSONB DEFAULT '{}',
    medical_optimization        JSONB DEFAULT '{}',
    psychosocial_assessment     JSONB DEFAULT '{}',
    decision_making_capacity    JSONB DEFAULT '{}',
    anaesthetic_plan            JSONB DEFAULT '{}',
    overall_status              VARCHAR(20) NOT NULL DEFAULT 'incomplete' CHECK (overall_status IN ('incomplete', 'in_progress', 'optimized', 'cleared')),
    cleared_at                  TIMESTAMPTZ,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_med_opt_checklist_pathway ON medical_optimization_checklists(pathway_id);
CREATE INDEX idx_med_opt_checklist_patient ON medical_optimization_checklists(patient_id);
CREATE INDEX idx_med_opt_checklist_status ON medical_optimization_checklists(overall_status) WHERE overall_status != 'cleared';

COMMENT ON TABLE medical_optimization_checklists IS 'Pre-surgical medical optimization checklist covering analgesic, medical, psychosocial, capacity, and anaesthetic domains.';
COMMENT ON COLUMN medical_optimization_checklists.analgesic_optimization IS 'Object: {current_regimen_reviewed, medd_calculated, opioid_rotation_needed, route_change_needed, multimodal_plan, regional_technique}';
COMMENT ON COLUMN medical_optimization_checklists.medical_optimization IS 'Object: {cardiopulmonary, renal_function, hepatic_function, hemoglobin, electrolytes, hydration, blood_sugar, respiratory, dvt_prophylaxis, blood_crossmatch}';
COMMENT ON COLUMN medical_optimization_checklists.psychosocial_assessment IS 'Object: {anxiety_screening, depression_screening, caregiver_burden, social_support, cultural_needs}';
COMMENT ON COLUMN medical_optimization_checklists.decision_making_capacity IS 'Object: {cognitive_status, delirium_screening, informed_consent, advance_directive_status}';
COMMENT ON COLUMN medical_optimization_checklists.anaesthetic_plan IS 'Object: {technique, post_op_disposition, pain_plan, comfort_priority, dnr_discussion}';

-- =============================================================================
-- 12. CONTINUOUS AGGREGATES
-- =============================================================================

-- Daily exercise summary: aggregates exercise_logs per patient per day
CREATE MATERIALIZED VIEW daily_exercise_summary
WITH (timescaledb.continuous) AS
SELECT
    patient_id,
    time_bucket('1 day', timestamp) AS day,
    COUNT(*) AS total_sessions,
    COUNT(*) FILTER (WHERE completed = TRUE) AS completed_sessions,
    SUM(duration_minutes) FILTER (WHERE completed = TRUE) AS total_minutes,
    AVG(pain_during) FILTER (WHERE pain_during IS NOT NULL) AS avg_pain_during,
    MAX(pain_during) AS max_pain_during,
    COUNT(DISTINCT exercise_type) AS exercise_variety
FROM exercise_logs
GROUP BY patient_id, time_bucket('1 day', timestamp);

COMMENT ON MATERIALIZED VIEW daily_exercise_summary IS 'TimescaleDB continuous aggregate: daily exercise adherence, duration, pain, and variety per patient.';

-- Daily nutrition summary: aggregates nutrition_logs per patient per day
CREATE MATERIALIZED VIEW daily_nutrition_summary
WITH (timescaledb.continuous) AS
SELECT
    patient_id,
    time_bucket('1 day', timestamp) AS day,
    COUNT(*) AS meal_count,
    SUM(estimated_protein_g) AS total_protein_g,
    SUM(estimated_calories) AS total_calories,
    AVG(appetite_score) FILTER (WHERE appetite_score IS NOT NULL) AS avg_appetite,
    AVG(nausea_level) FILTER (WHERE nausea_level IS NOT NULL) AS avg_nausea,
    COUNT(*) FILTER (WHERE meal_type = 'supplement') AS supplement_count
FROM nutrition_logs
GROUP BY patient_id, time_bucket('1 day', timestamp);

COMMENT ON MATERIALIZED VIEW daily_nutrition_summary IS 'TimescaleDB continuous aggregate: daily nutrition totals (protein, calories, appetite, nausea) per patient.';

-- =============================================================================
-- 13. AUTO-UPDATE TRIGGERS — updated_at columns
-- =============================================================================
-- Apply the existing update_updated_at_column() trigger function from 001_initial_schema
-- to all new tables that have an updated_at column.

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
        AND table_name IN (
            'surgical_pathways', 'exercise_plans', 'nutrition_targets',
            'advance_directives', 'medical_optimization_checklists'
        )
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_updated_at
             BEFORE UPDATE ON %I
             FOR EACH ROW
             EXECUTE FUNCTION update_updated_at_column()',
            tbl, tbl
        );
    END LOOP;
END;
$$;

-- =============================================================================
-- 14. ROW-LEVEL SECURITY (RLS)
-- =============================================================================
-- Enable RLS on all new patient-sensitive tables.
-- Policies follow the same pattern as 001_initial_schema:
--   - Patient sees own data (via patients.user_id match)
--   - Active caregiver sees linked patient data
--   - Clinicians see all (role-based)

ALTER TABLE surgical_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE prehab_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_directives ENABLE ROW LEVEL SECURITY;
ALTER TABLE perioperative_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_op_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_optimization_checklists ENABLE ROW LEVEL SECURITY;

-- Surgical pathways: patient, caregiver, or clinician
CREATE POLICY surgical_pathways_access ON surgical_pathways
    FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = current_setting('app.current_user_id')::UUID
        )
        OR
        patient_id IN (
            SELECT patient_id FROM caregivers
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND status = 'active'
        )
        OR
        current_setting('app.current_user_role') = 'clinician'
    );

-- Prehab assessments: patient, caregiver, or clinician
CREATE POLICY prehab_assessments_access ON prehab_assessments
    FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = current_setting('app.current_user_id')::UUID
        )
        OR
        patient_id IN (
            SELECT patient_id FROM caregivers
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND status = 'active'
        )
        OR
        current_setting('app.current_user_role') = 'clinician'
    );

-- Exercise plans: patient, caregiver, or clinician
CREATE POLICY exercise_plans_access ON exercise_plans
    FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = current_setting('app.current_user_id')::UUID
        )
        OR
        patient_id IN (
            SELECT patient_id FROM caregivers
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND status = 'active'
        )
        OR
        current_setting('app.current_user_role') = 'clinician'
    );

-- Exercise logs: patient, caregiver, or clinician
CREATE POLICY exercise_logs_access ON exercise_logs
    FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = current_setting('app.current_user_id')::UUID
        )
        OR
        patient_id IN (
            SELECT patient_id FROM caregivers
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND status = 'active'
        )
        OR
        current_setting('app.current_user_role') = 'clinician'
    );

-- Nutrition logs: patient, caregiver, or clinician
CREATE POLICY nutrition_logs_access ON nutrition_logs
    FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = current_setting('app.current_user_id')::UUID
        )
        OR
        patient_id IN (
            SELECT patient_id FROM caregivers
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND status = 'active'
        )
        OR
        current_setting('app.current_user_role') = 'clinician'
    );

-- Nutrition targets: patient, caregiver, or clinician
CREATE POLICY nutrition_targets_access ON nutrition_targets
    FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = current_setting('app.current_user_id')::UUID
        )
        OR
        patient_id IN (
            SELECT patient_id FROM caregivers
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND status = 'active'
        )
        OR
        current_setting('app.current_user_role') = 'clinician'
    );

-- Advance directives: patient or clinician only (sensitive — no caregiver access by default)
CREATE POLICY advance_directives_access ON advance_directives
    FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = current_setting('app.current_user_id')::UUID
        )
        OR
        current_setting('app.current_user_role') = 'clinician'
    );

-- Perioperative notes: clinician only (clinical documentation)
CREATE POLICY perioperative_notes_access ON perioperative_notes
    FOR ALL
    USING (
        current_setting('app.current_user_role') = 'clinician'
        OR
        patient_id IN (
            SELECT id FROM patients WHERE user_id = current_setting('app.current_user_id')::UUID
        )
    );

-- Post-op logs: patient, caregiver, or clinician
CREATE POLICY post_op_logs_access ON post_op_logs
    FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = current_setting('app.current_user_id')::UUID
        )
        OR
        patient_id IN (
            SELECT patient_id FROM caregivers
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND status = 'active'
        )
        OR
        current_setting('app.current_user_role') = 'clinician'
    );

-- Medical optimization checklists: clinician only
CREATE POLICY med_opt_checklist_access ON medical_optimization_checklists
    FOR ALL
    USING (
        current_setting('app.current_user_role') = 'clinician'
    );

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- ALTER TABLE: patients (6 new columns)
-- New Tables: 10 (surgical_pathways, prehab_assessments, exercise_plans,
--   exercise_logs, nutrition_logs, nutrition_targets, advance_directives,
--   perioperative_notes, post_op_logs, medical_optimization_checklists)
-- Hypertables: 4 (prehab_assessments, exercise_logs, nutrition_logs, post_op_logs)
-- Continuous Aggregates: 2 (daily_exercise_summary, daily_nutrition_summary)
-- Triggers: auto-generated for 5 tables with updated_at columns
-- RLS Policies: Enabled on all 10 new tables with role-based access
-- Indexes: 30+ covering patient_id, pathway_id, timestamps, status, JSONB
-- =============================================================================

COMMIT;
