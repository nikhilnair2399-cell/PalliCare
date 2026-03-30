# PalliCare -- DPDPA 2023 Compliance Mapping

**Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)**
**Last Updated:** 2026-03-08
**Version:** 1.0
**Data Fiduciary:** All India Institute of Medical Sciences (AIIMS), Bhopal
**DPO Contact:** dpo@pallicare.in

---

## Overview

This document provides a section-by-section mapping of the Digital Personal Data Protection Act, 2023 (DPDPA) to PalliCare's technical implementation, policies, and procedures. Each section includes the legal requirement, PalliCare's implementation approach, and the current implementation status.

### Status Legend

| Status | Meaning |
|---|---|
| **Implemented** | Fully built, tested, and deployed in production |
| **Partial** | Core functionality in place; enhancements or edge cases remaining |
| **Planned** | Designed and scheduled for implementation; not yet built |

---

## Table of Contents

1. [Chapter I -- Preliminary (Sections 1-2)](#chapter-i--preliminary)
2. [Chapter II -- Obligations of Data Fiduciary (Sections 4-9)](#chapter-ii--obligations-of-data-fiduciary)
3. [Chapter III -- Rights and Duties of Data Principal (Sections 11-15)](#chapter-iii--rights-and-duties-of-data-principal)
4. [Chapter IV -- Special Provisions (Sections 16-17)](#chapter-iv--special-provisions)
5. [Chapter V -- Compliance and Governance (Section 18)](#chapter-v--compliance-and-governance)
6. [Cross-Cutting Implementation Details](#cross-cutting-implementation-details)
7. [Implementation Roadmap](#implementation-roadmap)

---

## Chapter I -- Preliminary

### Section 2: Definitions

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 2(d) -- Data Fiduciary | Entity that determines purpose and means of processing | AIIMS Bhopal is the Data Fiduciary. Documented in Privacy Policy, consent notices, and all data processing agreements. | **Implemented** |
| Section 2(f) -- Data Principal | Individual whose data is processed | Three Data Principal categories defined: Patient, Caregiver, Clinician. Each has distinct data types and access levels. Role-based access control enforced in API (`auth` module with JWT claims). | **Implemented** |
| Section 2(g) -- Data Processor | Entity processing data on behalf of Fiduciary | AWS (ap-south-1) identified as sole Data Processor. Data Processing Agreement (DPA) executed with AWS. Firebase (notification delivery only -- no health data). | **Implemented** |
| Section 2(i) -- Personal Data | Data about identifiable individual | Personal data categories cataloged: identity data, health data, device data, usage analytics. Data classification labels applied at database column level and API DTO level. | **Implemented** |

---

## Chapter II -- Obligations of Data Fiduciary

### Section 4: Consent and Lawful Processing

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 4(1) -- Consent basis | Personal data shall be processed only for lawful purpose with Data Principal consent | **Granular consent flow** implemented at onboarding. Consent is collected per category: clinical data, notifications, analytics, research participation, legacy messages. Each consent category has an independent toggle. | **Implemented** |
| Section 4(1) -- Free consent | Consent must be free, specific, informed, unconditional, unambiguous | Consent is not bundled -- clinical features are accessible without analytics or research consent. No dark patterns (pre-checked boxes, confusing double negatives). Consent text reviewed for clarity at Grade 6 reading level. | **Implemented** |
| Section 4(1) -- Typed consents | Different processing activities require separate consent | `consent_records` database table stores: `consent_type` (enum: clinical, notifications, analytics, research, legacy_messages), `granted_at`, `withdrawn_at`, `method` (digital/verbal_witnessed), `policy_version`. | **Implemented** |
| Section 4(1) -- In-app toggle | Mechanism for granting and withdrawing consent | Settings > Privacy > Consent Management screen provides toggle controls for each consent category. Changes take immediate effect. | **Implemented** |
| Section 4(2)(a) -- Medical treatment | Processing permitted for medical treatment by health professional | Clinical data processing is justified under both consent (Section 4(1)) and medical treatment (Section 4(2)(a)). When consent is withdrawn, clinical data already collected is retained under Section 4(2)(a) for the statutory retention period but is restricted from active processing. | **Implemented** |
| Section 4(2)(b) -- Medical emergency | Processing permitted during medical emergency | Crisis detection alerts (self-harm indicators, critical symptom thresholds) trigger clinician notification without requiring separate consent for the alert mechanism. Justified under medical emergency and medical treatment provisions. | **Implemented** |
| Section 4(2)(c) -- Legal obligation | Processing permitted under law | Data retention beyond consent withdrawal is justified by Clinical Establishments Act (3-year retention). NDPS Act compliance for opioid medication records. Documented in `data_retention_policy` configuration. | **Implemented** |

### Section 5: Notice

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 5(1) -- Notice before consent | Data Fiduciary must give notice with description of personal data and purpose | **Privacy notice** displayed at first launch before any consent is requested. Notice includes: data categories collected, purposes, retention periods, rights, DPO contact. Available in Hindi and English. | **Implemented** |
| Section 5(1)(i) -- Description of data | Notice must describe personal data to be processed | Data categories listed explicitly in notice: name, phone, health data (symptom logs, medications, pain scores), device information, usage patterns. Each category linked to its purpose. | **Implemented** |
| Section 5(1)(ii) -- Purpose | Notice must describe purpose of processing | Seven purposes enumerated: clinical care, symptom monitoring, medication management, clinical alerts, education, research (anonymized), app improvement. Each purpose mapped to data categories. | **Implemented** |
| Section 5(1)(iii) -- Rights | Notice must inform of right to withdraw consent and file complaint | Rights section in privacy notice covers: access, correction, erasure, portability, complaint to DPB. Withdrawal mechanism described (in-app toggle, email, postal). | **Implemented** |
| Section 5(2) -- Language | Notice must be in clear and plain language | Privacy notice and all consent text written at Grade 6 reading level (Flesch-Kincaid). Available in both Hindi and English. Short sentences, active voice, no legal jargon without plain-language explanation. | **Implemented** |
| Section 5(3) -- Existing data | Notice for data collected before DPDPA | Not applicable -- PalliCare launched post-DPDPA enactment. No legacy data exists. | **N/A** |

### Section 6: Lawful Purpose

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 6 -- Purpose limitation | Data processed only for purpose stated in notice | API-level validation ensures data fields are used only for stated purposes. No secondary use without additional consent. Research data is anonymized before any analysis. Analytics data is aggregated and anonymized at collection. | **Implemented** |
| Section 6 -- No secondary purpose | Data not used for purposes not consented to | No data is shared with advertisers, data brokers, or any entity outside AIIMS Bhopal's clinical infrastructure. No behavioral profiling. No targeted content based on health data. | **Implemented** |

### Section 7: Data Minimization

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 7 -- Collection limitation | Only data necessary for purpose shall be collected | **Data minimization audit** performed per feature. Each database field is mapped to a stated purpose. No "nice to have" fields collected. Example: email is optional (phone number sufficient for authentication). | **Implemented** |
| Section 7 -- Adequate, relevant, necessary | Data must be adequate, relevant, and necessary | DTOs (class-validator) enforce field-level validation. API rejects unexpected fields. Database schema reviewed for unnecessary columns. No tracking of social media profiles, browsing history, or contacts. | **Implemented** |

### Section 8: General Obligations

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 8(1) -- Accuracy | Ensure completeness, accuracy, and consistency of data | Patients can update profile data in-app. Clinicians can review and correct clinical entries. Medication entries flagged as "unverified" until clinician confirmation. Input validation (class-validator) prevents malformed data. | **Implemented** |
| Section 8(2) -- Purpose achievement | Reasonable effort to verify that processing achieves stated purpose | Quarterly review of data collection practices against stated purposes. Features not achieving their stated purpose are revised or removed. Analytics reviewed to confirm they inform app improvement. | **Partial** -- review process defined, first review scheduled |
| Section 8(3) -- Storage limitation | Data retained only as long as necessary for stated purpose | Retention policy implemented per data category. `data_retention_policy` table: clinical (3 years from last interaction), auth logs (1 year), analytics (2 years anonymized), consent records (5 years). Automated retention enforcement via scheduled job. | **Partial** -- policy defined, automated cleanup job in development |
| Section 8(4) -- Data erasure after purpose | Erase data when purpose is served and retention not required by law | `data_deletion_requests` table tracks erasure requests. Processing pipeline: request received > identity verified > retention check > data erased or restricted > confirmation sent. Legal hold for clinical data under Clinical Establishments Act. | **Implemented** |
| Section 8(5) -- Reasonable security | Implement appropriate technical and organizational security safeguards | **Technical:** AES-256 at rest (PostgreSQL TDE, S3 SSE), TLS 1.3 in transit, JWT authentication with refresh rotation, bcrypt password hashing (cost 12), flutter_secure_storage on device, helmet.js HTTP headers, rate limiting (@nestjs/throttler), parameterized queries, CORS restrictions, Redis session management. **Organizational:** RBAC, audit logging, staff training, incident response plan, access reviews. | **Implemented** |
| Section 8(6) -- Breach notification to DPB | Notify Data Protection Board of personal data breach | `breach_notifications` database table stores breach records. Breach response procedure: detection > containment > assessment > DPB notification (within 72 hours) > Data Principal notification > remediation > post-incident review. DPB notification template prepared. | **Partial** -- process and templates defined; DPB notification pathway pending Board operational readiness |
| Section 8(6) -- Breach notification to Data Principals | Notify affected Data Principals of breach | Notification channels defined: in-app notification, SMS (to registered phone), email (if available). Notification content: nature of breach, potential impact, remedial measures, protective actions recommended. | **Partial** -- notification templates prepared; automated delivery mechanism in development |
| Section 8(7) -- Data erasure | Erase personal data when no longer necessary, unless retention required by law | Erasure workflow: `data_deletion_requests` table > admin review > retention check > hard delete (non-clinical data) or anonymize (clinical data past retention) > confirmation. Backup data included in erasure scope. Clinical data under statutory retention is restricted, not deleted, until period expires. | **Implemented** |

### Section 9: Data Processor Obligations

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 9(1) -- Processor processing | Data Processor processes only per Fiduciary's instructions | AWS operates under Data Processing Agreement (DPA). DPA restricts AWS to processing only as instructed by AIIMS Bhopal. No independent data use by AWS. | **Implemented** |
| Section 9(2) -- Processor security | Data Processor must implement reasonable security | AWS SOC 2 Type II, ISO 27001, ISO 27017, ISO 27018 certified. AWS ap-south-1 (Mumbai) region only. AWS shared responsibility model documented -- AIIMS Bhopal responsible for data-level security (encryption, access control); AWS responsible for infrastructure security. | **Implemented** |
| Section 9 -- Processor register | Maintain register of Data Processors | Data Processor register maintained by DPO. Current processors: AWS (infrastructure), Firebase/Google (push notification metadata only). Register includes: processor name, processing activities, data categories, security certifications, DPA reference. | **Implemented** |

---

## Chapter III -- Rights and Duties of Data Principal

### Section 11: Rights of Data Principal

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 11(1) -- Right to information | Confirmation of processing, summary of data, identities of recipients | **In-app:** Settings > Privacy > My Data > "View My Data Summary" shows all data categories, purposes, and processors. API endpoint: `GET /api/v1/data-rights/summary` returns structured summary. Data Processor identities (AWS, Firebase) listed. | **Implemented** |
| Section 11(1)(a) -- Access personal data | Access to personal data being processed | **In-app:** Settings > Privacy > My Data provides browsable view of profile, symptom history, medication records, assessment scores, consent records. API endpoint: `GET /api/v1/data-rights/export` generates complete data package. | **Implemented** |
| Section 11(1)(b) -- Correction | Request correction of inaccurate/incomplete data | **In-app:** Profile editing for identity data (name, phone, language). Symptom log correction (edit within 24-hour window). Clinician review request for clinical data corrections. API: `PATCH /api/v1/data-rights/correction` with change description. | **Implemented** |
| Section 11(1)(c) -- Erasure | Request erasure of personal data | **In-app:** Settings > Privacy > Delete My Data initiates erasure request. Workflow: request > identity verification (OTP) > retention check > processing (within 30 days) > confirmation. `data_deletion_requests` table with status tracking (requested, verified, processing, completed, rejected_retention). Rejection includes explanation (e.g., clinical retention period active). | **Implemented** |
| Section 11(2) -- Compliance timeline | Fiduciary must comply without unreasonable delay | 48-hour acknowledgment, 30-day resolution SLA. Extension permitted for complex requests (additional 30 days with notification). SLA tracked in `data_rights_requests` table with timestamp logging. | **Implemented** |

### Section 12: Right to Erasure (Detailed)

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 12(1) -- Erasure on withdrawal | Data Principal may request erasure upon consent withdrawal | Erasure request is automatically created when all consent categories are withdrawn. Partial withdrawal (e.g., only analytics) triggers selective erasure of analytics data while preserving clinical data. | **Implemented** |
| Section 12(2) -- Erasure scope | Erasure extends to processors | AWS S3 objects deleted. Database records hard-deleted (non-clinical) or anonymized (clinical past retention). Redis cache entries invalidated. Hive local storage cleared on device upon account deletion. Firebase token deregistered. | **Implemented** |
| Section 12 -- Retention exception | Retention permitted where required by law | Clinical Establishments Act requires 3-year retention of clinical records. Data subject to legal retention is **restricted** (no active processing) rather than deleted. Patient informed of retention reason and expected deletion date. | **Implemented** |

### Section 13: Right to Nominate

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 13(1) -- Nomination right | Data Principal may nominate person to exercise rights in case of death/incapacity | **In-app:** Settings > Privacy > Nominee Designation. Linked caregiver can serve as nominee. Nominee fields: name, phone, relationship, permissions scope. `nominee_designations` table stores nominee records with timestamps. | **Implemented** |
| Section 13(2) -- Nominee scope | Nominee can exercise Data Principal rights | Nominee can request: data access, data export, data erasure, account closure. Nominee identity verified via OTP to registered nominee phone. Nominee actions logged in audit trail. | **Partial** -- nominee designation implemented; nominee verification and action processing in testing |
| Section 13(3) -- Multiple nominees | Data Principal may update/revoke nominee | Nominee can be changed at any time via in-app settings. Previous nominee records archived (not deleted) for audit trail. Only one active nominee permitted at a time. | **Implemented** |

### Section 14: Duties of Data Principal

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 14(a) -- Compliance with laws | Data Principal must comply with applicable laws | Terms of Service require compliance with applicable laws. Prohibition on sharing account credentials. | **Implemented** |
| Section 14(b) -- Truthful information | Data Principal must not provide false information | Registration requires OTP verification of phone number (prevents fake accounts). Profile data is self-declared but linked to AIIMS Bhopal patient record by clinician. | **Implemented** |
| Section 14(c) -- No false grievance | Data Principal must not file false complaints | Documented in Terms of Service. DPO verifies identity before processing data rights requests. | **Implemented** |
| Section 14(d) -- Authentic information | Data Principal must provide authentic information | OTP-based phone verification at registration. Clinician verification of patient identity at care enrollment. | **Implemented** |

### Section 15: Duties -- Impersonation

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 15 -- No impersonation | Data Principal must not impersonate another person | Account creation requires OTP to phone number. Caregiver accounts are separate from patient accounts (no shared credentials). Suspicious login patterns (new device, unusual location) trigger re-verification. | **Implemented** |

---

## Chapter IV -- Special Provisions

### Section 16: Cross-Border Transfer

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 16(1) -- Transfer restrictions | Personal data may be transferred only to notified countries | **No cross-border transfer occurs.** All infrastructure hosted in AWS ap-south-1 (Mumbai). Database, S3 storage, Redis cache, and application servers are all within the Mumbai region. No data replication to non-Indian regions. Firebase push notification metadata (FCM tokens only, no health data) transits Google infrastructure but contains no personal data. | **Implemented** |
| Section 16(2) -- Government restriction | Central Government may restrict transfer to specific countries | PalliCare's India-only hosting eliminates cross-border transfer concerns entirely. No future plans for non-Indian data hosting. | **N/A** (no transfers to restrict) |

### Section 17: Data Protection Board

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 17(1) -- Complaint mechanism | Data Principal may file complaint with DPB | DPB contact information provided in Privacy Policy and in-app (Settings > Privacy > File a Complaint). DPO contact provided as first point of resolution before DPB escalation. | **Implemented** |
| Section 17 -- DPO designation | Significant Data Fiduciary must appoint DPO | DPO designated: Data Protection Officer, AIIMS Bhopal. Contact: dpo@pallicare.in. DPO responsibilities documented in Privacy Policy Section 2. | **Implemented** |
| Section 17 -- Grievance redressal | Provide effective grievance mechanism | Three-tier grievance process: (1) In-app feedback form, (2) DPO email/postal, (3) DPB complaint. 30-day resolution SLA at DPO level. Grievance tracking in `data_rights_requests` table. | **Implemented** |

---

## Chapter V -- Compliance and Governance

### Section 18: Data Portability

| DPDPA Provision | Requirement | PalliCare Implementation | Status |
|---|---|---|---|
| Section 18 -- Right to portability | Data Principal may request data in structured, machine-readable format | **In-app:** Settings > Privacy > Export My Data. Export formats: JSON (structured, machine-readable) and CSV (spreadsheet-compatible). Export includes: profile data, symptom logs, medication records, assessment scores, consent records. API endpoint: `GET /api/v1/data-rights/export?format=json` or `?format=csv`. Export generated asynchronously; download link sent via in-app notification. | **Partial** -- JSON export implemented; CSV export in development |
| Section 18 -- Interoperability | Data should be in a format that allows transfer to another Fiduciary | JSON export uses a documented schema. FHIR (Fast Healthcare Interoperability Resources) compatibility is a planned future enhancement for healthcare data portability. | **Planned** -- FHIR mapping under investigation |

---

## Cross-Cutting Implementation Details

### Consent Management Architecture

```
consent_records table:
- id (UUID, PK)
- user_id (UUID, FK -> users)
- consent_type (ENUM: clinical, notifications, analytics, research, legacy_messages)
- granted (BOOLEAN)
- granted_at (TIMESTAMPTZ)
- withdrawn_at (TIMESTAMPTZ, nullable)
- method (ENUM: digital, verbal_witnessed)
- witness_name (VARCHAR, nullable -- for verbal consent)
- witness_role (VARCHAR, nullable)
- policy_version (VARCHAR -- privacy policy version at time of consent)
- ip_address (INET -- for digital consent verification)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Data Deletion Request Pipeline

```
data_deletion_requests table:
- id (UUID, PK)
- user_id (UUID, FK -> users)
- request_type (ENUM: full_deletion, selective_deletion)
- scope (JSONB -- categories to delete)
- status (ENUM: requested, identity_verified, retention_check, processing, completed, rejected_retention)
- rejection_reason (TEXT, nullable)
- retention_expiry (DATE, nullable -- when restricted data will be deleted)
- requested_at (TIMESTAMPTZ)
- verified_at (TIMESTAMPTZ, nullable)
- completed_at (TIMESTAMPTZ, nullable)
- processed_by (UUID, FK -> admin users, nullable)
```

### Breach Notification Records

```
breach_notifications table:
- id (UUID, PK)
- breach_detected_at (TIMESTAMPTZ)
- breach_nature (TEXT)
- data_categories_affected (JSONB)
- estimated_principals_affected (INTEGER)
- containment_actions (TEXT)
- dpb_notified_at (TIMESTAMPTZ, nullable)
- dpb_notification_reference (VARCHAR, nullable)
- principals_notified_at (TIMESTAMPTZ, nullable)
- notification_method (JSONB -- channels used)
- remediation_actions (TEXT)
- root_cause (TEXT, nullable)
- post_incident_review_date (DATE, nullable)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Security Measures Summary

| Layer | Measure | Standard |
|---|---|---|
| Data at rest | AES-256 encryption (PostgreSQL TDE, S3 SSE-S3) | IT Act 2000, Rule 8 (reasonable security) |
| Data in transit | TLS 1.3 (all API and WebSocket communication) | IT Act 2000, Rule 8 |
| Authentication | JWT with RS256 signing, refresh token rotation | OWASP best practices |
| Password storage | bcrypt, cost factor 12 | OWASP best practices |
| Device storage | flutter_secure_storage (Keychain / EncryptedSharedPreferences) | Platform security best practices |
| API security | Rate limiting (throttler), CORS, helmet.js headers, input validation | OWASP API Security Top 10 |
| Database security | Row-level security (RLS), parameterized queries, connection pooling | PostgreSQL security guidelines |
| Legacy messages | End-to-end encryption (server cannot decrypt) | Privacy by design |
| Audit logging | All data access and modifications logged with actor, timestamp, action | IT Act 2000 compliance |
| Session management | Redis-backed sessions, configurable TTL, single-device enforcement | OWASP session management |

---

## Implementation Roadmap

### Completed (Implemented)

- [x] Granular consent flow with per-category toggles
- [x] Privacy notice in Hindi and English at Grade 6 reading level
- [x] Purpose-limited data collection with API-level enforcement
- [x] Data minimization review and DTO validation
- [x] AES-256 at rest, TLS 1.3 in transit
- [x] JWT authentication with refresh rotation
- [x] RBAC (patient, caregiver, clinician, admin)
- [x] Data access, correction, and erasure request workflow
- [x] Nominee designation
- [x] India-only hosting (ap-south-1)
- [x] DPO designation and contact channels
- [x] Consent records with full audit trail
- [x] Data deletion request pipeline
- [x] Breach notification table and templates
- [x] Grievance redressal mechanism (3-tier)
- [x] Verbal witnessed consent support

### In Progress (Partial)

- [ ] Automated data retention enforcement (scheduled cleanup job)
- [ ] CSV data export format (JSON implemented)
- [ ] Nominee action processing and verification workflow
- [ ] Automated breach notification delivery mechanism
- [ ] DPB breach notification submission (pending Board operational readiness)
- [ ] Section 8(2) purpose achievement review process (first review scheduled)

### Planned

- [ ] FHIR-compatible data portability format
- [ ] Automated Data Protection Impact Assessment (DPIA) tooling
- [ ] Consent analytics dashboard for DPO
- [ ] Data lineage tracking (source-to-processing-to-deletion)
- [ ] Automated compliance report generation for DPB audits
- [ ] Integration with DPB online complaint portal (when available)

---

## Compliance Review Schedule

| Activity | Frequency | Owner | Next Review |
|---|---|---|---|
| DPDPA compliance self-assessment | Quarterly | DPO | Q2 2026 |
| Data retention audit | Semi-annual | DPO + DB Admin | Q3 2026 |
| Security controls review | Quarterly | Security Lead | Q2 2026 |
| Consent mechanism UX review | Annual | UX Lead + DPO | Q1 2027 |
| Data Processor agreement review | Annual | DPO + Legal | Q1 2027 |
| Breach response drill | Annual | DPO + Security Lead + Clinical Lead | Q3 2026 |
| Privacy notice update review | Upon feature change or annual | DPO | Ongoing |
| Staff data protection training | Annual | DPO | Q2 2026 |

---

## References

1. Digital Personal Data Protection Act, 2023. The Gazette of India, Part II, Section 1, No. 22 of 2023.
2. Information Technology Act, 2000 (Act No. 21 of 2000), as amended by IT Amendment Act, 2008.
3. Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
4. Clinical Establishments (Registration and Regulation) Act, 2010.
5. ICMR National Ethical Guidelines for Biomedical and Health Research Involving Human Participants, 2017.
6. Narcotic Drugs and Psychotropic Substances Act, 1985 (as amended 2014).

---

*This compliance mapping is a living document maintained by the Data Protection Officer, AIIMS Bhopal. It is updated upon any change to PalliCare's data processing activities, security architecture, or regulatory requirements.*
