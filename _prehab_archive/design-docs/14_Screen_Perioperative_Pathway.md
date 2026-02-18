# Screen 14 — Perioperative Palliative Pathway (Clinician)

> **Tagline**: "End-to-End Perioperative Management for Palliative Surgical Patients"
> **Version**: 1.0  |  **Updated**: 2026-02-16  |  **Spec ID**: DOC-14
> **Status**: Draft  |  **Platform**: Web (React) + Tablet (10"+)

---

## Screen Purpose

The Perioperative Pathway provides clinicians with a unified view of the entire surgical journey for palliative patients — from prehabilitation planning through post-operative recovery and discharge. It implements Dr. Soumya Thakur's "Anaesthesia for Palliative Surgery" 5-Pillar Framework as the clinical backbone.

> **Design Philosophy**: Palliative surgical patients are among the most complex in any hospital. Their care demands coordination across specialties, meticulous optimization, and unwavering attention to goals of care. This screen does not simplify — it organizes. Every pillar, every metric, every checklist is here because it changes outcomes.

### Core Clinical Framework
Based on "Introduction and Role of an Anaesthesiologist in Palliative Care" (Dr. Soumya Thakur, moderated by Dr. Vaishali Waindeskar):

1. **Pillar 1**: Analgesic Optimization
2. **Pillar 2**: Medical Optimization of Comorbidities
3. **Pillar 3**: Psychosocial Assessment & Support
4. **Pillar 4**: Decision-Making Capacity Assessment
5. **Pillar 5**: Goal-Directed Anaesthetic Planning

### Target Users
- Anaesthesiologists (primary)
- Surgeons
- Palliative care physicians
- Nursing staff
- Physiotherapists & Dietitians (limited view)

### Clinical Rationale
Palliative surgical patients differ from standard surgical patients in several critical dimensions:
- Pre-existing opioid therapy complicates perioperative pain management
- Malnutrition and cancer cachexia impair wound healing
- Psychological burden is higher, affecting recovery trajectories
- Advance directives must be explicitly addressed before anaesthesia
- Goals of care may shift between curative-intent and symptom relief
- Prehabilitation offers measurable gains even in limited timeframes

---

## Navigation

- **Clinician Dashboard** → "Perioperative" tab (new tab in top navigation)
- **Patient List** → Patient row → "Periop" quick action button
- **Direct URL**: `/clinician/perioperative/:pathwayId`
- **Keyboard shortcut**: `Ctrl+P` from any clinician view → Periop search
- **Breadcrumb**: Dashboard > Perioperative > [Patient Name] > [Current View]

### Tab Integration with Screen 10

```
┌─────────────────────────────────────────────────────────────────────┐
│  PalliCare Clinical Dashboard · AIIMS Bhopal                       │
│  Dr. Thakur · Anaesthesia · 2 periop alerts                       │
├──────────┬──────────────────────────────────────────────────────────┤
│          │  [ Patients ] [ Alerts ] [ Analytics ] [ Perioperative ]│
│ SIDEBAR  │            ↑ NEW TAB — this screen                      │
│          │                                                          │
│ Patients │  ┌─────────────────────────────────────────────────┐    │
│ Alerts   │  │  Perioperative Pathway views render here        │    │
│ Analytics│  │                                                  │    │
│ Periop   │  │  View 1: Surgical Pathway List                  │    │
│ Research │  │  View 2: Individual 5-Pillar Dashboard          │    │
│ MDT      │  │  View 3: Prehab Progress Dashboard              │    │
│ Settings │  │  View 4: Perioperative Notes                    │    │
│          │  │  View 5: Post-Op Tracking                       │    │
│          │  │  View 6: Pre-Op Briefing Generator              │    │
│          │  └─────────────────────────────────────────────────┘    │
└──────────┴──────────────────────────────────────────────────────────┘
```

---

## View 1: Surgical Pathway List

> The entry point. Every active and recent surgical pathway for the clinician's patients, at a glance.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Perioperative Pathways (17)     [ Search patient or MRN ]  [ + New ]   │
│                                                                          │
│  ┌────────┐ ┌────────────────┐ ┌──────────────┐ ┌──────────────────┐   │
│  │ Active │ │ This Week: 4   │ │ At Risk: 2   │ │ Post-Op Active: 5│   │
│  │   17   │ │ surgeries      │ │ readiness<40%│ │ recovering       │   │
│  └────────┘ └────────────────┘ └──────────────┘ └──────────────────┘   │
│                                                                          │
│  Filters: [ Status ] [ Surgeon ] [ Procedure ] [ Date Range ] [ ASA ]  │
│                                                                          │
│  ┌───┬──────────┬──────────┬──────────┬─────┬────────┬───────┬────┬───┐│
│  │   │ Patient  │ Surgery  │ Procedure│ ASA │ Prehab │Readi- │Days│Act││
│  │   │ Name     │ Date     │          │     │ Status │ness % │Left│   ││
│  ├───┼──────────┼──────────┼──────────┼─────┼────────┼───────┼────┼───┤│
│  │ ! │ Ramesh K │ 21 Feb   │ Colostomy│ III │ Active │ 72% ● │ 5  │ > ││
│  │   │ MRN-4521 │ 2026     │ (pallia.)│     │ ██████ │ Green │    │   ││
│  ├───┼──────────┼──────────┼──────────┼─────┼────────┼───────┼────┼───┤│
│  │!!!│ Sunita D │ 18 Feb   │ Pleurode-│ IV  │ Active │ 38% ● │ 2  │ > ││
│  │   │ MRN-7788 │ 2026     │ sis      │     │ ████   │ Red   │    │   ││
│  ├───┼──────────┼──────────┼──────────┼─────┼────────┼───────┼────┼───┤│
│  │   │ Vikram P │ 25 Feb   │ Stent    │ II  │ Pre-Op │ 81% ● │ 9  │ > ││
│  │   │ MRN-3390 │ 2026     │ (biliary)│     │ ██████ │ Green │    │   ││
│  └───┴──────────┴──────────┴──────────┴─────┴────────┴───────┴────┴───┘│
│                                                                          │
│  Page 1 of 2   [ < ] [ 1 ] [ 2 ] [ > ]          Showing 10 of 17      │
└──────────────────────────────────────────────────────────────────────────┘
```

### [A] Pathway Table
Full-width sortable table:

| Column | Description | Sort | Filter |
|--------|-------------|------|--------|
| Alert Icon | `!` = 1 alert, `!!` = 2, `!!!` = 3+ | Numeric | Has alerts toggle |
| Patient Name | Full name + MRN on second line | Alpha | Text search |
| Surgery Date | Planned date in `DD MMM YYYY` format | Date (default) | Date range picker |
| Procedure | Surgery name with intent in parentheses | Alpha | Procedure type dropdown |
| ASA Score | ASA-PS classification badge (I through VI) | Numeric | Score range multi-select |
| Prehab Status | Lifecycle state badge + mini progress bar | Status | Multi-select |
| Readiness Score | 0-100% with color dot indicator | Numeric | Range slider |
| Days to Surgery | Countdown (negative for post-op: "POD 3") | Numeric | — |
| Actions | Chevron → Opens individual pathway | — | — |

### [B] Summary Cards (Top Bar)
Four cards, horizontally aligned, each clickable to filter the table:

| Card | Content | Visual |
|------|---------|--------|
| Active Pathways | Total count of non-discharged, non-cancelled pathways | Deep Teal number |
| This Week's Surgeries | Surgeries scheduled within current Mon-Sun | Golden Amber number |
| At Risk | Readiness score < 40% AND surgery within 14 days | Red badge, pulsing if any critical |
| Post-Op Active | Status = `post_op`, currently recovering | Teal number |

Click behavior: Clicking a card applies the corresponding filter to the table below.

### [C] Status Badges

| Status | Color | Hex | Condition |
|--------|-------|-----|-----------|
| `Planned` | Light Grey | `#E0E0E0` | Pathway created, prehab not yet started |
| `Prehab Active` | Lavender | `#D9D4E7` | Patient enrolled in prehabilitation |
| `Pre-Op` | Golden Amber | `#E8A838` | Within 48h of surgery, final checks |
| `Intra-Op` | Soft Coral | `#E87461` | Patient in operating theatre |
| `Post-Op` | Teal | `#2A6B6B` | Post-operative recovery phase |
| `Discharged` | Sage Green | `#7BA68C` | Pathway complete, patient discharged |
| `Cancelled` | Light Grey | `#CCCCCC` | Surgery cancelled, text with strikethrough |
| `Fast-Track` | Deep Amber | `#D48B00` | Emergency or urgent, prehab abbreviated |

### [D] Quick Actions Bar

```
┌──────────────────────────────────────────────────────────────────┐
│ [ + New Pathway ]    [ Bulk Pre-Op Review ]    [ Export CSV ]    │
│   Deep Teal btn       Secondary btn             Icon button      │
└──────────────────────────────────────────────────────────────────┘
```

- **"+ New Pathway"** button (Deep Teal `#2A6B6B`) — Opens pathway creation wizard
- **"Bulk Pre-Op Review"** — Opens multi-patient checklist view for batch pre-op sign-off
- **Export** — CSV download of the current filtered pathway list

### [E] Empty State
When no pathways exist:

```
┌─────────────────────────────────────────────────┐
│                                                   │
│    No perioperative pathways yet.                 │
│                                                   │
│    Create a pathway to start managing a           │
│    patient's surgical journey with the            │
│    5-Pillar Framework.                            │
│                                                   │
│         [ + Create First Pathway ]                │
│                                                   │
└─────────────────────────────────────────────────┘
```

### [F] Row Interaction
- **Click row** → Opens View 2 (Individual 5-Pillar Dashboard)
- **Hover** → Row highlights with subtle left-border color matching pathway status
- **Right-click** → Quick menu: View, Edit, Add Note, View Pre-Op Briefing, Cancel Pathway
- **Alert icon hover** → Tooltip listing alert summaries

---

## View 2: Individual Pathway — 5-Pillar Dashboard

> **The CORE view.** This is where clinical decisions are made. Accessed by clicking a patient row from View 1. Full-page layout with collapsible pillar sections arranged vertically.

### Header

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Back to Pathways                                                      │
│                                                                          │
│  Ramesh Kumar · 58/M · MRN-4521 · ABHA: XXXX-XXXX-XXXX                │
│  Dx: Carcinoma Colon (Stage IIIB) with Hepatic Metastases              │
│  Surgery: Palliative Colostomy · 21 Feb 2026 · Dr. A. Patel · OT-3     │
│  Intent: Palliative (obstruction relief)                                 │
│                                                                          │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐ ┌────────┐ ┌──────┐│
│  │ Planned │→│ Prehab   │→│ Pre-Op │→│ Intra-Op │→│Post-Op │→│ D/C  ││
│  │   ✓     │ │  ●active │ │        │ │          │ │        │ │      ││
│  └─────────┘ └──────────┘ └────────┘ └──────────┘ └────────┘ └──────┘│
│                                                                          │
│  [ Edit Pathway ] [ Add Note ] [ Generate Briefing ] [ Print Summary ] │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Patient line**: Name, age, gender, MRN, ABHA ID
- **Diagnosis line**: Primary diagnosis + staging + metastatic sites
- **Surgery line**: Procedure name, date, surgeon, operating theatre, institution
- **Intent line**: Curative / Palliative (with brief indication, e.g., "obstruction relief")
- **Pathway timeline**: Horizontal stepper with current step highlighted in Deep Teal, completed steps showing checkmarks, future steps greyed out
- **Quick actions**: Edit Pathway | Add Note | Generate Briefing | Print Summary

### Pillar Tabs (Sub-Navigation)

Below the header, five clickable pillar tabs plus additional views:

```
┌─────────────┬─────────────┬─────────────┬──────────────┬──────────────┐
│  1. Pain    │  2. Medical │ 3. Psycho-  │ 4. Capacity  │ 5. Anaesth.  │
│  Management │  Optimiz.   │ social      │ & Consent    │ Plan         │
└─────────────┴─────────────┴─────────────┴──────────────┴──────────────┘
  Also accessible: [ Prehab Progress ] [ Notes ] [ Post-Op ] [ Briefing ]
```

Each pillar tab shows a small status indicator:
- Grey circle: Not started
- Amber circle: In progress
- Green circle: Cleared/Optimized
- Red circle: Issues flagged

---

### Pillar 1: Analgesic Optimization (Pillar of Pain Management)

> Hindi label: दर्द प्रबंधन

#### Section 1A: Current Pain Regimen Table

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Current Pain Regimen                               MEDD: 75 mg/day    │
│                                                                          │
│  ┌────────────┬──────┬───────┬───────┬──────────┬──────────────────┐   │
│  │ Medication │ Dose │ Route │ Freq  │ MEDD     │ Pre-Op Action    │   │
│  ├────────────┼──────┼───────┼───────┼──────────┼──────────────────┤   │
│  │ Morphine SR│ 30mg │ Oral  │ BD    │ 60 mg    │ CONTINUE         │   │
│  │ Paracetamol│ 1g   │ Oral  │ QDS   │ —        │ CONTINUE         │   │
│  │ Ibuprofen  │ 400mg│ Oral  │ TDS   │ —        │ STOP 7d pre-op   │   │
│  │ Gabapentin │ 300mg│ Oral  │ TDS   │ —        │ CONTINUE         │   │
│  │ Morphine IR│ 10mg │ Oral  │ PRN   │ variable │ MODIFY→IV PRN    │   │
│  └────────────┴──────┴───────┴───────┴──────────┴──────────────────┘   │
│                                                                          │
│  [ + Add Medication ]  [ Opioid Conversion Calculator ]                 │
└──────────────────────────────────────────────────────────────────────────┘
```

**Pre-Op Action tags** (color-coded inline badges):
- `CONTINUE` — Green (`#7BA68C`)
- `STOP` — Red (`#E87461`) with timing (e.g., "7d pre-op", "morning of surgery")
- `MODIFY` — Amber (`#E8A838`) with change details
- `NEW` — Blue (`#5B8DB8`) for new perioperative additions
- `TAPER` — Purple (`#9B7BB8`) with taper schedule

**MEDD Auto-Calculation**:
- Displayed in header: Total Morphine Equivalent Daily Dose
- Source: PalliCare integrated CDS (Clinical Decision Support) equianalgesic tables
- Updates dynamically as medications are edited
- Warning badge if MEDD > 120 mg/day: "High opioid dose — consider specialist review"

#### Section 1B: Pain Trend Panel

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Pain Trends                    [ 7 days ] [ 30 days ] [ All ]          │
│                                                                          │
│  10│                                                                     │
│   8│      ●                                                              │
│   6│  ●  ● ●  ●  ●                            NRS ────                  │
│   4│              ● ●  ●                       MEDD - - -               │
│   2│                   ● ●  ●                  Breakthrough ⚡          │
│   0│                                                                     │
│    └─────────────────────────────────                                    │
│     Feb 1    Feb 5    Feb 10    Feb 15                                   │
│                                                                          │
│  Breakthroughs this week: 5 (avg intensity: 7.2/10)                     │
│  Predominant quality: Aching, Burning (neuropathic component)            │
│                                                                          │
│  ┌──────────────────┐                                                    │
│  │  Body Map         │  Current pain locations:                          │
│  │  [Anterior view]  │  - L. lumbar (7/10, deep aching)                 │
│  │   ● L.Back        │  - R. hypochondrium (5/10, dull)                 │
│  │   ● R.Abdo        │  - Surgical site (3/10, intermittent)            │
│  └──────────────────┘                                                    │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Interactive line chart**: NRS scores (primary Y-axis), MEDD (secondary Y-axis)
- **Breakthrough overlay**: Lightning bolt icons on timeline at breakthrough events
- **Body map snapshot**: Current pain locations from latest patient log entry (from Screen 04)
- **Data source**: `symptom_logs` table, filtered by `symptom_type = 'pain'`

#### Section 1C: Pre-Op Pain Plan Editor

Structured form for perioperative pain management planning:

| Field | Type | Options |
|-------|------|---------|
| Pre-Op Opioid Strategy | Radio | Continue current / Reduce / Convert to IV / Pause |
| NSAID Management | Radio | Stop 7 days prior / Stop 3 days prior / Continue (COX-2) / Not on NSAIDs |
| Regional Block Plan | Multi-select | Epidural, TAP Block, Paravertebral, Rectus Sheath, Wound Infusion, Nerve Block (specify) |
| Post-Op Primary Modality | Radio | PCA (opioid), Epidural Infusion, Regional Catheter, Oral Multimodal, IV Multimodal |
| Post-Op PCA Settings | Conditional | Drug, Bolus dose, Lockout interval, Background infusion (Y/N), 4h limit |
| Rescue Protocol | Text + structured | Drug, dose, route, frequency, escalation plan |
| Adjuvants | Multi-select | Paracetamol, Gabapentin/Pregabalin, Ketamine infusion, Lignocaine infusion, Dexamethasone, Clonidine |
| Opioid Conversion Notes | Free text | Equianalgesic rationale, incomplete cross-tolerance considerations |

**Opioid Conversion Calculator** (integrated):
- Input: Current opioid, dose, route
- Output: Equivalent doses for morphine, fentanyl, hydromorphone, oxycodone, methadone
- Displays conversion with 25-50% dose reduction for incomplete cross-tolerance
- Methadone conversion uses Ripamonti ratios with warnings for high-dose conversions

**Save behavior**: Saves as a `perioperative_note` with `type = 'pain_plan'` and structured JSONB content.

---

### Pillar 2: Medical Optimization (Medical Fitness for Surgery)

> Hindi label: चिकित्सा अनुकूलन

#### Section 2A: Comorbidity Checklist

Expandable accordion sections for each organ system. Each item toggles Present/Absent with severity scale and notes.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Comorbidity Assessment                   Overall: 5/7 systems reviewed │
│                                                                          │
│  ▼ Cardiovascular                                          ● 2 active   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  ☑ Hypertension     Severity: Controlled   Notes: On amlodipine │   │
│  │  ☐ IHD                                                          │   │
│  │  ☑ Heart Failure    Severity: NYHA II       Notes: EF 45%       │   │
│  │  ☐ Arrhythmia                                                    │   │
│  │  ☐ Valvular Disease                                              │   │
│  │  ☐ Pacemaker/ICD                                                 │   │
│  │  ☐ DVT/PE History                                                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ▶ Respiratory                                             ● 1 active   │
│  ▶ Renal                                                   ○ none       │
│  ▶ Hepatic                                                 ● 1 active   │
│  ▶ Endocrine                                               ● 1 active   │
│  ▶ Haematological                                          ● 1 active   │
│  ▶ Neurological                                            ○ none       │
└──────────────────────────────────────────────────────────────────────────┘
```

**System-by-system items**:

| System | Conditions |
|--------|------------|
| Cardiovascular | Hypertension, IHD, Heart Failure, Arrhythmia, Valvular Disease, Pacemaker/ICD, DVT/PE History |
| Respiratory | COPD, Asthma, Pleural Effusion, Lung Metastases, OSA, Restrictive Disease, Home O2 |
| Renal | CKD (with stage selector I-V), Dialysis (HD/PD), AKI history, Nephrostomy, Electrolyte abnormalities |
| Hepatic | Cirrhosis (Child-Pugh score), Hepatic Metastases, Coagulopathy, Ascites, Portal Hypertension |
| Endocrine | Diabetes (Type 1/2, HbA1c field), Thyroid (hypo/hyper), Adrenal Insufficiency, Carcinoid, Phaeochromocytoma |
| Haematological | Anaemia (with cause), Thrombocytopenia, Coagulopathy, Anticoagulant Use (drug + last dose), Sickle Cell |
| Neurological | CVA/TIA, Seizures, Raised ICP, Myasthenia, Neuropathy, Cognitive Impairment |

Each present condition has:
- **Severity**: Mild / Moderate / Severe / Controlled / Uncontrolled
- **Notes**: Free-text field for clinician comments
- **Optimization status**: Not assessed / Needs optimization / Optimized / Cleared

#### Section 2B: Lab Results Panel

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Lab Results                        Last updated: 14 Feb 2026, 08:30    │
│                                     [ + Add Result ] [ View Trends ]    │
│                                                                          │
│  ┌──────────────┬────────┬──────────┬────────┬──────────┬──────────┐   │
│  │ Test         │ Value  │ Ref Range│ Status │ Trend    │ Date     │   │
│  ├──────────────┼────────┼──────────┼────────┼──────────┼──────────┤   │
│  │ Haemoglobin  │ 9.2    │ 12-16   │ ● Low  │ ↑ 8.4→9.2│ 14 Feb  │   │
│  │ Platelets    │ 185    │ 150-400 │ ● OK   │ → Stable │ 14 Feb  │   │
│  │ WBC          │ 6.8    │ 4-11    │ ● OK   │ → Stable │ 14 Feb  │   │
│  │ INR          │ 1.1    │ <1.5    │ ● OK   │ → Stable │ 14 Feb  │   │
│  │ aPTT         │ 32     │ 25-35   │ ● OK   │ → Stable │ 14 Feb  │   │
│  │ Albumin      │ 2.8    │ 3.5-5.0 │ ● Low  │ ↑ 2.5→2.8│ 14 Feb  │   │
│  │ Creatinine   │ 1.0    │ 0.7-1.3 │ ● OK   │ → Stable │ 14 Feb  │   │
│  │ eGFR         │ 72     │ >60     │ ● OK   │ → Stable │ 14 Feb  │   │
│  │ Na+          │ 138    │ 135-145 │ ● OK   │ → Stable │ 14 Feb  │   │
│  │ K+           │ 4.2    │ 3.5-5.0 │ ● OK   │ → Stable │ 14 Feb  │   │
│  │ Fasting Glu  │ 130    │ <100    │ ● High │ ↑ Rising │ 14 Feb  │   │
│  │ HbA1c        │ 7.2%   │ <6.5%   │ ● High │ — New    │ 14 Feb  │   │
│  │ ECG          │ Normal │ —       │ ● OK   │ —        │ 13 Feb  │   │
│  │ CXR          │ Eff.R  │ —       │ ● Flag │ —        │ 13 Feb  │   │
│  └──────────────┴────────┴──────────┴────────┴──────────┴──────────┘   │
│                                                                          │
│  ● Normal (Green)  ● Borderline (Amber)  ● Abnormal (Red)              │
│  ● Investigation (Blue — for radiology, ECG, etc.)                      │
└──────────────────────────────────────────────────────────────────────────┘
```

**Traffic light system**:
- Green (`#7BA68C`): Within reference range
- Amber (`#E8A838`): Borderline — within 10% of limits or trending toward abnormal
- Red (`#E87461`): Outside reference range, clinically significant

**Trend indicators**: `↑` Rising, `↓` Falling, `→` Stable (based on last 3 values)

**"View Trends" button**: Opens modal with sparkline charts for each lab value over the prehab period.

#### Section 2C: Anaemia Correction Tracker

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Anaemia Correction                      Target Hb: ≥ 10 g/dL          │
│                                                                          │
│  Hb Trend:  8.0 → 8.4 → 9.2            Current: 9.2 g/dL              │
│  ┌──────────────────────────────────┐                                    │
│  │ 12 ─ ─ ─ ─ ─ ─ ─ ─ ─ target ─ ─│                                    │
│  │ 10 · · · · · · · · ·  ·   · ·  │                                    │
│  │  8 ●─────●─────────●            │                                    │
│  │  6                              │                                    │
│  │    Jan 28   Feb 5    Feb 14      │                                    │
│  └──────────────────────────────────┘                                    │
│                                                                          │
│  Iron Therapy Log:                                                       │
│  ┌───────────┬──────────┬─────────┬──────────────────────┐              │
│  │ Date      │ Type     │ Dose    │ Notes                │              │
│  ├───────────┼──────────┼─────────┼──────────────────────┤              │
│  │ 30 Jan    │ IV FCM   │ 1000mg  │ Infusion, tolerated  │              │
│  │ 06 Feb    │ IV FCM   │ 500mg   │ Top-up dose          │              │
│  │ Daily     │ Oral Fe  │ 200mg   │ Ongoing since 28 Jan │              │
│  └───────────┴──────────┴─────────┴──────────────────────┘              │
│                                                                          │
│  ⚠ Alert: Hb 9.2 — below surgical target of 10. Surgery in 5 days.     │
│  Recommendation: Consider additional IV iron or transfusion trigger.     │
│                                                                          │
│  [ + Log Iron Therapy ] [ Set Hb Target ] [ Request Haematology Review ]│
└──────────────────────────────────────────────────────────────────────────┘
```

- **Auto-alert**: If Hb < 8 g/dL within 7 days of surgery → Red alert to Pathway List
- **Auto-alert**: If Hb < target within 7 days of surgery → Amber warning as shown above
- **Transfusion log**: Separate sub-section if blood products administered

#### Section 2D: ASA Score Calculator

| Field | Type | Detail |
|-------|------|--------|
| ASA-PS Classification | Radio (1-6) | Full descriptive text for each grade |
| Justification | Free text | Clinical rationale for the selected score |
| Historical ASA | Read-only table | Previous ASA scores for this patient with dates |

**ASA Grade Descriptions** (displayed alongside radio buttons):
- I: Healthy patient
- II: Mild systemic disease
- III: Severe systemic disease
- IV: Severe systemic disease, constant threat to life
- V: Moribund, not expected to survive without surgery
- VI: Brain-dead organ donor

**E suffix**: Toggle for emergency surgery modifier (e.g., "III-E")

#### Section 2E: Medical Optimization Checklist (Interactive)

Maps to `medical_optimization_checklists` database table. Five clinical domains:

| Domain | Items | Responsible |
|--------|-------|-------------|
| Cardiac | ECG reviewed, Echo (if indicated), BP optimized, Rate-controlled, Anticoagulation plan | Anaesthesiologist |
| Respiratory | CXR reviewed, PFTs (if indicated), Effusion drained, Nebulization plan, O2 requirement noted | Anaesthesiologist |
| Renal & Metabolic | Electrolytes corrected, Glucose controlled, Dialysis scheduled (if needed), Fluid status assessed | Physician |
| Haematological | Anaemia corrected, Coagulation normal, Anticoagulant/Antiplatelet plan, Blood products crossmatched | Anaesthesiologist |
| Nutritional | Albumin > 3.0 target, Weight stable or improving, Supplement compliance, Pre-op carb loading plan | Dietitian |

Each item has:
- Checkbox (done/not done)
- Notes field
- Clinician attribution (who checked this)
- Timestamp

**Domain-level status badges**:
- `Incomplete` (Grey) → `In Progress` (Amber) → `Optimized` (Green) → `Cleared` (Green + checkmark)

**Overall Optimization Score**: Percentage of items cleared across all domains, displayed as a radial progress indicator.

**Clinician sign-off**: Each domain requires sign-off by the responsible clinician before status changes to "Cleared". Sign-off records clinician name, role, and timestamp.

---

### Pillar 3: Psychosocial Assessment (Psychological & Social Readiness)

> Hindi label: मनोसामाजिक मूल्यांकन

#### Section 3A: Psychological Scores

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Psychological Assessment                                                │
│                                                                          │
│  ┌─────────────────┬─────────────────┬─────────────────┐                │
│  │ HADS-Anxiety    │ HADS-Depression │ Distress Therm. │                │
│  │                 │                 │                 │                │
│  │  Score: 9       │  Score: 12      │  Score: 6       │                │
│  │  ● Borderline   │  ● Abnormal     │  ● Significant  │                │
│  │                 │                 │                 │                │
│  │  Trend: ↓ from │  Trend: → from  │  Trend: ↓ from  │                │
│  │  11 (improved)  │  12 (stable)    │  7 (improved)   │                │
│  │                 │                 │                 │                │
│  │  Threshold: 11  │  Threshold: 11  │  Threshold: 4   │                │
│  └─────────────────┴─────────────────┴─────────────────┘                │
│                                                                          │
│  Additional Screening:                                                   │
│  ┌────────────┬────────┬────────┬────────────────────────────┐          │
│  │ Scale      │ Score  │ Sever. │ Notes                      │          │
│  ├────────────┼────────┼────────┼────────────────────────────┤          │
│  │ PHQ-9      │ 14     │ Mod.   │ Administered 10 Feb        │          │
│  │ GAD-7      │ 11     │ Mod.   │ Administered 10 Feb        │          │
│  │ CAGE       │ 0/4    │ Neg.   │ No alcohol dependence      │          │
│  └────────────┴────────┴────────┴────────────────────────────┘          │
│                                                                          │
│  [ View Score Trends ] [ Administer New Assessment ]                    │
└──────────────────────────────────────────────────────────────────────────┘
```

**Threshold flags** (automatic):
- HADS-Anxiety >= 11 → Red badge: "Clinically significant anxiety"
- HADS-Depression >= 11 → Red badge: "Clinically significant depression"
- Distress Thermometer >= 4 → Amber badge: "Significant distress"
- PHQ-9 >= 10 → Red badge: "Moderate-severe depression"
- PHQ-9 item 9 > 0 → Critical red: "Suicidal ideation screening positive" + auto-alert

**Trend charts**: Available via "View Score Trends" — line chart showing each score over the prehab period with threshold lines marked.

#### Section 3B: Prehab Engagement Metrics

Data pulled from patient app usage (Screen 13: Prehabilitation module) and corresponding database tables.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Prehab Engagement (last 14 days)                                        │
│                                                                          │
│  Exercise                         Nutrition                              │
│  ● Adherence: 78%                 ● Protein target met: 65% of days     │
│  ● Sessions: 11/14 prescribed     ● Supplement adherence: 85%            │
│  ● Total minutes: 245             ● Calorie target met: 72% of days     │
│  ● Trend: Improving               ● Weight: 62kg (→ stable)             │
│                                                                          │
│  Learning                          Breathing                             │
│  ● Modules completed: 4/6         ● Sessions this week: 5               │
│  ● Quiz scores: avg 82%           ● Total sessions: 18                  │
│  ● Last module: "What to          ● IS performance: 1500mL (↑)          │
│    expect after surgery"          ● Trend: Improving                     │
│                                                                          │
│  App Engagement                                                          │
│  ● Login frequency: 12/14 days (86%)                                    │
│  ● Avg session duration: 8.2 min                                        │
│  ● Last login: 2 hours ago                                              │
│  ● Symptom logging compliance: 91%                                      │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Section 3C: Social Support Assessment

| Field | Type | Description |
|-------|------|-------------|
| Primary Caregiver | Text | Name, relationship, contact number |
| Caregiver Availability | Select | Full-time / Part-time / Limited / None |
| Caregiver Distress Level | Scale | 0-10 NRS (from caregiver mode data, Screen 09) |
| Family Involvement | Free text | Key family members, dynamics, decision-makers |
| Cultural Considerations | Free text | Religious beliefs, dietary restrictions, end-of-life preferences |
| Language Preference | Select | Hindi / English / Regional language (specify) |
| Interpreter Needed | Toggle | Yes/No + Language |
| Post-Discharge Support | Select | Family at home / Paid caregiver / Hospice / Nursing home / None identified |
| Financial Concerns | Free text | Insurance status, treatment cost barriers, social work involvement |

#### Section 3D: Referral Buttons

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Referrals                                                               │
│                                                                          │
│  [ Refer to Psychiatry ]  [ Refer to Clinical Psychology ]              │
│  [ Refer to Social Work ] [ Refer to Spiritual Care ]                   │
│  [ Refer to Dietitian ]   [ Refer to Physiotherapy ]                    │
│                                                                          │
│  Active Referrals:                                                       │
│  ● Psychiatry — Dr. Gupta, referred 08 Feb, status: Seen                │
│  ● Dietitian — Ms. Sharma, referred 01 Feb, status: Ongoing             │
└──────────────────────────────────────────────────────────────────────────┘
```

Each referral button:
1. Creates a `perioperative_note` with `type = 'referral'`
2. Pre-populates with patient summary and reason for referral
3. Sends notification to the referred specialty (if user is registered in system)
4. Tracks referral status: Pending → Scheduled → Seen → Recommendations received

---

### Pillar 4: Decision-Making Capacity (Consent & Directives)

> Hindi label: निर्णय लेने की क्षमता

#### Section 4A: Advance Directive Status

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Advance Directive Status: ● ACTIVE                                      │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Surrogate Decision Maker:                                       │   │
│  │  Priya Kumar (Daughter) · +91-XXXXX-XXXXX · Lives in Bhopal     │   │
│  │                                                                   │   │
│  │  Treatment Preferences:                                          │   │
│  │  ┌──────────────────┬──────────────┬──────────────────────────┐ │   │
│  │  │ Intervention      │ Preference   │ Notes                    │ │   │
│  │  ├──────────────────┼──────────────┼──────────────────────────┤ │   │
│  │  │ CPR               │ ● Do Not     │ Discussed 05 Feb 2026   │ │   │
│  │  │ Mech. Ventilation │ ● Time-trial │ Max 72h, then reassess  │ │   │
│  │  │ Dialysis          │ ● Undecided  │ Wants family discussion  │ │   │
│  │  │ ICU Admission     │ ● Want       │ Post-op recovery only    │ │   │
│  │  │ Blood Transfusion │ ● Want       │ No religious objection   │ │   │
│  │  │ Artificial Nutr.  │ ● Discuss    │ Short-term acceptable    │ │   │
│  │  └──────────────────┴──────────────┴──────────────────────────┘ │   │
│  │                                                                   │   │
│  │  Preferred Care Location: Home (if possible)                     │   │
│  │  Spiritual Needs: Hindu — Ganga jal, family presence at end      │   │
│  │  Document: [View scanned copy]                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  [ Review Directive ] [ Update Preferences ] [ Print for Chart ]        │
│                                                                          │
│  Last reviewed: 05 Feb 2026 by Dr. S. Thakur                           │
└──────────────────────────────────────────────────────────────────────────┘
```

**Status indicator options**:
- `None` (Grey): No advance directive on file
- `Draft` (Amber): Discussion initiated, not finalized
- `Active` (Green): Current, signed, on file
- `Revoked` (Red): Previously active, now revoked by patient
- `Needs Review` (Amber-pulsing): Last reviewed > 6 months ago or condition has changed significantly

**Treatment preference icons**:
- `Want` — Green check
- `Do Not Want` — Red X
- `Time-Trial` — Amber clock
- `Undecided` — Grey question mark
- `Discuss` — Blue speech bubble

#### Section 4B: Informed Consent Checklist

Interactive checklist that must be completed before the pathway can advance to `pre_op` status:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Informed Consent for Surgery              Status: 5/8 items complete    │
│                                                                          │
│  ☑ Patient understands diagnosis and prognosis                          │
│  ☑ Procedure explained in patient's preferred language (Hindi)          │
│  ☑ Risks and benefits of surgery discussed                              │
│  ☑ Alternative treatment options presented                              │
│  ☑ Patient's questions addressed satisfactorily                         │
│  ☐ Written consent form signed by patient                               │
│  ☐ Patient capacity confirmed by clinician                              │
│  ☐ Copy provided to patient/surrogate                                   │
│                                                                          │
│  Consent language: Hindi                                                 │
│  Interpreter used: No                                                    │
│  Clinician: Dr. A. Patel (Surgeon)                                      │
│  Witness: [Not yet assigned]                                            │
│                                                                          │
│  [ Mark Consent Complete ] [ Upload Signed Form ] [ Add Note ]          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Validation**: Pathway cannot transition to `pre_op` unless all 8 items are checked. System shows warning if transition is attempted with incomplete consent.

**Consent timestamp**: When "Mark Consent Complete" is clicked, records clinician ID, timestamp, and locks the checklist (editable only by the original consenting clinician or an admin).

#### Section 4C: Capacity Assessment Notes

| Field | Type | Description |
|-------|------|-------------|
| Orientation | Checkboxes | Person / Place / Time / Situation |
| Can explain procedure | Toggle + notes | Patient can describe what will happen |
| Can describe risks | Toggle + notes | Patient can articulate key risks |
| Can state alternatives | Toggle + notes | Patient understands other options |
| Consistent decisions | Toggle + notes | Decisions stable over multiple assessments |
| Overall capacity | Select | Intact / Questionable / Lacks capacity |
| Clinical narrative | Free text | Detailed assessment notes |

**If capacity is "Questionable" or "Lacks capacity"**:
- "Request Formal Capacity Assessment" button appears
- Creates referral to psychiatry with pre-populated clinical summary
- Blocks consent completion until capacity is formally assessed
- Surrogate decision-maker is highlighted

---

### Pillar 5: Goal-Directed Anaesthetic Plan (Anaesthesia Strategy)

> Hindi label: लक्ष्य-निर्देशित एनेस्थीसिया योजना

#### Section 5A: Anaesthetic Technique Selector

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Anaesthetic Technique                                                   │
│                                                                          │
│  ○ General Anaesthesia                                                   │
│  ○ Spinal Anaesthesia                                                    │
│  ○ Epidural Anaesthesia                                                  │
│  ○ Regional Block (specify: __________________)                          │
│  ○ Local Anaesthesia                                                     │
│  ○ Sedation (MAC — Monitored Anaesthesia Care)                          │
│  ● Combined: General + Epidural                                          │
│                                                                          │
│  Rationale: Colostomy requires abdominal access under GA.                │
│  Epidural for post-op analgesia given high baseline opioid              │
│  requirements and anticipated moderate-severe surgical pain.             │
│                                                                          │
│  Airway Plan:                                                            │
│  ● Mallampati: III                                                       │
│  ● Mouth opening: 3 cm                                                   │
│  ● Neck mobility: Limited                                                │
│  ● Previous intubation: Uneventful (2024, appendicectomy)              │
│  ● Plan A: Direct laryngoscopy (Mac 3)                                  │
│  ● Plan B: Video laryngoscopy                                           │
│  ● Plan C: Supraglottic airway                                          │
│  ● Plan D: Front-of-neck access (prepared)                              │
│                                                                          │
│  Difficult Airway: ⚠ Anticipated difficulty (Mallampati III, limited    │
│  opening). Video laryngoscope to be available.                           │
└──────────────────────────────────────────────────────────────────────────┘
```

**Airway assessment fields**:

| Field | Type | Options |
|-------|------|---------|
| Mallampati Score | Radio | I, II, III, IV |
| Mouth Opening | Numeric (cm) | — |
| Neck Mobility | Select | Full / Limited / Fixed |
| Thyromental Distance | Numeric (cm) | — |
| Previous Intubation | Select | Uneventful / Difficult / Failed / No record |
| Airway Plan A | Text | Primary intubation plan |
| Airway Plan B | Text | Secondary plan |
| Airway Plan C | Text | Supraglottic airway plan |
| Airway Plan D | Text | Can't intubate, can't oxygenate plan |
| Anticipated Difficulty | Toggle + notes | Flag if difficult airway anticipated |

#### Section 5B: Pre-Medication Orders

Structured medication order form:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Pre-Medication Orders                                                   │
│                                                                          │
│  ┌──────────────┬──────┬───────┬──────────────────┬────────────────┐   │
│  │ Drug         │ Dose │ Route │ Timing           │ Indication     │   │
│  ├──────────────┼──────┼───────┼──────────────────┼────────────────┤   │
│  │ Midazolam    │ 1mg  │ IV    │ On call to OT    │ Anxiolysis     │   │
│  │ Ondansetron  │ 4mg  │ IV    │ Pre-induction    │ Antiemetic     │   │
│  │ Ranitidine   │ 50mg │ IV    │ 1h pre-op        │ Acid prophy.   │   │
│  │ Enoxaparin   │ 40mg │ SC    │ Evening before   │ DVT prophy.    │   │
│  │ Dexamethasone│ 8mg  │ IV    │ At induction     │ Antiemetic+    │   │
│  │ Morphine SR  │ 30mg │ Oral  │ Morning of surg. │ Baseline opioid│   │
│  └──────────────┴──────┴───────┴──────────────────┴────────────────┘   │
│                                                                          │
│  ⚠ Allergy check: No known allergies in patient database                │
│                                                                          │
│  [ + Add Pre-Med ] [ Quick Presets ▼ ] [ Check Interactions ]           │
└──────────────────────────────────────────────────────────────────────────┘
```

**Quick Presets** dropdown:
- Standard Pre-Med (midazolam + ondansetron + ranitidine)
- Diabetic Pre-Med (modified timing, glucose monitoring)
- High Aspiration Risk (ranitidine + metoclopramide + Na citrate)
- Anticoagulated Patient (bridging protocol)

**Allergy cross-check**: Automatically checks against patient's allergy list from the medication database. Red warning banner if any conflict detected.

#### Section 5C: Intra-Operative Monitoring Plan

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Monitoring Plan                                                         │
│                                                                          │
│  Standard (mandatory):                                                   │
│  ☑ ECG (continuous)                                                      │
│  ☑ Pulse Oximetry (SpO2)                                                │
│  ☑ Non-Invasive Blood Pressure (NIBP, q5min)                            │
│  ☑ Temperature (nasopharyngeal)                                          │
│  ☑ End-Tidal CO2 (ETCO2)                                                │
│  ☑ End-Tidal Agent                                                       │
│                                                                          │
│  Additional:                                                             │
│  ☑ Invasive Arterial BP — Indication: High-risk, hemodynamic lability   │
│  ☐ Central Venous Pressure                                               │
│  ☑ Neuromuscular Monitoring (TOF) — Indication: Standard for relaxants  │
│  ☐ BIS / Entropy                                                        │
│  ☐ Transoesophageal Echo (TEE)                                           │
│  ☑ Urine Output (Foley) — Indication: Duration >2h, fluid balance      │
│  ☐ Cardiac Output Monitoring                                             │
│  ☐ ICP Monitoring                                                        │
│                                                                          │
│  Notes: Arterial line for continuous BP and serial ABG access.           │
│  TOF for atracurium reversal guidance.                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

Each additional monitor has an indication field that becomes required when checked.

#### Section 5D: Post-Op Disposition

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Planned Post-Op Disposition                                             │
│                                                                          │
│  ● ICU       ○ HDU       ○ Ward       ○ Day Care       ○ Home           │
│                                                                          │
│  Justification: ASA III, anticipated hemodynamic instability,            │
│  epidural infusion requiring ICU-level monitoring overnight.             │
│                                                                          │
│  Estimated ICU duration: 1-2 days                                        │
│  Step-down plan: ICU → Ward (POD 1-2 if stable)                         │
│                                                                          │
│  ICU bed booked: ☑ Yes — Bed confirmed, ICU informed                    │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Section 5E: Post-Op Pain Management Plan

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Post-Op Pain Management Plan                                            │
│                                                                          │
│  Primary Modality: Epidural Infusion                                     │
│  ┌──────────────────────────────────────────────────────┐               │
│  │ Solution: Bupivacaine 0.1% + Fentanyl 2mcg/mL       │               │
│  │ Rate: 6-10 mL/h                                      │               │
│  │ PCEA bolus: 3mL, lockout 20min                       │               │
│  │ Duration: 48-72h                                       │               │
│  └──────────────────────────────────────────────────────┘               │
│                                                                          │
│  Systemic Adjuncts:                                                      │
│  ┌────────────┬──────┬───────┬───────┬──────────────────────────┐       │
│  │ Drug       │ Dose │ Route │ Freq  │ Notes                    │       │
│  ├────────────┼──────┼───────┼───────┼──────────────────────────┤       │
│  │ Paracetamol│ 1g   │ IV→PO│ QDS   │ Switch to oral when tol. │       │
│  │ Morphine   │ 2mg  │ IV    │ PRN   │ Rescue. Max q2h.         │       │
│  │ Gabapentin │ 300mg│ Oral  │ TDS   │ Continue home dose       │       │
│  └────────────┴──────┴───────┴───────┴──────────────────────────┘       │
│                                                                          │
│  Breakthrough Protocol:                                                  │
│  NRS 4-6: Morphine 2mg IV, reassess 15min                               │
│  NRS 7-10: Morphine 4mg IV, call anaesthesia if no relief x2            │
│  Epidural troubleshoot: Check level, check catheter, bolus 5mL         │
│                                                                          │
│  Weaning Plan:                                                           │
│  POD 1-2: Epidural + multimodal                                         │
│  POD 2-3: Remove epidural, transition to oral opioid                    │
│  POD 3+: Oral multimodal, titrate to home regimen                       │
│                                                                          │
│  ⚠ Note: Patient on chronic opioids (MEDD 75mg). Ensure baseline        │
│  opioid requirements are met throughout. Do NOT discontinue abruptly.   │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Section 5F: NPO Orders

```
┌──────────────────────────────────────────────────────────────────────────┐
│  NPO (Fasting) Orders                    Surgery time: 09:00, 21 Feb    │
│                                                                          │
│  Solids / Heavy meals:   STOP by  01:00 (21 Feb)  — 8h prior           │
│  Light meal:             STOP by  03:00 (21 Feb)  — 6h prior           │
│  Clear fluids:           STOP by  07:00 (21 Feb)  — 2h prior           │
│  Breast milk:            N/A                                             │
│  Chewing gum / sweets:  STOP by  07:00 (21 Feb)  — 2h prior           │
│                                                                          │
│  Pre-op carb drink:      ☑ 200mL at 05:00 (21 Feb) — 4h prior         │
│                                                                          │
│  Medications with sip of water at 06:00:                                │
│  - Morphine SR 30mg                                                      │
│  - Amlodipine 5mg                                                        │
│  - Metformin: OMIT on morning of surgery                                │
│                                                                          │
│  [ Send to Patient App ] [ Print NPO Instructions ] [ Edit Times ]     │
└──────────────────────────────────────────────────────────────────────────┘
```

**Auto-calculation**: Fasting times auto-populate based on surgery time using current ASA/ESPEN fasting guidelines (6h solids, 2h clear fluids, 1h breast milk).

**"Send to Patient App"**: Pushes NPO reminder notification to Screen 13 (Prehabilitation) on the patient's device. Creates a timed notification sequence: evening before, early morning, and 30 min before clear fluid cutoff.

#### Section 5G: ERAS Checklist (Enhanced Recovery After Surgery)

Three-phase checklist, applicable when ERAS protocol is indicated:

| Phase | Items |
|-------|-------|
| **Pre-operative** | ☐ Patient education complete, ☐ Carbohydrate loading prescribed, ☐ No prolonged fasting, ☐ Bowel prep (if indicated, minimized), ☐ VTE prophylaxis plan, ☐ Antibiotic prophylaxis timed, ☐ Anaemia corrected, ☐ Smoking/alcohol cessation (if applicable) |
| **Intra-operative** | ☐ Short-acting anaesthetic agents, ☐ Goal-directed fluid therapy, ☐ Active warming (normothermia target), ☐ Multimodal analgesia (opioid-sparing), ☐ Minimally invasive approach (if possible), ☐ NG tube avoided (if possible), ☐ Drain avoided (if possible) |
| **Post-operative** | ☐ Early oral intake (within 24h), ☐ Early mobilization (day of surgery), ☐ Multimodal analgesia (epidural/regional + systemic), ☐ Opioid-sparing strategy, ☐ Early catheter removal, ☐ Glucose control, ☐ Audit and outcome tracking |

Each item: checkbox + optional notes + clinician attribution.

Overall ERAS compliance score: percentage of applicable items checked, displayed as progress bar.

---

## View 3: Prehab Progress Dashboard

> A focused view of the patient's prehabilitation journey, pulling data from exercise logs, nutrition logs, prehab assessments, and patient app engagement.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Prehab Progress — Ramesh Kumar               Surgery in 5 days         │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Readiness Score Trend                                           │   │
│  │  100│                                                 target=70  │   │
│  │   80│                                      ●───● 72%    ──────  │   │
│  │   60│                        ●───●───●                           │   │
│  │   40│              ●───●───●                                     │   │
│  │   20│   ●───●───●                                                │   │
│  │    0│                                                            │   │
│  │     └──────────────────────────────────────                      │   │
│  │      Week 1  Week 2  Week 3  Week 4  Now                        │   │
│  │                                                                   │   │
│  │  ── Overall   ── Physical   ── Nutritional   ── Psychological   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌────────────────────────────┐  ┌────────────────────────────────┐    │
│  │ Functional Capacity        │  │ Nutritional Status              │    │
│  │                            │  │                                  │    │
│  │ [Table below]              │  │ [Nutrition panel below]          │    │
│  │                            │  │                                  │    │
│  └────────────────────────────┘  └────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────┐  ┌────────────────────────────────┐    │
│  │ Exercise Adherence         │  │ Psychological Readiness         │    │
│  │                            │  │                                  │    │
│  │ [Exercise panel below]     │  │ [Psych panel below]             │    │
│  │                            │  │                                  │    │
│  └────────────────────────────┘  └────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```

### Readiness Score Trend
- **Line chart**: Readiness score (0-100) over prehab weeks, weekly data points
- **Overlay lines**: Individual pillar scores (Physical, Nutritional, Psychological) in different colors
- **Target line**: Dashed horizontal at 70% — "Surgery Ready" threshold
- **Current score**: Large number display beside chart with color (Green >= 70, Amber 40-69, Red < 40)
- **Score composition**: Tooltip on each data point breaks down sub-scores

### Functional Capacity Changes

| Metric | Baseline | Current | Change | MCID | Status |
|--------|----------|---------|--------|------|--------|
| 6-Minute Walk Test (6MWT) | 280m | 340m | +60m | 30m | Met |
| Timed Up-and-Go (TUG) | 14.0s | 11.0s | -3.0s | 2.5s | Met |
| Hand Grip Strength | 18kg | 22kg | +4kg | 5kg | Improving |
| 30-Second Sit-to-Stand | 8 | 12 | +4 | 2 | Met |
| Stair Climb Test | 45s | 38s | -7s | 5s | Met |
| Inspiratory Volume (IS) | 1200mL | 1500mL | +300mL | 200mL | Met |

**Color coding**:
- Green: Met or exceeded Minimal Clinically Important Difference (MCID)
- Amber: Improving but below MCID threshold
- Red: No improvement or declining
- Grey: Not assessed

**MCID**: Minimum change considered clinically meaningful for that measure. Pre-configured per metric.

### Nutritional Status Panel

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Weight | 62.0 kg | Stable or ↑ | Stable (→) |
| BMI | 21.3 | 18.5-25.0 | Normal |
| Albumin | 2.8 g/dL | > 3.0 g/dL | Below target |
| Protein intake (avg/day) | 62g | 80g (1.2g/kg) | 78% of target |
| Calorie intake (avg/day) | 1650 kcal | 1800 kcal | 92% of target |
| Supplement adherence | 85% | 100% | Good |
| Pre-albumin | 15 mg/dL | > 16 mg/dL | Borderline |

- **Weight trend chart**: Line chart from baseline to current, weekly measurements
- **Albumin trend**: Overlaid on weight chart or separate panel
- **Protein compliance**: Bar chart by week, target line overlay

### Exercise Adherence Panel

- **Sessions completed vs prescribed**: Grouped bar chart by week
- **Total exercise minutes**: Running total with weekly breakdown
- **Exercise type distribution**: Doughnut chart (Aerobic / Resistance / Flexibility / Breathing)
- **Pain during exercise**: Line chart of average pain during sessions
- **Adherence percentage**: Large number display (e.g., "78%") with color coding

### Psychological Readiness Panel

- **Anxiety/Depression score trends**: Dual-line chart (HADS-A and HADS-D) over prehab weeks
- **Threshold lines**: Dashed at HADS = 11 (clinically significant)
- **App engagement trend**: Login frequency per week
- **Worry journal entries**: Count per week
- **Coping tool usage**: Sessions per week (breathing exercises, relaxation modules)
- **Sleep quality**: Average hours and quality score (if logged)

---

## View 4: Perioperative Notes

> Clinical documentation for the entire perioperative journey. Structured, timestamped, auditable.

### Note Type Templates

| Type | Template Structure | JSONB Content Fields |
|------|-------------------|---------------------|
| Anaesthesia Consultation | History, examination, airway assessment, plan | `airway`, `medications`, `allergies`, `fasting_status`, `plan`, `consent` |
| Pre-Op Briefing | Auto-generated from 5 pillars | `readiness`, `risks`, `key_issues`, `plan`, `contingencies`, `team` |
| Intra-Op Note | Structured anaesthetic record | `technique`, `drugs`, `fluids`, `blood_loss`, `events`, `monitoring`, `duration`, `complications` |
| Post-Op Note | Recovery and plan | `pain_scores`, `vitals`, `consciousness`, `nausea`, `complications`, `plan`, `handover` |
| MDT Prehab Review | Team discussion record | `attendees`, `roles`, `discussion_points`, `decisions`, `action_items`, `next_review_date` |
| Discharge Summary | Comprehensive discharge document | `diagnosis`, `procedures`, `findings`, `medications`, `follow_up`, `instructions`, `emergency_contact` |
| Pain Plan | Perioperative pain management | `current_regimen`, `pre_op_changes`, `intra_op_plan`, `post_op_plan`, `rescue`, `weaning` |
| Referral | Specialty referral | `referring_clinician`, `specialty`, `reason`, `urgency`, `clinical_summary`, `questions` |
| Progress Note | Daily progress | `day`, `subjective`, `objective`, `assessment`, `plan` |

### Note List View

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Perioperative Notes — Ramesh Kumar          [ + New Note ▼ ] [ Filter ]│
│                                                                          │
│  ┌──────┬──────────────────┬────────────────┬──────────┬───────────┐   │
│  │ Date │ Type             │ Author         │ Status   │ Actions   │   │
│  ├──────┼──────────────────┼────────────────┼──────────┼───────────┤   │
│  │14 Feb│ Anaes. Consult.  │ Dr. Thakur     │ Final    │ View Edit │   │
│  │12 Feb│ MDT Prehab Review│ Dr. Thakur     │ Final    │ View      │   │
│  │10 Feb│ Pain Plan        │ Dr. Thakur     │ Final    │ View Edit │   │
│  │08 Feb│ Referral-Psych   │ Dr. Thakur     │ Seen     │ View      │   │
│  │01 Feb│ Progress Note    │ Dr. Sharma     │ Final    │ View      │   │
│  │28 Jan│ Anaes. Consult.  │ Dr. Thakur     │ Final    │ View      │   │
│  └──────┴──────────────────┴────────────────┴──────────┴───────────┘   │
│                                                                          │
│  Showing 6 notes   [ < ] [ 1 ] [ > ]                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

### Note Editor

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Anaesthesia Consultation Note                 Status: Draft             │
│  Patient: Ramesh Kumar · MRN-4521 · 21 Feb 2026 surgery                │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [B] [I] [U] | [H1] [H2] | [•] [1.] | [SBAR] | [Auto-fill]   │   │
│  │                                                                   │   │
│  │  ## History                                                       │   │
│  │  58-year-old male, diagnosed carcinoma colon (Stage IIIB)        │   │
│  │  with hepatic metastases. Presenting for palliative colostomy    │   │
│  │  for intestinal obstruction.                                      │   │
│  │                                                                   │   │
│  │  ## Relevant Comorbidities                                        │   │
│  │  - Hypertension (controlled, amlodipine 5mg)                     │   │
│  │  - Heart Failure NYHA II (EF 45%)                                │   │
│  │  - Type 2 DM (HbA1c 7.2%, on metformin + glimepiride)          │   │
│  │  - Chronic pain on opioids (MEDD 75mg/day)                      │   │
│  │  ...                                                              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Author: Dr. S. Thakur, Anaesthesia                                     │
│  Created: 14 Feb 2026, 10:30                                            │
│  Last modified: 14 Feb 2026, 11:15                                      │
│                                                                          │
│  [ Save Draft ] [ Submit for Review ] [ Sign Off (Final) ] [ Print ]   │
└──────────────────────────────────────────────────────────────────────────┘
```

**Key editor features**:
- Rich text editing with medical formatting (bold, italic, headers, lists)
- **SBAR toggle**: Restructures note into Situation / Background / Assessment / Recommendation format for handover notes
- **Auto-fill**: Populates available fields from patient data (demographics, vitals, labs, medications)
- **Modification history**: Every edit is versioned, viewable via "History" button
- **Sign-off workflow**: Draft → Submitted → Reviewed → Final
  - "Draft": Only author can see/edit
  - "Submitted": Visible to team, pending review
  - "Reviewed": Senior clinician has reviewed
  - "Final": Locked, no further edits (corrections require addendum)
- **Print-optimized view**: A4 layout with hospital header, patient details, structured content, signatures

---

## View 5: Post-Op Tracking

> Real-time post-operative recovery monitoring. Active from the moment the patient leaves the operating theatre until discharge.

### Post-Op Dashboard Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Post-Op Tracking — Ramesh Kumar          POD 2 (Day 2 post-surgery)    │
│  Surgery: Palliative Colostomy · 21 Feb 2026 · Dr. Patel               │
│  Location: Surgical Ward, Bed 14 (stepped down from ICU POD 1)         │
│                                                                          │
│  ┌─────────────────────────────────┬─────────────────────────────────┐  │
│  │ Pain Tracking                   │ Mobility Progress               │  │
│  │                                 │                                 │  │
│  │ Current NRS: 4/10 (Green)      │ 🛏 → 🪑 → 🧍 → [🚶] → 🪜     │  │
│  │ Target: NRS ≤ 4                │      ✓    ✓    ✓   ●current     │  │
│  │                                 │                                 │  │
│  │ 10│                             │ POD 0: Bed rest                 │  │
│  │  8│ ●                           │ POD 0 (eve): Sat in chair 10min│  │
│  │  6│  ●  ●                       │ POD 1: Standing with assist     │  │
│  │  4│      ● ●  ● ● current      │ POD 2: Walking 20m with frame  │  │
│  │  2│                             │ Next goal: Walk 50m unaided    │  │
│  │  0│                             │                                 │  │
│  │    POD0 POD1  POD2              │                                 │  │
│  └─────────────────────────────────┴─────────────────────────────────┘  │
│                                                                          │
│  ┌─────────────────────────────────┬─────────────────────────────────┐  │
│  │ Nutrition Progression           │ Key Parameters                  │  │
│  │                                 │                                 │  │
│  │ NPO→Sips→Clears→[Full]→Soft→Reg│ Temp: 37.2C (Normal)           │  │
│  │  ✓    ✓    ✓     ●current      │ HR: 82 bpm                     │  │
│  │                                 │ BP: 128/78 mmHg                │  │
│  │ POD 0: NPO                     │ SpO2: 97% (RA)                  │  │
│  │ POD 0 (eve): Sips of water     │ UO: 45 mL/h (adequate)         │  │
│  │ POD 1: Clear fluids tolerated  │ Drain: 80mL/24h (↓ decreasing) │  │
│  │ POD 2: Full liquids started    │ Bowel sounds: Present           │  │
│  │ Next: Soft diet (if tolerated) │ Flatus: Not yet passed          │  │
│  └─────────────────────────────────┴─────────────────────────────────┘  │
│                                                                          │
│  [ Log Assessment ] [ Add Note ] [ Update Milestones ]                  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Pain Score Trend
- NRS plotted per assessment (q4h in ICU, q6h on ward)
- Horizontal target line at NRS = 4
- Markers for PRN rescue doses given
- Pain at rest vs. pain on movement (dual lines if both reported)
- Epidural/PCA usage overlay (mL/h or number of boluses)

### Mobility Milestone Tracker
Visual horizontal stepper:
- Bed-bound → Sitting in chair → Standing → Walking (assisted) → Walking (independent) → Stairs
- Each milestone records: Date/time achieved, duration, assistance level, pain during activity
- Color: Completed steps in Sage Green, current step in Deep Teal, future steps in Grey

### Nutrition Progression
Visual horizontal stepper:
- NPO → Sips → Clear liquids → Full liquids → Soft diet → Regular diet
- Each stage records: Date/time started, tolerance (Tolerated / Nausea / Vomiting / Refused)
- Calorie count resumption: When oral intake starts, daily calorie tracking resumes

### Complication Tracking

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Complications                                                           │
│                                                                          │
│  ┌──────┬──────────────┬──────────┬──────────────┬──────────────────┐   │
│  │ Date │ Complication  │ C-D Grade│ Intervention │ Outcome          │   │
│  ├──────┼──────────────┼──────────┼──────────────┼──────────────────┤   │
│  │22 Feb│ Nausea/vomit │ I        │ Ondansetron  │ Resolved POD 1   │   │
│  │23 Feb│ Wound ooze   │ I        │ Dressing     │ Monitoring        │   │
│  └──────┴──────────────┴──────────┴──────────────┴──────────────────┘   │
│                                                                          │
│  Clavien-Dindo Classification:                                           │
│  I: Deviation from normal, no intervention                               │
│  II: Pharmacological treatment                                           │
│  III: Surgical/endoscopic/radiological intervention (a: no GA, b: GA)   │
│  IV: Life-threatening (a: single organ, b: multi-organ)                  │
│  V: Death                                                                │
│                                                                          │
│  Wound Status: Clean, dry, intact. No signs of infection.                │
│  Drain Output: 80mL/24h, serous (decreasing from 150mL POD 0)          │
│  Stoma: Viable, pink, functioning                                        │
│                                                                          │
│  [ + Log Complication ] [ Update Wound ] [ Update Drain ]               │
└──────────────────────────────────────────────────────────────────────────┘
```

### Discharge Readiness Checklist

Interactive checklist — all items must be checked before discharge can be processed:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Discharge Readiness                       Status: 7/10 items met       │
│                                                                          │
│  ☑ Pain controlled on oral medications (NRS ≤ 4)                        │
│  ☑ Mobilizing independently (or to pre-op baseline)                     │
│  ☑ Tolerating oral diet adequate for nutritional needs                  │
│  ☐ Drains removed or plan for home drain management                     │
│  ☑ Wound clean, dry, no signs of infection                              │
│  ☑ Bowel function returned (flatus or stool)                            │
│  ☑ Medications reconciled — discharge prescription ready                │
│  ☐ Follow-up appointment scheduled (surgical + palliative)              │
│  ☐ Discharge instructions reviewed with patient AND caregiver           │
│  ☑ Caregiver education complete (stoma care, medications, red flags)    │
│                                                                          │
│  Additional for palliative patients:                                     │
│  ☑ Advance directive reviewed and updated post-op                       │
│  ☑ Pain regimen transitioned back to oral (MEDD reconciled)             │
│  ☑ Prehab team notified of discharge plan                               │
│  ☐ Home care / hospice referral (if needed)                             │
│                                                                          │
│  [ Initiate Discharge ] — requires all mandatory items ☑                │
└──────────────────────────────────────────────────────────────────────────┘
```

**"Initiate Discharge"** button:
- Enabled only when all mandatory items are checked
- Triggers discharge summary note creation (auto-populated)
- Changes pathway status to `discharged`
- Sends notification to patient app with follow-up reminders
- Archives pathway data (remains viewable, not editable)

---

## View 6: Pre-Op Briefing Generator

> One-click generation of a comprehensive pre-operative briefing document, aggregating data from all 5 pillars plus prehab progress.

### One-Click Generate

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Pre-Op Briefing Generator                                               │
│                                                                          │
│  Patient: Ramesh Kumar · MRN-4521                                       │
│  Surgery: Palliative Colostomy · 21 Feb 2026 · Dr. A. Patel            │
│                                                                          │
│  Data Sources:                                                           │
│  ● Pillar 1 (Pain): ✓ Complete          ● Prehab data: ✓ Complete      │
│  ● Pillar 2 (Medical): ✓ Complete       ● Labs: ✓ Updated 14 Feb       │
│  ● Pillar 3 (Psychosocial): ✓ Complete  ● Medications: ✓ Current       │
│  ● Pillar 4 (Capacity): ⚠ 5/8 consent  ● Advance Dir: ✓ Active       │
│  ● Pillar 5 (Anaes Plan): ✓ Complete    ● Notes: 6 notes available     │
│                                                                          │
│  ⚠ Warning: Informed consent checklist incomplete (5/8).                 │
│  Briefing will be generated with available data.                         │
│                                                                          │
│         [ Generate Pre-Op Briefing ]                                     │
│              (Deep Teal, prominent button)                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Generated Briefing Sections

The briefing document is structured as follows:

| Section | Content Source | Key Elements |
|---------|---------------|-------------|
| 1. Patient Summary | Demographics, diagnosis | Name, age, gender, MRN, ABHA, diagnosis, staging, ECOG, PPS |
| 2. Surgical Details | Pathway record | Procedure, surgeon, date, OT, intent (curative/palliative), indication |
| 3. Prehab Summary | View 3 data | Readiness score, duration, functional changes, key metrics with MCID comparison |
| 4. Analgesic Plan | Pillar 1 | Current regimen, MEDD, pre-op changes, regional plan, post-op pain plan |
| 5. Medical Status | Pillar 2 | Active comorbidities, lab results (abnormal highlighted), optimization status, ASA score |
| 6. Psychosocial Flags | Pillar 3 | HADS/DT scores, engagement metrics, caregiver status, cultural notes |
| 7. Advance Directives | Pillar 4 | Status, key preferences (CPR, ventilation, ICU), surrogate decision-maker |
| 8. Anaesthetic Plan | Pillar 5 | Technique, airway plan, pre-med, monitoring, post-op disposition |
| 9. Risk Assessment | Aggregated | ASA score, specific concerns by system, contingency plans, difficult airway alert |

### Briefing Output Format

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════════════════════════╗    │
│  ║  PRE-OPERATIVE BRIEFING                                         ║    │
│  ║  PalliCare · AIIMS Bhopal                                      ║    │
│  ║                                                                  ║    │
│  ║  Patient: Ramesh Kumar, 58/M, MRN-4521                          ║    │
│  ║  Surgery: Palliative Colostomy · 21 Feb 2026                    ║    │
│  ║  Generated: 16 Feb 2026, 14:30 by Dr. S. Thakur                ║    │
│  ╠══════════════════════════════════════════════════════════════════╣    │
│  ║                                                                  ║    │
│  ║  1. PATIENT SUMMARY                                             ║    │
│  ║  ... [auto-populated content] ...                                ║    │
│  ║                                                                  ║    │
│  ║  2. SURGICAL DETAILS                                            ║    │
│  ║  ... [auto-populated content] ...                                ║    │
│  ║                                                                  ║    │
│  ║  [Sections 3-9 follow]                                          ║    │
│  ║                                                                  ║    │
│  ║  KEY ALERTS:                                                     ║    │
│  ║  ⚠ Hb 9.2 — below target of 10 g/dL                           ║    │
│  ║  ⚠ HADS-Depression 12 — above clinical threshold               ║    │
│  ║  ⚠ Chronic opioid use — MEDD 75mg, do not discontinue          ║    │
│  ║  ⚠ Difficult airway anticipated — video laryngoscope ready     ║    │
│  ║                                                                  ║    │
│  ╚══════════════════════════════════════════════════════════════════╝    │
│                                                                          │
│  [ Download PDF ] [ Print ] [ Share to MDT ] [ Edit Before Saving ]    │
└──────────────────────────────────────────────────────────────────────────┘
```

**Export options**:
- **PDF download**: Generates A4-formatted PDF with hospital branding
- **Print**: Opens browser print dialog with print-optimized CSS
- **Share to MDT**: Sends briefing as a notification/email to all clinicians tagged on the pathway
- **Edit Before Saving**: Opens briefing in the note editor (View 4) for manual adjustments before finalizing

**Key Alerts section**: Auto-generated from any amber/red flags across all pillars. Sorted by clinical urgency.

---

## Data Architecture

### Database Tables

| Table | Purpose | Type | RLS |
|-------|---------|------|-----|
| `surgical_pathways` | Pathway lifecycle, surgical details, status | Regular | Clinician team only |
| `prehab_assessments` | Multi-domain functional assessments | Hypertable | Clinician + patient |
| `exercise_plans` | Clinician-prescribed exercise plans | Regular | Clinician + physio |
| `exercise_logs` | Patient session logs with metrics | Hypertable | Clinician + patient |
| `nutrition_logs` | Patient meal/supplement logs | Hypertable | Clinician + patient |
| `nutrition_targets` | Clinician-set nutritional targets | Regular | Clinician + dietitian |
| `advance_directives` | Patient directive documents | Regular | Clinician + patient only (restricted) |
| `perioperative_notes` | Structured clinical notes (JSONB) | Regular | Clinician team |
| `post_op_logs` | Post-op recovery tracking entries | Hypertable | Clinician team |
| `medical_optimization_checklists` | 5-domain optimization items | Regular | Clinician only |
| `lab_results` | Lab values with reference ranges | Hypertable | Clinician team |
| `complication_logs` | Post-op complication tracking | Regular | Clinician team |
| `discharge_checklists` | Discharge readiness items | Regular | Clinician team |

### Key Relationships

```
surgical_pathways ──1:M──→ prehab_assessments
surgical_pathways ──1:M──→ perioperative_notes
surgical_pathways ──1:M──→ post_op_logs
surgical_pathways ──1:1──→ medical_optimization_checklists
surgical_pathways ──1:1──→ advance_directives (via patient)
surgical_pathways ──M:1──→ patients

exercise_plans ──1:M──→ exercise_logs
nutrition_targets ──1:M──→ nutrition_logs
```

### Real-Time Updates
- **WebSocket events**: Pathway status changes, new notes added, alert triggers, patient app activity
- **Clinician sees live updates**: Exercise logged, nutrition logged, symptom reported, breakthrough pain event
- **Dashboard refresh strategy**:
  - Primary: WebSocket push for critical events (alerts, status changes)
  - Secondary: 30-second polling for non-critical updates (adherence metrics)
  - Manual: Refresh button available on every view
- **Optimistic UI**: Actions (checking items, saving notes) reflect immediately with background sync

### Audit Trail
- All clinical actions logged to `audit_log` (hypertable) with:
  - `action_type`: CREATE, READ, UPDATE, DELETE, SIGN_OFF, GENERATE, EXPORT
  - `entity_type`: Which table/record was affected
  - `entity_id`: Record identifier
  - `clinician_id`: Who performed the action
  - `old_value` / `new_value`: JSONB diff for UPDATE actions
  - `timestamp`: Server-side timestamp
  - `ip_address`: Source IP
  - `session_id`: Browser session
- **Modification history**: Visible per note, per checklist item
- **Sign-off chain**: Tracked with clinician role, name, timestamp
- **Data retention**: Audit logs retained for minimum 7 years (DPDPA 2023 compliance)

---

## RBAC & Security

### Permission Matrix

| Entity | Anaesthesiologist | Surgeon | Palliative Physician | Nurse | Physio/Dietitian |
|--------|:-:|:-:|:-:|:-:|:-:|
| Surgical Pathway | CRUD | CRUD | CRUD | Read | Read |
| Prehab Assessment | CRUD | Read | CRUD | Read + Create | Read |
| Exercise Plan | Read | Read | CRUD | Read | CRUD |
| Exercise Logs | Read | Read | Read | Read | Read |
| Nutrition Target | Read | Read | CRUD | Read | CRUD |
| Nutrition Logs | Read | Read | Read | Read | Read |
| Advance Directive | Read | Read | Read | Read | — |
| Periop Notes | CRUD | CRUD | CRUD | Read + Create | Read |
| Post-Op Logs | CRUD | CRUD | CRUD | CRUD | Read |
| Med Optimization | CRUD | Read | CRUD | Read | — |
| Lab Results | CRUD | Read | CRUD | Read + Create | Read |
| Complication Logs | CRUD | CRUD | CRUD | Read + Create | Read |
| Pre-Op Briefing | Generate + Edit | Generate + View | Generate + Edit | View | View |
| Discharge Checklist | CRUD | CRUD | CRUD | Read + Update | Read |

### Security Measures

| Measure | Implementation |
|---------|---------------|
| Transport Encryption | TLS 1.3 for all connections |
| Data-at-Rest Encryption | AES-256 for database and file storage |
| Row-Level Security | Supabase RLS policies per table, per role |
| Session Management | JWT tokens, 30-minute inactivity timeout, refresh token rotation |
| Advance Directive Access | Restricted: Only treating clinician + patient — separate RLS policy |
| Note Immutability | Finalized notes are append-only (corrections via addendum) |
| Data Privacy | DPDPA 2023 compliant, consent-based data access |
| ABDM Integration | ABHA-verified patient identity, FHIR R4 resource sharing |
| IP Whitelisting | Optional institutional IP restriction for admin actions |
| 2FA | Required for clinician accounts (TOTP or SMS) |

### Sensitive Data Handling
- **Advance directives**: Encrypted at rest with per-record key. Access logged. No bulk export.
- **Psychological scores**: PHQ-9 item 9 (suicidal ideation) triggers immediate alert workflow, access logged separately.
- **Caregiver data**: Accessible only to treating team members. Not included in research exports without separate consent.

---

## API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/perioperative/pathways` | List pathways (with filters, pagination) |
| POST | `/api/v1/perioperative/pathways` | Create new pathway |
| GET | `/api/v1/perioperative/pathways/:id` | Get pathway detail (all pillar data) |
| PATCH | `/api/v1/perioperative/pathways/:id` | Update pathway (status, details) |
| DELETE | `/api/v1/perioperative/pathways/:id` | Soft-delete pathway |
| GET | `/api/v1/perioperative/pathways/:id/notes` | List notes for pathway |
| POST | `/api/v1/perioperative/pathways/:id/notes` | Create note |
| PATCH | `/api/v1/perioperative/notes/:noteId` | Update note |
| POST | `/api/v1/perioperative/pathways/:id/briefing` | Generate pre-op briefing |
| GET | `/api/v1/perioperative/pathways/:id/prehab` | Get prehab progress data |
| GET | `/api/v1/perioperative/pathways/:id/postop` | Get post-op tracking data |
| POST | `/api/v1/perioperative/pathways/:id/postop` | Log post-op assessment |
| GET | `/api/v1/perioperative/pathways/:id/optimization` | Get optimization checklist |
| PATCH | `/api/v1/perioperative/pathways/:id/optimization` | Update checklist items |
| GET | `/api/v1/perioperative/pathways/:id/labs` | Get lab results |
| POST | `/api/v1/perioperative/pathways/:id/labs` | Add lab result |

### WebSocket Events

| Event | Payload | Trigger |
|-------|---------|---------|
| `pathway.status_changed` | `{ pathwayId, oldStatus, newStatus, clinician }` | Status transition |
| `pathway.note_added` | `{ pathwayId, noteId, noteType, author }` | New note created |
| `pathway.alert_triggered` | `{ pathwayId, alertType, severity, message }` | Clinical alert |
| `pathway.patient_activity` | `{ pathwayId, activityType, data }` | Patient app action |
| `pathway.checklist_updated` | `{ pathwayId, domain, item, checked, clinician }` | Optimization item toggled |
| `pathway.lab_result` | `{ pathwayId, test, value, status }` | New lab result entered |

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Emergency surgery (no prehab time) | Fast-track pathway: Created with status `pre_op` directly. Prehab section shows "N/A — Emergency". Readiness score set to "Not assessed". All 5 pillars still available for rapid assessment. |
| Surgery cancelled | Status → `cancelled`. Requires `cancellation_reason` (structured: Patient declined / Medically unfit / Surgical decision / Patient death / Other). All data preserved, pathway archived. Can be "Re-activated" by senior clinician. |
| Patient death during pathway | Sensitive handling: Status → `discharged` with `outcome = deceased`. Discharge summary note auto-created with template for mortality documentation. UI suppresses "Readiness Score" and shows respectful "Pathway concluded" message. |
| Patient death intra-operatively | Status → `intra_op` then immediately `discharged` with `outcome = deceased_intraop`. Triggers mandatory intra-op note completion. |
| Multiple concurrent pathways | List view shows all pathways, sorted by next surgery date. Banner warning: "Patient has multiple active pathways". Each pathway is independent. |
| Incomplete prehab data | Readiness score adjusts: Missing domains scored as 0 with "Insufficient data" label. Briefing generator shows "[Data unavailable]" for missing sections. Warning banner on 5-Pillar Dashboard. |
| Clinician disagrees with readiness | "Override Readiness" button available to senior clinicians (Consultant grade). Requires free-text justification. Logged in audit trail. Readiness badge shows "Overridden" label. |
| Transfer to another facility | "Export Pathway" button generates FHIR R4 Bundle (Patient, Condition, Procedure, CarePlan resources). Includes all notes, labs, and assessment data. Download as JSON or push to ABDM Health Locker. |
| Very short prehab window (<7 days) | Auto-flagged as "Fast-Track Prehab". Modified targets: Focus on nutrition optimization, breathing exercises, psychological preparation. Exercise goals reduced. Readiness threshold lowered to 50%. |
| Patient re-scheduled (date change) | Date change updates all auto-calculated fields (NPO times, countdown). Prehab timeline recalculates. Notification sent to all team members. |
| Duplicate pathway creation | System checks for existing active pathway for same patient + procedure. Warning dialog: "An active pathway exists for this patient. Create additional pathway?" |
| Network loss during note editing | Auto-save every 30 seconds to local storage. "Unsaved changes" indicator. On reconnection, prompts to merge or overwrite. Conflict resolution UI for simultaneous edits by different clinicians. |
| Consent revoked post-surgery | Advance directive status changes to "Revoked". Active post-op care continues per standard protocol. Alert sent to attending clinician to discuss updated wishes. |

---

## Accessibility

| Feature | Implementation |
|---------|---------------|
| Keyboard Navigation | Full keyboard access for all interactive elements. Tab order follows visual layout. |
| Screen Reader | ARIA labels on all icons, badges, charts. Chart data available as tables. |
| Color Independence | All color-coded information also has text/icon indicators (not color-alone). |
| Focus Indicators | Visible focus ring (2px Deep Teal) on all focusable elements. |
| Text Sizing | Supports browser zoom up to 200% without layout breakage. |
| High Contrast | Respects system high-contrast mode. All text meets WCAG 2.1 AA contrast ratios. |
| Language | Hindi labels available alongside English for all section headers (toggle in settings). |
| Touch Targets | Minimum 44x44px for all interactive elements (tablet optimization). |

---

## Responsive Design

| Breakpoint | Layout | Notes |
|-----------|--------|-------|
| >= 1400px | Full 5-pillar dashboard, 3-column layout for data-dense views | Optimal experience |
| 1200-1399px | Full dashboard, 2-column layout for pillar content | Slight compression |
| 992-1199px | 2-column layout, collapsible pillars, scrollable tables | Laptop screens |
| 768-991px | Single column, tab navigation for pillars, simplified charts | Tablet portrait |
| < 768px | Not supported — redirect to "Use desktop for Perioperative" message | Clinician dashboard requires screen real estate |

### Print Stylesheets

| Document | Print Format |
|----------|-------------|
| Pre-Op Briefing | A4, landscape-aware tables, hospital header, page breaks between sections |
| Discharge Summary | A4, patient identification on every page, medication table formatted for pharmacist |
| Consent Checklist | A4, signature lines, date fields, witness section |
| Individual Note | A4, author attribution, creation/modification timestamps |

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Pathway List Load | < 800ms | Time to interactive (20 rows) |
| Individual Pathway Load | < 1.2s | Time to render all 5 pillar summaries |
| Note Save (Draft) | < 300ms | Time from click to confirmation |
| Note Save (Final) | < 500ms | Includes sign-off validation |
| Briefing Generation | < 2s | Aggregation + render of full briefing |
| Chart Render | < 500ms | Any individual chart component |
| Real-time Update | < 100ms | WebSocket event to UI update |
| Search (patient/MRN) | < 200ms | Debounced, 300ms after last keystroke |

### Caching Strategy
- **Pathway list**: Cached client-side, invalidated on WebSocket `pathway.status_changed`
- **Patient demographics**: Cached with 5-minute TTL
- **Lab results**: Cached with 1-minute TTL (frequently updated)
- **Notes**: Cached individually, invalidated on edit
- **Prehab data**: Cached with 5-minute TTL (bulk data, less frequent changes)

---

## Analytics Events

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `periop.pathway_created` | New pathway created | Patient ID, procedure, surgeon, prehab duration |
| `periop.status_changed` | Pathway status transition | Pathway ID, old/new status, clinician, timestamp |
| `periop.pillar_completed` | All items in a pillar marked complete | Pathway ID, pillar number, time to complete |
| `periop.briefing_generated` | Pre-op briefing created | Pathway ID, data completeness %, clinician |
| `periop.note_created` | Clinical note saved | Note type, author role, word count |
| `periop.discharge_initiated` | Discharge process started | LOS, complications count, readiness score |
| `periop.readiness_threshold` | Readiness score crosses 70% | Pathway ID, days to surgery, prehab duration |
| `periop.alert_generated` | Clinical alert triggered | Alert type, severity, pathway status |
| `periop.prehab_adherence` | Weekly adherence calculated | Exercise %, nutrition %, app engagement % |
| `periop.fast_track` | Emergency pathway created | Time from creation to surgery |

---

## Error States

| Error | Display | Recovery |
|-------|---------|---------|
| Patient not found | "Patient not found. Please check the MRN or search again." | Redirect to search |
| Pathway not found | "This pathway may have been deleted or you may not have access." | Link to pathway list |
| Failed to save note | "Could not save your note. Your draft has been preserved locally." | Retry button, local storage recovery |
| Briefing generation failed | "Some data sources are unavailable. Briefing generated with available data." | Partial briefing with "[Unavailable]" sections |
| WebSocket disconnected | Subtle amber banner: "Live updates paused. Reconnecting..." | Auto-reconnect with exponential backoff |
| Permission denied | "You do not have permission to [action]. Contact your administrator." | Suggest appropriate role |
| Concurrent edit conflict | "Dr. [Name] has modified this record. Review their changes?" | Side-by-side diff view, merge or overwrite option |
| Lab import failed | "Could not import lab results from HIS. Please enter manually." | Manual entry form |

---

## Future Enhancements (v1.1+)

| Enhancement | Priority | Description |
|-------------|----------|-------------|
| AI Risk Prediction | High | ML model predicting post-op complications based on prehab data, comorbidities, and procedure type |
| Automated Lab Import | High | Integration with hospital HIS/LIS for automatic lab result population |
| Voice Dictation | Medium | Speech-to-text for clinical note entry during rounds |
| Patient-Facing Timeline | Medium | Patient app view of their perioperative journey (simplified, reassuring) |
| MDT Video Conferencing | Medium | In-app video call with shared patient view for remote MDT reviews |
| ERAS Outcome Dashboard | Low | Aggregate ERAS compliance vs. outcomes for quality improvement |
| Research Export | Low | De-identified data export for perioperative palliative care research |
| Barcode/QR Wristband | Low | Scan patient wristband to open pathway (for ward rounds) |

---

## File References

| Document | Link |
|----------|------|
| Blueprint Master | [00_Blueprint_Master.md](00_Blueprint_Master.md) |
| Clinician Dashboard | [10_Screen_Clinician_Dashboard.md](10_Screen_Clinician_Dashboard.md) |
| Patient Prehab Module | [13_Screen_Prehabilitation.md](13_Screen_Prehabilitation.md) |
| Prehab Research | [Research_Prehabilitation_Palliative_Care.md](Research_Prehabilitation_Palliative_Care.md) |
| Technical Design Document | [Output/Technical/Technical_Design_Document.md](Output/Technical/Technical_Design_Document.md) |
| Database Migration | [Output/Code/database/002_prehabilitation_schema.sql](Output/Code/database/002_prehabilitation_schema.sql) |
| OpenAPI Spec | [Output/Technical/openapi.yaml](Output/Technical/openapi.yaml) |
| Design System | [Output/Technical/Design_System.md](Output/Technical/Design_System.md) |
| Test Plan | [Output/Technical/Test_Plan.md](Output/Technical/Test_Plan.md) |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-16 | Initial spec: 5-Pillar Dashboard, Prehab Progress, Perioperative Notes, Post-Op Tracking, Pre-Op Briefing Generator |

---

*PalliCare v1.1 — Perioperative Pathway*
*Screen 14: Bridging prehabilitation, anaesthesia, and palliative care for surgical patients.*
*Built on Dr. Soumya Thakur's 5-Pillar Framework for Anaesthesia in Palliative Surgery.*
