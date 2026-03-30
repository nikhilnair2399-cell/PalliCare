-- =============================================================================
-- PalliCare Database Migration: 002_privacy_compliance.sql
-- AIIMS Bhopal — Privacy, Compliance & Data Governance Layer
-- =============================================================================
-- PostgreSQL 16 + TimescaleDB 2.x + pgcrypto (already enabled in 001)
-- DPDPA 2023 (Digital Personal Data Protection Act, India) compliance
-- =============================================================================

-- =============================================================================
-- 1. DATA ACCESS LOG (TimescaleDB hypertable)
-- Records all clinical data reads for DPDPA audit trail
-- =============================================================================

CREATE TABLE data_access_log (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accessor_id         UUID NOT NULL REFERENCES users(id),
    accessor_role       VARCHAR(30),
    accessed_user_id    UUID REFERENCES users(id),
    accessed_patient_id UUID REFERENCES patients(id),
    resource_type       VARCHAR(50) NOT NULL,
    resource_id         UUID,
    action              VARCHAR(20) NOT NULL CHECK (action IN ('read', 'list', 'export', 'share', 'break_glass')),
    purpose             VARCHAR(50),
    ip_address          INET,
    user_agent          VARCHAR(500),
    consent_verified    BOOLEAN DEFAULT FALSE,
    timestamp           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('data_access_log', 'timestamp');

CREATE INDEX idx_data_access_accessed_user ON data_access_log(accessed_user_id, timestamp DESC);
CREATE INDEX idx_data_access_accessor ON data_access_log(accessor_id, timestamp DESC);

-- =============================================================================
-- 2. BREAK-GLASS LOG
-- Emergency access records — when clinician overrides normal consent flow
-- =============================================================================

CREATE TABLE break_glass_log (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinician_id        UUID NOT NULL REFERENCES users(id),
    patient_id          UUID NOT NULL REFERENCES patients(id),
    reason              TEXT NOT NULL,
    emergency_type      VARCHAR(50) NOT NULL CHECK (emergency_type IN ('life_threatening', 'unconscious_patient', 'legal_requirement', 'other')),
    approved_by         UUID REFERENCES users(id),
    access_granted_at   TIMESTAMPTZ DEFAULT NOW(),
    access_revoked_at   TIMESTAMPTZ,
    data_accessed       JSONB DEFAULT '[]',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_break_glass_patient ON break_glass_log(patient_id, created_at DESC);

-- =============================================================================
-- 3. PATIENT-CLINICIAN ASSIGNMENTS
-- Formal consent-gated assignments (replaces ad-hoc care_team_ids)
-- =============================================================================

CREATE TABLE patient_clinician_assignments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    clinician_id        UUID NOT NULL REFERENCES users(id),
    assignment_type     VARCHAR(20) NOT NULL CHECK (assignment_type IN ('primary', 'secondary', 'on_call', 'consultant')),
    assigned_by         UUID NOT NULL REFERENCES users(id),
    patient_consent_id  UUID REFERENCES consent_records(id),
    status              VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('pending_consent', 'active', 'revoked', 'transferred')),
    started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at            TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one active assignment per (patient, clinician, type) at a time
CREATE UNIQUE INDEX idx_assignment_active_unique
    ON patient_clinician_assignments(patient_id, clinician_id, assignment_type)
    WHERE status = 'active';

CREATE INDEX idx_assignments_patient_active
    ON patient_clinician_assignments(patient_id)
    WHERE status = 'active';

CREATE INDEX idx_assignments_clinician_active
    ON patient_clinician_assignments(clinician_id)
    WHERE status = 'active';

-- =============================================================================
-- 4. DATA DELETION REQUESTS (DPDPA right to erasure)
-- =============================================================================

CREATE TABLE data_deletion_requests (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id),
    request_type        VARCHAR(30) NOT NULL CHECK (request_type IN ('full_erasure', 'selective_erasure', 'anonymize_only')),
    status              VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected', 'partially_completed')),
    requested_data_types TEXT[] DEFAULT '{}',
    rejection_reason    TEXT,
    processed_by        UUID REFERENCES users(id),
    processed_at        TIMESTAMPTZ,
    retention_exception TEXT,
    acknowledgment_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deletion_requests_user ON data_deletion_requests(user_id);
CREATE INDEX idx_deletion_requests_pending ON data_deletion_requests(status) WHERE status = 'pending';

-- =============================================================================
-- 5. DATA EXPORTS (DPDPA data portability)
-- =============================================================================

CREATE TABLE data_exports (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id),
    export_type         VARCHAR(20) NOT NULL CHECK (export_type IN ('full', 'medical', 'logs', 'fhir')),
    format              VARCHAR(10) NOT NULL CHECK (format IN ('json', 'csv', 'fhir_r4', 'pdf')),
    status              VARCHAR(20) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'ready', 'expired', 'failed')),
    file_url            VARCHAR(500),
    file_size_bytes     BIGINT,
    expires_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_data_exports_user ON data_exports(user_id, created_at DESC);

-- =============================================================================
-- 6. BREACH NOTIFICATIONS (incident response / DPDPA Sec 8)
-- =============================================================================

CREATE TABLE breach_notifications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    detected_at         TIMESTAMPTZ NOT NULL,
    detected_by         UUID REFERENCES users(id),
    breach_type         VARCHAR(50) NOT NULL,
    severity            VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description         TEXT NOT NULL,
    affected_user_count INT,
    affected_data_types TEXT[],
    containment_actions TEXT,
    dpb_notified_at     TIMESTAMPTZ,
    users_notified_at   TIMESTAMPTZ,
    resolution          TEXT,
    status              VARCHAR(20) NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'contained', 'notified', 'resolved')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. CONTENT ATTRIBUTIONS (plagiarism / source tracking)
-- =============================================================================

CREATE TABLE content_attributions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type        VARCHAR(30) NOT NULL CHECK (content_type IN ('learn_module', 'medication_info', 'guideline', 'faq', 'breathing_guide')),
    content_id          UUID,
    source_title        TEXT NOT NULL,
    source_authors      TEXT,
    source_publication  TEXT,
    source_year         SMALLINT,
    source_doi          VARCHAR(100),
    source_url          VARCHAR(500),
    license_type        VARCHAR(50),
    usage_type          VARCHAR(30) NOT NULL CHECK (usage_type IN ('direct_quote', 'adapted', 'summarized', 'original', 'public_domain')),
    attribution_text    TEXT NOT NULL,
    verified_by         UUID REFERENCES users(id),
    verified_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_attr_type_id ON content_attributions(content_type, content_id);

-- =============================================================================
-- 8. ALTER EXISTING TABLES
-- =============================================================================

-- 8a. Extend consent_records with richer metadata
ALTER TABLE consent_records
    ADD COLUMN IF NOT EXISTS purpose             TEXT,
    ADD COLUMN IF NOT EXISTS description_en       TEXT,
    ADD COLUMN IF NOT EXISTS description_hi       TEXT,
    ADD COLUMN IF NOT EXISTS consent_document_version VARCHAR(10),
    ADD COLUMN IF NOT EXISTS witness_name         VARCHAR(255),
    ADD COLUMN IF NOT EXISTS witness_role         VARCHAR(50);

-- 8b. Add phone hash to users for non-reversible lookup
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS phone_hash VARCHAR(64);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_hash
    ON users(phone_hash)
    WHERE phone_hash IS NOT NULL;

-- =============================================================================
-- 9. PII ENCRYPTION / DECRYPTION FUNCTIONS (pgcrypto)
-- =============================================================================

-- Encrypt PII field using AES-256 via pgp_sym_encrypt
CREATE OR REPLACE FUNCTION encrypt_pii(
    plaintext TEXT,
    encryption_key TEXT
)
RETURNS BYTEA AS $$
BEGIN
    IF plaintext IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN pgp_sym_encrypt(plaintext, encryption_key, 'cipher-algo=aes256');
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

-- Decrypt PII field
CREATE OR REPLACE FUNCTION decrypt_pii(
    ciphertext BYTEA,
    encryption_key TEXT
)
RETURNS TEXT AS $$
BEGIN
    IF ciphertext IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN pgp_sym_decrypt(ciphertext, encryption_key);
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'decrypt_pii failed: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

-- Hash phone number for deterministic lookup (SHA-256 with salt)
CREATE OR REPLACE FUNCTION hash_phone(
    phone_number TEXT,
    salt TEXT DEFAULT 'pallicare-phone-salt'
)
RETURNS VARCHAR(64) AS $$
BEGIN
    IF phone_number IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN encode(digest(salt || phone_number, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

-- Anonymize UUID for research export (HMAC-SHA256, truncated)
CREATE OR REPLACE FUNCTION anonymize_id(
    user_uuid UUID,
    research_salt TEXT DEFAULT 'pallicare-research-salt'
)
RETURNS VARCHAR(16) AS $$
BEGIN
    IF user_uuid IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN substring(
        encode(hmac(user_uuid::TEXT, research_salt, 'sha256'), 'hex')
        FROM 1 FOR 16
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

-- =============================================================================
-- 10. ROW-LEVEL SECURITY (RLS) ON NEW TABLES
-- =============================================================================

ALTER TABLE data_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE break_glass_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_clinician_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE breach_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_attributions ENABLE ROW LEVEL SECURITY;

-- data_access_log: only admins and the accessor/accessed user can view
CREATE POLICY data_access_log_admin ON data_access_log
    FOR ALL
    USING (
        current_setting('app.current_user_role', TRUE) IN ('admin', 'researcher')
        OR accessor_id = current_setting('app.current_user_id', TRUE)::UUID
        OR accessed_user_id = current_setting('app.current_user_id', TRUE)::UUID
    );

-- break_glass_log: only admins and the clinician who broke glass
CREATE POLICY break_glass_log_access ON break_glass_log
    FOR ALL
    USING (
        current_setting('app.current_user_role', TRUE) IN ('admin')
        OR clinician_id = current_setting('app.current_user_id', TRUE)::UUID
    );

-- patient_clinician_assignments: patient, assigned clinician, or admin
CREATE POLICY assignments_access ON patient_clinician_assignments
    FOR ALL
    USING (
        current_setting('app.current_user_role', TRUE) = 'admin'
        OR clinician_id = current_setting('app.current_user_id', TRUE)::UUID
        OR patient_id IN (
            SELECT id FROM patients
            WHERE user_id = current_setting('app.current_user_id', TRUE)::UUID
        )
    );

-- data_deletion_requests: own requests or admin
CREATE POLICY deletion_requests_access ON data_deletion_requests
    FOR ALL
    USING (
        user_id = current_setting('app.current_user_id', TRUE)::UUID
        OR current_setting('app.current_user_role', TRUE) = 'admin'
    );

-- data_exports: own exports only
CREATE POLICY data_exports_own ON data_exports
    FOR ALL
    USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);

-- breach_notifications: admin only
CREATE POLICY breach_admin_only ON breach_notifications
    FOR ALL
    USING (current_setting('app.current_user_role', TRUE) = 'admin');

-- content_attributions: readable by all authenticated users
CREATE POLICY content_attr_read ON content_attributions
    FOR SELECT
    USING (TRUE);

CREATE POLICY content_attr_write ON content_attributions
    FOR ALL
    USING (current_setting('app.current_user_role', TRUE) IN ('admin', 'clinician'));

-- =============================================================================
-- 11. AUTO-UPDATE TRIGGERS FOR NEW TABLES
-- =============================================================================
-- Reuse the update_updated_at_column() function from 001_initial_schema.sql

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'patient_clinician_assignments',
            'data_deletion_requests',
            'breach_notifications'
        ])
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
-- MIGRATION COMPLETE: 002_privacy_compliance
-- =============================================================================
-- New tables: 7 (data_access_log, break_glass_log, patient_clinician_assignments,
--                data_deletion_requests, data_exports, breach_notifications,
--                content_attributions)
-- Hypertables: 1 (data_access_log)
-- Altered tables: 2 (consent_records, users)
-- Functions: 4 (encrypt_pii, decrypt_pii, hash_phone, anonymize_id)
-- RLS enabled: 7 tables with role-based policies
-- Triggers: 3 (updated_at on assignments, deletions, breaches)
-- =============================================================================
