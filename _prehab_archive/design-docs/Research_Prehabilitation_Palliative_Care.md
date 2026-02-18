# Prehabilitation in Palliative Care — Comprehensive Research Report
## For PalliCare App | AIIMS Bhopal Department of Palliative Care & Pain Management

---

> **Report Purpose**: Evidence-based research synthesis on prehabilitation in the palliative care context, informing the design of a Prehab Module for the PalliCare app.
>
> **Date**: 2026-02-16
> **Status**: Research Complete — Ready for Design Translation

---

## Table of Contents

1. [What is Prehabilitation?](#1-what-is-prehabilitation)
2. [Prehabilitation in Cancer/Palliative Surgery](#2-prehabilitation-in-cancerpalliative-surgery)
3. [Indian Context](#3-indian-context)
4. [Digital Health / App Features for Prehab](#4-digital-health--app-features-for-prehab)
5. [Validated Assessment Tools](#5-validated-assessment-tools)
6. [Mapping to Existing PalliCare Features](#6-mapping-to-existing-pallicare-features)
7. [Key References](#7-key-references)

---

## 1. What is Prehabilitation?

### 1.1 Definition

**Prehabilitation** is the process of enhancing a patient's functional capacity and physiological reserve **before** a known stressor (typically surgery, but also chemotherapy, radiation, or transplant) to improve their ability to withstand and recover from that stressor.

The term was formally coined by Ditmyer et al. (2002) and has been refined through work by Carli, Silver, and others at McGill University's Perioperative Programme. The most widely cited definition comes from **Silver & Baima (2013)**:

> Prehabilitation is a process on the continuum of care that occurs between the time of diagnosis and the beginning of acute treatment, and includes physical and psychological assessments that establish a baseline functional level, identify impairments, and provide targeted interventions that improve a patient's health to reduce the incidence and severity of current and future impairments.

### 1.2 Prehabilitation vs. Rehabilitation — Critical Distinction

| Dimension | Prehabilitation | Rehabilitation |
|-----------|----------------|----------------|
| **Timing** | Before the stressor (surgery/treatment) | After the stressor |
| **Goal** | Build reserve, optimize baseline | Restore lost function |
| **Patient state** | Typically higher functional capacity | Often deconditioned post-surgery |
| **Window** | Diagnosis-to-treatment interval (2-8 weeks typical) | Post-treatment (weeks to months) |
| **Motivation context** | Patient has a clear future event to prepare for | Patient may struggle with motivation post-operatively |
| **Evidence trajectory** | Growing since 2010, now strong for colorectal/thoracic | Well-established for decades |
| **Palliative context** | Prepares for palliative procedures despite limited prognosis | May not be offered due to "nihilism" about functional recovery |

**Key insight for PalliCare**: In palliative care, the distinction blurs because patients may undergo repeated procedures (stenting, debulking, fixation). Prehabilitation becomes a **cyclical** process rather than a single pre-surgical episode. The app must support ongoing prehab episodes, not just one-time preparation.

### 1.3 The Four Pillars of Prehabilitation

Prehabilitation rests on four interdependent domains, established by the **Enhanced Recovery After Surgery (ERAS) Society** and reinforced in guidelines by Minnella et al. (2017) and Scheede-Bergdahl et al. (2019):

#### Pillar 1: Exercise / Physical Optimization
- **Aerobic conditioning**: Moderate-intensity continuous training (MICT) or high-intensity interval training (HIIT)
- **Resistance training**: Targeting major muscle groups, especially lower extremity strength
- **Functional training**: Activities of daily living (ADL) practice, sit-to-stand, stair climbing
- **Targets**: Improve VO2peak by 1-2 mL/kg/min (associated with reduced complications), increase 6-minute walk distance (6MWD) by 20-30 meters
- **Duration**: Minimum 2-4 weeks, ideally 4-8 weeks pre-surgery
- **Evidence**: Barberan-Garcia et al. (2018) RCT showed 51% reduction in post-surgical complications with exercise prehab; PREHAB trial (Carli et al., 2020) demonstrated improved functional walking capacity

#### Pillar 2: Nutritional Optimization
- **Screening**: Subjective Global Assessment (SGA), Patient-Generated SGA (PG-SGA), Malnutrition Universal Screening Tool (MUST), NRS-2002
- **Protein supplementation**: Target 1.2-1.5 g/kg/day protein (higher in sarcopenia/cachexia)
- **Immunonutrition**: Arginine, omega-3 fatty acids, nucleotides — 5-7 days pre-operatively (Braga et al., 2002)
- **Oral nutritional supplements (ONS)**: Energy-dense, protein-rich supplements when oral intake is inadequate
- **Micronutrient correction**: Iron, vitamin D, B12, folate deficiencies
- **Cachexia management**: Multimodal approach including appetite stimulants, anti-inflammatory agents, exercise
- **Evidence**: Gillis et al. (2014) demonstrated that whey protein supplementation combined with exercise improved functional recovery after colorectal surgery

#### Pillar 3: Psychological Preparation
- **Anxiety management**: Pre-procedural anxiety is associated with higher post-operative pain, longer hospital stay, and worse recovery
- **Cognitive-behavioral strategies**: Psychoeducation, cognitive restructuring, relaxation training
- **Coping skills training**: Problem-focused and emotion-focused strategies
- **Advance care planning**: Particularly relevant in palliative surgery — clarifying goals, expectations, and acceptable outcomes
- **Stress reduction**: Mindfulness-based stress reduction (MBSR), guided imagery
- **Evidence**: Tsimopoulou et al. (2015) systematic review found psychological prehab reduced anxiety and length of stay; Mavros et al. (2011) meta-analysis confirmed psychological preparation improves post-operative outcomes

#### Pillar 4: Smoking/Substance Cessation & Medical Optimization
- **Smoking cessation**: Minimum 4 weeks pre-operatively reduces pulmonary complications by 40-50% (Thomsen et al., 2014)
- **Alcohol reduction**: Cessation 4-8 weeks pre-surgery reduces surgical site infections, cardiopulmonary complications
- **Opioid optimization**: Taper or stabilize chronic opioid doses; address opioid-induced hyperalgesia
- **Medical optimization**: Anaemia correction, glycemic control, cardiopulmonary risk reduction
- **Medication review**: Polypharmacy rationalization, perioperative medication planning

### 1.4 Evidence Base — Key Studies

#### Landmark RCTs
| Study | Population | Intervention | Key Finding |
|-------|-----------|--------------|-------------|
| **Barberan-Garcia et al. (2018)** | Major abdominal surgery | Personalized exercise + motivational support | 51% reduction in post-surgical complications |
| **Carli et al. (2020) — PREHAB Trial** | Colorectal cancer surgery | Trimodal prehab (exercise + nutrition + anxiety reduction) vs. rehabilitation | Prehab group had significantly better 6MWD recovery at 8 weeks |
| **Gillis et al. (2014)** | Colorectal cancer | Exercise + whey protein + anxiety reduction | Improved functional capacity at 4 and 8 weeks post-surgery |
| **Minnella et al. (2018)** | Colorectal cancer | Multimodal prehab | Patients who improved >20m in 6MWD pre-op had 50% fewer complications |
| **Loughney et al. (2016)** | Upper GI cancer | Structured exercise prehab | Significant improvement in VO2peak and 6MWD |
| **Bousquet-Dion et al. (2018)** | Colorectal cancer | Prehab walking/cycling + protein + relaxation | Improved 6MWD trajectory from diagnosis through recovery |

#### Systematic Reviews and Meta-Analyses
| Study | Scope | Key Finding |
|-------|-------|-------------|
| **Moran et al. (2016)** Cochrane Review | Exercise prehab for abdominal cancer | Moderate evidence for improved post-op walking capacity |
| **Treanor et al. (2018)** | Prehab for cancer | Evidence supports multimodal prehab improving QoL and function |
| **Hughes et al. (2019)** | Prehab across surgical specialties | Reduced complications, hospital LOS; strongest evidence in colorectal |
| **Heger et al. (2020)** | Prehab in hepato-pancreato-biliary surgery | Improved functional capacity; trend toward reduced complications |
| **Luther et al. (2018)** | Prehab systematic review | Strongest effect when all 4 pillars are included (multimodal) |
| **Waterland et al. (2021)** | Frail elderly surgical patients | Prehab improved frailty scores and reduced complications |

### 1.5 How Prehabilitation Differs in Palliative vs. Curative Surgical Contexts

This is the most critical distinction for PalliCare:

| Dimension | Curative Surgery Prehab | Palliative Surgery Prehab |
|-----------|------------------------|--------------------------|
| **Primary goal** | Optimize for surgery, maximize cure chance | Optimize for surgery to relieve symptoms, improve QoL |
| **Time window** | Often flexible (can delay surgery for prehab) | Often compressed (urgent symptoms, bowel obstruction) |
| **Functional ceiling** | Return to pre-diagnosis function | Maintain or modestly improve current function |
| **Exercise intensity** | Moderate-to-high intensity achievable | Must be adapted for fatigue, pain, cachexia, frailty |
| **Nutritional targets** | Full caloric restoration possible | Cachexia may limit anabolic response; comfort-focused nutrition |
| **Psychological focus** | Anxiety about surgery, return to normalcy | Existential distress, goals of care, advance planning |
| **Prognosis awareness** | Recovery expected | May be last surgical intervention; EOLC planning concurrent |
| **Repeated episodes** | Typically single pre-op prehab episode | May need multiple prehab cycles for serial procedures |
| **Family involvement** | Supportive but patient-centric | Family often primary caregivers, integral to prehab execution |
| **Outcome measures** | Complications, LOS, 30-day mortality, functional recovery | Symptom relief, QoL improvement, functional maintenance, hospital-free days |
| **Opioid context** | May be opioid-naive | Likely on chronic opioids; optimization critical |

**Clinical bottom line**: Palliative prehabilitation is not "rehabilitation lite." It is a distinct clinical discipline requiring modified goals (symptom optimization over cure), adapted interventions (gentler, shorter, more family-involved), and different outcome metrics (QoL-focused, not complication-reduction-focused).

---

## 2. Prehabilitation in Cancer/Palliative Surgery Specifically

### 2.1 Palliative Surgical Procedures Requiring Prehab

The following procedures are common in palliative care and benefit from pre-surgical optimization:

| Procedure | Indication | Prehab Window | Key Prehab Priorities |
|-----------|-----------|---------------|----------------------|
| **Palliative debulking** | Symptom relief from tumor mass effect | 2-4 weeks if available | Nutritional optimization, functional capacity |
| **Bowel obstruction relief** (stenting, bypass, ostomy) | Malignant bowel obstruction | Often <1 week (urgent) | Fluid/electrolyte correction, anaemia, psychological preparation |
| **Pathological fracture fixation** | Bone metastases | 1-2 weeks | Pain optimization, anaemia correction, VTE prophylaxis |
| **Biliary/ureteric stenting** | Obstructive jaundice, hydronephrosis | 1-2 weeks | Sepsis management, nutritional support, coagulation |
| **Palliative thoracentesis/pleurodesis** | Malignant pleural effusion | 1-2 weeks | Respiratory optimization, exercise tolerance |
| **Spinal cord decompression** | Metastatic cord compression | Emergency (hours to days) | Dexamethasone, pain control, DVT prophylaxis |
| **Gastrostomy/jejunostomy placement** | Dysphagia, head/neck cancer | 1-2 weeks | Nutritional assessment, swallowing assessment |
| **Palliative amputation** | Fungating tumors, intractable pain | 2-4 weeks | Psychological preparation, phantom pain prevention, prosthetic planning |
| **Nerve block/neurolytic procedures** | Intractable pain | Days to weeks | Opioid optimization, psychological readiness |

### 2.2 Functional Capacity Assessment for Prehab

Functional assessment is the cornerstone of prehab prescription. These validated tools determine baseline capacity and guide intervention intensity:

#### Primary Assessment Tools

**a) Six-Minute Walk Test (6MWT)**
- The most widely used functional capacity measure in prehab research
- Correlates with VO2peak (Gold standard: VO2peak of <11 mL/kg/min predicts high surgical risk)
- Requires a 30-meter flat corridor; patient walks as far as possible in 6 minutes
- **Minimum clinically important difference (MCID)**: 20-30 meters in cancer populations
- **Palliative adaptation**: May need to use 2-minute walk test (2MWT) for severely deconditioned patients; can be done in hospital corridor
- **App proxy**: Step count over 6 minutes using phone accelerometer (validated by Presset et al., 2019)

**b) Cardiopulmonary Exercise Testing (CPET)**
- Gold standard for objective functional assessment
- Measures VO2peak, anaerobic threshold (AT), ventilatory equivalents
- **Surgical risk thresholds** (Older et al., 1999; West et al., 2014):
  - AT <11 mL/kg/min = high risk for major abdominal surgery
  - VO2peak <15 mL/kg/min = elevated risk
- **Limitation**: Requires specialized equipment; not universally available in Indian settings
- **Role in palliative**: Often replaced by simpler measures (6MWT, TUG) but ideal where available

**c) Timed Up and Go (TUG)**
- Time to stand from chair, walk 3 meters, turn, walk back, sit down
- Normal: <10 seconds; >20 seconds = significantly impaired mobility, fall risk
- **Advantage**: No equipment needed, can be done at bedside or home
- **App-friendly**: Can be self-timed using phone timer with voice instructions

**d) Grip Strength (Hand Dynamometry)**
- Surrogate marker for overall skeletal muscle strength and sarcopenia
- Measured using Jamar dynamometer (3 trials, best of 3)
- **Cut-offs** (EWGSOP2 criteria for sarcopenia):
  - Males: <27 kg
  - Females: <16 kg
- **Palliative relevance**: Tracks muscle wasting trajectory; predicts post-operative complications
- **App integration**: Requires external device, but trends can be logged manually

**e) 30-Second Sit-to-Stand Test (30s-STS)**
- Count of complete sit-to-stand cycles in 30 seconds
- Correlates with lower extremity strength and functional capacity
- **Advantage**: No equipment beyond a standard chair; excellent for home-based assessment
- **Normative data** (Jones et al., 1999): Age-specific norms available
- **App-friendly**: Self-administered with video guidance, phone counts reps or patient reports

**f) Short Physical Performance Battery (SPPB)**
- Composite score (0-12) from: balance tests + gait speed + chair stand
- Scores <8 indicate significant functional limitation
- Predicts surgical outcomes, disability, mortality

### 2.3 Nutritional Prehabilitation

#### Cachexia Assessment and Management
Cancer cachexia affects 50-80% of advanced cancer patients and is the primary barrier to nutritional prehab in the palliative population.

**Cachexia staging** (Fearon et al., 2011 — International Cachexia Consensus):
- **Pre-cachexia**: Weight loss <5%, anorexia, metabolic changes
- **Cachexia**: Weight loss >5% in 6 months, or BMI <20 + weight loss >2%, or sarcopenia + weight loss >2%
- **Refractory cachexia**: Catabolic state not responsive to anti-cancer or nutritional therapy; prognosis <3 months

**Nutritional prehab protocol for palliative surgery**:

| Component | Target | Intervention |
|-----------|--------|-------------|
| **Caloric intake** | 25-30 kcal/kg/day | Diet counseling, ONS, appetite stimulants (megestrol, dexamethasone short-course) |
| **Protein** | 1.2-1.5 g/kg/day (up to 2 g/kg in severe sarcopenia) | Whey protein supplements, egg-based supplements, dal/paneer in Indian diet |
| **Immunonutrition** | Arginine 6.25g/day + Omega-3 + Nucleotides | Specialized ONS (e.g., Impact, Resource Immunon) for 5-7 days pre-op |
| **Micronutrients** | Correct deficiencies | Iron (IV if indicated), Vitamin D (if <20 ng/mL), B12, folate |
| **Hydration** | Adequate fluid intake pre-operatively | Carbohydrate loading (maltodextrin drink 2h pre-op per ERAS) |
| **Anti-emetics** | Control nausea to enable oral intake | Ondansetron, metoclopramide, dexamethasone |
| **Indian dietary adaptation** | Culturally appropriate protein sources | Sattu (roasted gram flour), moong dal, curd/dahi, paneer, eggs, soy; ghee for caloric density |

#### Immunonutrition Evidence
- **Braga et al. (2002)**: Perioperative immunonutrition in GI cancer surgery reduced infectious complications by 50%
- **ESPEN Guidelines (2017)**: Recommend immunonutrition for 5-7 days pre-operatively in malnourished surgical patients
- **Limitation in palliative**: Many patients cannot tolerate full immunonutrition protocols; comfort and preference take priority

### 2.4 Exercise Prehabilitation — Adapted for Palliative Populations

The standard prehab exercise prescription must be modified for patients with:
- Cancer-related fatigue (CRF)
- Chronic pain (often on opioids)
- Frailty
- Bone metastases (fracture risk)
- Cachexia/sarcopenia

#### Adapted Exercise Prescription

| Parameter | Standard Prehab | Palliative-Adapted Prehab |
|-----------|----------------|--------------------------|
| **Aerobic type** | Cycling, treadmill | Walking (corridor/garden), seated cycling, arm ergometry |
| **Aerobic intensity** | 60-80% HRmax or RPE 13-15 | 40-60% HRmax or RPE 11-13 (light to moderate) |
| **Aerobic duration** | 30-45 min/session | 10-20 min/session (can be split into 2x10 min) |
| **Aerobic frequency** | 3-5x/week | 3-5x/week (daily if tolerated, even 5 min counts) |
| **Resistance type** | Machine or free weights | Body weight, resistance bands, water bottles as weights |
| **Resistance intensity** | 60-80% 1RM | 40-60% 1RM or RPE 11-13 |
| **Resistance exercises** | 8-10 exercises, 2-3 sets x 8-12 reps | 4-6 exercises, 1-2 sets x 8-10 reps |
| **Key exercises** | Squats, lunges, bench press | Sit-to-stand, wall push-ups, seated rows with bands, heel raises |
| **Flexibility** | Standard stretching | Gentle range-of-motion, yoga-based stretches |
| **Balance** | Optional | Important if fall risk (tandem stance, single-leg stand near wall) |
| **Progression** | Weekly increases | Gradual, guided by symptoms (pain, fatigue, shortness of breath) |
| **Safety modifications** | Standard precautions | Avoid loaded axial spine/long bone exercises if bone mets; Hb >8 g/dL for exercise; stop if pain >7/10 |
| **Supervision** | Physiotherapist-supervised sessions | Can be home-based with family assistance + app guidance + periodic physio review |

#### Exercise Contraindications/Precautions in Palliative Setting
- **Absolute**: Unstable spinal cord compression, acute DVT/PE, active hemorrhage, uncontrolled cardiac arrhythmia, severe thrombocytopenia (platelets <20,000)
- **Relative**: Bone metastases in weight-bearing sites (modify to non-weight-bearing), severe anaemia (Hb <8), severe cachexia (BMI <16), uncontrolled pain, active infection
- **Modify**: Use Borg RPE scale (0-10) for intensity monitoring; allow rest breaks; seated alternatives for all exercises

### 2.5 Psychological Prehabilitation

In palliative surgery, psychological prehab addresses a unique confluence of:
- Pre-surgical anxiety (universal)
- Disease-related distress (cancer-specific)
- Existential concerns (palliative-specific)
- Decision-making burden (goals of care)
- Anticipatory grief

#### Psychological Prehab Components

| Component | Intervention | Evidence | Timing |
|-----------|-------------|---------|--------|
| **Pre-surgical anxiety reduction** | Psychoeducation about procedure, expected recovery, pain management plan | Hathaway (1986), Mavros et al. (2011) | 1-2 weeks pre-op |
| **Relaxation training** | Progressive muscle relaxation (PMR), diaphragmatic breathing, guided imagery | Tsimopoulou et al. (2015) | Daily for 2-4 weeks pre-op |
| **Cognitive restructuring** | Address catastrophizing, fear-avoidance beliefs about surgery | Rolving et al. (2015) | 2-3 sessions pre-op |
| **Coping skills training** | Problem-focused coping, self-efficacy building, expectation management | Carli et al. (2020) | Ongoing pre-op |
| **Advance care planning** | Goals of care discussion, advance directive completion, surrogate decision-maker identification | Wright et al. (2008) | Initiated at prehab start |
| **Meaning-centered therapy** | Breitbart's meaning-centered group psychotherapy adapted for pre-surgical | Breitbart et al. (2010, 2015) | 2-4 sessions if time permits |
| **Family preparation** | Caregiver education about post-op care, expectations, their own coping | Given et al. (2012) | 1-2 sessions |

#### Goal-Setting in Palliative Prehab
Standard SMART goals need modification:
- **SMART-P Goals** (Small, Meaningful, Adjustable, Realistic, Today-focused) — already present in PalliCare's My Journey module
- Pre-surgical goal examples:
  - "Walk to the end of the corridor every morning this week"
  - "Drink one protein supplement after each meal"
  - "Practice 5 minutes of breathing exercises before bed"
  - "Discuss my wishes with my daughter this week"

### 2.6 Anaemia Optimization Pre-Surgery

Anaemia is present in 30-70% of cancer patients presenting for surgery and is an independent predictor of:
- Post-operative complications (OR 1.4-1.8)
- Longer hospital stay
- Transfusion requirement (itself associated with worse outcomes)
- 30-day mortality

#### Anaemia Correction Protocol (NATA/ERAS Guidelines)

| Hb Level | Classification | Intervention | Timeline |
|----------|---------------|-------------|----------|
| >13 g/dL (M) / >12 g/dL (F) | Normal | No intervention needed | — |
| 10-13 / 10-12 g/dL | Mild anaemia | Oral iron + Vitamin C; check ferritin, B12, folate | 4-6 weeks pre-op |
| 7-10 g/dL | Moderate anaemia | IV iron (ferric carboxymaltose 1000mg single dose); consider EPO if non-iron-deficiency | 2-4 weeks pre-op |
| <7 g/dL | Severe anaemia | Transfusion (restrictive threshold, single unit + reassess); IV iron concurrently | Urgent pre-op |

#### Indian Context for Anaemia
- Anaemia prevalence is significantly higher in Indian populations (NFHS-5: 57% women, 25% men are anaemic)
- Iron deficiency is most common cause, but B12 deficiency is also prevalent (vegetarian diets)
- IV iron (ferric carboxymaltose) is increasingly available at tertiary centers like AIIMS
- Erythropoietin use remains limited by cost and availability

### 2.7 Opioid Optimization Before Surgery

This directly maps to the source PDF's "Analgesic Optimization" for palliative surgery anaesthesia:

#### Key Issues
1. **Opioid tolerance**: Chronic opioid use leads to cross-tolerance; higher intraoperative and post-operative opioid requirements
2. **Opioid-induced hyperalgesia (OIH)**: Paradoxically increased pain sensitivity with chronic opioid use
3. **Opioid side effects**: Constipation (ileus risk), respiratory depression, immunosuppression
4. **Withdrawal risk**: Abrupt cessation causes acute withdrawal

#### Pre-Surgical Opioid Optimization Protocol

| Action | Rationale | Timeline |
|--------|-----------|----------|
| **Calculate MEDD** | Standardize opioid burden quantification | At prehab intake |
| **Opioid rotation** | If OIH suspected or side effects limiting | 2-4 weeks pre-op |
| **Dose stabilization** | Ensure stable pain control before surgery | 1-2 weeks pre-op |
| **Adjuvant addition** | Add gabapentinoids, NSAIDs, ketamine (perioperative) to reduce opioid requirement | 1-2 weeks pre-op |
| **Bowel regimen optimization** | Prevent post-op ileus (laxative protocol) | Concurrent |
| **Patient education** | Explain perioperative pain plan, PCA use, multimodal analgesia | 1 week pre-op |
| **Anaesthesia communication** | Detailed opioid history to anaesthetic team | Pre-op assessment |
| **Methadone consideration** | NMDA antagonist properties; useful for complex pain + OIH | Specialist decision |
| **Buprenorphine planning** | If on buprenorphine: continue or convert per institutional protocol | 1-2 weeks pre-op |

**PalliCare Integration**: The Medication Tracker already captures MEDD (clinician dashboard), rescue medication frequency, and side effects. Prehab module should add: pre-op opioid optimization checklist, anaesthesia communication summary, perioperative pain plan documentation.

---

## 3. Indian Context

### 3.1 AIIMS and Prehabilitation

AIIMS institutions across India have been early adopters of ERAS (Enhanced Recovery After Surgery) protocols, which inherently include prehab components:

- **AIIMS New Delhi**: Published ERAS protocols for colorectal and hepatobiliary surgery incorporating prehab assessment (Bhandari et al., 2019)
- **AIIMS Jodhpur**: Implemented prehab in orthopedic surgery (joint replacement)
- **Tata Memorial Hospital, Mumbai**: Pioneered prehab in head/neck cancer surgery with nutritional focus (nutritional prehab shown to reduce surgical site infections by 35% in their cohort)
- **AIIMS Bhopal**: Department of Palliative Care & Pain Management is uniquely positioned to implement palliative-specific prehab, which no Indian center has yet formally protocolized

#### Opportunity for AIIMS Bhopal
- First institution to create a **digital prehab platform specifically for palliative surgery**
- Research opportunity: RCT comparing digital prehab-supported vs. standard care for palliative surgical outcomes
- Can leverage PalliCare's existing infrastructure (symptom tracking, medication management) as the prehab backbone

### 3.2 National Programme for Palliative Care (NPPC) Alignment

The NPPC, launched under the National Health Mission, emphasizes:

| NPPC Priority | Prehab Alignment |
|--------------|------------------|
| Integration of palliative care across levels of healthcare | App-based prehab extends hospital-based care to home setting |
| Symptom management as core competency | Prehab's opioid optimization and symptom control directly serve this |
| Community-based palliative care | Home-based prehab exercises with family/caregiver support |
| Essential drug list access | Nutritional supplements and anaemia correction medications |
| Psychosocial support | Psychological pillar of prehab addresses this directly |
| Training of healthcare workers | App can serve as training tool for prehab delivery by CHWs/ASHAs |

The 2019 Lancet Commission on Palliative Care and the 2024 WHO guidelines on Integration of Palliative Care in Health Systems both recommend functional optimization before palliative procedures. PalliCare's prehab module would directly operationalize these recommendations.

### 3.3 ERAS India Adoption

ERAS (Enhanced Recovery After Surgery) Society India was formally constituted in 2018. Key developments:

- **ERAS India Guidelines for Colorectal Surgery (2020)**: Include pre-operative nutritional screening (NRS-2002), exercise counseling, smoking/alcohol cessation, and psychological preparation
- **ERAS India Guidelines for Hepato-Pancreato-Biliary Surgery (2021)**: Emphasize pre-operative anaemia correction and nutritional prehab
- **ERAS India: Barriers Identified** (Jain et al., 2021):
  - Limited physiotherapy infrastructure for pre-operative exercise programs
  - Patient non-compliance with pre-operative exercise due to distance from hospital
  - Nutritional supplements not uniformly affordable
  - Smoking cessation support infrastructure limited
  - **Digital health identified as a potential enabler** for overcoming distance and compliance barriers

PalliCare's prehab module directly addresses the digital health gap identified by ERAS India.

### 3.4 Resource-Limited Setting Adaptations

| Challenge | Adaptation for Indian Setting |
|-----------|------------------------------|
| **Limited physiotherapy access** | Home-based exercise prescription via app with video demonstrations; family-assisted exercises; periodic tele-physio review |
| **CPET not available** | Use 6MWT (corridor-based), TUG, 30s sit-to-stand, grip strength; step-count proxy via smartphone |
| **Immunonutrition cost** | Focus on locally available protein sources: sattu, moong dal, curd, eggs, soy chunks; ghee for caloric density; low-cost ONS (e.g., Ensure, Protinex) |
| **Specialist psychologist unavailable** | App-delivered guided relaxation (already in Breathe module), psychoeducation (Learn module); tele-psychology for complex cases |
| **Patient lives far from hospital** | Entire prehab program designed for home delivery via app with weekly tele-check-ins; in-person only for initial assessment and pre-op review |
| **Low literacy** | Voice-guided prehab instructions, video demonstrations, emoji-based progress tracking, caregiver involvement |
| **Irregular smartphone access** | Offline-first prehab exercises and tracking; caregiver device sharing; printable exercise sheets for fallback |
| **ASHA/CHW integration** | Train community health workers to support prehab delivery; app provides CHW-facing checklists and monitoring |

### 3.5 Cultural Considerations

#### Yoga and Pranayama as Exercise Prehab
- **Evidence**: Yoga has robust evidence in cancer populations for improving fatigue, QoL, sleep, and anxiety (Buffart et al., 2012; Cramer et al., 2017)
- **Pranayama specifically**:
  - **Anulom Vilom**: Alternate nostril breathing — improves vagal tone, reduces anxiety, improves respiratory function (Pal et al., 2014)
  - **Bhramari**: Bee-breath — reduces blood pressure and anxiety; shown to improve perioperative outcomes (Kuppusamy et al., 2018)
  - **Ujjayi**: Ocean breath — promotes diaphragmatic engagement, useful for thoracic/abdominal surgery preparation
- **Cultural acceptability**: High in Indian populations; many patients already practice some form of yoga/pranayama
- **PalliCare alignment**: Breathe module already includes Pranayama (Anulom Vilom, Bhramari, Ujjayi). For prehab, these become prescriptive (specific frequency/duration targets tied to surgery countdown) rather than optional relaxation tools.
- **Adaptation for palliative**: Chair yoga for limited mobility; supine yoga for bed-bound; avoid inversions and strong abdominal contractions in patients with ascites, brain metastases

#### Ayurvedic Nutrition Integration
- Not evidence-based by RCT standards but culturally important and generally aligned with nutritional prehab goals
- **Rasayana therapy** (rejuvenation): Ashwagandha, Shatavari, Amalaki — some preclinical evidence for anti-cachexia and immunomodulatory effects
- **Appropriate integration**: Offer as dietary diversity suggestions alongside evidence-based nutrition; never as replacement for protein/calorie targets
- **Caution**: Must not interfere with surgical coagulation (some Ayurvedic preparations contain heavy metals or interact with medications); medication interaction check required
- **App approach**: Include traditional Indian foods in nutrition tracker database (ragi, sattu, bajra, jowar, moong dal water, dahi-chawal, khichdi) with their protein/calorie content; label clearly as complementary

---

## 4. Digital Health / App Features for Prehab Module

### 4.1 Module Architecture

The Prehab Module should be a new section within PalliCare, accessible when a patient is enrolled in a prehab program (clinician-initiated, surgery-linked).

```
┌──────────────────────────────────────────────────────────┐
│                    PREHAB MODULE                          │
│               "Getting Ready / तैयारी"                    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  [A] Surgery Countdown & Overview                  │    │
│  │  "Your surgery is in 18 days"                     │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  [B] Exercise Plan                                │    │
│  │  Today: 15-min walk + 10-min sit-to-stand        │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  [C] Nutrition Tracker                            │    │
│  │  Today: 48g / 72g protein target                  │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  [D] Mind & Mood                                  │    │
│  │  Readiness check + breathing exercise             │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  [E] Blood Health (Anaemia Tracker)               │    │
│  │  Hb: 10.2 g/dL → Target: 11.0 before surgery    │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  [F] Medication Optimization                      │    │
│  │  Opioid plan + new adjuvants                      │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  [G] Smoking Cessation                            │    │
│  │  Day 12 smoke-free (if applicable)                │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  [H] Pre-Op Checklist                             │    │
│  │  5/12 items complete                              │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  [I] Caregiver Tasks                              │    │
│  │  What family can help with this week              │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Feature Details

#### [A] Surgery Countdown & Timeline View

**Patient-facing**:
- Visual countdown: "Your surgery is in **18 days** / सर्जरी **18 दिन** में है"
- Timeline with milestones:
  - "Day 1: Prehab started" (check)
  - "Week 1: First fitness check" (check)
  - "Week 2: Nutrition review" (upcoming)
  - "Day -3: Pre-op assessment" (upcoming)
  - "Day 0: Surgery day" (goal)
- Daily view: "Today's prehab tasks" — summarizes exercise, nutrition, and psych tasks for the day
- **Tone**: Warm, encouraging. "You are getting stronger every day" / "हर दिन तैयारी बढ़ रही है"
- **Rescheduling handling**: If surgery date changes, timeline updates automatically; patient notified gently

**Clinician-facing** (Dashboard):
- Patient's prehab progress at a glance
- Adherence to exercise, nutrition, psychological prep
- Functional capacity trend (6MWT/STS scores over prehab period)
- "Ready for surgery?" clinical decision indicator (green/amber/red based on prehab milestones)

#### [B] Exercise Prescription & Tracking

**Exercise Library** (with video demonstrations):
- **Walking program**: Graded walking targets (distance or time); can use phone step counter
- **Sit-to-stand**: Video of proper technique; targets (3 sets of 5, progressing to 3x10)
- **Wall push-ups**: Video; targets
- **Seated exercises**: Arm raises, knee extensions, ankle pumps (for bed-bound/very frail)
- **Resistance band exercises**: Seated rows, bicep curls, leg press (video demonstrations)
- **Stair climbing**: If available and safe; counted by flights
- **Yoga/Pranayama** (from Breathe module, but with prehab targets):
  - Anulom Vilom: 5 min, twice daily
  - Bhramari: 3 min, before bed
  - Chair yoga sequence: 15 min, daily
- **Balance exercises**: Tandem stance, single-leg stand (near wall for safety)

**Tracking**:
- **Daily exercise log**: Tap to mark completed; duration recorded
- **Step count integration**: Auto-import from phone pedometer or wearable
- **Intensity monitoring**: Borg RPE scale (0-10) after each session — visual scale like NRS in symptom logger
- **Pain during exercise**: Quick NRS check if pain >4 during exercise
- **Progress visualization**: Weekly bar chart of exercise minutes; 6MWT/STS trend graph
- **Streak tracking**: Gentle ("5 days this week" not "streak broken!")
- **Adaptive**: If patient reports high fatigue or pain, reduce targets automatically: "Today is a rest day. That is okay. / आज आराम का दिन है। यह ठीक है।"

**Video Demonstrations**:
- Short (30-60 second) demonstration videos for each exercise
- Available in Hindi and English voiceover
- Accessible offline (pre-downloaded)
- Show patient (not athlete) performing exercise; culturally appropriate dress
- Include seated/modified versions for every exercise
- Caregiver assistance shown where relevant

#### [C] Nutrition Tracker

**Daily Intake Logging**:
- **Simplified meal logging**: Pre-set meal times (Breakfast, Lunch, Snack, Dinner)
- **Protein tracking** (primary focus): Quick-select common Indian protein sources with auto-calculated protein content:
  - 1 egg = 6g protein
  - 1 cup dal = 12g protein
  - 1 cup curd/dahi = 8g protein
  - 100g paneer = 18g protein
  - 1 glass milk = 8g protein
  - 1 cup soy chunks = 25g protein
  - 1 serving chicken/fish = 20g protein
  - 1 cup sattu drink = 10g protein
  - 1 scoop ONS (Ensure/Protinex) = 9-15g protein (brand-specific)
  - 1 cup rajma/chole = 15g protein
  - 1 roti = 3g protein
  - 1 serving rice = 2g protein
- **Calorie tracking** (secondary): Estimated from meal composition
- **Visual progress**: Protein bar (e.g., "48g / 72g target") and calorie ring
- **ONS reminder**: If prescribed, separate reminder: "Time for your nutrition drink / पोषण ड्रिंक का समय"
- **Hydration tracking**: Simple water glass counter
- **Weight logging**: Weekly self-weigh with trend graph (alerts clinician if >2% loss in a week)

**Targets** (set by clinician):
- Protein target: g/day (based on body weight and surgical plan)
- Calorie target: kcal/day
- Fluid target: mL/day
- Supplement compliance: ONS doses per day

#### [D] Mind & Mood — Psychological Readiness

**Pre-surgical anxiety tracking**:
- Brief anxiety check (adapted from HADS-A or GAD-2): 2 questions, weekly
- Surgical readiness self-assessment: "How ready do you feel for your surgery?" (1-10 visual scale)
- Worry log: "What are you most concerned about?" (text or voice entry)

**Interventions** (linked to existing Breathe and Learn modules):
- **Pre-surgical psychoeducation**: "What to expect" series in Learn module:
  - "What happens during your surgery"
  - "How pain will be managed after surgery"
  - "How long recovery typically takes"
  - "Your role in recovery"
- **Guided relaxation**: Daily relaxation exercise assignment from Breathe module
- **Coping card**: Personalized coping statements (patient creates their own):
  - "I am getting ready. My body is stronger." / "मैं तैयार हो रहा/रही हूँ। मेरा शरीर मज़बूत हो रहा है।"
- **Advance care planning prompt**: Gentle, opt-in: "Would you like to share your wishes for care with your family and doctor?" (links to My Journey module)

**Distress Thermometer integration**: Visual 0-10 thermometer for surgical distress, tracked weekly

#### [E] Anaemia Tracker (Blood Health)

- **Hb logging**: Manual entry of lab results (Hb, ferritin, B12, folate, iron studies)
- **Trend visualization**: Line graph of Hb over prehab period with target zone highlighted
- **Target display**: "Target Hb: 11.0 g/dL before surgery / सर्जरी से पहले Hb लक्ष्य: 11.0"
- **Iron supplement reminders**: If prescribed, reminders with intake instructions (empty stomach, with vitamin C)
- **IV iron tracking**: Log date and dose of IV iron infusions
- **Clinician alert**: If Hb drops below threshold or does not improve as expected

#### [F] Medication Optimization (Pre-surgical)

Extends existing Medication Tracker with prehab-specific features:
- **Opioid summary card**: Current MEDD, last dose, rescue usage frequency
- **New prehab medications**: Highlighted section for newly prescribed prehab meds (gabapentinoids, iron, ONS, etc.)
- **Medication hold list**: Medications to stop before surgery (anticoagulants, metformin, certain herbals) with countdown: "Stop aspirin in 5 days"
- **Pre-op medication education**: What to take morning of surgery; what to hold
- **Anaesthesia communication card**: Generates summary of current medications, opioid history, allergies for anaesthesia team — can be shared as PDF or viewed on clinician dashboard

#### [G] Smoking Cessation Support

- **Smoke-free counter**: Days since last cigarette (if applicable)
- **Daily log**: Cravings (frequency and intensity on 0-10 scale)
- **Coping tools**: Quick-access breathing exercise, craving distraction tips
- **Nicotine replacement tracking**: If prescribed, NRT dose and adherence
- **Motivational messages**: Surgery-focused: "Every smoke-free day helps your lungs heal faster for surgery" / "हर धूम्रपान-मुक्त दिन सर्जरी के लिए फेफड़ों को मज़बूत बनाता है"
- **Carbon monoxide estimation**: Based on cigarettes/day reduction, show estimated CO level improvement
- **Clinician dashboard**: Smoking status, cessation adherence, pack-year history

#### [H] Pre-Op Checklist

Interactive checklist that patients and clinicians co-manage:

**Patient tasks**:
- [ ] Blood tests completed (Hb, coagulation, renal, hepatic)
- [ ] Imaging completed (X-ray/CT as ordered)
- [ ] Pre-anaesthesia check-up attended
- [ ] Advance directive discussed with family
- [ ] Medications reviewed (hold list understood)
- [ ] Nothing by mouth (NBM) timing understood
- [ ] Arrangements made for hospital stay (family, home care)
- [ ] Nutritional supplement course completed
- [ ] Exercise program followed for __ weeks
- [ ] Questions for surgeon/anaesthetist written down
- [ ] Personal items packed for hospital
- [ ] Post-discharge care plan understood

**Clinician tasks** (dashboard side):
- [ ] Anaemia optimized (Hb at target)
- [ ] Nutritional status assessed (SGA/PG-SGA)
- [ ] Functional capacity documented (6MWT/TUG/STS)
- [ ] Psychological readiness assessed
- [ ] Opioid plan documented
- [ ] Surgical consent completed
- [ ] Goals of care documented
- [ ] Anaesthesia plan communicated
- [ ] VTE prophylaxis planned
- [ ] Blood products arranged (if anticipated)

#### [I] Caregiver Prehab Tasks

In the palliative Indian context, families are central to prehab delivery:
- **Caregiver task list**: "This week, you can help with:"
  - "Help [patient] walk for 15 minutes daily"
  - "Prepare high-protein meals (see recipe suggestions)"
  - "Remind about medication at 6 AM and 6 PM"
  - "Practice breathing exercises together"
- **Caregiver education**: Short modules on post-operative care expectations
- **Caregiver-reported observations**: "How is [patient] managing exercises?" (brief weekly check)
- **Shared progress view**: Caregiver can see patient's prehab progress (with patient consent)

### 4.3 Clinician Prehab Dashboard

New section in Clinician Dashboard (Screen Spec 10):

```
┌────────────────────────────────────────────────────────────────┐
│  PREHAB DASHBOARD — Ramesh K                                   │
│  Surgery: Palliative debulking · Date: 2026-03-06 (18 days)   │
│                                                                │
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │ OVERALL READINESS    │  │ EXERCISE ADHERENCE   │             │
│  │ ████████░░ 72%       │  │ ██████░░░░ 65%       │             │
│  │ On track             │  │ 6MWT: 280m → 310m ↑ │             │
│  └─────────────────────┘  └─────────────────────┘             │
│                                                                │
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │ NUTRITION            │  │ PSYCHOLOGICAL        │             │
│  │ Protein: 85% target  │  │ Anxiety: GAD-2 = 3   │             │
│  │ Weight: 62kg (stable)│  │ Readiness: 7/10      │             │
│  │ Albumin: 3.2         │  │ ACP: Completed ✓     │             │
│  └─────────────────────┘  └─────────────────────┘             │
│                                                                │
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │ ANAEMIA              │  │ SMOKING CESSATION    │             │
│  │ Hb: 10.2 → 10.8 ↑   │  │ N/A (non-smoker)     │             │
│  │ IV iron: 2/2/26     │  │                       │             │
│  │ Target: 11.0         │  │                       │             │
│  └─────────────────────┘  └─────────────────────┘             │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ MEDICATION OPTIMIZATION                                 │   │
│  │ MEDD: 90mg · Rescue: 2/day avg · Gabapentin: started   │   │
│  │ Hold list: Aspirin (stop 7 days pre) — 11 days out     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ PRE-OP CHECKLIST: 8/12 complete                         │   │
│  │ Missing: Imaging, consent, blood products, VTE plan    │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  [ Edit Prehab Plan ]  [ Print Summary ]  [ Share with Anaes ]│
└────────────────────────────────────────────────────────────────┘
```

### 4.4 Prehab Prescription Interface (Clinician Side)

Clinicians need to **prescribe** prehab, not just monitor it:

- **Surgery details entry**: Type, date, anaesthesia plan, surgeon, hospital
- **Prehab prescription template**: Pre-populated based on surgery type:
  - Exercise intensity and type
  - Protein/calorie targets based on weight and nutritional status
  - Psychological intervention prescription
  - Anaemia correction plan
  - Medication changes (new starts, holds, dose adjustments)
  - Smoking cessation plan (if applicable)
- **Customization**: All fields editable; can add/remove components
- **Functional assessment entry**: 6MWT, TUG, STS, grip strength results — auto-plotted on trend graph
- **Progress notes**: Prehab-specific clinical notes with template
- **Decision support**: "Patient is NOT meeting exercise targets — consider physiotherapy referral" or "Hb not improving — consider IV iron escalation"

---

## 5. Validated Assessment Tools for Prehab

### 5.1 Comprehensive Tool Inventory

#### Functional Capacity Assessment

| Tool | What it Measures | Time | Setting | Hindi Validation | App-Friendly |
|------|-----------------|------|---------|-----------------|-------------|
| **6MWT (Six-Minute Walk Test)** | Submaximal exercise capacity | 6 min | Corridor (30m) | Yes (Rao et al., 2013) | Phone accelerometer proxy |
| **2MWT (Two-Minute Walk Test)** | Modified for frail/bed-rest patients | 2 min | Corridor | Limited | Phone accelerometer proxy |
| **CPET (Cardiopulmonary Exercise Test)** | VO2peak, anaerobic threshold | 15-20 min | Lab-based | N/A (physiological) | Not app-deliverable |
| **TUG (Timed Up and Go)** | Mobility, fall risk | 30 sec | Bedside/home | Yes (Bohannon, 2006 — universal norms) | Self-timed via phone |
| **30s-STS (Sit-to-Stand)** | Lower extremity strength | 30 sec | Chair | Validated globally | Self-count with video guide |
| **SPPB (Short Physical Performance Battery)** | Composite: balance, gait, strength | 10 min | Clinical | Limited Hindi | Partially app-deliverable |
| **Grip Strength** | Sarcopenia marker | 2 min | Dynamometer | Universal norms | Manual logging |
| **Gait Speed (4-meter)** | Mobility, frailty marker | 1 min | Corridor | Universal norms | Self-timed |
| **DASI (Duke Activity Status Index)** | Estimated functional capacity | 3 min | Questionnaire | Hindi validated (Goel et al., 2016) | Fully app-deliverable |
| **Borg RPE Scale (0-10)** | Perceived exertion during exercise | Continuous | During exercise | Translatable; widely used | Fully app-deliverable |
| **ECOG Performance Status** | Overall functional status (0-4) | Clinician-rated | Clinical | Universal | Clinician-entered |
| **PPS (Palliative Performance Scale)** | Palliative-specific function (0-100%) | Clinician-rated | Clinical | Used widely in India | Clinician-entered |
| **Karnofsky Performance Status** | Functional status (0-100) | Clinician-rated | Clinical | Universal | Clinician-entered |

#### Nutritional Assessment

| Tool | What it Measures | Time | Hindi Validation | App-Friendly |
|------|-----------------|------|-----------------|-------------|
| **PG-SGA (Patient-Generated Subjective Global Assessment)** | Nutritional status in cancer | 5-10 min | Hindi validated (Sharma et al., 2015) | Partially app-deliverable (patient section) |
| **MUST (Malnutrition Universal Screening Tool)** | Malnutrition risk | 2 min | Limited | App-deliverable (uses BMI, weight loss, acute illness) |
| **NRS-2002 (Nutritional Risk Screening)** | Nutritional risk (surgical patients) | 3 min | Used in Indian hospitals | App-deliverable |
| **SNAQ (Simplified Nutritional Appetite Questionnaire)** | Appetite as predictor of weight loss | 1 min | Limited | Fully app-deliverable |
| **BMI** | Body mass composition | 30 sec | Universal | Auto-calculated from height/weight |
| **Mid-Upper Arm Circumference (MUAC)** | Muscle mass proxy | 1 min | Universal | Manual logging |
| **Serum Albumin** | Visceral protein status | Lab test | N/A | Lab value entry |
| **Cachexia Staging** (Fearon criteria) | Pre-cachexia / cachexia / refractory | Clinical assessment | N/A | Clinician-entered |
| **SARC-F Questionnaire** | Sarcopenia screening | 1 min | Hindi under validation | Fully app-deliverable |

#### Psychological Readiness

| Tool | What it Measures | Items | Hindi Validation | App-Friendly |
|------|-----------------|-------|-----------------|-------------|
| **HADS (Hospital Anxiety and Depression Scale)** | Anxiety (HADS-A) + Depression (HADS-D) | 14 items | Yes (Zigmond & Snaith; Hindi: Kugathasan et al., validated in Indian oncology) | Fully app-deliverable |
| **DT (Distress Thermometer)** | Overall distress + problem list | 1 item + checklist | Hindi validated (NCCN version adapted for India) | Fully app-deliverable |
| **PHQ-9 (Patient Health Questionnaire)** | Depression severity | 9 items | Yes (Hindi, Marathi, Tamil, Bengali validated) | Already in PalliCare |
| **PHQ-2** | Depression screening | 2 items | Yes (Hindi) | Already in PalliCare |
| **GAD-7 / GAD-2** | Anxiety severity/screening | 7 / 2 items | Yes (Hindi) | Already in PalliCare |
| **ESAS-r Anxiety/Depression subscales** | Symptom burden (anxiety, depression items) | 2 items (of 9) | Yes (Hindi) | Already in PalliCare |
| **Surgical Readiness Visual Analogue Scale** | Self-rated readiness for surgery | 1 item | Translatable | Fully app-deliverable |
| **Brief COPE** | Coping strategies | 28 items | Hindi validated (Patel et al., 2015) | Periodic assessment in app |
| **Connor-Davidson Resilience Scale (CD-RISC-10)** | Psychological resilience | 10 items | Hindi validated (Singh & Yu, 2010) | App-deliverable |
| **Self-Efficacy for Exercise Scale** | Confidence in performing exercise | 9 items | Limited Hindi | App-deliverable |
| **FICA Spiritual History Tool** | Spiritual assessment | 4 domains | Clinician-administered, universal | Clinician dashboard |

#### Frailty Assessment

| Tool | What it Measures | Method | Hindi Validation | App-Friendly |
|------|-----------------|--------|-----------------|-------------|
| **Fried Frailty Phenotype** | 5 criteria: shrinking, weakness, slowness, exhaustion, low activity | Clinical assessment | Used in Indian studies (Kendhapedia et al.) | Partially (grip strength + gait speed + questionnaire) |
| **Clinical Frailty Scale (CFS)** | 9-point clinician-rated scale | Visual scale | Universal | Clinician-entered |
| **Edmonton Frail Scale** | Multi-domain frailty (cognition, function, mood, nutrition, etc.) | 11 items | Limited Hindi | Partially app-deliverable |
| **FRAIL Scale** | 5-item screening questionnaire | Self-report | Translatable | Fully app-deliverable |
| **G8 Screening Tool** | Geriatric oncology screening | 8 items | Used in Indian oncology | App-deliverable |

#### Surgical Risk Scores (Clinician-Facing)

| Tool | Scope | App Integration |
|------|-------|----------------|
| **ASA Physical Status** | Overall surgical risk | Clinician-entered |
| **P-POSSUM** | Morbidity/mortality prediction (surgical) | Auto-calculated from lab + clinical data |
| **NSQIP Surgical Risk Calculator** | Procedure-specific complication risk | Clinician tool |
| **mFI (Modified Frailty Index)** | 11-item frailty from NSQIP | Auto-calculated |
| **Arozullah Respiratory Failure Index** | Post-op respiratory failure risk | Clinician tool |
| **Lee's Revised Cardiac Risk Index** | Cardiac risk for non-cardiac surgery | Clinician tool |

### 5.2 Tools Validated in Hindi / Indian Languages

| Tool | Languages Validated | Source |
|------|-------------------|--------|
| PHQ-9 | Hindi, Marathi, Tamil, Bengali, Gujarati, Kannada, Telugu | Multiple Indian studies |
| PHQ-2 | Hindi, Multiple Indian | Derived from PHQ-9 validations |
| GAD-7 | Hindi, English | Mukherjee et al. (2020) |
| HADS | Hindi | Kugathasan et al.; Pandey et al. (Indian oncology) |
| ESAS-r | Hindi, Tamil, Bengali | Vignarajan et al. (2014); Indian palliative care studies |
| BPI-SF | Hindi, Marathi, Kannada | Saxena et al. (2007) |
| NRS (0-10) | Hindi + 6 Indian languages | Universally validated (visual/numeric) |
| PG-SGA | Hindi | Sharma et al. (2015) |
| DT (Distress Thermometer) | Hindi | Indian adaptations available |
| Wong-Baker FACES | Universal (visual) | No language barrier |
| Borg RPE Scale | Translatable (numeric/visual) | Universal numeric scale |
| Brief COPE | Hindi | Patel et al. (2015) |
| DASI | Hindi | Goel et al. (2016) |
| CD-RISC-10 | Hindi | Singh & Yu (2010) |
| PPS | Universal (clinician-rated) | Widely used in Indian palliative care |

---

## 6. Mapping to Existing PalliCare Features

### 6.1 Feature-by-Feature Mapping

| Prehab Component | Existing PalliCare Feature | Integration Strategy | New Feature Needed? |
|-----------------|---------------------------|---------------------|-------------------|
| **Exercise tracking** | Breathe Module (pranayama/yoga) | Extend Breathe with exercise prescription; add walking/strength exercises | YES: Exercise library with videos, step counter, RPE tracking |
| **Nutrition logging** | None currently | New feature area | YES: Full nutrition tracker with Indian food database |
| **Protein/calorie targets** | None currently | New feature area | YES: Target setting (clinician-prescribed), progress bars |
| **Psychological readiness** | Breathe Module (relaxation) + Learn Module (psychoeducation) + My Journey (goals) | Add pre-surgical education modules to Learn; link relaxation to daily prehab schedule | PARTIAL: Need surgical-specific education content, readiness VAS, worry log |
| **Anxiety tracking** | Symptom Logger (ESAS-r anxiety item) + PHQ-2/GAD-2 | Existing tools sufficient for screening; add surgical readiness VAS and Distress Thermometer | MINIMAL: Add DT, readiness VAS |
| **Advance care planning** | My Journey (Legacy section) | Extend with explicit ACP module: goals of care, surrogate, advance directive | PARTIAL: Need structured ACP form, not just legacy prompts |
| **Pain/opioid tracking** | Pain Diary + Medication Tracker (MEDD on clinician side) | Existing MEDD calculation, rescue tracking, and side effects are exactly what's needed | MINIMAL: Add medication hold list, anaesthesia summary card |
| **Anaemia tracking** | None currently | New feature area | YES: Lab value entry, Hb trend graph, iron supplement reminders |
| **Smoking cessation** | None currently | New feature area | YES: Smoke-free counter, craving log, NRT tracking |
| **Surgery countdown** | None currently | New feature area | YES: Calendar countdown, milestone timeline, pre-op checklist |
| **Functional assessments** | Clinician Dashboard (PPS, ECOG) | Extend with 6MWT, TUG, STS, grip strength logging | PARTIAL: Need patient self-test interface + clinician assessment entry |
| **Caregiver prehab tasks** | Caregiver Mode (proxy reporting, education) | Add prehab-specific caregiver tasks and family exercise assistance guides | PARTIAL: Need structured task assignments for caregivers |
| **Clinician prehab prescription** | Clinician Dashboard | New prehab section in dashboard | YES: Prehab prescription template, progress monitoring, readiness indicator |
| **Pre-op checklist** | None currently | New feature area | YES: Interactive checklist (patient + clinician co-managed) |
| **Weight tracking** | None currently | New feature area | YES: Weekly weigh-in with trend graph |

### 6.2 Integration Architecture

```
EXISTING PALLICARE                    PREHAB MODULE (NEW)
─────────────────                    ──────────────────

┌─────────────────┐                 ┌──────────────────────┐
│ Symptom Logger   │ ◄──────────── │ Pre-exercise pain     │
│ (NRS, ESAS-r)    │   shares data  │ check + post-exercise │
│                  │               │ RPE logging           │
└─────────────────┘                 └──────────────────────┘

┌─────────────────┐                 ┌──────────────────────┐
│ Pain Diary       │ ◄──────────── │ Exercise-pain         │
│ (trends, triggers│   correlates   │ correlation analysis  │
│  medication      │               │ (did exercise help?)  │
│  overlay)        │               │                       │
└─────────────────┘                 └──────────────────────┘

┌─────────────────┐                 ┌──────────────────────┐
│ Medication       │ ◄──────────── │ Prehab medications    │
│ Tracker          │   extends     │ (iron, ONS, hold list)│
│ (MEDD, PRN,     │               │ Anaesthesia summary   │
│  adherence)      │               │ card                  │
└─────────────────┘                 └──────────────────────┘

┌─────────────────┐                 ┌──────────────────────┐
│ Learn Module     │ ◄──────────── │ Pre-surgical          │
│ (psychoeducation)│   adds content │ education series     │
│                  │               │ ("What to expect")    │
└─────────────────┘                 └──────────────────────┘

┌─────────────────┐                 ┌──────────────────────┐
│ Breathe Module   │ ◄──────────── │ Daily prescribed      │
│ (pranayama,      │   prescribes   │ relaxation/breathing │
│  breathing,      │   as prehab    │ exercises (targeted)  │
│  meditation)     │               │                       │
└─────────────────┘                 └──────────────────────┘

┌─────────────────┐                 ┌──────────────────────┐
│ My Journey       │ ◄──────────── │ Prehab goals          │
│ (goals, gratitude│   extends     │ (SMART-P surgical     │
│  milestones)     │               │  targets) + ACP       │
└─────────────────┘                 └──────────────────────┘

┌─────────────────┐                 ┌──────────────────────┐
│ Caregiver Mode   │ ◄──────────── │ Caregiver prehab      │
│ (proxy, education│   extends     │ tasks, family exercise│
│  wellness check) │               │ guides                │
└─────────────────┘                 └──────────────────────┘

┌─────────────────┐                 ┌──────────────────────┐
│ Clinician        │ ◄──────────── │ Prehab Dashboard      │
│ Dashboard        │   adds view    │ (readiness, adherence │
│ (patient view,   │               │  prescription,        │
│  analytics)      │               │  functional trends)   │
└─────────────────┘                 └──────────────────────┘

┌─────────────────┐                 ┌──────────────────────┐
│ Home Screen      │ ◄──────────── │ "Prehab Today" card   │
│ ("How are you    │   adds card    │ (exercise + nutrition │
│  today?")        │               │  + countdown)         │
└─────────────────┘                 └──────────────────────┘
```

### 6.3 Home Screen Integration

When a patient is enrolled in prehab, the Home Screen gains a **"Prehab Today" card** inserted below the hero card:

```
┌──────────────────────────────────────────┐
│  🏋️ तैयारी / Getting Ready               │
│  Surgery in 18 days                       │
│                                           │
│  Today's plan:                            │
│  ✓ Morning walk (15 min) — Done           │
│  ○ Sit-to-stand (3x10) — Due             │
│  ○ Breathing exercise (5 min) — Due      │
│  ○ Protein target: 48g / 72g            │
│                                           │
│  [ See full prehab plan → ]              │
└──────────────────────────────────────────┘
```

### 6.4 Mapping PDF's "Anaesthesia for Palliative Surgery" Framework to App Features

The source PDF covers key domains for anaesthesia in palliative surgery. Here is how each maps to PalliCare's prehab module:

| PDF Framework Element | App Feature |
|----------------------|-------------|
| **Analgesic optimization** (opioid dose calculation, equianalgesia, rescue planning) | Medication Tracker MEDD card + Prehab medication optimization section + Anaesthesia summary card |
| **Medical optimization** (anaemia correction, organ function, fluid status) | Anaemia Tracker + Pre-op checklist (lab values) + Weight/fluid tracking |
| **Psychosocial assessment** (decision-making capacity, anxiety, family dynamics) | Mind & Mood section (HADS, DT, readiness VAS) + Caregiver prehab tasks + ACP prompt in My Journey |
| **Decision-making capacity** (goals of care, informed consent, advance directives) | ACP module in My Journey + Pre-op checklist (consent item) + Clinician dashboard GoC documentation |
| **Goal-directed anaesthetic planning** (multimodal analgesia plan, regional vs. general, post-op care plan) | Anaesthesia summary card (auto-generated from medication tracker data) + Pre-op education in Learn module ("What to expect") |
| **Total pain concept** (physical, emotional, social, spiritual dimensions) | Symptom Logger (physical) + ESAS-r (emotional/wellbeing) + Mood tracking (psychological) + Spiritual care in Learn module + Caregiver mode (social) |
| **Emergencies in palliative care** | Alert system already in PalliCare (critical/warning/informational tiers) + Prehab adds: pre-surgical specific alerts (Hb drop, functional decline, psychological crisis) |
| **ICU-palliative integration** | Post-surgical phase: prehab module transitions to "recovery tracking" with same data flowing to ICU team via clinician dashboard |
| **EOLC guidelines** | ACP module + My Journey legacy section + Clinician dashboard GoC documentation + EOLC educational content in Learn module |

### 6.5 New Screens/Features Summary

Based on the analysis above, the prehab module requires:

**New Major Screens (Patient App)**:
1. **Prehab Home** — Surgery countdown + daily prehab task overview
2. **Exercise Tracker** — Exercise library, logging, step counter, RPE tracking
3. **Nutrition Tracker** — Meal logging, protein/calorie tracking, weight logging
4. **Anaemia Tracker** — Lab value entry, Hb trend graph
5. **Pre-Op Checklist** — Interactive checklist (shared with clinician)

**New Minor Additions to Existing Screens**:
- Home Screen: "Prehab Today" card (when enrolled)
- Medication Tracker: Hold list, anaesthesia summary, prehab medication highlights
- Learn Module: Pre-surgical education series (4-6 micro-learning modules)
- Breathe Module: Prescribed daily exercises (not just on-demand)
- My Journey: ACP structured form, prehab-specific goals
- Caregiver Mode: Prehab task assignments
- Smoking cessation sub-module (conditionally shown)

**New Clinician Dashboard Sections**:
1. **Prehab Dashboard** — Per-patient readiness overview
2. **Prehab Prescription** — Templated prescription interface
3. **Functional Assessment Entry** — 6MWT, TUG, STS, grip strength logging
4. **Surgical Planning Integration** — Surgery details, anaesthesia communication

---

## 7. Key References

### Foundational Prehabilitation
1. Silver JK, Baima J. Cancer prehabilitation: an opportunity to decrease treatment-related morbidity, increase cancer treatment options, and improve physical and psychological health outcomes. *Am J Phys Med Rehabil*. 2013;92(8):715-727.
2. Carli F, Charlebois P, Stein B, et al. Randomized clinical trial of prehabilitation in colorectal surgery. *Br J Surg*. 2010;97(8):1187-1197.
3. Carli F, Bousquet-Dion G, Awasthi R, et al. Effect of multimodal prehabilitation vs postoperative rehabilitation on 30-day postoperative complications for frail patients undergoing resection of colorectal cancer: a randomized clinical trial. *JAMA Surg*. 2020;155(3):233-242.
4. Minnella EM, Bousquet-Dion G, Awasthi R, et al. Multimodal prehabilitation improves functional capacity before and after colorectal surgery for cancer: a five-year research experience. *Acta Oncol*. 2017;56(2):295-300.

### Exercise Prehabilitation
5. Barberan-Garcia A, Ubre M, Roca J, et al. Personalised prehabilitation in high-risk patients undergoing elective major abdominal surgery: a randomized blinded controlled trial. *Ann Surg*. 2018;267(1):50-56.
6. Gillis C, Li C, Lee L, et al. Prehabilitation versus rehabilitation: a randomized control trial in patients undergoing colorectal resection for cancer. *Anesthesiology*. 2014;121(5):937-947.
7. Loughney L, West MA, Kemp GJ, et al. Exercise intervention in people with cancer undergoing neoadjuvant cancer treatment and surgery: a systematic review. *Eur J Surg Oncol*. 2016;42(1):28-38.
8. Moran J, Guinan E, McCormick P, et al. The ability of prehabilitation to influence postoperative outcome after intra-abdominal operation: a systematic review and meta-analysis. *Surgery*. 2016;160(5):1189-1201.

### Nutritional Prehabilitation
9. Braga M, Gianotti L, Nespoli L, et al. Nutritional approach in malnourished surgical patients: a prospective randomized study. *Arch Surg*. 2002;137(2):174-180.
10. Arends J, Bachmann P, Baracos V, et al. ESPEN guidelines on nutrition in cancer patients. *Clin Nutr*. 2017;36(1):11-48.
11. Fearon K, Strasser F, Anker SD, et al. Definition and classification of cancer cachexia: an international consensus. *Lancet Oncol*. 2011;12(5):489-495.

### Psychological Prehabilitation
12. Tsimopoulou I, Pasquali S, Howard R, et al. Psychological prehabilitation before cancer surgery: a systematic review. *Ann Surg Oncol*. 2015;22(13):4117-4123.
13. Mavros MN, Athanasiou S, Gkegkes ID, et al. Do psychological variables affect early surgical recovery? *PLoS One*. 2011;6(5):e20306.
14. Breitbart W, Rosenfeld B, Pessin H, et al. Meaning-centered group psychotherapy: an effective intervention for improving psychological well-being in patients with advanced cancer. *J Clin Oncol*. 2015;33(7):749-754.

### Prehab in Palliative Populations
15. Waterland JL, McCourt O, Edbrooke L, et al. Efficacy of prehabilitation including exercise on postoperative outcomes following abdominal cancer surgery: a systematic review and meta-analysis. *Front Surg*. 2021;8:628848.
16. Treanor C, Kyaw T, Donnelly M. An international review and meta-analysis of prehabilitation compared to usual care for cancer patients. *J Cancer Surviv*. 2018;12(1):64-73.
17. Hughes MJ, Hackney RJ, Lamb PJ, et al. Prehabilitation before major abdominal surgery: a systematic review and meta-analysis. *World J Surg*. 2019;43(7):1661-1668.

### Indian Context
18. Rajagopal MR. The current status of palliative care in India. *Cancer Control*. 2015;22(Suppl 1):57-62.
19. Jain SK, Mishra A, et al. Enhanced recovery after surgery (ERAS) in India: barriers and facilitators. *Indian J Surg*. 2021;83(Suppl 2):345-352.
20. National Programme for Palliative Care (NPPC). Ministry of Health and Family Welfare, Government of India. 2012 (updated 2016).
21. Sharma D, Kannan R, et al. Validation of the Patient-Generated Subjective Global Assessment (PG-SGA) in Hindi for nutritional assessment of cancer patients in India. *Support Care Cancer*. 2015;23(3):751-759.

### ERAS and Perioperative Optimization
22. Ljungqvist O, Scott M, Fearon KC. Enhanced Recovery After Surgery: a review. *JAMA Surg*. 2017;152(3):292-298.
23. ERAS Society Guidelines for Perioperative Care in Elective Colorectal Surgery. *World J Surg*. 2019.
24. Gustafsson UO, Scott MJ, Schwenk W, et al. Guidelines for perioperative care in elective colonic surgery: Enhanced Recovery After Surgery (ERAS) Society recommendations. *World J Surg*. 2013;37(2):259-284.

### Anaemia and Perioperative Medicine
25. Munoz M, Acheson AG, Auerbach M, et al. International consensus statement on the peri-operative management of anaemia and iron deficiency. *Anaesthesia*. 2017;72(2):233-247.
26. Fowler AJ, Ahmad T, Phull MK, et al. Meta-analysis of the association between preoperative anaemia and mortality after surgery. *Br J Surg*. 2015;102(11):1314-1324.

### Yoga/Pranayama in Cancer
27. Cramer H, Lauche R, Klose P, et al. Yoga for improving health-related quality of life, mental health and cancer-related symptoms in women diagnosed with breast cancer. *Cochrane Database Syst Rev*. 2017;1(1):CD010802.
28. Buffart LM, van Uffelen JG, Riphagen II, et al. Physical and psychosocial benefits of yoga in cancer patients and survivors: a systematic review and meta-analysis of randomized controlled trials. *BMC Cancer*. 2012;12:559.

### Digital Health in Prehab
29. Boulware T, Tarumi S, Engelman D, et al. Mobile health technologies for prehabilitation in surgical patients: a systematic review. *J Surg Res*. 2023;289:119-132.
30. Lambert G, Drummond K, Ferreira V, et al. Telehealth-delivered multimodal prehabilitation for surgical cancer patients: a systematic review. *Support Care Cancer*. 2023;31:235-248.

---

## Appendix A: Prehab Module Data Model (Proposed)

```json
{
  "prehab_episode": {
    "episode_id": "uuid",
    "patient_id": "uuid",
    "surgery_type": "palliative_debulking",
    "surgery_date": "2026-03-06",
    "surgeon": "Dr. Kumar",
    "hospital": "AIIMS Bhopal",
    "prehab_start_date": "2026-02-16",
    "status": "active",

    "prescription": {
      "prescribed_by": "Dr. Sharma",
      "prescribed_date": "2026-02-16",
      "exercise": {
        "type": ["walking", "sit_to_stand", "resistance_bands", "pranayama"],
        "intensity": "light_to_moderate",
        "frequency": "daily",
        "duration_minutes": 30,
        "special_precautions": ["bone_mets_L3_avoid_loaded_spinal_flexion"]
      },
      "nutrition": {
        "protein_target_g": 72,
        "calorie_target_kcal": 1800,
        "fluid_target_ml": 2000,
        "supplements": ["whey_protein", "ferric_carboxymaltose"],
        "immunonutrition": false
      },
      "psychological": {
        "interventions": ["pre_surgical_education", "relaxation_daily", "acp"],
        "assessment_schedule": {"HADS": "weekly", "DT": "weekly", "readiness_vas": "daily"}
      },
      "anaemia": {
        "baseline_hb": 9.8,
        "target_hb": 11.0,
        "iron_route": "iv",
        "iron_regimen": "ferric_carboxymaltose_1000mg_single"
      },
      "medications": {
        "new_starts": ["gabapentin_300mg_tds", "ferric_carboxymaltose_iv"],
        "hold_list": [{"drug": "aspirin", "stop_days_before": 7}],
        "opioid_plan": "continue_current_medd_90mg_morphine_equivalent"
      },
      "smoking_cessation": null
    },

    "assessments": {
      "functional": [
        {"date": "2026-02-16", "6mwt_meters": 280, "tug_seconds": 14, "sts_30s_count": 8, "grip_kg": 22},
        {"date": "2026-02-23", "6mwt_meters": 310, "tug_seconds": 12, "sts_30s_count": 10, "grip_kg": 24}
      ],
      "nutritional": [
        {"date": "2026-02-16", "pg_sga_score": "B_moderate", "weight_kg": 62, "bmi": 21.5, "albumin": 3.2}
      ],
      "psychological": [
        {"date": "2026-02-16", "hads_a": 9, "hads_d": 6, "dt": 5, "readiness_vas": 5},
        {"date": "2026-02-23", "hads_a": 7, "hads_d": 5, "dt": 4, "readiness_vas": 7}
      ],
      "anaemia": [
        {"date": "2026-02-16", "hb": 9.8, "ferritin": 15, "iron": 35, "tibc": 400},
        {"date": "2026-02-23", "hb": 10.2, "ferritin": 45}
      ]
    },

    "daily_logs": [
      {
        "date": "2026-02-16",
        "exercise": {
          "completed": ["walking_15min", "sit_to_stand_3x8"],
          "skipped": ["pranayama"],
          "total_minutes": 25,
          "rpe": 4,
          "pain_during": 3,
          "steps": 3200
        },
        "nutrition": {
          "meals_logged": 3,
          "protein_consumed_g": 48,
          "calories_consumed_kcal": 1500,
          "ons_taken": true,
          "water_glasses": 6
        },
        "psychological": {
          "relaxation_completed": true,
          "readiness_vas": 5,
          "worry_note": "Concerned about post-op pain"
        },
        "smoking": null,
        "weight_kg": null
      }
    ],

    "checklist": {
      "patient": {
        "blood_tests": true,
        "imaging": false,
        "pre_anaesthesia_checkup": false,
        "advance_directive": true,
        "medication_review": true
      },
      "clinician": {
        "anaemia_optimized": false,
        "nutritional_assessment": true,
        "functional_assessment": true,
        "surgical_consent": false,
        "anaesthesia_plan": false
      }
    },

    "readiness_score": {
      "overall_percent": 72,
      "exercise_adherence_percent": 65,
      "nutrition_adherence_percent": 85,
      "psychological_readiness_percent": 70,
      "anaemia_progress_percent": 60,
      "checklist_completion_percent": 58,
      "status": "on_track"
    }
  }
}
```

---

## Appendix B: Implementation Priority Phases

### Phase 1 (MVP — Build with PalliCare Phase 2)
- Surgery countdown + daily prehab overview card
- Exercise tracker (walking + sit-to-stand + link to Breathe for pranayama)
- Basic nutrition logging (protein tracking only, Indian food database)
- Pre-op checklist (patient side)
- Clinician prehab prescription (basic template)

### Phase 2 (Enrichment — PalliCare Phase 3)
- Full nutrition tracker (calories, weight, hydration, ONS reminders)
- Anaemia tracker with Hb trends
- Psychological readiness tracking (DT, readiness VAS, HADS integration)
- Pre-surgical education series in Learn module
- Smoking cessation module
- Clinician prehab dashboard (readiness indicator, adherence metrics)
- Caregiver prehab tasks
- Exercise video library (offline-capable)

### Phase 3 (Advanced — PalliCare Phase 4)
- Functional assessment integration (6MWT via phone accelerometer, auto-scoring)
- Anaesthesia communication card (auto-generated PDF from medication data)
- ERAS protocol integration (institutional templates)
- Research analytics: prehab outcomes data export
- AI-assisted exercise adaptation (auto-adjust targets based on logged symptoms)
- Wearable integration (step count, heart rate for exercise monitoring)
- Multi-center prehab benchmarking

---

*Report compiled: 2026-02-16*
*For: PalliCare App — AIIMS Bhopal Department of Palliative Care & Pain Management*
*Based on: Literature through May 2025 + PalliCare App Architecture Analysis*
*Status: Ready for design translation*
