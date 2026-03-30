# Data Collection Protocol

## PalliCare Pilot Study — AIIMS Bhopal

> **Version**: 1.0
> **Date**: March 2026
> **Document Owner**: Principal Investigator, Department of Anaesthesiology & Palliative Medicine
> **Classification**: Confidential

---

## 1. Overview

This document defines the data collection, storage, transmission, anonymization, and retention procedures for the PalliCare pilot study at AIIMS Bhopal. All personnel involved in data handling must read and acknowledge this protocol before accessing any study data.

---

## 2. Types of Data Collected

### 2.1 Symptom Logs

| Field | Description | Scale / Format | Frequency |
|-------|-------------|----------------|-----------|
| Pain intensity (NRS) | Numeric Rating Scale | Integer 0-10 | Minimum 3x/week |
| Pain location | Body map zones | 28 zones (14 front + 14 back) | With each pain log |
| Pain quality | Descriptive characteristics | Multi-select: aching, sharp, burning, throbbing, stabbing, shooting, tingling, cramping, dull, pressure, electric, gnawing, radiating, squeezing, other | With full log |
| Pain aggravators/relievers | What worsens or improves pain | Free text tags | With full log |
| ESAS-r scores | Edmonton Symptom Assessment System - Revised | 9 domains, each 0-10: pain, tiredness, nausea, depression, anxiety, drowsiness, appetite, wellbeing, shortness of breath | Weekly (encouraged) |
| Mood | Emotional state | 5-point scale: great, good, okay, low, distressed | Daily (encouraged) |
| Sleep quality | Subjective sleep assessment | 3-point: well, okay, poorly + hours (decimal) | Daily (encouraged) |
| Breakthrough pain | Acute pain episode | NRS + timing + rescue medication taken (boolean) + 30-min follow-up NRS | As occurs |
| PAINAD | Pain Assessment in Advanced Dementia | 5 domains (0-2 each): breathing, vocalization, facial expression, body language, consolability; total 0-10 | For non-communicative patients |
| Free-text notes | Patient narrative | Text (max 2000 chars) | Optional per log |
| Voice notes | Audio recording | Audio file (MP3/M4A/WAV, max 10 MB) | Optional per log |
| Photo attachments | Wound/symptom photos | JPEG/PNG/WebP (max 10 MB, max 3 per log) | Optional per log |

### 2.2 Medication Adherence

| Field | Description | Format | Frequency |
|-------|-------------|--------|-----------|
| Dose confirmation | Whether a scheduled dose was taken | Boolean (taken/skipped) + timestamp | Per scheduled dose |
| PRN usage | As-needed medication consumption | Medication ID + timestamp + indication | As occurs |
| Side effects | Adverse effects experienced | Checklist + free text | As reported |
| MEDD contribution | Morphine Equivalent Daily Dose per medication | Calculated: dose x conversion factor (mg) | Auto-calculated |
| Total daily MEDD | Sum of all opioid MEDD contributions | mg/day (decimal) | Auto-calculated daily |

### 2.3 App Usage Analytics

| Metric | Description | Collection Method | Identifiable |
|--------|-------------|-------------------|-------------|
| Session count | App opens per day | Automatic | No (anonymized device ID) |
| Session duration | Time spent per session | Automatic | No |
| Feature utilization | Screen views and feature engagement | Automatic | No |
| Log type distribution | Quick Log vs Full Log vs Breakthrough | Automatic | No |
| Time to complete entry | Duration from start to save of a log | Automatic | No |
| Notification response | Time between notification and app open | Automatic | No |
| Offline sessions | Sessions without network connectivity | Automatic | No |
| Error/crash events | Application errors | Automatic (crash reporting) | No |
| Onboarding completion | Steps completed in onboarding flow | Automatic | No |
| Caregiver mode usage | Proxy logging sessions vs patient sessions | Automatic | No |

### 2.4 Study Outcome Instruments

| Instrument | Description | Administration | Format |
|------------|-------------|----------------|--------|
| System Usability Scale (SUS) | 10-item standardized usability questionnaire | Week 4, paper/digital | 5-point Likert (1-5 per item); composite score 0-100 |
| Patient satisfaction survey | Custom 15-item questionnaire on app usefulness | Week 4, paper/digital | 5-point Likert + open-ended |
| Clinician utility survey | Custom 12-item questionnaire on dashboard value | Week 4, paper | 5-point Likert + open-ended |
| Semi-structured interview | Qualitative interview with selected participants | Week 4-5, audio recorded | Transcribed text (de-identified) |
| Focus group discussion | Group interview with clinical team | Week 5, audio recorded | Transcribed text (de-identified) |

---

## 3. Data Flow Architecture

```
+------------------+       +------------------+       +------------------+
|  Patient Device  |       |    API Server    |       |    Dashboard     |
|  (Android App)   |       |   (Node.js)      |       |   (Next.js)      |
+------------------+       +------------------+       +------------------+
|                  |       |                  |       |                  |
| Hive DB (local)  | ----> | PostgreSQL DB    | ----> | Browser (HTTPS)  |
| - Symptom logs   | TLS   | - Clinical data  | TLS   | - Patient views  |
| - Medication logs| 1.3   | - User accounts  | 1.3   | - Alert center   |
| - Offline queue  |       | - Audit logs     |       | - Analytics      |
|                  |       |                  |       |                  |
| Firebase SDK     | ----> | Firebase         | ----> | Analytics API    |
| - Anonymized     | TLS   | Analytics        | TLS   | - Aggregate only |
|   usage events   |       | - No PII         |       |                  |
+------------------+       +------------------+       +------------------+
```

### 3.1 Data Flow Steps

1. **Local capture**: Patient or caregiver enters data in the mobile app. Data is immediately saved to the local Hive database on the device (offline-first).

2. **Sync to server**: When network connectivity is available, the app syncs pending data to the API server over HTTPS (TLS 1.3). Each record has a `sync_status` field: `pending` -> `synced` (or `conflict` / `failed`).

3. **Server storage**: The API server validates and stores data in PostgreSQL. Each write is audit-logged with timestamp, user ID, and action type.

4. **Dashboard access**: Clinicians access patient data through the web dashboard. Authentication is required (email + password or SSO). Role-based access control ensures clinicians only see their assigned patients.

5. **Analytics pipeline**: Anonymized usage events (stripped of all PII) are sent to Firebase Analytics for aggregate analysis. No clinical data passes through Firebase.

6. **Alert generation**: The API server evaluates clinical alert rules on each incoming symptom log. If thresholds are exceeded (e.g., NRS >= 8 sustained, MEDD > 200 mg), alerts are created and sent to the dashboard.

### 3.2 Offline Behavior

- All app features function without network connectivity
- Data is stored in the local Hive database with `sync_status = pending`
- When connectivity is restored, a background sync job processes the queue
- Conflict resolution: Server timestamp wins; conflicting entries are flagged for manual review
- Maximum offline queue size: 500 entries before oldest entries are archived locally

---

## 4. Anonymization Approach

### 4.1 Identifiable Data (Clinical Layer)

The following fields contain or can be linked to personally identifiable information (PII):

| Field | PII Type | Access Level |
|-------|----------|-------------|
| Patient name | Direct identifier | Research team only |
| Phone number | Direct identifier | Research team only |
| UHID | Quasi-identifier (AIIMS-specific) | Research team only |
| Patient ID (UUID) | Pseudonymous identifier | Clinicians + Research team |
| Symptom logs | Health data (sensitive personal data under DPDPA) | Patient + Assigned clinicians + Research team |
| Medication logs | Health data | Patient + Assigned clinicians + Research team |

### 4.2 Anonymized Data (Analytics Layer)

All usage analytics are processed through an anonymization pipeline before storage:

1. **Device ID hashing**: Device identifiers are SHA-256 hashed with a study-specific salt. The salt is stored separately from the analytics database.
2. **PII stripping**: Patient name, phone number, UHID, and patient UUID are never included in analytics events.
3. **Aggregation**: Analytics queries return aggregate data only (counts, averages, percentiles). No individual-level analytics are accessible.
4. **Time rounding**: Timestamps in analytics are rounded to the nearest hour to prevent correlation attacks.
5. **Small cell suppression**: Any aggregate with fewer than 5 individuals is suppressed in reports.

### 4.3 De-identification for Publication

Before any data is used in publications or presentations:

1. All direct identifiers are removed (name, phone, UHID)
2. Patient IDs are replaced with sequential study codes (P001, P002, etc.)
3. Dates are shifted by a random offset (same offset per patient) to prevent re-identification
4. Free-text notes are reviewed manually for embedded PII before inclusion
5. Any quotes from interviews are attributed to generic labels (e.g., "Patient 7", "Caregiver 3")

---

## 5. Data Retention

| Data Category | Retention Period | After Retention | Justification |
|---------------|-----------------|-----------------|---------------|
| Clinical data (symptom logs, medication logs) | 6 months post-study completion | Review committee decides: archive for publication support or permanent deletion | Analysis, manuscript preparation |
| Anonymized analytics | Up to 2 years post-study | Permanent deletion | Research publication timeline |
| Informed consent forms (physical copies) | Minimum 5 years | Per AIIMS Bhopal IEC retention policy | Regulatory requirement |
| Informed consent forms (digital scans) | Minimum 5 years | Per AIIMS Bhopal IEC retention policy | Backup of physical copies |
| Interview audio recordings | Deleted within 3 months of transcription | N/A (deleted) | Minimize sensitive data storage |
| Interview transcripts (de-identified) | Up to 2 years post-study | Permanent deletion | Qualitative analysis, publication |
| Server audit logs | 1 year post-study | Permanent deletion | Security and compliance |
| Local device data (Hive DB) | Deleted upon participant withdrawal or study completion | N/A | Study endpoint |

### 5.1 Data Deletion Procedures

- **Participant withdrawal**: Upon receiving a data deletion request, all identifiable data for that participant is permanently deleted from all systems within 30 days. Anonymized aggregate data (which cannot be linked back to the individual) is retained.
- **Study completion**: Research coordinator initiates data retention review. PI and IEC approve retention or deletion schedule.
- **Deletion verification**: A data deletion log is maintained, documenting what was deleted, when, by whom, and the method used.

---

## 6. Security Measures

### 6.1 Encryption

| Layer | Standard | Implementation |
|-------|----------|----------------|
| Data at rest (device) | AES-256 | Hive database encrypted with device-specific key |
| Data at rest (server) | AES-256 | PostgreSQL with Transparent Data Encryption (TDE); encrypted cloud storage volumes |
| Data in transit | TLS 1.3 | All API communication over HTTPS; certificate pinning in mobile app |
| Backup encryption | AES-256 | All database backups encrypted before storage |

### 6.2 Authentication and Access Control

| Component | Authentication | Authorization |
|-----------|---------------|---------------|
| Patient app | Phone OTP (6-digit, 5-min expiry, max 3 attempts/10 min) | Patients see own data only |
| Clinician dashboard | Email + password (or institutional SSO) | Role-based: assigned patients only |
| API server | JWT tokens (1-hour expiry, refresh tokens) | Endpoint-level permission checks |
| Database | SSH key + password | IP-restricted; named accounts only |
| Admin panel | MFA required | Superadmin only; audit-logged |

### 6.3 Role-Based Access Control (RBAC)

| Role | Can View | Can Create | Can Modify | Can Delete | Can Export |
|------|----------|------------|------------|------------|-----------|
| Patient | Own data only | Own logs | Own logs (within 24h) | Request via support | Own data (PDF) |
| Caregiver | Linked patient data | Proxy logs for linked patient | Proxy logs (within 24h) | No | No |
| Clinician | Assigned patients | Clinical notes | Alert status | No | De-identified reports |
| PI / Researcher | All study data | Study metadata | Study configuration | Approved deletions | Full de-identified dataset |
| System Admin | System logs only | System config | System config | Per PI authorization | System logs |

### 6.4 Network Security

- API server behind a firewall; only ports 443 (HTTPS) and 22 (SSH, IP-restricted) open
- Rate limiting: 100 requests/minute per authenticated user; 10 requests/minute for unauthenticated endpoints
- DDoS protection via cloud provider (if applicable)
- No direct database access from the internet; database accessible only via API server
- Webhook endpoints use HMAC signature verification

### 6.5 Monitoring and Incident Response

- **Logging**: All API requests logged (method, endpoint, user ID, timestamp, response code). No request body logged for clinical data endpoints.
- **Alert monitoring**: Automated alerts for: failed login attempts (>5 in 10 minutes), unusual data access patterns, server errors (5xx rate > 1%), SSL certificate expiry (30-day warning).
- **Incident response**: Security incidents reported to PI within 4 hours. IEC notified within 24 hours if participant data is affected. Affected participants notified within 72 hours per DPDPA requirements.

---

## 7. Regulatory Compliance

### 7.1 Digital Personal Data Protection Act (DPDPA), 2023

India's DPDPA 2023 is the primary data protection regulation applicable to this study. Key compliance measures:

| DPDPA Requirement | Implementation |
|-------------------|----------------|
| **Lawful purpose** | Data collected solely for the stated research purpose; informed consent obtained |
| **Purpose limitation** | Data used only for pilot study evaluation; no secondary use without fresh consent |
| **Data minimization** | Only clinically necessary fields collected; no excess data capture |
| **Storage limitation** | Defined retention periods (see Section 5); deletion procedures documented |
| **Data accuracy** | Participants can review and correct their data; validation checks in app |
| **Security safeguard** | Encryption, access control, audit logging (see Section 6) |
| **Consent** | Written informed consent in preferred language; right to withdraw at any time |
| **Data principal rights** | Right to access, correct, delete, and port personal data |
| **Breach notification** | Data Protection Board of India notified within 72 hours of any breach |
| **Data fiduciary obligations** | PI designated as data fiduciary; processes documented |

### 7.2 Information Technology Act, 2000

- Compliance with IT (Reasonable Security Practices and Procedures) Rules, 2011
- Body of sensitive personal data: health data classified as sensitive personal data
- Reasonable security practices: ISO 27001-aligned security controls

### 7.3 HIPAA-Equivalent Safeguards

Although HIPAA (U.S.) does not apply in India, the following HIPAA-equivalent safeguards have been implemented as international best practices:

| HIPAA Safeguard | Equivalent Implementation |
|-----------------|---------------------------|
| Administrative safeguards | Designated data privacy officer (PI); workforce training; sanction policy |
| Physical safeguards | Server in secure data center; device encryption; secure disposal |
| Technical safeguards | Access control; audit controls; integrity controls; transmission security |
| Minimum necessary rule | Role-based access; data minimization in all queries |
| Business associate agreements | Data processing agreements with cloud service providers |
| Breach notification | 72-hour notification per DPDPA (comparable to HIPAA's 60-day rule) |

### 7.4 ICMR National Ethical Guidelines (2017)

- IEC approval obtained before study commencement
- Informed consent process per Chapter 5 of ICMR guidelines
- Vulnerable population protections applicable to palliative care patients
- Data sharing and publication per Chapter 12

---

## 8. Backup and Recovery

### 8.1 Backup Schedule

| Data Store | Backup Type | Frequency | Retention | Storage |
|------------|-------------|-----------|-----------|---------|
| PostgreSQL (server) | Full database dump | Daily (02:00 IST) | 30 days rolling | Encrypted cloud storage (separate region) |
| PostgreSQL (server) | Incremental backup | Every 6 hours | 7 days rolling | Encrypted cloud storage |
| Hive DB (device) | App-level export | On demand (user-initiated) | On device | Device local storage |
| Firebase Analytics | Automatic (managed) | Continuous | Per Firebase retention policy | Google Cloud (managed) |
| Consent forms (scans) | Manual upload | Within 48h of signing | Per IEC policy | Encrypted institutional drive |
| Audit logs | Log rotation + archive | Daily | 1 year | Encrypted cloud storage |

### 8.2 Recovery Procedures

| Scenario | Recovery Target | Procedure | Estimated Time |
|----------|----------------|-----------|----------------|
| Server database corruption | RPO: 6 hours; RTO: 4 hours | Restore from most recent clean backup; replay incremental logs | 2-4 hours |
| Patient device loss/reset | Full data recovery | Re-install app; authenticate with phone OTP; data syncs from server | 10 minutes |
| Server outage | Resume service | Failover to backup instance (if configured) or restore from backup | 1-4 hours |
| Accidental data deletion | Point-in-time recovery | Restore specific records from backup; audit log identifies what was deleted | 1-2 hours |

### 8.3 Backup Verification

- Weekly automated backup integrity check (restore to test environment)
- Monthly manual verification: Research coordinator confirms a random sample of records can be restored correctly
- Backup failure alerts sent to system administrator immediately

---

## 9. Data Quality Assurance

### 9.1 Validation Rules (App-Level)

| Field | Validation | Action on Failure |
|-------|-----------|-------------------|
| NRS pain score | Integer, 0-10 | Reject entry; display error |
| ESAS scores | Integer, 0-10 per domain | Reject invalid domain; allow partial |
| Medication dose confirmation | Boolean (taken/skipped) | Required before saving |
| Timestamp | ISO 8601; not in future; not > 48h in past | Auto-correct to now; flag if > 24h old |
| Free text | Max 2000 characters; no embedded HTML/scripts | Truncate; sanitize input |
| Audio file | Allowed MIME types; max 10 MB | Reject with error message |
| Photo file | JPEG/PNG/WebP; max 10 MB; max 3 per log | Reject excess; compress if needed |

### 9.2 Monitoring and Completeness

- Weekly data completeness check by research coordinator
- Flag patients with < 3 logs/week for phone follow-up
- Dashboard shows data completeness percentage per patient
- Automatic detection of suspicious patterns (e.g., identical scores for > 7 consecutive days)

---

## 10. Personnel and Training

### 10.1 Data Handling Personnel

| Role | Data Access Level | Training Required |
|------|-------------------|-------------------|
| Principal Investigator | Full access (all study data) | GCP certification; DPDPA awareness |
| Co-Investigators | Full access (all study data) | GCP certification; DPDPA awareness |
| Research Coordinator | Identifiable clinical data | GCP certification; DPDPA awareness; app training |
| Clinicians | Assigned patient data only | Dashboard training; data privacy orientation |
| System Administrator | System logs; no clinical data | Security training; DPDPA awareness |
| Biostatistician | De-identified dataset only | GCP certification; DPDPA awareness |

### 10.2 Training Requirements

All personnel must complete:
1. Good Clinical Practice (GCP) certification (ICMR/WHO module)
2. DPDPA 2023 awareness training (provided by institution)
3. Study-specific data handling orientation (provided by PI)
4. Signed confidentiality agreement

---

## 11. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 2026 | [PI Name] | Initial version |

**Approved by**:
- Principal Investigator: _____________ Date: _____________
- IEC (if required): _____________ Date: _____________

---

*This document is confidential and intended for study personnel only.*
*Department of Anaesthesiology & Palliative Medicine, AIIMS Bhopal*
