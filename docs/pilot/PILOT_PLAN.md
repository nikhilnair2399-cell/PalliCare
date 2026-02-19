# PalliCare AIIMS Bhopal Pilot Plan

> **Version**: 1.0
> **Date**: February 2026
> **Principal Investigator**: Dr. [PI Name], Department of Anaesthesiology & Palliative Medicine
> **Institution**: All India Institute of Medical Sciences, Bhopal

---

## 1. Pilot Overview

### 1.1 Objective
Evaluate the feasibility, usability, and clinical utility of the PalliCare mobile application for palliative care pain management and symptom monitoring at AIIMS Bhopal.

### 1.2 Study Design
Single-arm prospective feasibility study with mixed-methods evaluation (quantitative app usage data + qualitative user feedback).

### 1.3 Duration
- **Enrollment**: 2 weeks
- **Active pilot**: 8 weeks
- **Analysis & reporting**: 2 weeks
- **Total**: 12 weeks

### 1.4 Setting
Department of Anaesthesiology & Palliative Medicine, AIIMS Bhopal
- Palliative care outpatient clinic
- Pain management clinic
- Inpatient palliative care consults

---

## 2. Participant Selection

### 2.1 Target Cohort
| Group | Target N | Selection Criteria |
|-------|----------|--------------------|
| Patients | 20-30 | Age >=18, chronic pain / palliative care, smartphone access, Hindi or English literate |
| Caregivers | 10-15 | Primary caregiver of enrolled patient, smartphone access |
| Clinicians | 5-8 | Palliative care team members (doctors, nurses, pharmacist, psychologist) |

### 2.2 Inclusion Criteria (Patients)
- Age >= 18 years
- Diagnosed with advanced cancer or chronic non-cancer pain requiring palliative care
- Expected prognosis >= 3 months
- Access to Android smartphone (personal or shared with caregiver)
- Able to read Hindi or English (or have caregiver assistance)
- Willing to log symptoms at least 3 times per week
- Informed written consent provided

### 2.3 Exclusion Criteria
- Severe cognitive impairment preventing app use
- Unstable clinical condition requiring immediate intensive care
- No smartphone access (patient or caregiver)
- Unable to provide informed consent

### 2.4 Recruitment Strategy
1. Screen palliative care clinic patients during routine visits
2. Clinician referral from pain management clinic
3. Identify eligible inpatients receiving palliative care consults
4. Approach caregivers of enrolled patients

---

## 3. Deployment Plan

### 3.1 Technical Infrastructure
| Component | Platform | Deployment |
|-----------|----------|------------|
| Patient App | Android APK (sideload) | Direct installation via QR code |
| Clinician Dashboard | Web (Next.js) | Staging server URL |
| Backend | Mock data (Phase 1) | Local-first with future API |

### 3.2 Pre-Deployment Checklist
- [ ] Android APK built in release mode (`flutter build apk --release`)
- [ ] APK signed with release keystore
- [ ] APK tested on 5+ Android devices (API 28-34)
- [ ] Dashboard deployed to staging URL
- [ ] QR code generated for APK download
- [ ] Test accounts created for all clinicians
- [ ] Mock data seeded for demo/training
- [ ] Offline functionality verified (airplane mode test)

### 3.3 Device Requirements
- Android 9.0 (API 28) or higher
- Minimum 2GB RAM, 100MB free storage
- Internet connectivity (WiFi or mobile data) for initial setup
- App works offline after initial setup

---

## 4. Training Plan

### 4.1 Patient Training (30 minutes)
| Session | Duration | Content |
|---------|----------|---------|
| App install | 5 min | QR code scan, APK install, permissions |
| Onboarding | 5 min | Language selection, profile setup |
| Core features | 10 min | Pain logging (quick + full), medication tracker |
| Practice | 5 min | Log one sample entry with guidance |
| Q&A | 5 min | Address concerns, provide quick-start card |

**Materials**: Hindi quick-start guide (2-page laminated card)

### 4.2 Caregiver Training (20 minutes)
| Session | Duration | Content |
|---------|----------|---------|
| App install | 5 min | Same as patient |
| Caregiver mode | 5 min | Switch to caregiver view, proxy logging |
| Monitoring | 5 min | View patient logs, wellness check |
| Practice | 5 min | Log on behalf of patient |

### 4.3 Clinician Training (45 minutes)
| Session | Duration | Content |
|---------|----------|---------|
| Dashboard overview | 10 min | Patient list, traffic light triage, navigation |
| Patient detail view | 10 min | Pain trends, medication review, symptom panel |
| Alerts & MDT | 10 min | Alert management, SBAR, team messaging |
| Analytics & reports | 5 min | Department metrics, export tools |
| Workflow integration | 10 min | When/how to check dashboard in clinical workflow |

**Materials**: 15-slide training deck, laminated quick-reference card

---

## 5. Outcome Measures

### 5.1 Primary Outcomes
| Outcome | Metric | Target |
|---------|--------|--------|
| Feasibility | Enrollment rate | >= 70% of approached patients |
| Usability | System Usability Scale (SUS) | Score >= 68 |
| Engagement | Weekly logging rate | >= 3 logs/week per patient |
| Retention | 8-week completion | >= 70% of enrolled |

### 5.2 Secondary Outcomes
| Outcome | Metric | Method |
|---------|--------|--------|
| Pain control | NRS trend over 8 weeks | App data analysis |
| Medication adherence | Self-reported via app | App analytics |
| Patient satisfaction | Likert scale (1-5) | Exit survey |
| Clinician utility | Time to clinical decision | Pre/post comparison |
| Caregiver burden | Zarit Burden Interview | Pre/post |
| Data completeness | % of expected logs received | App analytics |

### 5.3 Qualitative Outcomes
- Semi-structured interviews (5 patients, 3 caregivers, 3 clinicians)
- Focus group discussion with clinical team
- Thematic analysis of in-app feedback

---

## 6. Data Collection & Privacy

### 6.1 Data Types Collected
| Data Type | Storage | Identifiable? |
|-----------|---------|---------------|
| Symptom logs | Device (Hive) + Server | Yes (linked to patient ID) |
| Medication logs | Device + Server | Yes |
| App usage analytics | Firebase Analytics | Anonymized |
| Feedback surveys | Google Forms | Semi-anonymous |
| Interview transcripts | Encrypted drive | De-identified |

### 6.2 Privacy Safeguards (DPDPA 2023)
- All data encrypted at rest (AES-256) and in transit (TLS 1.3)
- Minimal data collection — only clinically necessary fields
- No third-party data sharing
- Patient right to data export and deletion
- Data retention: 1 year post-study, then deletion
- Data Processing Agreement with AIIMS IT

### 6.3 ABDM Compliance
- ABHA integration placeholder included (not active in pilot)
- FHIR R4 data model aligned
- DISHA compliance documentation prepared

---

## 7. Safety & Escalation

### 7.1 Clinical Safety
- App does NOT replace clinical judgment or emergency care
- Emergency helpline (112) prominently displayed in app
- AIIMS palliative care helpline available 24/7
- Critical pain alerts (NRS >= 8 sustained) generate clinician notification
- MEDD safety threshold alerts for opioid dosing

### 7.2 Technical Safety
- Offline-first design ensures data is never lost
- Daily automated backups of server data
- 24/7 technical support contact for pilot period
- Bug reporting via in-app feedback button

### 7.3 Adverse Event Reporting
- Any app-related safety concerns reported to PI within 24 hours
- Serious adverse events (SAE) reported to IEC per institutional protocol
- Weekly safety review by study team

---

## 8. Timeline

| Week | Activity |
|------|----------|
| 0 | IEC approval, APK build, staging deployment |
| 1 | Clinician training sessions |
| 2-3 | Patient enrollment and training |
| 4-9 | Active pilot (data collection) |
| 6 | Mid-pilot review and adjustments |
| 10 | Exit surveys and interviews |
| 11-12 | Data analysis and report writing |

---

## 9. Budget Estimate

| Item | Cost (INR) | Notes |
|------|-----------|-------|
| Devices for testing | 0 | Patients use own smartphones |
| Staging server (3 months) | 3,000 | Cloud hosting |
| Printed materials | 2,000 | Quick-start guides, laminated cards |
| Participant incentives | 15,000 | Token travel reimbursement |
| Transcription services | 5,000 | Interview transcription |
| **Total** | **25,000** | |

---

## 10. Success Criteria

The pilot will be deemed successful if:
1. >= 20 patients enrolled and >= 14 complete 8-week pilot
2. SUS usability score >= 68 (above average)
3. >= 3 symptom logs per patient per week (average)
4. >= 80% of clinicians report dashboard is clinically useful
5. No app-related safety concerns identified
6. Technical platform stable (< 2% crash rate)

---

*Document prepared for IEC submission*
*PalliCare Development Team, AIIMS Bhopal*
