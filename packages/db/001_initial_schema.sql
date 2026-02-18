-- =============================================================================
-- PalliCare Database Migration: 001_initial_schema.sql
-- AIIMS Bhopal — Palliative Care & Pain Management Platform
-- =============================================================================
-- PostgreSQL 16 + TimescaleDB 2.x
-- Encoding: UTF-8 (Hindi/Devanagari support)
-- Collation: en_US.utf8
-- All timestamps: TIMESTAMPTZ (stored UTC, converted to IST at app layer)
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- =============================================================================
-- 1. CORE ENTITY TABLES
-- =============================================================================

-- 1.1 users (base identity for all platform users)
CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type              VARCHAR(20) NOT NULL CHECK (type IN ('patient', 'caregiver', 'clinician', 'admin', 'researcher')),
    phone             VARCHAR(15) UNIQUE,
    phone_verified    BOOLEAN NOT NULL DEFAULT FALSE,
    email             VARCHAR(255) UNIQUE,
    email_verified    BOOLEAN NOT NULL DEFAULT FALSE,
    name              VARCHAR(255) NOT NULL,
    name_hi           VARCHAR(255),
    date_of_birth     DATE,
    gender            VARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    language_pref     VARCHAR(10) NOT NULL DEFAULT 'hi' CHECK (language_pref IN ('hi', 'en', 'mr', 'ta', 'bn', 'te', 'ur', 'kn')),
    abha_id           VARCHAR(20) UNIQUE,
    abha_address      VARCHAR(255),
    avatar_url        VARCHAR(500),
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at     TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_users_abha ON users(abha_id) WHERE abha_id IS NOT NULL;
CREATE INDEX idx_users_type ON users(type);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- 1.2 patients (extended patient profile)
CREATE TABLE patients (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    primary_diagnosis       VARCHAR(500) NOT NULL,
    diagnosis_icd10         VARCHAR(10),
    diagnosis_date          DATE,
    secondary_diagnoses     JSONB DEFAULT '[]',
    primary_clinician_id    UUID REFERENCES users(id),
    care_team_ids           UUID[] DEFAULT '{}',
    phase_of_illness        VARCHAR(20) DEFAULT 'stable' CHECK (phase_of_illness IN ('stable', 'unstable', 'deteriorating', 'terminal', 'bereaved')),
    pps_score               SMALLINT CHECK (pps_score BETWEEN 0 AND 100),
    ecog_score              SMALLINT CHECK (ecog_score BETWEEN 0 AND 5),
    code_status             VARCHAR(20) DEFAULT 'full' CHECK (code_status IN ('full', 'dnr', 'comfort_only')),
    care_setting            VARCHAR(20) DEFAULT 'outpatient' CHECK (care_setting IN ('inpatient', 'outpatient', 'home_care', 'hospice')),
    onboarding_stage        VARCHAR(20) DEFAULT 'pending' CHECK (onboarding_stage IN ('pending', 'language', 'profile', 'consent', 'tutorial', 'complete')),
    onboarding_completed_at TIMESTAMPTZ,
    adaptive_complexity     VARCHAR(10) DEFAULT 'simple' CHECK (adaptive_complexity IN ('simple', 'standard', 'detailed')),
    fatigue_mode_enabled    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_patients_user ON patients(user_id);
CREATE INDEX idx_patients_clinician ON patients(primary_clinician_id);
CREATE INDEX idx_patients_phase ON patients(phase_of_illness);
CREATE INDEX idx_patients_care_setting ON patients(care_setting);

-- 1.3 caregivers
CREATE TABLE caregivers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    relationship        VARCHAR(50) NOT NULL,
    permission_level    VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (permission_level IN ('view_only', 'standard', 'full')),
    can_log_symptoms    BOOLEAN NOT NULL DEFAULT TRUE,
    can_manage_meds     BOOLEAN NOT NULL DEFAULT TRUE,
    can_view_legacy     BOOLEAN NOT NULL DEFAULT FALSE,
    can_message_team    BOOLEAN NOT NULL DEFAULT TRUE,
    status              VARCHAR(20) NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'paused', 'removed')),
    invited_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activated_at        TIMESTAMPTZ,
    notification_prefs  JSONB DEFAULT '{"alerts": true, "med_reminders": true, "quiet_start": "22:00", "quiet_end": "07:00"}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, patient_id)
);

CREATE INDEX idx_caregivers_patient ON caregivers(patient_id);
CREATE INDEX idx_caregivers_user ON caregivers(user_id);
CREATE INDEX idx_caregivers_status ON caregivers(status) WHERE status = 'active';

-- 1.4 clinicians
CREATE TABLE clinicians (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    designation             VARCHAR(100) NOT NULL,
    department              VARCHAR(100) NOT NULL DEFAULT 'Palliative Care & Pain Management',
    registration_number     VARCHAR(50),
    role                    VARCHAR(30) NOT NULL CHECK (role IN ('physician', 'nurse', 'psychologist', 'social_worker', 'physiotherapist', 'spiritual_care', 'dietitian', 'research_coordinator', 'admin')),
    can_prescribe           BOOLEAN NOT NULL DEFAULT FALSE,
    can_export_research     BOOLEAN NOT NULL DEFAULT FALSE,
    can_manage_users        BOOLEAN NOT NULL DEFAULT FALSE,
    institutional_email     VARCHAR(255),
    shift_pattern           VARCHAR(20) DEFAULT 'day' CHECK (shift_pattern IN ('day', 'night', 'rotating', 'on_call')),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clinicians_user ON clinicians(user_id);
CREATE INDEX idx_clinicians_role ON clinicians(role);
CREATE INDEX idx_clinicians_department ON clinicians(department);

-- =============================================================================
-- 2. CLINICAL DATA TABLES
-- =============================================================================

-- 2.1 symptom_logs (TimescaleDB hypertable)
CREATE TABLE symptom_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    logged_by           UUID NOT NULL REFERENCES users(id),
    logged_by_role      VARCHAR(20) NOT NULL DEFAULT 'self' CHECK (logged_by_role IN ('self', 'caregiver', 'clinician')),
    log_type            VARCHAR(20) NOT NULL CHECK (log_type IN ('quick', 'full', 'breakthrough', 'voice', 'clinician_assessment')),
    timestamp           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reported_for_time   TIMESTAMPTZ,
    is_retrospective    BOOLEAN NOT NULL DEFAULT FALSE,

    -- Pain
    pain_intensity      SMALLINT CHECK (pain_intensity BETWEEN 0 AND 10),
    pain_locations      JSONB DEFAULT '[]',
    pain_qualities      JSONB DEFAULT '[]',
    aggravators         JSONB DEFAULT '[]',
    relievers           JSONB DEFAULT '[]',
    custom_aggravators  JSONB DEFAULT '[]',
    custom_relievers    JSONB DEFAULT '[]',

    -- ESAS-r
    esas_scores         JSONB DEFAULT '{}',

    -- Mood & Sleep
    mood                VARCHAR(20) CHECK (mood IN ('good', 'calm', 'okay', 'low', 'anxious', 'distressed')),
    sleep_quality       VARCHAR(10) CHECK (sleep_quality IN ('good', 'okay', 'poor')),
    sleep_hours         DECIMAL(3,1) CHECK (sleep_hours BETWEEN 0 AND 24),

    -- Notes & Media
    notes_text          TEXT,
    voice_note_url      VARCHAR(500),
    voice_transcription TEXT,
    photo_urls          JSONB DEFAULT '[]',

    -- Metadata
    data_confidence     VARCHAR(20) DEFAULT 'self_reported' CHECK (data_confidence IN ('self_reported', 'caregiver_observed', 'caregiver_estimated', 'clinician_assessed')),
    input_method        VARCHAR(10) DEFAULT 'touch' CHECK (input_method IN ('touch', 'voice', 'proxy')),
    completeness_score  DECIMAL(3,2) CHECK (completeness_score BETWEEN 0 AND 1),
    app_version         VARCHAR(20),
    device_info         VARCHAR(100),

    -- Sync
    local_id            VARCHAR(100),
    synced_at           TIMESTAMPTZ,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('symptom_logs', 'timestamp');

CREATE INDEX idx_symptom_logs_patient_time ON symptom_logs(patient_id, timestamp DESC);
CREATE INDEX idx_symptom_logs_type ON symptom_logs(log_type);
CREATE INDEX idx_symptom_logs_pain ON symptom_logs(patient_id, pain_intensity) WHERE pain_intensity IS NOT NULL;
CREATE INDEX idx_symptom_logs_local ON symptom_logs(local_id) WHERE local_id IS NOT NULL;

-- Continuous aggregate: daily pain summary
CREATE MATERIALIZED VIEW daily_pain_summary
WITH (timescaledb.continuous) AS
SELECT
    patient_id,
    time_bucket('1 day', timestamp) AS day,
    AVG(pain_intensity) AS avg_pain,
    MAX(pain_intensity) AS max_pain,
    MIN(pain_intensity) AS min_pain,
    COUNT(*) AS entry_count,
    COUNT(*) FILTER (WHERE log_type = 'breakthrough') AS breakthrough_count
FROM symptom_logs
WHERE pain_intensity IS NOT NULL
GROUP BY patient_id, time_bucket('1 day', timestamp);

-- 2.2 body_map_entries
CREATE TABLE body_map_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_id          UUID NOT NULL REFERENCES symptom_logs(id) ON DELETE CASCADE,
    zone_id         VARCHAR(5) NOT NULL,
    zone_name       VARCHAR(50) NOT NULL,
    zone_name_hi    VARCHAR(100),
    intensity       SMALLINT NOT NULL CHECK (intensity BETWEEN 0 AND 10),
    is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
    quality_descriptors JSONB DEFAULT '[]',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_body_map_log ON body_map_entries(log_id);
CREATE INDEX idx_body_map_zone ON body_map_entries(zone_id);

-- 2.3 medications
CREATE TABLE medications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name                VARCHAR(255) NOT NULL,
    generic_name        VARCHAR(255),
    name_hi             VARCHAR(255),
    dose                DECIMAL(10,2) NOT NULL,
    unit                VARCHAR(20) NOT NULL DEFAULT 'mg' CHECK (unit IN ('mg', 'ml', 'mcg', 'g', 'units', 'puffs', 'drops', 'patch')),
    frequency           VARCHAR(30) NOT NULL,
    frequency_display   VARCHAR(100),
    route               VARCHAR(30) NOT NULL DEFAULT 'oral' CHECK (route IN ('oral', 'sublingual', 'transdermal', 'subcutaneous', 'intravenous', 'rectal', 'topical', 'inhalation', 'intramuscular')),
    category            VARCHAR(30) NOT NULL CHECK (category IN ('opioid', 'non_opioid_analgesic', 'adjuvant', 'anti_emetic', 'laxative', 'steroid', 'anxiolytic', 'antibiotic', 'supplement', 'other')),
    is_prn              BOOLEAN NOT NULL DEFAULT FALSE,
    prn_min_interval_minutes SMALLINT,
    schedule_times      JSONB DEFAULT '[]',
    instructions        TEXT,
    instructions_hi     TEXT,
    purpose             TEXT,
    purpose_hi          TEXT,
    side_effect_notes   TEXT,
    side_effect_notes_hi TEXT,
    start_date          DATE NOT NULL,
    end_date            DATE,
    prescribed_by       UUID REFERENCES users(id),
    prescription_id     VARCHAR(100),
    medd_factor         DECIMAL(6,3),
    is_rescue           BOOLEAN NOT NULL DEFAULT FALSE,
    nlem_listed         BOOLEAN,
    status              VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'discontinued', 'completed')),
    discontinued_reason TEXT,
    local_id            VARCHAR(100),
    synced_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_medications_patient ON medications(patient_id);
CREATE INDEX idx_medications_active ON medications(patient_id, status) WHERE status = 'active';
CREATE INDEX idx_medications_category ON medications(category);
CREATE INDEX idx_medications_opioid ON medications(patient_id) WHERE category = 'opioid' AND status = 'active';

-- 2.4 medication_logs (TimescaleDB hypertable)
CREATE TABLE medication_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id       UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    scheduled_time      TIMESTAMPTZ,
    actual_time         TIMESTAMPTZ,
    status              VARCHAR(20) NOT NULL CHECK (status IN ('taken', 'taken_late', 'missed', 'skipped', 'upcoming', 'overdue')),
    administered_by     UUID REFERENCES users(id),
    administered_role   VARCHAR(20) DEFAULT 'self' CHECK (administered_role IN ('self', 'caregiver', 'nurse')),
    notes               TEXT,
    skip_reason         VARCHAR(50),
    snooze_count        SMALLINT DEFAULT 0,
    pain_before         SMALLINT CHECK (pain_before BETWEEN 0 AND 10),
    pain_after          SMALLINT CHECK (pain_after BETWEEN 0 AND 10),
    pain_after_time     TIMESTAMPTZ,
    local_id            VARCHAR(100),
    synced_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('medication_logs', 'created_at');

CREATE INDEX idx_med_logs_medication ON medication_logs(medication_id, created_at DESC);
CREATE INDEX idx_med_logs_patient ON medication_logs(patient_id, created_at DESC);
CREATE INDEX idx_med_logs_status ON medication_logs(status) WHERE status IN ('missed', 'skipped');
CREATE INDEX idx_med_logs_prn ON medication_logs(medication_id) WHERE pain_before IS NOT NULL;

-- 2.5 medication_side_effects
CREATE TABLE medication_side_effects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id   UUID REFERENCES medications(id) ON DELETE SET NULL,
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    effect_type     VARCHAR(50) NOT NULL,
    effect_custom   VARCHAR(255),
    severity        VARCHAR(10) NOT NULL DEFAULT 'mild' CHECK (severity IN ('mild', 'moderate', 'severe')),
    reported_by     UUID NOT NULL REFERENCES users(id),
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_side_effects_patient ON medication_side_effects(patient_id, timestamp DESC);
CREATE INDEX idx_side_effects_medication ON medication_side_effects(medication_id);

-- =============================================================================
-- 3. WELLNESS & JOURNEY TABLES
-- =============================================================================

-- 3.1 goals
CREATE TABLE goals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    category        VARCHAR(20) NOT NULL CHECK (category IN ('physical', 'social', 'coping', 'self_care', 'medical')),
    description     VARCHAR(500) NOT NULL,
    description_hi  VARCHAR(500),
    frequency       VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', '3x_week', 'weekly', 'once')),
    target_count    SMALLINT NOT NULL DEFAULT 1,
    duration_weeks  SMALLINT,
    status          VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_goals_patient ON goals(patient_id);
CREATE INDEX idx_goals_active ON goals(patient_id, status) WHERE status = 'active';

-- 3.2 goal_logs
CREATE TABLE goal_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id     UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    date        DATE NOT NULL,
    completed   BOOLEAN NOT NULL DEFAULT FALSE,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(goal_id, date)
);

CREATE INDEX idx_goal_logs_goal ON goal_logs(goal_id, date DESC);

-- 3.3 gratitude_entries
CREATE TABLE gratitude_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    content         VARCHAR(500) NOT NULL,
    voice_note_url  VARCHAR(500),
    date            DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(patient_id, date)
);

CREATE INDEX idx_gratitude_patient ON gratitude_entries(patient_id, date DESC);

-- 3.4 intentions
CREATE TABLE intentions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    date                DATE NOT NULL DEFAULT CURRENT_DATE,
    content             VARCHAR(300) NOT NULL,
    content_hi          VARCHAR(300),
    source              VARCHAR(20) DEFAULT 'custom' CHECK (source IN ('custom', 'suggestion')),
    completed_status    VARCHAR(20) DEFAULT 'pending' CHECK (completed_status IN ('pending', 'yes', 'partially', 'not_today', 'skipped')),
    completed_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(patient_id, date)
);

CREATE INDEX idx_intentions_patient ON intentions(patient_id, date DESC);

-- 3.5 milestones
CREATE TABLE milestones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    type            VARCHAR(50) NOT NULL,
    message         VARCHAR(255) NOT NULL,
    message_hi      VARCHAR(255),
    emoji           VARCHAR(10),
    triggered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    seen            BOOLEAN NOT NULL DEFAULT FALSE,
    seen_at         TIMESTAMPTZ,
    UNIQUE(patient_id, type)
);

CREATE INDEX idx_milestones_patient ON milestones(patient_id, triggered_at DESC);

-- 3.6 legacy_messages (Dignity Therapy)
CREATE TABLE legacy_messages (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id              UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    recipient_name          VARCHAR(255) NOT NULL,
    recipient_name_hi       VARCHAR(255),
    content                 TEXT,
    voice_note_url          VARCHAR(500),
    voice_duration_seconds  SMALLINT,
    delivery_preference     VARCHAR(20) NOT NULL DEFAULT 'save_private' CHECK (delivery_preference IN ('save_private', 'share_now', 'share_later')),
    shared_with             UUID REFERENCES users(id),
    shared_at               TIMESTAMPTZ,
    status                  VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'saved', 'shared')),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_legacy_patient ON legacy_messages(patient_id);

-- =============================================================================
-- 4. EDUCATION TABLES
-- =============================================================================

-- 4.1 learn_modules
CREATE TABLE learn_modules (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase               SMALLINT NOT NULL CHECK (phase BETWEEN 1 AND 4),
    display_order       SMALLINT NOT NULL,
    title_en            VARCHAR(255) NOT NULL,
    title_hi            VARCHAR(255) NOT NULL,
    description_en      TEXT,
    description_hi      TEXT,
    duration_minutes    SMALLINT NOT NULL,
    content_type        VARCHAR(20) NOT NULL CHECK (content_type IN ('animated', 'interactive', 'story', 'audio', 'reflective', 'practical', 'faq', 'guided', 'video')),
    content_url         VARCHAR(500),
    audio_url_en        VARCHAR(500),
    audio_url_hi        VARCHAR(500),
    thumbnail_url       VARCHAR(500),
    target_audience     VARCHAR(20) NOT NULL DEFAULT 'patient' CHECK (target_audience IN ('patient', 'caregiver', 'both')),
    prerequisite_ids    UUID[] DEFAULT '{}',
    tags                TEXT[] DEFAULT '{}',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(phase, display_order)
);

CREATE INDEX idx_learn_modules_phase ON learn_modules(phase, display_order);
CREATE INDEX idx_learn_modules_audience ON learn_modules(target_audience);

-- 4.2 learn_progress
CREATE TABLE learn_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    module_id       UUID NOT NULL REFERENCES learn_modules(id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
    progress_pct    SMALLINT DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    last_position   JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(patient_id, module_id)
);

CREATE INDEX idx_learn_progress_patient ON learn_progress(patient_id);
CREATE INDEX idx_learn_progress_status ON learn_progress(status) WHERE status IN ('in_progress', 'available');

-- 4.3 breathe_sessions (TimescaleDB hypertable)
CREATE TABLE breathe_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    exercise_type       VARCHAR(30) NOT NULL CHECK (exercise_type IN ('4_7_8', 'box_breathing', 'diaphragmatic', 'anulom_vilom', 'bhramari', 'body_scan', 'loving_kindness', 'guided_imagery', 'progressive_muscle', 'pain_breath')),
    duration_seconds    SMALLINT NOT NULL,
    pre_feeling         VARCHAR(20) CHECK (pre_feeling IN ('tense', 'anxious', 'neutral', 'calm', 'pain')),
    post_feeling        VARCHAR(20) CHECK (post_feeling IN ('tense', 'anxious', 'neutral', 'calm', 'relaxed', 'better')),
    background_sound    VARCHAR(30),
    completed           BOOLEAN NOT NULL DEFAULT TRUE,
    completed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    local_id            VARCHAR(100),
    synced_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('breathe_sessions', 'completed_at');

CREATE INDEX idx_breathe_patient ON breathe_sessions(patient_id, completed_at DESC);

-- =============================================================================
-- 5. CARE COORDINATION TABLES
-- =============================================================================

-- 5.1 care_schedules
CREATE TABLE care_schedules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    caregiver_id    UUID NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_care_schedules_patient ON care_schedules(patient_id, date);
CREATE INDEX idx_care_schedules_caregiver ON care_schedules(caregiver_id, date);

-- 5.2 handover_notes
CREATE TABLE handover_notes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_caregiver_id   UUID NOT NULL REFERENCES users(id),
    to_caregiver_id     UUID REFERENCES users(id),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    content             TEXT NOT NULL,
    voice_note_url      VARCHAR(500),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_handover_patient ON handover_notes(patient_id, created_at DESC);

-- 5.3 messages
CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id       UUID NOT NULL REFERENCES users(id),
    recipient_id    UUID REFERENCES users(id),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    thread_id       UUID,
    content         TEXT,
    message_type    VARCHAR(10) NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'photo', 'system')),
    media_url       VARCHAR(500),
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_patient ON messages(patient_id, created_at DESC);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, created_at DESC) WHERE recipient_id IS NOT NULL;
CREATE INDEX idx_messages_unread ON messages(recipient_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_messages_thread ON messages(thread_id, created_at) WHERE thread_id IS NOT NULL;

-- =============================================================================
-- 6. NOTIFICATION TABLES
-- =============================================================================

-- 6.1 notifications
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            VARCHAR(50) NOT NULL,
    title_en        VARCHAR(255) NOT NULL,
    title_hi        VARCHAR(255),
    body_en         TEXT NOT NULL,
    body_hi         TEXT,
    priority        VARCHAR(10) NOT NULL DEFAULT 'normal' CHECK (priority IN ('critical', 'high', 'normal', 'low')),
    deep_link       VARCHAR(500),
    payload         JSONB DEFAULT '{}',
    channel         VARCHAR(20) NOT NULL DEFAULT 'push' CHECK (channel IN ('push', 'sms', 'whatsapp', 'email', 'in_app')),
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    is_sent         BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at         TIMESTAMPTZ,
    read_at         TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_unsent ON notifications(is_sent, priority) WHERE is_sent = FALSE;

-- 6.2 notification_preferences
CREATE TABLE notification_preferences (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type                VARCHAR(50) NOT NULL,
    enabled             BOOLEAN NOT NULL DEFAULT TRUE,
    channels            TEXT[] DEFAULT '{"push"}',
    quiet_hours_start   TIME DEFAULT '22:00',
    quiet_hours_end     TIME DEFAULT '07:00',
    respect_quiet_hours BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, type)
);

CREATE INDEX idx_notif_prefs_user ON notification_preferences(user_id);

-- =============================================================================
-- 7. CLINICIAN DASHBOARD TABLES
-- =============================================================================

-- 7.1 clinical_notes
CREATE TABLE clinical_notes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinician_id    UUID NOT NULL REFERENCES users(id),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    note_type       VARCHAR(30) NOT NULL CHECK (note_type IN ('progress', 'assessment', 'plan', 'soap', 'handover_sbar', 'mdt_meeting', 'family_meeting', 'phone_consult')),
    content         TEXT NOT NULL,
    structured_data JSONB,
    attachments     JSONB DEFAULT '[]',
    is_addendum     BOOLEAN NOT NULL DEFAULT FALSE,
    parent_note_id  UUID REFERENCES clinical_notes(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clinical_notes_patient ON clinical_notes(patient_id, created_at DESC);
CREATE INDEX idx_clinical_notes_clinician ON clinical_notes(clinician_id, created_at DESC);
CREATE INDEX idx_clinical_notes_type ON clinical_notes(note_type);

-- 7.2 alerts
CREATE TABLE alerts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    type                VARCHAR(15) NOT NULL CHECK (type IN ('critical', 'warning', 'info')),
    trigger_rule        VARCHAR(100) NOT NULL,
    message             TEXT NOT NULL,
    message_hi          TEXT,
    details             JSONB DEFAULT '{}',
    status              VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed', 'escalated')),
    assigned_to         UUID REFERENCES users(id),
    acknowledged_by     UUID REFERENCES users(id),
    acknowledged_at     TIMESTAMPTZ,
    resolved_by         UUID REFERENCES users(id),
    resolved_at         TIMESTAMPTZ,
    resolution_notes    TEXT,
    escalated_to        UUID REFERENCES users(id),
    escalated_at        TIMESTAMPTZ,
    auto_generated      BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_patient ON alerts(patient_id, created_at DESC);
CREATE INDEX idx_alerts_active ON alerts(status, type) WHERE status = 'active';
CREATE INDEX idx_alerts_assigned ON alerts(assigned_to, status) WHERE status = 'active';
CREATE INDEX idx_alerts_critical ON alerts(type, status, created_at DESC) WHERE type = 'critical' AND status = 'active';

-- 7.3 care_plans
CREATE TABLE care_plans (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    created_by          UUID NOT NULL REFERENCES users(id),
    title               VARCHAR(255),
    goals_of_care       TEXT,
    goals               JSONB DEFAULT '[]',
    interventions       JSONB DEFAULT '[]',
    tasks               JSONB DEFAULT '[]',
    review_date         DATE,
    status              VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'under_review', 'completed', 'archived')),
    version             SMALLINT NOT NULL DEFAULT 1,
    previous_version_id UUID REFERENCES care_plans(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_care_plans_patient ON care_plans(patient_id, status) WHERE status = 'active';

-- =============================================================================
-- 8. AUDIT & SYNC TABLES
-- =============================================================================

-- 8.1 audit_log (TimescaleDB hypertable)
CREATE TABLE audit_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    user_role       VARCHAR(30),
    action          VARCHAR(50) NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID,
    details         JSONB DEFAULT '{}',
    ip_address      INET,
    user_agent      VARCHAR(500),
    session_id      VARCHAR(100),
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('audit_log', 'timestamp');

CREATE INDEX idx_audit_user ON audit_log(user_id, timestamp DESC);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id, timestamp DESC);
CREATE INDEX idx_audit_action ON audit_log(action, timestamp DESC);

-- 8.2 sync_queue
CREATE TABLE sync_queue (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id       VARCHAR(100) NOT NULL,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    operation       VARCHAR(10) NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       VARCHAR(100) NOT NULL,
    server_id       UUID,
    payload         JSONB NOT NULL,
    version_vector  JSONB DEFAULT '{}',
    conflict_status VARCHAR(20) DEFAULT 'none' CHECK (conflict_status IN ('none', 'detected', 'resolved_local', 'resolved_server', 'resolved_merge')),
    conflict_detail JSONB,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'synced', 'failed', 'conflict')),
    retry_count     SMALLINT DEFAULT 0,
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    synced_at       TIMESTAMPTZ
);

CREATE INDEX idx_sync_queue_device ON sync_queue(device_id, status, created_at);
CREATE INDEX idx_sync_queue_pending ON sync_queue(status) WHERE status = 'pending';
CREATE INDEX idx_sync_queue_user ON sync_queue(user_id, created_at DESC);

-- =============================================================================
-- 9. SUPPORTING TABLES
-- =============================================================================

-- 9.1 devices
CREATE TABLE devices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id       VARCHAR(100) NOT NULL UNIQUE,
    device_name     VARCHAR(100),
    platform        VARCHAR(10) NOT NULL CHECK (platform IN ('android', 'ios', 'web')),
    os_version      VARCHAR(50),
    app_version     VARCHAR(20),
    fcm_token       VARCHAR(500),
    apns_token      VARCHAR(500),
    last_sync_at    TIMESTAMPTZ,
    last_active_at  TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_user ON devices(user_id);
CREATE INDEX idx_devices_fcm ON devices(fcm_token) WHERE fcm_token IS NOT NULL;

-- 9.2 consent_records (DPDPA 2023 compliance)
CREATE TABLE consent_records (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type        VARCHAR(50) NOT NULL,
    granted             BOOLEAN NOT NULL,
    version             VARCHAR(20) NOT NULL,
    granted_at          TIMESTAMPTZ,
    revoked_at          TIMESTAMPTZ,
    ip_address          INET,
    method              VARCHAR(20) DEFAULT 'in_app' CHECK (method IN ('in_app', 'paper', 'verbal_witnessed')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consent_user ON consent_records(user_id, consent_type);

-- 9.3 medication_database (reference/lookup table)
CREATE TABLE medication_database (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generic_name    VARCHAR(255) NOT NULL,
    brand_names     TEXT[] DEFAULT '{}',
    name_hi         VARCHAR(255),
    category        VARCHAR(30) NOT NULL,
    common_doses    JSONB DEFAULT '[]',
    common_routes   TEXT[] DEFAULT '{}',
    medd_factor     DECIMAL(6,3),
    nlem_listed     BOOLEAN NOT NULL DEFAULT FALSE,
    who_essential   BOOLEAN NOT NULL DEFAULT FALSE,
    common_side_effects TEXT[] DEFAULT '{}',
    interactions    JSONB DEFAULT '[]',
    palliative_use  BOOLEAN NOT NULL DEFAULT FALSE,
    search_vector   TSVECTOR,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_med_db_generic ON medication_database(generic_name);
CREATE INDEX idx_med_db_search ON medication_database USING GIN(search_vector);
CREATE INDEX idx_med_db_palliative ON medication_database(palliative_use) WHERE palliative_use = TRUE;

-- =============================================================================
-- 10. AUTO-UPDATE TRIGGERS
-- =============================================================================

-- Trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables with updated_at column
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
        AND table_name NOT IN ('daily_pain_summary')
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

-- Trigger for medication_database search_vector
CREATE OR REPLACE FUNCTION update_medication_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector = to_tsvector('english',
        COALESCE(NEW.generic_name, '') || ' ' ||
        COALESCE(array_to_string(NEW.brand_names, ' '), '') || ' ' ||
        COALESCE(NEW.name_hi, '') || ' ' ||
        COALESCE(NEW.category, '')
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_medication_db_search
    BEFORE INSERT OR UPDATE ON medication_database
    FOR EACH ROW
    EXECUTE FUNCTION update_medication_search_vector();

-- =============================================================================
-- 11. ROW-LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on patient-sensitive tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Patient can see own data
CREATE POLICY patient_own_data ON patients
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- Symptom logs: patient sees own, caregiver sees linked patient, clinician sees assigned
CREATE POLICY symptom_logs_access ON symptom_logs
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

-- Notifications: user sees only own notifications
CREATE POLICY notifications_own ON notifications
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- Tables: 24
-- Hypertables: 4 (symptom_logs, medication_logs, breathe_sessions, audit_log)
-- Materialized Views: 1 (daily_pain_summary)
-- Triggers: auto-generated for all updated_at columns + medication search
-- RLS Policies: Enabled on 12 tables with example policies
-- =============================================================================
