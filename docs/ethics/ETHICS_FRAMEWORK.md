# PalliCare Ethics Framework

**Version:** 1.0
**Last Updated:** 2026-03-08
**Institution:** All India Institute of Medical Sciences (AIIMS), Bhopal
**Department:** Palliative Medicine
**Applicable Standards:** ICMR National Ethical Guidelines (2017), DPDPA 2023, IAPC Ethics Position Papers

---

## Purpose

This document defines the ethical principles, policies, and design commitments that govern the PalliCare platform. Palliative care exists at the intersection of medicine, technology, and human dignity. PalliCare is built on the recognition that patients approaching end of life, their caregivers, and their clinicians deserve technology that is not only functional but morally responsible.

This framework addresses ethical considerations unique to palliative care mHealth applications in the Indian context, including end-of-life data sensitivity, cognitive accommodation, caregiver wellbeing, opioid safety, cultural sensitivity, and crisis detection.

---

## Table of Contents

1. [Core Ethical Principles](#1-core-ethical-principles)
2. [End-of-Life Data Sensitivity](#2-end-of-life-data-sensitivity)
3. [Non-Maleficence in Clinical Alerts](#3-non-maleficence-in-clinical-alerts)
4. [Cognitive Load Accommodation](#4-cognitive-load-accommodation)
5. [Caregiver Burnout Prevention](#5-caregiver-burnout-prevention)
6. [Opioid Safety](#6-opioid-safety)
7. [Right to Disconnect](#7-right-to-disconnect)
8. [Informed Consent with Impaired Cognition](#8-informed-consent-with-impaired-cognition)
9. [Community Crisis Detection](#9-community-crisis-detection)
10. [Research Ethics](#10-research-ethics)
11. [Cultural Sensitivity](#11-cultural-sensitivity)
12. [Algorithmic Transparency](#12-algorithmic-transparency)
13. [Equity and Access](#13-equity-and-access)
14. [Review and Governance](#14-review-and-governance)

---

## 1. Core Ethical Principles

PalliCare's design and operation are governed by four foundational bioethical principles, adapted for the digital health context:

### 1.1 Autonomy

- Patients retain full control over their data, their care engagement, and their communication preferences
- Every feature that collects, shares, or acts on patient data requires informed consent
- Patients may withdraw from any feature at any time without consequence to their care access
- Technology augments patient agency; it never replaces patient decision-making

### 1.2 Beneficence

- Every feature must demonstrate a clear benefit to patient care, caregiver support, or clinical decision-making
- Features are designed to improve quality of life, not merely to capture data
- Educational content is evidence-based, culturally appropriate, and reviewed by palliative care specialists

### 1.3 Non-Maleficence

- No feature should cause harm, distress, or undue burden to patients, caregivers, or clinicians
- Alarm fatigue, guilt-inducing design patterns, and cognitive overload are recognized as forms of digital harm
- Clinical alerts are calibrated to minimize false positives while maintaining patient safety
- The app must never delay or replace direct clinical care

### 1.4 Justice

- Access to PalliCare features is equitable regardless of socioeconomic status, literacy level, or technological proficiency
- Hindi and English language parity ensures linguistic equity
- Offline-first architecture ensures functionality in areas with poor connectivity
- No feature is gated behind premium payment -- all clinical features are available to all users

---

## 2. End-of-Life Data Sensitivity

Palliative care data carries unique sensitivity. Data created by people approaching the end of life demands heightened ethical consideration that goes beyond standard health data protection.

### 2.1 Dignity in Data

- Patient data is **never** used for marketing, advertising, or any non-clinical commercial purpose
- End-of-life patient data is **never** sold, licensed, or shared with data brokers
- Data visualizations and analytics are designed to reflect patient progress with dignity, not to gamify health outcomes
- Language in all data displays avoids framing decline as "failure" -- symptom trends are presented neutrally without judgment

### 2.2 Legacy Messages

Legacy messages allow patients to leave messages for loved ones, accessible after the patient's passing.

| Aspect | Policy |
|---|---|
| Encryption | End-to-end encrypted -- the PalliCare server cannot read message content |
| Access | Only designated recipients can decrypt and read legacy messages |
| Timing | Accessible only after a clinician confirms the patient's passing and a configurable waiting period (default: 7 days) |
| Storage | Retained for up to 5 years post-patient's passing or until retrieved, whichever is earlier |
| Deletion | If unclaimed after 5 years, permanently and irreversibly deleted |
| Modification | Patient can edit or delete legacy messages at any time while alive |
| Consent | Explicit, separate consent required for legacy message creation |

### 2.3 Grief-Sensitive Data Access

- Caregivers accessing patient data after the patient's passing encounter a **grief-aware interface**:
  - Gentle transition notice acknowledging the loss
  - No automated prompts or notifications about the deceased patient
  - Caregiver can choose when and how to access historical data
  - Option to export and then permanently close the patient account
- Automated data processing (analytics, alerts, research inclusion) ceases immediately upon recording of a patient's passing
- Caregiver access to post-mortem patient data is governed by:
  - The patient's prior consent and nominee designation
  - Applicable Indian law regarding medical records of deceased persons
  - Institutional policy of AIIMS Bhopal

### 2.4 Data After Death

- No new data is collected or generated for a deceased patient's account
- Existing clinical data is retained per statutory requirements (Clinical Establishments Act, 3 years minimum)
- Research data previously anonymized remains in anonymized datasets (cannot be recalled)
- Account closure and full data deletion is available to the nominee after the statutory retention period

---

## 3. Non-Maleficence in Clinical Alerts

Clinical alerts are essential for patient safety but carry risks of alarm fatigue, clinician burnout, and false confidence. PalliCare's alert system is designed to minimize harm while maintaining safety.

### 3.1 Alarm Fatigue Mitigation

| Strategy | Implementation |
|---|---|
| Tiered severity | Alerts classified as Critical (immediate action), Warning (review within 4 hours), and Informational (next visit review) |
| Smart grouping | Multiple simultaneous alerts for the same patient are grouped into a single notification with details |
| Escalation delays | Non-critical alerts have configurable delays (default: 30 minutes) to allow self-resolution before notifying clinicians |
| De-duplication | Repeated identical alerts within a 4-hour window are suppressed after the first notification |
| Batch delivery | Informational alerts are batched and delivered at configurable intervals (e.g., morning summary) |
| Clinician preferences | Individual clinicians can adjust alert thresholds within safe bounds set by the institution |

### 3.2 False Positive Management

- All clinical alerts include a **confidence indicator** reflecting the reliability of the triggering data:
  - **High confidence:** Based on multiple consistent data points (e.g., 3 consecutive high pain scores)
  - **Moderate confidence:** Single data point above threshold
  - **Low confidence:** Pattern-based inference, may require verification
- Clinicians can provide feedback on alert accuracy, which is used to refine thresholds over time
- Overridden alerts are logged for quality improvement review

### 3.3 Clinician Cognitive Load

- Dashboard designed following **information density principles** -- critical data visible at a glance without scrolling
- Patient lists ordered by clinical priority, not alphabetical order
- Color coding limited to 4 distinct states (critical, warning, stable, inactive) to avoid visual overload
- Shift handover view summarizes only changes since last login
- Dashboard does not play audio alerts -- notifications are visual only, with optional browser notifications

### 3.4 Alert Accountability

- Every clinical alert generates an audit trail: trigger time, delivery time, acknowledgment time, action taken
- Unacknowledged critical alerts escalate to a secondary clinician after a configurable timeout (default: 60 minutes)
- Alert response metrics are available for institutional quality review (aggregated, not individual clinician evaluation)

---

## 4. Cognitive Load Accommodation

Palliative care patients frequently experience fatigue, cognitive impairment, pain, and emotional distress. The app's design treats accommodation of these states as an **ethical imperative**, not merely a usability preference.

### 4.1 Fatigue Mode

- When a patient reports high fatigue (ESAS-r tiredness score >= 7), the app transitions to **Fatigue Mode**:
  - Simplified interface with reduced visual elements
  - Larger text and fewer options per screen
  - Quick-log option: single-tap symptom entry (emoji-based pain faces)
  - Non-essential features (education, breathing exercises) are accessible but not promoted
  - Session auto-saves progress to prevent data loss from early exit
- Fatigue Mode is automatic based on latest symptom data but can be manually toggled by the patient

### 4.2 Adaptive Onboarding

- Emotional state detection during onboarding adjusts the experience:
  - If the patient indicates distress during initial setup, onboarding is shortened to essential steps only
  - Remaining setup tasks are deferred and presented gradually over subsequent sessions
  - No mandatory tutorial completion is required to access core features
- Onboarding language is warm, supportive, and avoids clinical coldness

### 4.3 Voice Input

- Voice input (speech_to_text) is available as an alternative to typing for:
  - Symptom descriptions (free-text notes)
  - Medication side effect reports
  - Communication with care team
- Voice input is essential for patients with:
  - Motor function impairment (neuropathy, weakness)
  - Visual impairment
  - Fatigue that makes typing burdensome
- Voice data is processed locally on-device and converted to text -- raw audio is **not** stored or transmitted

### 4.4 Touch Target Accessibility

- **Minimum touch target size: 48x48 density-independent pixels (dp)** for all interactive elements
- This exceeds the Android accessibility minimum (44dp) and accounts for:
  - Tremor or reduced fine motor control from pain or medication side effects
  - Peripheral neuropathy common in cancer patients
  - Touch accuracy reduction under fatigue
- Spacing between touch targets minimum 8dp to prevent accidental activation

### 4.5 Content Readability

- All patient-facing text targets a **Grade 6 reading level** (Flesch-Kincaid)
- Medical terminology is accompanied by plain-language explanations
- Hindi content uses conversational Hindi (Hindustani), not formal Hindi (Shudh Hindi), for accessibility
- Font size minimum: 16sp for body text, 14sp for secondary text

---

## 5. Caregiver Burnout Prevention

Caregivers of palliative care patients face high rates of burnout, depression, and compassion fatigue. PalliCare has an ethical obligation to support caregiver wellbeing, not just extract data from them.

### 5.1 Burnout Screening

- Periodic caregiver wellness check-ins are prompted (default: every 2 weeks):
  - Brief validated screening questions adapted from the Zarit Burden Interview
  - Results are private to the caregiver -- not shared with the patient or clinician unless the caregiver chooses
  - If burnout indicators are detected, the app provides resource recommendations
- Screening is **optional** and can be permanently dismissed

### 5.2 Respite Reminders

- The app periodically sends supportive notifications to caregivers:
  - Self-care reminders (e.g., "You've been logging daily for 14 days. Remember to take time for yourself too.")
  - Links to caregiver support resources (IAPC caregiver guide, local support groups)
  - Breathing exercise suggestions for the caregiver (not the patient)
- Notifications are never guilt-inducing or obligatory
- Frequency is adjustable or can be turned off entirely

### 5.3 Role Boundaries

- The app clearly delineates caregiver versus clinician responsibilities:
  - Caregivers can log observations but are never presented as responsible for clinical decisions
  - PAINAD assessment (caregiver-administered) includes clear instructions that it supplements, not replaces, clinical assessment
  - Medication reminders indicate what the clinician prescribed -- the app never suggests caregivers modify dosing
- Language consistently frames caregivers as partners in care, not substitute healthcare providers

### 5.4 Caregiver Data Sovereignty

- Caregiver wellness data is the caregiver's own personal data, separate from the patient's record
- Caregivers have independent data rights (access, correction, erasure) for their own data
- Unlinking from a patient account does not delete the caregiver's own data

---

## 6. Opioid Safety

Opioid medications are essential in palliative pain management but carry significant regulatory and safety obligations, particularly in India where opioid access and diversion are both serious concerns.

### 6.1 NDPS Act 1985 Compliance

- All opioid medication tracking in PalliCare follows the requirements of the Narcotic Drugs and Psychotropic Substances Act, 1985 (as amended)
- The app does not prescribe, recommend, or suggest opioid medications -- it tracks clinician-prescribed medications
- Opioid medication entries include:
  - Drug name and formulation
  - Prescribed dose and frequency
  - Prescribing clinician (linked to AIIMS Bhopal clinician account)
  - Date of prescription
- The app maintains an audit trail of all opioid medication data entries and modifications

### 6.2 MEDD Safety Thresholds

- **Morphine Equivalent Daily Dose (MEDD)** is automatically calculated from logged opioid medications
- Safety alerts are triggered at the following thresholds:

| MEDD Threshold | Alert Level | Action |
|---|---|---|
| >= 90 mg/day | Warning | Clinician notification -- review recommended |
| >= 120 mg/day | Critical | Immediate clinician alert -- mandatory review |
| Rapid escalation (>50% increase in 7 days) | Warning | Clinician notification -- dose escalation review |
| New opioid added to existing regimen | Informational | Drug interaction and cumulative dose review prompt |

- MEDD calculation uses published equianalgesic conversion factors (Pereira et al., 2001)
- Conversion factors are transparent and displayed to clinicians

### 6.3 Prescription Verification

- Opioid medications logged by patients or caregivers are flagged for **clinician confirmation**
- Unconfirmed opioid entries are included in MEDD calculations (safety-first approach) but marked as unverified in clinical reports
- Clinicians can confirm, modify, or reject patient-logged opioid entries

### 6.4 Diversion Risk Detection

- Pattern detection algorithms monitor for unusual medication logging patterns that may indicate diversion risk:
  - Medications logged as "lost" or "spilled" with unusual frequency
  - Dose escalation not corroborated by symptom scores
  - Multiple opioid prescriptions from different sources (if data is available)
- Diversion risk flags are **never** shown to patients or caregivers
- Flags are visible only to the treating clinician and institutional administrators
- Flags are informational only -- they prompt clinical review, not automated action
- False positive risk is acknowledged -- flags are presented as "patterns requiring review," not accusations

---

## 7. Right to Disconnect

Palliative care patients have a fundamental right to periods of peace without digital intrusion. The app must respect the patient's wish to disengage without penalizing them.

### 7.1 Pause Notifications

- Patients and caregivers can **pause all notifications** from PalliCare:
  - Quick pause: 1 hour, 4 hours, 8 hours, or until tomorrow
  - Extended pause: Custom duration up to 7 days
  - Indefinite pause: Until manually resumed
- During pause:
  - No push notifications, no SMS reminders, no in-app badges
  - Data access remains fully available if the patient opens the app
  - Clinical alerts to clinicians are **not** affected -- clinician-facing alerts continue regardless of patient pause status

### 7.2 Quiet Hours

- Configurable notification-free periods (default: 10 PM -- 7 AM):
  - No medication reminders, no wellness prompts, no check-in requests during quiet hours
  - Critical safety alerts (crisis detection) may still trigger clinician notification but do **not** disturb the patient during quiet hours
  - Quiet hours are adjustable per patient preference

### 7.3 No-Guilt Design

- **Skipping symptom logs does not trigger warning messages**, guilt-inducing prompts, or admonishment
- The app never says: "You missed your log!", "You haven't checked in!", or similar guilt-framing messages
- If a symptom log is missed, the app simply makes it easy to log when the patient is ready
- Streak-based engagement mechanics (consecutive day counters, badges for daily logging) are **never** used
- The app avoids dark patterns that exploit patient vulnerability to increase engagement

### 7.4 Data Continuity

- Pausing or skipping does not create data gaps that alarm clinicians
- Clinician dashboards clearly indicate "No patient-reported data in X days" without alarm coloring
- Clinicians are informed that gaps may reflect patient preference, not clinical deterioration

---

## 8. Informed Consent with Impaired Cognition

Many palliative care patients experience cognitive impairment from disease progression, medications (opioids, sedatives), metabolic derangement, or fatigue. Standard digital consent mechanisms (long text, checkboxes) are inadequate for this population.

### 8.1 Simplified Consent Language

- All consent text is written at a **Grade 6 reading level** (Flesch-Kincaid Grade Level <= 6)
- Consent notices use:
  - Short sentences (maximum 15 words per sentence)
  - Active voice
  - Concrete examples instead of abstract legal language
  - Visual aids (icons, color coding) to supplement text
- Available in both Hindi and English with equal clarity

### 8.2 Witnessed Verbal Consent

For patients who cannot read, understand written text, or interact with touchscreens:

- **Witnessed verbal consent** is supported as a valid alternative to digital consent
- The verbal consent process records:
  - Patient's name and ID
  - Consent scope (which data, which purposes)
  - Witness name, role, and relationship to patient
  - Date and time of consent
  - Clinician or caregiver who administered the consent explanation
- Verbal consent entries are marked as such in the consent log and carry the same legal weight as digital consent within the PalliCare system

### 8.3 Consent Re-Validation

- Periodic prompts (default: every 90 days) ask patients to re-confirm their understanding and consent
- Re-validation is adjusted based on cognitive status:
  - Patients with PPS < 40% or clinician-noted cognitive decline: re-validation every 30 days with simplified questions
  - Stable patients: every 90 days
- Re-validation is a brief interaction (3-4 screens), not a full re-consent process
- If re-validation is not completed (patient too unwell), existing consent remains valid -- consent does not expire

### 8.4 Surrogate Consent

- When a patient lacks decision-making capacity (as determined by the treating clinician):
  - A legally authorized representative (LAR) or next of kin may provide consent on behalf of the patient
  - Surrogate consent is documented with the surrogate's identity, relationship, and the basis for surrogate authority
  - If the patient regains capacity, their own consent supersedes surrogate consent

---

## 9. Community Crisis Detection

PalliCare monitors symptom patterns for indicators of mental health crisis, particularly suicidal ideation. This feature carries profound ethical responsibility.

### 9.1 Detection Approach

- Crisis detection is **pattern-based**, not keyword-based:
  - Specific combinations of high depression scores (ESAS-r >= 8), high anxiety (>= 7), low wellbeing (<= 2), and expressed hopelessness in free-text notes may trigger a crisis flag
  - Single high scores alone do not trigger crisis detection -- only persistent patterns across multiple entries
- Detection is a **flag for human review**, never an automated clinical determination

### 9.2 Never Automated Response

- Crisis detection **never** triggers automated messages to the patient (e.g., "We noticed you're feeling down...")
- Crisis detection **never** automatically contacts emergency services
- Crisis detection **never** restricts patient access to the app or its features
- Crisis flags are routed to the treating clinician for **human assessment and response**

### 9.3 Clinician Response Protocol

When a crisis flag is generated:

1. The treating clinician receives a **Critical** alert with the triggering data points
2. The clinician reviews the flag and determines whether clinical intervention is needed
3. The clinician may:
   - Contact the patient directly
   - Schedule an urgent review
   - Refer to AIIMS Bhopal psychiatry services
   - Document the flag as a false positive with clinical reasoning
4. All crisis flags and responses are documented in the clinical audit trail

### 9.4 Helpline Information

The following crisis helplines are accessible within the app at all times (not only during crisis detection):

| Service | Contact | Availability |
|---|---|---|
| Vandrevala Foundation | 1860-2662-345 / 1800-2333-330 | 24x7, Hindi and English |
| iCall (TISS) | 9152987821 | Mon-Sat, 8 AM -- 10 PM |
| AIIMS Bhopal Psychiatry Emergency | Internal referral pathway via PalliCare clinician | 24x7 via AIIMS emergency |
| KIRAN Mental Health Helpline | 1800-599-0019 | 24x7, toll-free, Government of India |

- Helpline information is displayed in Settings > Emergency Contacts and is always one tap away
- During high distress scores, a non-intrusive suggestion to "Talk to someone" with helpline numbers is presented -- the patient may dismiss it without consequence

### 9.5 Ethical Boundaries of Detection

- PalliCare does **not** claim to diagnose mental health conditions
- Crisis detection is a **safety net**, not a diagnostic tool
- The app explicitly acknowledges that palliative care patients may have high distress scores as a normal part of their illness trajectory -- not every high score indicates crisis
- Clinician training on interpreting crisis flags includes palliative care context (distinguishing existential distress from suicidal ideation)

---

## 10. Research Ethics

### 10.1 ICMR 2017 Compliance

All research activities using PalliCare data comply with the **ICMR National Ethical Guidelines for Biomedical and Health Research Involving Human Participants (2017)**:

- Institutional Ethics Committee (IEC) approval required before any research data access
- Research protocols must specify data elements required, analysis methodology, and dissemination plan
- All research involving patient data (even anonymized) is registered with the AIIMS Bhopal IEC

### 10.2 Anonymization Before Analysis

- **No identifiable data leaves the clinical context** for research purposes
- Anonymization process:
  - Direct identifiers removed: name, phone number, date of birth, address
  - Quasi-identifiers generalized: age (to 5-year brackets), location (to district level)
  - Dates shifted by a random constant per patient
  - Free-text fields are not included in research datasets (may contain identifying information)
- Anonymization is performed by the DPO or designated data steward before data is made available to researchers

### 10.3 Opt-In Research Participation

- Research consent is **separate and explicit** from clinical consent
- Patients are never enrolled in research by default
- The research consent form clearly explains:
  - What data will be used
  - How it will be anonymized
  - Who will have access to the anonymized data
  - Expected outputs (publications, presentations)
  - That participation is voluntary and does not affect clinical care

### 10.4 Right to Withdraw from Research

- Patients may withdraw research consent at any time
- Withdrawal does **not** affect access to clinical features
- Upon withdrawal:
  - Future data is excluded from research datasets
  - Previously anonymized data already included in analyses cannot be recalled (it is no longer linked to the individual)
  - This limitation is clearly explained during the initial research consent process

### 10.5 Publication Ethics

- Research findings are published in aggregate -- no individual patient is identifiable in any publication
- AIIMS Bhopal is acknowledged as the data source in all publications
- Patients who contributed data are acknowledged collectively (e.g., "We thank the patients and families who participated")

---

## 11. Cultural Sensitivity

PalliCare serves a diverse Indian patient population. Cultural sensitivity is an ethical obligation, not a design preference.

### 11.1 Spiritual Care Awareness

- Educational and wellness content is available in tradition-aware variants:

| Tradition | Content Adaptations |
|---|---|
| Hindu | References to pranayama and yoga-based breathing; awareness of karma and dharma concepts in end-of-life context |
| Muslim | Awareness of salah times for notification scheduling; halal medication considerations flagged |
| Christian | Awareness of sacramental needs (anointing of the sick); prayer-based relaxation content option |
| Sikh | Awareness of Gurbani and Naam Simran for spiritual comfort; kirtan-based relaxation |
| Buddhist | Mindfulness meditation content aligned with Vipassana traditions |
| Jain | Awareness of Santhara tradition and dietary restrictions in nutritional guidance |
| Secular / No preference | Non-religious wellness content (progressive muscle relaxation, guided imagery, box breathing) |

- Tradition selection is **optional** and defaults to secular/universal content
- Patients can change their preference at any time
- No tradition is promoted over another; content is informational, not prescriptive

### 11.2 Language Parity

- Hindi and English are maintained at **full feature parity**
- No feature is available in English but not Hindi, or vice versa
- Medical terminology is presented in both languages simultaneously where clinically relevant
- Hindi content uses accessible, conversational language (not overly Sanskritized)

### 11.3 Family-Centric Care Model

- PalliCare's design reflects the **Indian cultural context** where healthcare decisions are often made collectively by the family:
  - Multiple caregivers can be linked to a single patient
  - Family meeting notes can be recorded by clinicians
  - Consent models accommodate family involvement while maintaining the patient as the primary Data Principal
- The app never forces a Western individualistic model of healthcare decision-making on families who prefer collective decision-making
- However, the patient's individual rights (privacy, consent withdrawal, data access) are always preserved and cannot be overridden by family members

### 11.4 Death and Dying Language

- The app uses **culturally appropriate terminology** for death and dying:
  - Avoids clinical euphemisms that obscure meaning ("passed away" instead of "expired" in clinical context)
  - Avoids overly casual language that may feel disrespectful
  - Hindi terminology follows common cultural usage, not medical jargon
- Prognostic language is honest but compassionate -- the app does not deliver prognostic information; it supports clinician-patient communication

### 11.5 Dietary and Religious Observances

- Medication scheduling can accommodate religious observances:
  - Ramadan fasting awareness for Muslim patients (adjustable medication timing)
  - Festival-aware notification scheduling (reduced non-essential notifications during major observances)
- These accommodations are patient-configured and optional

---

## 12. Algorithmic Transparency

### 12.1 No Opaque AI Decision-Making

- PalliCare does not use opaque machine learning models to make clinical recommendations
- All alert thresholds, MEDD calculations, and risk flags use **transparent, rule-based algorithms** that clinicians can inspect and understand
- The logic behind every clinical alert is documented and available to clinicians

### 12.2 Explainable Alerts

- Every clinical alert includes:
  - The specific data points that triggered it
  - The threshold or rule that was exceeded
  - The confidence level
  - Recommended clinical action
- Clinicians are never presented with a recommendation without its rationale

### 12.3 Bias Awareness

- Symptom assessment tools (ESAS-r, NRS, PAINAD) have known validation limitations across different populations
- PalliCare documents these limitations in clinician-facing help text
- Cultural and linguistic factors that may affect symptom self-reporting are noted (e.g., pain expression norms vary across cultures)

---

## 13. Equity and Access

### 13.1 No Premium Gating

- All clinical features are available to all users without payment
- No "premium" tier exists for patients or caregivers
- Feature access is determined by clinical role (patient, caregiver, clinician), not ability to pay

### 13.2 Offline-First Architecture

- Core features (symptom logging, medication tracking, educational content) function without internet connectivity
- Data is synced when connectivity is restored
- This design ensures equitable access for patients in rural areas or areas with unreliable connectivity, which is common in many parts of India

### 13.3 Low-End Device Support

- The app targets Android devices from API level 21 (Android 5.0) onwards
- Performance optimization ensures usability on devices with limited RAM (2GB minimum)
- Data storage is managed efficiently to minimize device storage requirements

### 13.4 Literacy Accommodation

- Voice input, large text options, and icon-based interaction reduce literacy barriers
- Hindi language support serves the majority of the AIIMS Bhopal patient population
- Future consideration: support for additional regional languages based on patient population needs

---

## 14. Review and Governance

### 14.1 Ethics Review Cadence

| Review Activity | Frequency | Responsible Party |
|---|---|---|
| Full ethics framework review | Annual | AIIMS Bhopal IEC + PalliCare clinical team |
| Alert threshold review | Quarterly | Palliative Medicine department |
| Crisis detection accuracy review | Quarterly | Psychiatry liaison + PalliCare team |
| Caregiver burnout screening validation | Annual | Psychology department |
| Cultural sensitivity content review | Annual | Multi-faith advisory panel |
| Data protection impact assessment | Annual or upon significant feature change | DPO |
| Opioid safety algorithm review | Semi-annual | Pharmacology + Palliative Medicine |

### 14.2 Ethics Incident Reporting

- Any ethical concern (from patients, caregivers, clinicians, or staff) can be reported to:
  - In-app: Settings > Feedback > Report an Ethical Concern
  - Email: ethics@pallicare.in
  - The AIIMS Bhopal Institutional Ethics Committee
- Reports are reviewed within 7 working days
- Reporters may remain anonymous

### 14.3 Continuous Improvement

- This Ethics Framework is a living document, updated as:
  - New clinical evidence emerges on palliative care ethics
  - Patient and caregiver feedback reveals ethical gaps
  - Regulatory requirements change (DPDPA rules, ICMR updates)
  - New features are developed that raise ethical considerations
- All updates are documented with version history and rationale

### 14.4 Accountability

- The Head of the Department of Palliative Medicine, AIIMS Bhopal, is the executive sponsor of this Ethics Framework
- The DPO is responsible for data-related ethical compliance
- The PalliCare development team is responsible for implementing ethical design requirements
- The AIIMS Bhopal IEC provides independent ethical oversight

---

## Appendix: Ethical Decision-Making Checklist

Before any new feature is approved for development, it must pass the following ethical review:

- [ ] **Autonomy:** Does this feature respect patient choice and control?
- [ ] **Beneficence:** Does this feature provide clear clinical or wellbeing benefit?
- [ ] **Non-maleficence:** Could this feature cause harm, distress, guilt, or burden? How is that risk mitigated?
- [ ] **Justice:** Is this feature accessible to all users regardless of literacy, connectivity, device quality, or socioeconomic status?
- [ ] **Dignity:** Does this feature treat end-of-life patients with dignity?
- [ ] **Consent:** Is appropriate consent obtained for this feature's data collection?
- [ ] **Cultural sensitivity:** Has this feature been reviewed for cultural appropriateness across religious and linguistic groups?
- [ ] **Caregiver impact:** Does this feature increase or decrease caregiver burden?
- [ ] **Clinician impact:** Does this feature increase or decrease clinician cognitive load?
- [ ] **Data minimization:** Does this feature collect only the data it needs?
- [ ] **Transparency:** Can the user understand what this feature does and why?

---

*This Ethics Framework was developed by the PalliCare clinical and technical team at AIIMS Bhopal, with input from the Department of Palliative Medicine, the Department of Psychiatry, the Institutional Ethics Committee, and patient advocacy representatives.*
