# PalliCare Clinician Training Deck

## Dashboard & Workflow Integration — 15 Slides

> **Audience**: Palliative care clinicians (doctors, nurses, psychologists, pharmacists)
> **Duration**: 45 minutes
> **Version**: 1.0 | March 2026
> **Institution**: AIIMS Bhopal, Department of Anaesthesiology & Palliative Medicine

---

### Slide 1: Title Slide

**PalliCare Clinician Dashboard**
*Real-Time Palliative Care Monitoring & Decision Support*

AIIMS Bhopal | Department of Anaesthesiology & Palliative Medicine
Pilot Study Training | March 2026

---

### Slide 2: What is PalliCare?

**A three-part mHealth system for palliative care:**

| Component | Users | Purpose |
|-----------|-------|---------|
| **Patient Mobile App** (Android) | Patients, Caregivers | Symptom logging, medication tracking, breathing exercises, psychoeducation |
| **Clinician Dashboard** (Web) | Doctors, Nurses, MDT | Real-time patient monitoring, clinical alerts, care coordination |
| **Backend API** | System | Data processing, alert generation, analytics |

**Key Features:**
- Bilingual: Hindi and English
- Offline-first: works without internet
- NRS pain scoring + ESAS-r + body mapping
- MEDD (Morphine Equivalent Daily Dose) auto-calculation
- Clinical alert system with escalation
- SBAR handover generation

---

### Slide 3: The Problem We Are Solving

**Current gaps in palliative care monitoring:**

| Gap | Impact |
|-----|--------|
| Pain assessed only during clinic visits (every 2-4 weeks) | Prolonged uncontrolled pain between visits |
| Patients forget symptom details | Inaccurate clinical picture at follow-up |
| Breakthrough pain episodes go unreported | Missed opportunities for dose adjustment |
| Medication adherence is guesswork | Over- or under-dosing risks |
| Caregiver distress is invisible | Caregiver burnout, reduced care quality |
| Paper-based records are fragmented | Difficult to identify trends and patterns |

**PalliCare bridges these gaps** by enabling continuous, patient-reported symptom data that flows directly to your dashboard.

---

### Slide 4: Patient App Overview

**What patients see and do:**

| Feature | Description | Frequency |
|---------|-------------|-----------|
| **Quick Pain Log** | NRS 0-10 + mood in 3 taps | Minimum 3x/week |
| **Full Symptom Log** | NRS + body map + qualities + ESAS-r + sleep + notes | As desired |
| **Breakthrough Pain** | Acute pain event + rescue medication tracking + 30-min follow-up | As occurs |
| **Medication Tracker** | Dose confirmation per scheduled time, PRN logging, side effects | Daily |
| **Breathing Exercises** | Guided 4-7-8, box breathing, pranayama with visual + audio | On demand |
| **Learn Modules** | Pain education, medication info, self-management tips (Hindi) | On demand |
| **Caregiver Mode** | Proxy logging, wellness check, burnout self-assessment | For caregivers |

**Data entry takes 30 seconds (Quick Log) to 5 minutes (Full Log).**

---

### Slide 5: Dashboard — Patient List View

**Traffic Light Triage System:**

| Color | Criteria | Action Required |
|-------|----------|-----------------|
| **Red** | Latest NRS >= 8, OR critical alert active | Immediate review |
| **Yellow** | Latest NRS 5-7, OR warning alert active | Same-day review |
| **Green** | Latest NRS < 5, no active alerts | Routine monitoring |
| **Grey** | No data for 48+ hours | Follow-up needed |

**Patient List Features:**
- Search by name or UHID
- Filter by triage color, alert status, or assigned clinician
- Sort by: pain severity (highest first), last activity, medication adherence, MEDD
- Click any patient row to open the detailed patient view
- Unacknowledged alert count shown as a badge on each patient card

---

### Slide 6: Dashboard — Patient Detail View

**Three-Panel Layout:**

| Panel | Content |
|-------|---------|
| **Left: Pain Assessment** | Current NRS score with color indicator; 7-day sparkline chart; breakthrough pain count (last 7 days); dominant pain qualities; pain location body map overlay |
| **Center: Medications** | Total MEDD display (with threshold warning); current active medications table; adherence percentage (last 7 days); PRN usage count and trend; reported side effects |
| **Right: Symptoms & Wellbeing** | Top 3 most bothersome ESAS-r symptoms; mood trend (7-day); sleep quality pattern; caregiver wellness score (if caregiver enrolled); functional status notes |

**Below the panels:** Full-width expandable sections for clinical notes, alert history, and care plan.

---

### Slide 7: Dashboard — Pain Trend Charts

**Visualizing Pain Over Time:**

- **30-day pain trend chart**: Color-coded bars (green 0-3, yellow 4-6, red 7-10)
- **Time range toggle**: 7 days / 30 days / All
- **Breakthrough overlay**: Breakthrough pain events marked as triangular markers on the chart
- **ESAS-r radar chart**: Nine symptom dimensions shown as a spider plot; compare current vs previous assessment
- **Sleep and mood timeline**: Overlaid on pain chart to identify correlations

**Clinical Questions the Chart Helps Answer:**
- Is pain escalating, stable, or improving?
- Are breakthrough episodes clustering at specific times?
- Is there correlation between mood decline and pain spikes?
- Did a medication change result in improved pain control?

---

### Slide 8: Dashboard — Clinical Alerts System

**Three-Tier Alert Severity:**

| Severity | Color | Trigger Examples | Response Time |
|----------|-------|-----------------|---------------|
| **Critical** | Red | NRS >= 8 sustained for 4+ hours; MEDD > 200 mg/day; 3+ breakthrough episodes in 24 hours; severe opioid side effects | **30 minutes** (escalates if not acknowledged) |
| **Warning** | Amber | Pain trend worsening over 3+ days; medication adherence < 70% (7-day); PRN overuse; sustained low mood (3+ days); caregiver distress flag | **Same day** |
| **Informational** | Blue | No data for 48+ hours; sleep severely disrupted 3+ nights; ESAS symptom newly scored >= 7; functional decline noted | **Next clinic visit** |

**Alert Lifecycle:**
1. Alert created (auto-generated by system rules)
2. Alert acknowledged (clinician sees and clicks "Acknowledge")
3. Alert in progress (clinician documents action taken)
4. Alert resolved (clinician documents outcome) OR dismissed (false alarm)

**Escalation**: Unacknowledged critical alerts escalate after 30 minutes: nurse -> registrar -> consultant.

---

### Slide 9: Dashboard — MEDD Tracking and Safety

**Morphine Equivalent Daily Dose (MEDD):**

| Display Element | Description |
|-----------------|-------------|
| **Total daily MEDD** | Sum of all opioid contributions, displayed prominently with color coding |
| **Per-medication breakdown** | Each opioid's dose, conversion factor, and MEDD contribution |
| **Threshold indicators** | Green (< 100 mg), Yellow (100-200 mg), Red (> 200 mg) |
| **Trend chart** | MEDD over last 30 days — identify escalation patterns |

**Safety Alerts:**
- MEDD > 200 mg/day triggers a critical alert
- Rapid MEDD increase (> 50% in 7 days) triggers a warning
- New opioid added without dose reduction of existing opioid: warning

**Equianalgesic Conversion Table:** Built into the dashboard for quick reference during medication adjustments.

**NDPS Compliance:** Alerts for dose changes that may require Narcotic Drug and Psychotropic Substance register updates.

---

### Slide 10: Dashboard — Medication Management

**Active Medication List:**

| Column | Details |
|--------|---------|
| Medication name | Generic + brand name (Hindi name if available) |
| Dose & route | e.g., Morphine 10 mg PO |
| Frequency | e.g., Q4H, TID, PRN |
| WHO ladder step | Step 1 / 2 / 3 indicator |
| Adherence (7-day) | Percentage bar chart |
| MEDD contribution | mg/day |
| Side effects | Active complaints count |
| Actions | View details, flag for review |

**PRN Section:**
- List of PRN medications with indication
- PRN usage count per day (last 7 days)
- Average time between PRN doses
- Alert if PRN usage suggests need for scheduled dose increase

**Side Effects Panel:**
- Patient-reported side effects aggregated by medication
- Common opioid side effects tracked: constipation, nausea, drowsiness, confusion, itching
- Severity rating for each reported side effect

---

### Slide 11: Dashboard — Generating Reports

**Available Reports:**

| Report Type | Content | Export Format |
|-------------|---------|---------------|
| **Patient Summary** | Current status, pain trend, medications, alerts | PDF |
| **Pain Assessment Report** | Detailed pain analysis: NRS trend, body map, qualities, triggers | PDF |
| **Medication Review** | Full medication list, MEDD calculation, adherence data, side effects | PDF |
| **SBAR Handover** | Auto-generated Situation-Background-Assessment-Recommendation | PDF / Print |
| **Clinic Visit Summary** | Pre-visit summary for upcoming appointment | PDF / Print |
| **Cohort Analytics** | Aggregate metrics across all enrolled patients | CSV / PDF |

**SBAR Handover Generator:**
- **Situation**: Patient name, age, diagnosis, current NRS, active alerts
- **Background**: Medication history, MEDD trend, recent changes
- **Assessment**: Pain trend analysis, key ESAS findings, adherence status
- **Recommendation**: System-suggested actions based on alert rules

**Research Export:**
- De-identified dataset export for biostatistician
- CSV format compatible with SPSS, R, REDCap
- Configurable columns and date ranges

---

### Slide 12: Dashboard — Data Interpretation Guide

**How to Read the Data:**

| Data Pattern | Clinical Interpretation | Suggested Action |
|-------------|------------------------|------------------|
| NRS stable 0-3 | Good pain control | Continue current regimen |
| NRS 4-6 with stable trend | Moderate pain, manageable | Review at next visit; consider adjuvant |
| NRS escalating over days | Progressive pain, possible disease progression | Urgent medication review; consider dose increase |
| NRS >= 8 sustained | Uncontrolled pain crisis | Immediate contact; consider admission |
| Breakthrough > 3/day | Inadequate background analgesia | Increase scheduled opioid dose |
| MEDD > 200 mg/day | High opioid dose — heightened monitoring needed | Specialist review; consider rotation or adjuvants |
| Adherence < 70% | Medication non-compliance | Assess barriers (side effects, access, understanding) |
| Mood "distressed" 3+ days | Sustained emotional distress | Psychological support referral |
| No data 48+ hours | Patient may be unwell or disengaged | Phone follow-up |
| Caregiver distress flag | Caregiver approaching burnout | Caregiver support referral; respite care discussion |

**Important**: App data supplements but does not replace clinical assessment. Always correlate with clinical examination.

---

### Slide 13: Dashboard — Troubleshooting Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Patient not appearing on dashboard | Not yet enrolled in study, or sync delay | Verify enrollment; check if patient's app has synced |
| No data from a patient | Patient not logging, or offline without sync | Contact patient; check app connectivity |
| Alert seems incorrect | Edge case in alert rule logic | Review raw data; provide feedback to tech team |
| Dashboard slow to load | Large dataset or network issue | Refresh page; clear browser cache; check internet |
| Cannot access patient data | Role-based restriction | Verify you are assigned to the patient; contact admin |
| MEDD calculation seems wrong | Missing medication entry or incorrect dose unit | Review medication list for completeness; report if conversion factor seems incorrect |
| Duplicate patient entries | Patient registered twice | Report to research coordinator for merge |
| Export not downloading | Browser blocking popup or download | Allow popups for dashboard URL; try different browser |

**Technical Support**: [support email/phone] — available during pilot hours

---

### Slide 14: Pilot Study — Your Role as a Clinician

**Study Duration**: 4 weeks of active patient monitoring

**Your responsibilities during the pilot:**

| Task | Frequency | Detail |
|------|-----------|--------|
| **Check dashboard** | At least once daily | Review alert center, patient list |
| **Acknowledge critical alerts** | Within 30 minutes | Click "Acknowledge" and document action |
| **Acknowledge warning alerts** | Same day | Review and respond or dismiss |
| **Review patient data before visits** | Before each clinic appointment | Use clinic visit summary report |
| **Document actions** | As needed | Note alert resolutions and clinical decisions |
| **Report issues** | As they arise | Technical bugs, clinical concerns, false alerts |
| **Complete exit survey** | Week 4 | 12-item clinician utility questionnaire |
| **Participate in focus group** | Week 5 | 45-minute team discussion on experience |

**What you should NOT do:**
- Do NOT rely solely on app data for clinical decisions
- Do NOT change medications based on app data without clinical assessment
- Do NOT share dashboard access credentials
- Do NOT contact patients outside normal clinical channels based on app data (unless critical alert)

---

### Slide 15: Data Privacy, Security, and Contacts

**Data Privacy (DPDPA 2023 Compliance):**
- All patient data is encrypted in transit (TLS 1.3) and at rest (AES-256)
- You can only see data for patients assigned to you
- All dashboard access is audit-logged (timestamp, user, action)
- Patient names are visible only on the dashboard; published data is anonymized
- Do not screenshot or export identifiable data outside the dashboard

**Your Obligation:**
- Treat all patient data as confidential per AIIMS Bhopal policy
- Do not share login credentials
- Log out when leaving workstation
- Report any suspected data breach to PI immediately

**Key Contacts:**

| Need | Contact |
|------|---------|
| Clinical questions about pilot | Dr. [PI Name] — [Phone] |
| Technical issues with dashboard | [Tech support email / phone] |
| Patient app issues | [Tech support — patient helpline] |
| Data privacy concern | [PI / Data Protection contact] |
| Research coordinator | [Name] — [Phone] |

**Dashboard Access:**
- **URL**: [https://dashboard.pallicare.app] (staging)
- **Login**: Your AIIMS email credentials
- **Browser**: Chrome, Firefox, or Edge (latest version)
- **First login**: You will be asked to set up your password and verify your email

---

*PalliCare v1.0 | Built for AIIMS Bhopal Palliative Care*
*Department of Anaesthesiology & Palliative Medicine*
*"Today, You Matter"*
