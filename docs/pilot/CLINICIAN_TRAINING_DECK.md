# PalliCare Clinician Training Deck
## Dashboard & Workflow Integration — 15 Slides

---

### Slide 1: Title
**PalliCare Clinician Dashboard**
*Palliative Care Monitoring & Decision Support*
AIIMS Bhopal | Department of Anaesthesiology & Palliative Medicine

---

### Slide 2: What is PalliCare?
- Mobile app for patients to log pain, symptoms, and medications
- Web dashboard for clinicians to monitor and respond
- Bilingual (Hindi/English), offline-first
- **Goal**: Better pain control through real-time data

---

### Slide 3: The Problem We're Solving
- Pain assessment only happens during clinic visits (every 2-4 weeks)
- Patients forget symptom details between visits
- Breakthrough pain episodes go unreported
- Medication adherence is hard to track
- Caregiver distress is often invisible

---

### Slide 4: Patient App Overview
- **Pain Logging**: NRS 0-10, body map, qualities, aggravators
- **Medication Tracker**: Dose logging, reminders, PRN tracking
- **Symptom Diary**: Mood, sleep, ESAS-r scores
- **Education**: Pain management modules (Hindi)
- **Breathing Exercises**: 4-7-8, box breathing, pranayama

---

### Slide 5: Dashboard — Patient List
- Traffic light triage: Red (NRS >=8), Yellow (5-7), Green (<5), Grey (no data 48h+)
- Search by name, filter by status
- Sort by pain level, adherence, last activity
- Click any patient to see detailed view

---

### Slide 6: Dashboard — Patient Detail View
**3-Column Layout:**
- **Left**: Pain Assessment — Current NRS, 7-day sparkline, breakthrough count, pain qualities
- **Center**: Medications — MEDD display, current regimen, adherence %, PRN usage, side effects
- **Right**: Symptoms & Wellbeing — Top 3 bothersome, mood trend, sleep, caregiver distress

---

### Slide 7: Dashboard — Pain Trend Chart
- Full-width 30-day pain trend (color-coded bars)
- Toggle: 7 days / 30 days / All
- Identify patterns: escalating pain, breakthrough clusters
- Color legend: Green (mild) → Yellow (moderate) → Red (severe)

---

### Slide 8: Dashboard — Clinical Alerts
**4-Tier Priority System:**
| Level | Color | Examples |
|-------|-------|----------|
| Critical (P0) | Red | NRS >7 sustained 4h+, MEDD >200mg |
| Warning (P1) | Amber | Breakthrough >3/day, adherence <70% |
| Info (P2) | Blue | Low mood 3+ days, sleep disruption |
| Low (P3) | Grey | Incomplete logs, missed check-in |

- Acknowledge → Resolve workflow
- Unacknowledged critical alerts escalate after 30 minutes

---

### Slide 9: Dashboard — MEDD Safety
- Morphine Equivalent Daily Dose calculated automatically
- **Red flag**: MEDD > 200mg/day
- **NDPS compliance**: Alerts for dose changes requiring register updates
- Equianalgesic conversion built into dashboard

---

### Slide 10: Dashboard — MDT Collaboration
- **SBAR Handover**: Auto-generated from patient data (Situation, Background, Assessment, Recommendation)
- **Shared Care Plan**: Goals of care, pain management plan, team tasks with checklist
- **Team Discussion**: Real-time messaging between MDT members

---

### Slide 11: Dashboard — Analytics
- Department-wide metrics: Active patients, quality metrics, opioid utilization
- Pain distribution across patient cohort
- NABH/NAAC report generation
- Research data export (CSV, cohort builder, REDCap)

---

### Slide 12: Clinical Workflow Integration
**When to Check the Dashboard:**
| Timing | Action |
|--------|--------|
| Start of shift | Review alert center for overnight flags |
| Before clinic | Check patient detail for upcoming appointments |
| After rounds | Update notes, resolve alerts |
| Weekly | MDT review using SBAR + shared care plan |

---

### Slide 13: What Patients See (Screenshots)
- Home screen: "Today, You Matter" + comfort score
- Quick pain log: 3 taps to log NRS
- Medication strip: One-tap dose confirmation
- Pain diary: Calendar heatmap of their own data

---

### Slide 14: Pilot Study — Your Role
- **8-week pilot** with 20-30 patients
- Check dashboard at least **once daily** during pilot
- Acknowledge alerts within **30 minutes** (critical) or **same day** (warning)
- Record any usability issues or clinical concerns
- Complete exit survey at end of pilot

---

### Slide 15: Support & Contacts
| Need | Contact |
|------|---------|
| Technical issues | [Tech support email/phone] |
| Clinical questions | Dr. [PI Name] |
| App access problems | [IT support] |
| Feedback | In-app feedback button or email |

**Dashboard URL**: [staging-url]
**Login**: Your AIIMS email credentials

---

*PalliCare v0.5.0 | Built for AIIMS Bhopal Palliative Care*
