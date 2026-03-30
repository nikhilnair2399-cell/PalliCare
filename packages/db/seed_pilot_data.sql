-- =============================================================================
-- PalliCare Pilot Study — Seed Data
-- AIIMS Bhopal — Palliative Care & Pain Management
-- =============================================================================
-- Idempotent: uses INSERT ... ON CONFLICT DO NOTHING
-- Run after 001_initial_schema.sql
-- All timestamps in UTC (IST = UTC + 05:30)
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. FEEDBACK TABLE (required for feedback module)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS feedback (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    screen              VARCHAR(50) NOT NULL,
    rating              SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    category            VARCHAR(30) NOT NULL DEFAULT 'general'
                        CHECK (category IN ('general', 'pain_logging', 'medication', 'ui_ux', 'bug', 'suggestion')),
    text                TEXT,
    client_timestamp    TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_screen ON feedback(screen);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CLINICIAN ACCOUNTS
-- ─────────────────────────────────────────────────────────────────────────────

-- 1a. Palliative Physician
INSERT INTO users (id, type, phone, phone_verified, name, name_hi, gender, language_pref, is_active, created_at, updated_at)
VALUES (
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'clinician',
    '+919876500001',
    TRUE,
    'Dr. Ananya Sharma',
    'डॉ. अनन्या शर्मा',
    'female',
    'en',
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO clinicians (id, user_id, designation, department, registration_number, role, can_prescribe, can_export_research, can_manage_users, institutional_email, created_at, updated_at)
VALUES (
    'c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'Associate Professor',
    'Palliative Care & Pain Management',
    'MCI-MP-54321',
    'physician',
    TRUE,
    TRUE,
    TRUE,
    'ananya.sharma@aiims.edu',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 1b. Palliative Care Nurse
INSERT INTO users (id, type, phone, phone_verified, name, name_hi, gender, language_pref, is_active, created_at, updated_at)
VALUES (
    'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    'clinician',
    '+919876500002',
    TRUE,
    'Priya Patel',
    'प्रिया पटेल',
    'female',
    'hi',
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO clinicians (id, user_id, designation, department, registration_number, role, can_prescribe, can_export_research, can_manage_users, institutional_email, created_at, updated_at)
VALUES (
    'd2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f6a',
    'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    'Senior Nursing Officer',
    'Palliative Care & Pain Management',
    'RN-MP-67890',
    'nurse',
    FALSE,
    FALSE,
    FALSE,
    'priya.patel@aiims.edu',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. TEST PATIENTS (5 anonymized, Indian names, ages 45-75)
-- ─────────────────────────────────────────────────────────────────────────────

-- Patient 1: Rajesh Kumar, 68, lung cancer
INSERT INTO users (id, type, phone, phone_verified, name, name_hi, date_of_birth, gender, language_pref, is_active, created_at, updated_at)
VALUES (
    '11111111-aaaa-4bbb-cccc-dddddddddd01',
    'patient',
    '+919800010001',
    TRUE,
    'Rajesh Kumar',
    'राजेश कुमार',
    '1958-03-15',
    'male',
    'hi',
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, user_id, primary_diagnosis, diagnosis_icd10, diagnosis_date, primary_clinician_id, phase_of_illness, pps_score, ecog_score, care_setting, onboarding_stage, onboarding_completed_at, created_at, updated_at)
VALUES (
    'p1111111-aaaa-4bbb-cccc-dddddddddd01',
    '11111111-aaaa-4bbb-cccc-dddddddddd01',
    'Non-small cell lung cancer, Stage IIIB',
    'C34.1',
    '2025-06-10',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'stable',
    70,
    2,
    'outpatient',
    'complete',
    NOW() - INTERVAL '30 days',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Patient 2: Sunita Devi, 55, breast cancer
INSERT INTO users (id, type, phone, phone_verified, name, name_hi, date_of_birth, gender, language_pref, is_active, created_at, updated_at)
VALUES (
    '11111111-aaaa-4bbb-cccc-dddddddddd02',
    'patient',
    '+919800010002',
    TRUE,
    'Sunita Devi',
    'सुनीता देवी',
    '1971-08-22',
    'female',
    'hi',
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, user_id, primary_diagnosis, diagnosis_icd10, diagnosis_date, primary_clinician_id, phase_of_illness, pps_score, ecog_score, care_setting, onboarding_stage, onboarding_completed_at, created_at, updated_at)
VALUES (
    'p1111111-aaaa-4bbb-cccc-dddddddddd02',
    '11111111-aaaa-4bbb-cccc-dddddddddd02',
    'Invasive ductal carcinoma, Stage IV (metastatic to bone)',
    'C50.9',
    '2025-01-20',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'unstable',
    50,
    3,
    'outpatient',
    'complete',
    NOW() - INTERVAL '28 days',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Patient 3: Mohammed Hussain, 72, head and neck cancer
INSERT INTO users (id, type, phone, phone_verified, name, name_hi, date_of_birth, gender, language_pref, is_active, created_at, updated_at)
VALUES (
    '11111111-aaaa-4bbb-cccc-dddddddddd03',
    'patient',
    '+919800010003',
    TRUE,
    'Mohammed Hussain',
    'मोहम्मद हुसैन',
    '1954-11-05',
    'male',
    'hi',
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, user_id, primary_diagnosis, diagnosis_icd10, diagnosis_date, primary_clinician_id, phase_of_illness, pps_score, ecog_score, care_setting, onboarding_stage, onboarding_completed_at, created_at, updated_at)
VALUES (
    'p1111111-aaaa-4bbb-cccc-dddddddddd03',
    '11111111-aaaa-4bbb-cccc-dddddddddd03',
    'Squamous cell carcinoma of oral cavity, Stage IVA',
    'C06.9',
    '2024-09-12',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'deteriorating',
    40,
    3,
    'home_care',
    'complete',
    NOW() - INTERVAL '25 days',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Patient 4: Lakshmi Iyer, 61, ovarian cancer
INSERT INTO users (id, type, phone, phone_verified, name, name_hi, date_of_birth, gender, language_pref, is_active, created_at, updated_at)
VALUES (
    '11111111-aaaa-4bbb-cccc-dddddddddd04',
    'patient',
    '+919800010004',
    TRUE,
    'Lakshmi Iyer',
    'लक्ष्मी अय्यर',
    '1965-04-18',
    'female',
    'en',
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, user_id, primary_diagnosis, diagnosis_icd10, diagnosis_date, primary_clinician_id, phase_of_illness, pps_score, ecog_score, care_setting, onboarding_stage, onboarding_completed_at, created_at, updated_at)
VALUES (
    'p1111111-aaaa-4bbb-cccc-dddddddddd04',
    '11111111-aaaa-4bbb-cccc-dddddddddd04',
    'High-grade serous ovarian carcinoma, Stage IIIC',
    'C56',
    '2025-04-05',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'stable',
    60,
    2,
    'outpatient',
    'complete',
    NOW() - INTERVAL '20 days',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Patient 5: Arjun Singh, 45, colorectal cancer
INSERT INTO users (id, type, phone, phone_verified, name, name_hi, date_of_birth, gender, language_pref, is_active, created_at, updated_at)
VALUES (
    '11111111-aaaa-4bbb-cccc-dddddddddd05',
    'patient',
    '+919800010005',
    TRUE,
    'Arjun Singh',
    'अर्जुन सिंह',
    '1981-01-30',
    'male',
    'hi',
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, user_id, primary_diagnosis, diagnosis_icd10, diagnosis_date, primary_clinician_id, phase_of_illness, pps_score, ecog_score, care_setting, onboarding_stage, onboarding_completed_at, created_at, updated_at)
VALUES (
    'p1111111-aaaa-4bbb-cccc-dddddddddd05',
    '11111111-aaaa-4bbb-cccc-dddddddddd05',
    'Adenocarcinoma of rectum, Stage IV (hepatic metastases)',
    'C20',
    '2025-08-18',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'unstable',
    50,
    3,
    'outpatient',
    'complete',
    NOW() - INTERVAL '14 days',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. MEDICATION REGIMENS (WHO Analgesic Ladder)
-- ─────────────────────────────────────────────────────────────────────────────

-- === Patient 1 (Rajesh Kumar) — WHO Step 2: Tramadol + Paracetamol ===

INSERT INTO medications (id, patient_id, name, generic_name, name_hi, dose, unit, frequency, frequency_display, route, category, is_prn, schedule_times, instructions, instructions_hi, purpose, purpose_hi, start_date, prescribed_by, status, created_at, updated_at)
VALUES
(
    'm1111111-aaaa-4bbb-cccc-000000000001',
    'p1111111-aaaa-4bbb-cccc-dddddddddd01',
    'Paracetamol 500mg',
    'Paracetamol',
    'पैरासिटामोल 500mg',
    500, 'mg', 'QID', 'Every 6 hours',
    'oral', 'non_opioid_analgesic', FALSE,
    '["06:00","12:00","18:00","00:00"]',
    'Take with or after food. Do not exceed 4g/day.',
    'खाने के साथ या बाद में लें। दिन में 4g से अधिक न लें।',
    'Pain relief (WHO Step 1)',
    'दर्द से राहत (WHO चरण 1)',
    '2025-11-01',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
),
(
    'm1111111-aaaa-4bbb-cccc-000000000002',
    'p1111111-aaaa-4bbb-cccc-dddddddddd01',
    'Tramadol 50mg',
    'Tramadol',
    'ट्रामाडोल 50mg',
    50, 'mg', 'TID', 'Every 8 hours',
    'oral', 'opioid', FALSE,
    '["08:00","16:00","00:00"]',
    'Take with food. May cause drowsiness.',
    'खाने के साथ लें। नींद आ सकती है।',
    'Moderate pain relief (WHO Step 2)',
    'मध्यम दर्द से राहत (WHO चरण 2)',
    '2025-11-15',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- === Patient 2 (Sunita Devi) — WHO Step 3: Morphine + Paracetamol + Laxative ===

INSERT INTO medications (id, patient_id, name, generic_name, name_hi, dose, unit, frequency, frequency_display, route, category, is_prn, schedule_times, instructions, instructions_hi, purpose, purpose_hi, start_date, prescribed_by, status, created_at, updated_at)
VALUES
(
    'm1111111-aaaa-4bbb-cccc-000000000003',
    'p1111111-aaaa-4bbb-cccc-dddddddddd02',
    'Morphine Oral Solution 10mg',
    'Morphine Sulfate',
    'मॉर्फीन ओरल 10mg',
    10, 'mg', 'Q4H', 'Every 4 hours',
    'oral', 'opioid', FALSE,
    '["06:00","10:00","14:00","18:00","22:00"]',
    'Take with water. Keep a dose diary. Report excessive drowsiness.',
    'पानी के साथ लें। खुराक डायरी रखें। अत्यधिक नींद की रिपोर्ट करें।',
    'Severe pain relief (WHO Step 3)',
    'गंभीर दर्द से राहत (WHO चरण 3)',
    '2025-10-01',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
),
(
    'm1111111-aaaa-4bbb-cccc-000000000004',
    'p1111111-aaaa-4bbb-cccc-dddddddddd02',
    'Morphine Rescue 5mg',
    'Morphine Sulfate',
    'मॉर्फीन रेस्क्यू 5mg',
    5, 'mg', 'PRN', 'As needed (max every 2 hours)',
    'oral', 'opioid', TRUE,
    '[]',
    'Take for breakthrough pain. Wait at least 2 hours between doses.',
    'तीव्र दर्द के लिए लें। दो खुराकों के बीच कम से कम 2 घंटे का अंतर रखें।',
    'Breakthrough pain rescue',
    'तीव्र दर्द बचाव',
    '2025-10-01',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
),
(
    'm1111111-aaaa-4bbb-cccc-000000000005',
    'p1111111-aaaa-4bbb-cccc-dddddddddd02',
    'Paracetamol 1000mg',
    'Paracetamol',
    'पैरासिटामोल 1000mg',
    1000, 'mg', 'TID', 'Every 8 hours',
    'oral', 'non_opioid_analgesic', FALSE,
    '["06:00","14:00","22:00"]',
    'Take with food.',
    'खाने के साथ लें।',
    'Adjunct pain relief (WHO Step 1)',
    'सहायक दर्द राहत (WHO चरण 1)',
    '2025-10-01',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
),
(
    'm1111111-aaaa-4bbb-cccc-000000000006',
    'p1111111-aaaa-4bbb-cccc-dddddddddd02',
    'Bisacodyl 10mg',
    'Bisacodyl',
    'बिसाकोडिल 10mg',
    10, 'mg', 'OD', 'Once daily at bedtime',
    'oral', 'laxative', FALSE,
    '["21:00"]',
    'Take at bedtime. Essential with opioid therapy.',
    'सोने से पहले लें। ओपिओइड थेरेपी के साथ आवश्यक।',
    'Prevent opioid-induced constipation',
    'ओपिओइड से होने वाली कब्ज की रोकथाम',
    '2025-10-01',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- === Patient 3 (Mohammed Hussain) — WHO Step 3: Morphine + Adjuvants ===

INSERT INTO medications (id, patient_id, name, generic_name, name_hi, dose, unit, frequency, frequency_display, route, category, is_prn, schedule_times, instructions, instructions_hi, purpose, purpose_hi, start_date, prescribed_by, status, created_at, updated_at)
VALUES
(
    'm1111111-aaaa-4bbb-cccc-000000000007',
    'p1111111-aaaa-4bbb-cccc-dddddddddd03',
    'Morphine Oral Solution 15mg',
    'Morphine Sulfate',
    'मॉर्फीन ओरल 15mg',
    15, 'mg', 'Q4H', 'Every 4 hours',
    'oral', 'opioid', FALSE,
    '["06:00","10:00","14:00","18:00","22:00"]',
    'Take with water. Oral mucositis may make swallowing difficult — report to nurse.',
    'पानी के साथ लें। मुंह के छालों से निगलने में कठिनाई हो तो नर्स को बताएं।',
    'Severe pain relief (WHO Step 3)',
    'गंभीर दर्द से राहत (WHO चरण 3)',
    '2025-09-15',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
),
(
    'm1111111-aaaa-4bbb-cccc-000000000008',
    'p1111111-aaaa-4bbb-cccc-dddddddddd03',
    'Gabapentin 300mg',
    'Gabapentin',
    'गैबापेंटिन 300mg',
    300, 'mg', 'TID', 'Every 8 hours',
    'oral', 'adjuvant', FALSE,
    '["08:00","16:00","00:00"]',
    'For neuropathic pain. May cause dizziness.',
    'न्यूरोपैथिक दर्द के लिए। चक्कर आ सकते हैं।',
    'Neuropathic pain adjuvant',
    'न्यूरोपैथिक दर्द सहायक',
    '2025-09-20',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
),
(
    'm1111111-aaaa-4bbb-cccc-000000000009',
    'p1111111-aaaa-4bbb-cccc-dddddddddd03',
    'Lactulose 15ml',
    'Lactulose',
    'लैक्टुलोज 15ml',
    15, 'ml', 'BID', 'Twice daily',
    'oral', 'laxative', FALSE,
    '["08:00","20:00"]',
    'Mix with water or juice.',
    'पानी या जूस में मिलाकर लें।',
    'Prevent opioid-induced constipation',
    'ओपिओइड से होने वाली कब्ज की रोकथाम',
    '2025-09-15',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- === Patient 4 (Lakshmi Iyer) — WHO Step 2: Tramadol + Paracetamol ===

INSERT INTO medications (id, patient_id, name, generic_name, name_hi, dose, unit, frequency, frequency_display, route, category, is_prn, schedule_times, instructions, instructions_hi, purpose, purpose_hi, start_date, prescribed_by, status, created_at, updated_at)
VALUES
(
    'm1111111-aaaa-4bbb-cccc-000000000010',
    'p1111111-aaaa-4bbb-cccc-dddddddddd04',
    'Tramadol SR 100mg',
    'Tramadol',
    'ट्रामाडोल SR 100mg',
    100, 'mg', 'BID', 'Twice daily',
    'oral', 'opioid', FALSE,
    '["08:00","20:00"]',
    'Swallow whole, do not crush. Take with food.',
    'पूरी गोली निगलें, कुचलें नहीं। खाने के साथ लें।',
    'Moderate pain relief (WHO Step 2)',
    'मध्यम दर्द से राहत (WHO चरण 2)',
    '2025-11-10',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
),
(
    'm1111111-aaaa-4bbb-cccc-000000000011',
    'p1111111-aaaa-4bbb-cccc-dddddddddd04',
    'Paracetamol 650mg',
    'Paracetamol',
    'पैरासिटामोल 650mg',
    650, 'mg', 'TID', 'Every 8 hours',
    'oral', 'non_opioid_analgesic', FALSE,
    '["06:00","14:00","22:00"]',
    'Take after food.',
    'खाने के बाद लें।',
    'Pain relief (WHO Step 1)',
    'दर्द से राहत (WHO चरण 1)',
    '2025-11-10',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
),
(
    'm1111111-aaaa-4bbb-cccc-000000000012',
    'p1111111-aaaa-4bbb-cccc-dddddddddd04',
    'Ondansetron 4mg',
    'Ondansetron',
    'ऑन्डेनसेट्रॉन 4mg',
    4, 'mg', 'PRN', 'As needed for nausea (max 3x/day)',
    'oral', 'anti_emetic', TRUE,
    '[]',
    'Take 30 minutes before chemotherapy or as needed for nausea.',
    'कीमोथेरेपी से 30 मिनट पहले या मतली होने पर लें।',
    'Anti-nausea',
    'मतली-रोधी',
    '2025-11-10',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- === Patient 5 (Arjun Singh) — WHO Step 1: Paracetamol (mild pain, recent diagnosis) ===

INSERT INTO medications (id, patient_id, name, generic_name, name_hi, dose, unit, frequency, frequency_display, route, category, is_prn, schedule_times, instructions, instructions_hi, purpose, purpose_hi, start_date, prescribed_by, status, created_at, updated_at)
VALUES
(
    'm1111111-aaaa-4bbb-cccc-000000000013',
    'p1111111-aaaa-4bbb-cccc-dddddddddd05',
    'Paracetamol 1000mg',
    'Paracetamol',
    'पैरासिटामोल 1000mg',
    1000, 'mg', 'TID', 'Every 8 hours',
    'oral', 'non_opioid_analgesic', FALSE,
    '["06:00","14:00","22:00"]',
    'Take with food. Do not exceed 3g/day.',
    'खाने के साथ लें। दिन में 3g से अधिक न लें।',
    'Mild pain relief (WHO Step 1)',
    'हल्के दर्द से राहत (WHO चरण 1)',
    '2025-12-01',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
),
(
    'm1111111-aaaa-4bbb-cccc-000000000014',
    'p1111111-aaaa-4bbb-cccc-dddddddddd05',
    'Dexamethasone 4mg',
    'Dexamethasone',
    'डेक्सामेथासोन 4mg',
    4, 'mg', 'OD', 'Once daily (morning)',
    'oral', 'steroid', FALSE,
    '["08:00"]',
    'Take in the morning with food. Do not stop suddenly.',
    'सुबह खाने के साथ लें। अचानक बंद न करें।',
    'Anti-inflammatory / appetite stimulant',
    'सूजन-रोधी / भूख बढ़ाने वाला',
    '2025-12-01',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'active',
    NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. SYMPTOM LOGS (7 days per patient, 2 logs/day)
--    Using NOW() - INTERVAL offsets for relative timestamps.
--    Pain scores follow realistic trajectories per WHO ladder step.
-- ─────────────────────────────────────────────────────────────────────────────

-- Helper: Each patient gets 14 entries (days -7 through -1, morning + evening)

-- === Patient 1 (Rajesh, WHO Step 2, moderate pain 3-5) ===
INSERT INTO symptom_logs (id, patient_id, logged_by, logged_by_role, log_type, timestamp, pain_intensity, mood, sleep_quality, sleep_hours, esas_scores, notes_text, input_method, created_at)
VALUES
('sl000001-aaaa-4bbb-cccc-000000000001', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '7 days' + INTERVAL '7 hours', 4, 'okay',   'okay', 6.5, '{"tiredness":4,"nausea":1,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '7 days'),
('sl000001-aaaa-4bbb-cccc-000000000002', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '7 days' + INTERVAL '19 hours', 5, 'low',    'poor', NULL, '{"tiredness":5,"nausea":2,"appetite":2}', 'दर्द शाम को बढ़ गया', 'touch', NOW() - INTERVAL '7 days'),
('sl000001-aaaa-4bbb-cccc-000000000003', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '6 days' + INTERVAL '7 hours', 3, 'okay',   'okay', 7.0, '{"tiredness":3,"nausea":1,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '6 days'),
('sl000001-aaaa-4bbb-cccc-000000000004', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '6 days' + INTERVAL '19 hours', 4, 'okay',   'okay', NULL, '{"tiredness":4,"nausea":1,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '6 days'),
('sl000001-aaaa-4bbb-cccc-000000000005', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '5 days' + INTERVAL '7 hours', 3, 'good',   'good', 7.5, '{"tiredness":2,"nausea":0,"appetite":4}', NULL, 'touch', NOW() - INTERVAL '5 days'),
('sl000001-aaaa-4bbb-cccc-000000000006', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '5 days' + INTERVAL '19 hours', 4, 'okay',   'okay', NULL, '{"tiredness":3,"nausea":1,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '5 days'),
('sl000001-aaaa-4bbb-cccc-000000000007', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '4 days' + INTERVAL '7 hours', 4, 'okay',   'poor', 5.5, '{"tiredness":5,"nausea":2,"appetite":2}', 'रात में नींद नहीं आई', 'touch', NOW() - INTERVAL '4 days'),
('sl000001-aaaa-4bbb-cccc-000000000008', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '4 days' + INTERVAL '19 hours', 5, 'low',    'poor', NULL, '{"tiredness":5,"nausea":2,"appetite":2}', NULL, 'touch', NOW() - INTERVAL '4 days'),
('sl000001-aaaa-4bbb-cccc-000000000009', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '3 days' + INTERVAL '7 hours', 3, 'okay',   'okay', 7.0, '{"tiredness":3,"nausea":1,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '3 days'),
('sl000001-aaaa-4bbb-cccc-000000000010', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '3 days' + INTERVAL '19 hours', 4, 'okay',   'okay', NULL, '{"tiredness":3,"nausea":1,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '3 days'),
('sl000001-aaaa-4bbb-cccc-000000000011', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '2 days' + INTERVAL '7 hours', 3, 'good',   'good', 7.5, '{"tiredness":2,"nausea":0,"appetite":4}', NULL, 'touch', NOW() - INTERVAL '2 days'),
('sl000001-aaaa-4bbb-cccc-000000000012', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '2 days' + INTERVAL '19 hours', 3, 'good',   'good', NULL, '{"tiredness":2,"nausea":0,"appetite":4}', 'दवाई से आराम मिल रहा है', 'touch', NOW() - INTERVAL '2 days'),
('sl000001-aaaa-4bbb-cccc-000000000013', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '1 day'  + INTERVAL '7 hours', 3, 'good',   'good', 7.0, '{"tiredness":2,"nausea":0,"appetite":4}', NULL, 'touch', NOW() - INTERVAL '1 day'),
('sl000001-aaaa-4bbb-cccc-000000000014', 'p1111111-aaaa-4bbb-cccc-dddddddddd01', '11111111-aaaa-4bbb-cccc-dddddddddd01', 'self', 'quick', NOW() - INTERVAL '1 day'  + INTERVAL '19 hours', 4, 'okay',   'okay', NULL, '{"tiredness":3,"nausea":1,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- === Patient 2 (Sunita, WHO Step 3, severe pain 5-8, bone mets) ===
INSERT INTO symptom_logs (id, patient_id, logged_by, logged_by_role, log_type, timestamp, pain_intensity, mood, sleep_quality, sleep_hours, esas_scores, notes_text, input_method, created_at)
VALUES
('sl000002-aaaa-4bbb-cccc-000000000001', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'full', NOW() - INTERVAL '7 days' + INTERVAL '7 hours', 7, 'anxious',  'poor', 4.0, '{"tiredness":7,"nausea":4,"appetite":2,"drowsiness":5}', 'हड्डियों में बहुत दर्द', 'touch', NOW() - INTERVAL '7 days'),
('sl000002-aaaa-4bbb-cccc-000000000002', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '7 days' + INTERVAL '19 hours', 8, 'distressed', 'poor', NULL, '{"tiredness":8,"nausea":5,"appetite":1}', NULL, 'touch', NOW() - INTERVAL '7 days'),
('sl000002-aaaa-4bbb-cccc-000000000003', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '6 days' + INTERVAL '7 hours', 6, 'low',      'okay', 5.5, '{"tiredness":6,"nausea":3,"appetite":2}', 'मॉर्फीन से थोड़ा आराम', 'touch', NOW() - INTERVAL '6 days'),
('sl000002-aaaa-4bbb-cccc-000000000004', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '6 days' + INTERVAL '19 hours', 7, 'anxious',  'poor', NULL, '{"tiredness":7,"nausea":4,"appetite":2}', NULL, 'touch', NOW() - INTERVAL '6 days'),
('sl000002-aaaa-4bbb-cccc-000000000005', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '5 days' + INTERVAL '7 hours', 6, 'okay',     'okay', 6.0, '{"tiredness":5,"nausea":3,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '5 days'),
('sl000002-aaaa-4bbb-cccc-000000000006', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'breakthrough', NOW() - INTERVAL '5 days' + INTERVAL '15 hours', 8, 'distressed', 'poor', NULL, '{"tiredness":7,"nausea":4}', 'Breakthrough pain — took rescue dose', 'touch', NOW() - INTERVAL '5 days'),
('sl000002-aaaa-4bbb-cccc-000000000007', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '4 days' + INTERVAL '7 hours', 5, 'okay',     'okay', 6.5, '{"tiredness":5,"nausea":2,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '4 days'),
('sl000002-aaaa-4bbb-cccc-000000000008', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '4 days' + INTERVAL '19 hours', 6, 'low',      'okay', NULL, '{"tiredness":6,"nausea":3,"appetite":2}', NULL, 'touch', NOW() - INTERVAL '4 days'),
('sl000002-aaaa-4bbb-cccc-000000000009', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '3 days' + INTERVAL '7 hours', 5, 'okay',     'good', 7.0, '{"tiredness":4,"nausea":2,"appetite":3}', 'दर्द कम हो रहा है', 'touch', NOW() - INTERVAL '3 days'),
('sl000002-aaaa-4bbb-cccc-000000000010', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '3 days' + INTERVAL '19 hours', 6, 'okay',     'okay', NULL, '{"tiredness":5,"nausea":2,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '3 days'),
('sl000002-aaaa-4bbb-cccc-000000000011', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '2 days' + INTERVAL '7 hours', 5, 'okay',     'okay', 6.0, '{"tiredness":5,"nausea":2,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '2 days'),
('sl000002-aaaa-4bbb-cccc-000000000012', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '2 days' + INTERVAL '19 hours', 6, 'low',      'poor', NULL, '{"tiredness":6,"nausea":3,"appetite":2}', NULL, 'touch', NOW() - INTERVAL '2 days'),
('sl000002-aaaa-4bbb-cccc-000000000013', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '1 day'  + INTERVAL '7 hours', 5, 'okay',     'okay', 6.5, '{"tiredness":5,"nausea":2,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '1 day'),
('sl000002-aaaa-4bbb-cccc-000000000014', 'p1111111-aaaa-4bbb-cccc-dddddddddd02', '11111111-aaaa-4bbb-cccc-dddddddddd02', 'self', 'quick', NOW() - INTERVAL '1 day'  + INTERVAL '19 hours', 6, 'okay',     'okay', NULL, '{"tiredness":5,"nausea":2,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- === Patient 3 (Mohammed, WHO Step 3, oral cancer, pain 5-9) ===
INSERT INTO symptom_logs (id, patient_id, logged_by, logged_by_role, log_type, timestamp, pain_intensity, mood, sleep_quality, sleep_hours, esas_scores, notes_text, input_method, created_at)
VALUES
('sl000003-aaaa-4bbb-cccc-000000000001', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '7 days' + INTERVAL '7 hours', 7, 'low',       'poor', 4.5, '{"tiredness":7,"nausea":3,"appetite":1,"drowsiness":6}', 'मुंह में बहुत दर्द, खाना नहीं खा पा रहा', 'touch', NOW() - INTERVAL '7 days'),
('sl000003-aaaa-4bbb-cccc-000000000002', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '7 days' + INTERVAL '19 hours', 8, 'distressed','poor', NULL, '{"tiredness":8,"nausea":4,"appetite":1}', NULL, 'touch', NOW() - INTERVAL '7 days'),
('sl000003-aaaa-4bbb-cccc-000000000003', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '6 days' + INTERVAL '7 hours', 7, 'low',       'poor', 5.0, '{"tiredness":7,"nausea":3,"appetite":1}', NULL, 'touch', NOW() - INTERVAL '6 days'),
('sl000003-aaaa-4bbb-cccc-000000000004', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '6 days' + INTERVAL '19 hours', 8, 'anxious',   'poor', NULL, '{"tiredness":8,"nausea":4,"appetite":1}', NULL, 'touch', NOW() - INTERVAL '6 days'),
('sl000003-aaaa-4bbb-cccc-000000000005', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '5 days' + INTERVAL '7 hours', 6, 'okay',      'okay', 5.5, '{"tiredness":6,"nausea":2,"appetite":2}', 'गैबापेंटिन शुरू किया, थोड़ा बेहतर', 'touch', NOW() - INTERVAL '5 days'),
('sl000003-aaaa-4bbb-cccc-000000000006', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '5 days' + INTERVAL '19 hours', 7, 'low',       'poor', NULL, '{"tiredness":7,"nausea":3,"appetite":1}', NULL, 'touch', NOW() - INTERVAL '5 days'),
('sl000003-aaaa-4bbb-cccc-000000000007', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '4 days' + INTERVAL '7 hours', 6, 'okay',      'okay', 6.0, '{"tiredness":5,"nausea":2,"appetite":2}', NULL, 'touch', NOW() - INTERVAL '4 days'),
('sl000003-aaaa-4bbb-cccc-000000000008', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'breakthrough', NOW() - INTERVAL '4 days' + INTERVAL '14 hours', 9, 'distressed','poor', NULL, '{"tiredness":8,"nausea":5}', 'Severe breakthrough while eating', 'touch', NOW() - INTERVAL '4 days'),
('sl000003-aaaa-4bbb-cccc-000000000009', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '3 days' + INTERVAL '7 hours', 6, 'okay',      'okay', 5.5, '{"tiredness":6,"nausea":2,"appetite":2}', NULL, 'touch', NOW() - INTERVAL '3 days'),
('sl000003-aaaa-4bbb-cccc-000000000010', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '3 days' + INTERVAL '19 hours', 7, 'low',       'poor', NULL, '{"tiredness":7,"nausea":3,"appetite":1}', NULL, 'touch', NOW() - INTERVAL '3 days'),
('sl000003-aaaa-4bbb-cccc-000000000011', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '2 days' + INTERVAL '7 hours', 5, 'okay',      'okay', 6.5, '{"tiredness":5,"nausea":2,"appetite":2}', 'दवाई से कुछ आराम', 'touch', NOW() - INTERVAL '2 days'),
('sl000003-aaaa-4bbb-cccc-000000000012', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '2 days' + INTERVAL '19 hours', 6, 'okay',      'okay', NULL, '{"tiredness":6,"nausea":2,"appetite":2}', NULL, 'touch', NOW() - INTERVAL '2 days'),
('sl000003-aaaa-4bbb-cccc-000000000013', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '1 day'  + INTERVAL '7 hours', 5, 'okay',      'okay', 6.0, '{"tiredness":5,"nausea":2,"appetite":2}', NULL, 'touch', NOW() - INTERVAL '1 day'),
('sl000003-aaaa-4bbb-cccc-000000000014', 'p1111111-aaaa-4bbb-cccc-dddddddddd03', '11111111-aaaa-4bbb-cccc-dddddddddd03', 'self', 'quick', NOW() - INTERVAL '1 day'  + INTERVAL '19 hours', 7, 'low',       'poor', NULL, '{"tiredness":7,"nausea":3,"appetite":1}', NULL, 'touch', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- === Patient 4 (Lakshmi, WHO Step 2, moderate pain 3-6) ===
INSERT INTO symptom_logs (id, patient_id, logged_by, logged_by_role, log_type, timestamp, pain_intensity, mood, sleep_quality, sleep_hours, esas_scores, notes_text, input_method, created_at)
VALUES
('sl000004-aaaa-4bbb-cccc-000000000001', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '7 days' + INTERVAL '7 hours', 4, 'okay',   'okay', 6.0, '{"tiredness":4,"nausea":3,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '7 days'),
('sl000004-aaaa-4bbb-cccc-000000000002', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '7 days' + INTERVAL '19 hours', 5, 'low',    'poor', NULL, '{"tiredness":5,"nausea":4,"appetite":2}', 'Nausea from chemo side effects', 'touch', NOW() - INTERVAL '7 days'),
('sl000004-aaaa-4bbb-cccc-000000000003', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '6 days' + INTERVAL '7 hours', 4, 'okay',   'okay', 6.5, '{"tiredness":4,"nausea":2,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '6 days'),
('sl000004-aaaa-4bbb-cccc-000000000004', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '6 days' + INTERVAL '19 hours', 5, 'okay',   'okay', NULL, '{"tiredness":4,"nausea":3,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '6 days'),
('sl000004-aaaa-4bbb-cccc-000000000005', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '5 days' + INTERVAL '7 hours', 3, 'good',   'good', 7.5, '{"tiredness":3,"nausea":1,"appetite":4}', 'Feeling better today', 'touch', NOW() - INTERVAL '5 days'),
('sl000004-aaaa-4bbb-cccc-000000000006', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '5 days' + INTERVAL '19 hours', 4, 'okay',   'okay', NULL, '{"tiredness":3,"nausea":2,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '5 days'),
('sl000004-aaaa-4bbb-cccc-000000000007', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '4 days' + INTERVAL '7 hours', 3, 'good',   'good', 7.0, '{"tiredness":3,"nausea":1,"appetite":4}', NULL, 'touch', NOW() - INTERVAL '4 days'),
('sl000004-aaaa-4bbb-cccc-000000000008', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '4 days' + INTERVAL '19 hours', 4, 'okay',   'okay', NULL, '{"tiredness":4,"nausea":2,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '4 days'),
('sl000004-aaaa-4bbb-cccc-000000000009', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '3 days' + INTERVAL '7 hours', 3, 'good',   'good', 7.5, '{"tiredness":2,"nausea":1,"appetite":4}', NULL, 'touch', NOW() - INTERVAL '3 days'),
('sl000004-aaaa-4bbb-cccc-000000000010', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '3 days' + INTERVAL '19 hours', 4, 'okay',   'okay', NULL, '{"tiredness":3,"nausea":2,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '3 days'),
('sl000004-aaaa-4bbb-cccc-000000000011', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '2 days' + INTERVAL '7 hours', 4, 'okay',   'okay', 6.5, '{"tiredness":4,"nausea":2,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '2 days'),
('sl000004-aaaa-4bbb-cccc-000000000012', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '2 days' + INTERVAL '19 hours', 5, 'low',    'poor', NULL, '{"tiredness":5,"nausea":4,"appetite":2}', 'Nausea returned after chemo', 'touch', NOW() - INTERVAL '2 days'),
('sl000004-aaaa-4bbb-cccc-000000000013', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '1 day'  + INTERVAL '7 hours', 4, 'okay',   'okay', 6.0, '{"tiredness":4,"nausea":3,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '1 day'),
('sl000004-aaaa-4bbb-cccc-000000000014', 'p1111111-aaaa-4bbb-cccc-dddddddddd04', '11111111-aaaa-4bbb-cccc-dddddddddd04', 'self', 'quick', NOW() - INTERVAL '1 day'  + INTERVAL '19 hours', 4, 'okay',   'okay', NULL, '{"tiredness":4,"nausea":2,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- === Patient 5 (Arjun, WHO Step 1, mild pain 2-4, recent diagnosis) ===
INSERT INTO symptom_logs (id, patient_id, logged_by, logged_by_role, log_type, timestamp, pain_intensity, mood, sleep_quality, sleep_hours, esas_scores, notes_text, input_method, created_at)
VALUES
('sl000005-aaaa-4bbb-cccc-000000000001', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '7 days' + INTERVAL '7 hours', 3, 'anxious', 'poor', 5.0, '{"tiredness":3,"nausea":1,"appetite":3}', 'चिंता हो रही है diagnosis के बारे में', 'touch', NOW() - INTERVAL '7 days'),
('sl000005-aaaa-4bbb-cccc-000000000002', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '7 days' + INTERVAL '19 hours', 3, 'anxious', 'poor', NULL, '{"tiredness":4,"nausea":1,"appetite":3}', NULL, 'touch', NOW() - INTERVAL '7 days'),
('sl000005-aaaa-4bbb-cccc-000000000003', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '6 days' + INTERVAL '7 hours', 2, 'okay',    'okay', 6.5, '{"tiredness":3,"nausea":0,"appetite":4}', NULL, 'touch', NOW() - INTERVAL '6 days'),
('sl000005-aaaa-4bbb-cccc-000000000004', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '6 days' + INTERVAL '19 hours', 3, 'okay',    'okay', NULL, '{"tiredness":3,"nausea":0,"appetite":4}', NULL, 'touch', NOW() - INTERVAL '6 days'),
('sl000005-aaaa-4bbb-cccc-000000000005', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '5 days' + INTERVAL '7 hours', 2, 'good',    'good', 7.0, '{"tiredness":2,"nausea":0,"appetite":5}', 'पैरासिटामोल से आराम मिल रहा है', 'touch', NOW() - INTERVAL '5 days'),
('sl000005-aaaa-4bbb-cccc-000000000006', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '5 days' + INTERVAL '19 hours', 2, 'good',    'good', NULL, '{"tiredness":2,"nausea":0,"appetite":5}', NULL, 'touch', NOW() - INTERVAL '5 days'),
('sl000005-aaaa-4bbb-cccc-000000000007', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '4 days' + INTERVAL '7 hours', 3, 'okay',    'okay', 6.5, '{"tiredness":3,"nausea":1,"appetite":4}', NULL, 'touch', NOW() - INTERVAL '4 days'),
('sl000005-aaaa-4bbb-cccc-000000000008', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '4 days' + INTERVAL '19 hours', 4, 'low',     'poor', NULL, '{"tiredness":4,"nausea":2,"appetite":3}', 'पेट में दर्द बढ़ा', 'touch', NOW() - INTERVAL '4 days'),
('sl000005-aaaa-4bbb-cccc-000000000009', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '3 days' + INTERVAL '7 hours', 3, 'okay',    'okay', 7.0, '{"tiredness":3,"nausea":1,"appetite":4}', NULL, 'touch', NOW() - INTERVAL '3 days'),
('sl000005-aaaa-4bbb-cccc-000000000010', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '3 days' + INTERVAL '19 hours', 3, 'okay',    'okay', NULL, '{"tiredness":3,"nausea":1,"appetite":4}', NULL, 'touch', NOW() - INTERVAL '3 days'),
('sl000005-aaaa-4bbb-cccc-000000000011', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '2 days' + INTERVAL '7 hours', 2, 'good',    'good', 7.5, '{"tiredness":2,"nausea":0,"appetite":5}', NULL, 'touch', NOW() - INTERVAL '2 days'),
('sl000005-aaaa-4bbb-cccc-000000000012', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '2 days' + INTERVAL '19 hours', 2, 'good',    'good', NULL, '{"tiredness":2,"nausea":0,"appetite":5}', 'Much better with medication routine', 'touch', NOW() - INTERVAL '2 days'),
('sl000005-aaaa-4bbb-cccc-000000000013', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '1 day'  + INTERVAL '7 hours', 2, 'good',    'good', 7.0, '{"tiredness":2,"nausea":0,"appetite":5}', NULL, 'touch', NOW() - INTERVAL '1 day'),
('sl000005-aaaa-4bbb-cccc-000000000014', 'p1111111-aaaa-4bbb-cccc-dddddddddd05', '11111111-aaaa-4bbb-cccc-dddddddddd05', 'self', 'quick', NOW() - INTERVAL '1 day'  + INTERVAL '19 hours', 3, 'okay',    'okay', NULL, '{"tiredness":3,"nausea":1,"appetite":4}', NULL, 'touch', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. VERIFICATION QUERIES (optional, for sanity checking)
-- ─────────────────────────────────────────────────────────────────────────────
-- SELECT 'users' AS entity, COUNT(*) FROM users WHERE id IN ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d','b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e','11111111-aaaa-4bbb-cccc-dddddddddd01','11111111-aaaa-4bbb-cccc-dddddddddd02','11111111-aaaa-4bbb-cccc-dddddddddd03','11111111-aaaa-4bbb-cccc-dddddddddd04','11111111-aaaa-4bbb-cccc-dddddddddd05')
-- UNION ALL SELECT 'clinicians', COUNT(*) FROM clinicians
-- UNION ALL SELECT 'patients', COUNT(*) FROM patients
-- UNION ALL SELECT 'medications', COUNT(*) FROM medications
-- UNION ALL SELECT 'symptom_logs', COUNT(*) FROM symptom_logs;
