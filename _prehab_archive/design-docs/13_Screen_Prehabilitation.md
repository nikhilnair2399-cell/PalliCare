# Screen 13 — Prehabilitation Module (Patient)

> **Tagline**: "Preparing for Your Procedure — आपकी सर्जरी की तैयारी"
> **Version**: 1.0  |  **Updated**: 2026-02-16  |  **Spec ID**: DOC-13
> **Status**: Draft  |  **Platform**: Mobile (Flutter)

---

## Screen Purpose

The Prehabilitation Module activates when a clinician enrolls a patient in a pre-surgical pathway. It transforms the PalliCare experience from pain management into active surgical preparation across four pillars: Exercise, Nutrition, Mind, and Medical Optimization.

This screen is conditional — it only appears for patients with an active prehabilitation pathway (clinician-initiated). Non-surgical patients never see this module.

> **Key Insight**: Prehabilitation is NOT a fitness programme. It is a clinically supervised, patient-paced preparation journey designed for people who are often frail, fatigued, or living with advanced illness. Every element respects the patient's autonomy, energy level, and cultural context. The module communicates optimism without creating obligation.

### Design Philosophy
- **Empowerment without pressure**: "When you're ready" not "you must"
- **Countdown as motivation, not anxiety**: Framed as "X days to prepare" not "X days left"
- **Cultural grounding**: Yoga, pranayama, Indian food library, multi-faith support
- **Offline-first**: All exercise/nutrition logging works without internet
- **Clinician-patient partnership**: Plans are prescribed; completion is never forced
- **Incremental progress**: Celebrate small wins ("You walked 5 minutes today — that counts!")

---

## Navigation & Entry Points

| Source | Taps to Reach | Destination |
|--------|--------------|-------------|
| Bottom Navigation: "Prep" tab | 1 tap | Overview tab (default landing) |
| Home Screen: Prehab Countdown Card | 1 tap | Overview tab |
| Push Notification: Exercise reminder | 1 tap | Exercise tab → today's exercise |
| Push Notification: NPO reminder | 1 tap | Pre-Op Checklist → NPO section |
| Push Notification: Supplement reminder | 1 tap | Nutrition tab → Supplement Tracker |
| My Journey: Prehab milestone | 1 tap | Overview tab |
| Learn Module: Phase 0 surgery link | 2 taps | Mind tab |
| Breathe Module: Surgery Prep section | 1 tap | Exercise tab → breathing exercises |
| Voice: "PalliCare, my surgery prep" | 0 taps | Overview tab |

### Conditional Visibility Rules
- **Bottom Navigation**: The "Prep" tab (icon: 🩺) replaces the "Insights" tab when a prehab pathway is active
- **Home Screen**: A Prehab Countdown Card appears as the first card in the home feed when pathway is active
- **Deactivation**: When the clinician closes the pathway (surgery completed, cancelled, or patient declines), the Prep tab disappears and Insights returns
- **Transition animation**: Smooth crossfade (300ms) when Prep tab appears/disappears

---

## Tab Structure

Four tabs across the top of the screen: **Overview** | **Exercise** | **Nutrition** | **Mind**

```
┌──────────────────────────────────────────────────────┐
│  🩺 Prep / तैयारी                                     │
│                                                      │
│  ┌────────────┬────────────┬────────────┬──────────┐ │
│  │  अवलोकन   │  व्यायाम    │  पोषण      │  मन      │ │
│  │  Overview  │  Exercise  │ Nutrition  │  Mind    │ │
│  └────────────┴────────────┴────────────┴──────────┘ │
│                                                      │
│  [Tab content area below]                            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Tab Bar Specifications
- **Style**: Fixed top tab bar, Material 3 style with Lavender Mist (#D9D4E7) active indicator
- **Icons**: Each tab has a 20dp icon above the label
  - Overview: 📋 (clipboard), Exercise: 🏃 (runner), Nutrition: 🥗 (salad), Mind: 🧘 (meditation)
- **Labels**: Bilingual — Hindi above, English below, 11sp/10sp respectively
- **Active state**: Lavender Mist underline (3dp), bold label, filled icon
- **Inactive state**: Grey (#757575) label, outlined icon
- **Swipe**: Horizontal swipe between tabs enabled
- **Badge**: Red dot on tab when there are unviewed items (e.g., new exercise plan, updated target)

---

## Tab 1: Overview (अवलोकन)

> The Overview tab is the patient's daily dashboard — a single scroll that answers: "What do I need to do today, and how am I progressing?"

```
┌──────────────────────────────────────────────────────┐
│  [A] Surgery Countdown Hero                          │
│  ┌──────────────────────────────────────────────┐    │
│  │           ╭─────────╮                        │    │
│  │           │   14    │  ← large countdown     │    │
│  │           │ दिन शेष │                        │    │
│  │           ╰─────────╯                        │    │
│  │  Bowel Obstruction Relief                    │    │
│  │  आंत्र अवरोध राहत                            │    │
│  │  Dr. Sharma · AIIMS Bhopal                   │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [B] Readiness Meter                                 │
│  ┌──────────────────────────────────────────────┐    │
│  │     ╭───╮                                    │    │
│  │    │ 68% │  Surgery Readiness                │    │
│  │     ╰───╯   सर्जरी तैयारी                     │    │
│  │     🟡 Amber — Getting there!                │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [C] Today's Prehab Tasks                            │
│  ┌──────────────────────────────────────────────┐    │
│  │  ▓▓▓▓▓▓▓░░░  3 of 5 done                    │    │
│  │  ☑ Morning walk (15 min)                     │    │
│  │  ☑ Log breakfast                             │    │
│  │  ☑ Take iron supplement                      │    │
│  │  ☐ Breathing practice                        │    │
│  │  ☐ Review medication list                    │    │
│  │  "Great progress today!"                     │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [D] 4-Pillar Progress Cards                         │
│  ┌──────┐ ┌──────┐                                   │
│  │🏃 3/5│ │🥗 45g│                                   │
│  │ Ex.  │ │ Prot │                                   │
│  └──────┘ └──────┘                                   │
│  ┌──────┐ ┌──────┐                                   │
│  │🧘 😊 │ │🏥 Lab│                                   │
│  │ Mind │ │ Med. │                                   │
│  └──────┘ └──────┘                                   │
│                                                      │
│  [E] Quick Actions Row                               │
│  [ Log Exercise ] [ Log Meal ] [ Breathe ] [ List ]  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### [A] Surgery Countdown Hero

- **Layout**: Full-width card, 180dp height, Lavender Mist (#D9D4E7) gradient background (left-to-right, 10% darker on right)
- **Countdown number**: 56sp font, Sora Bold, Deep Teal (#2A6B6B), centred
- **Hindi label**: "दिन शेष" (days remaining) directly below the number, 16sp, medium weight
- **Surgery name**: Hindi + English on separate lines, 14sp / 12sp, centered below countdown
- **Surgeon & facility**: "Dr. [Name] · [Facility]" — 12sp, grey (#616161), bottom of card
- **Subtle animation**: The countdown number has a gentle pulse animation (scale 1.0 → 1.02 → 1.0, 2s cycle, ease-in-out) — conveys life without being distracting
- **Edge case — Surgery date unknown**: Show "Surgery Date Pending — तारीख़ अभी तय नहीं" with a calming illustration instead of countdown number
- **Edge case — Surgery today**: Hero transforms to "Surgery Day" mode (see Edge Cases section)
- **Edge case — 0 days remaining**: Show "Tomorrow is the day — कल का दिन" with reassuring tone

### Countdown Calculation
```
days_remaining = surgical_pathways.surgery_date - current_date
Display rules:
  > 30 days  → "X दिन शेष" (days)
  7-30 days  → "X दिन शेष" (days, number in Deep Teal)
  2-6 days   → "X दिन शेष" (days, number in Golden Amber)
  1 day      → "कल / Tomorrow" (Soft Coral accent)
  0 days     → "आज / Today" (Surgery Day mode)
  Negative   → "सर्जरी हो चुकी / Surgery Complete" → transition to recovery
```

---

### [B] Readiness Meter

- **Layout**: Card with 120dp circular progress indicator centered, label to the right on larger screens or below on narrow screens
- **Ring diameter**: 100dp, stroke width 10dp
- **Color logic**:
  - Red (#E87461): 0–39% — "Let's get started — शुरू करते हैं"
  - Amber (#E8A838): 40–69% — "Getting there! — बस थोड़ा और!"
  - Green (#7BA68C): 70–100% — "Looking great! — बहुत अच्छा!"
- **Percentage**: 28sp bold number inside the ring
- **Label**: "Surgery Readiness — सर्जरी तैयारी" — 14sp, below the ring
- **Animation**: On load, the ring fills from 0% to current value over 800ms with spring curve (damping 0.7)

### Readiness Calculation Algorithm
```
readiness_score = weighted_average(
  exercise_adherence   × 0.30,   // sessions completed / sessions planned
  nutrition_compliance × 0.25,   // protein target met days / total days
  mind_engagement      × 0.15,   // anxiety assessments + coping sessions this week
  checklist_completion × 0.15,   // checklist items checked / total items
  medical_optimization × 0.15    // clinician-set flags: labs done, meds reviewed, etc.
)
```

### Readiness Breakdown (Expandable)
- **Tap the readiness card** → expands to show pillar breakdown:
  ```
  Exercise       ▓▓▓▓▓▓▓░░░  70%
  Nutrition      ▓▓▓▓▓▓░░░░  60%
  Mind           ▓▓▓▓▓▓▓▓░░  80%
  Medical        ▓▓▓▓▓░░░░░  50%
  Checklist      ▓▓▓▓▓▓▓▓▓░  90%
  ```
- Each bar is colour-coded to its pillar colour (Exercise: Sage Green, Nutrition: Golden Amber, Mind: Deep Teal, Medical: Soft Coral)
- Tap any row → navigates to corresponding tab or checklist
- **Collapse**: Tap the card header or swipe up to collapse

---

### [C] Today's Prehab Tasks

- **Layout**: Card with a horizontal progress bar at top (Sage Green fill), checklist below
- **Progress bar**: "3 of 5 done" label on the right end, 8dp height, rounded caps
- **Task items**: Each task is a row with:
  - Soft circular checkbox (24dp) — unchecked: outline only, checked: filled Sage Green with white checkmark
  - Task label: 14sp, bilingual where needed
  - Tap checkbox → marks complete with gentle haptic (light impact) and green checkmark animation (scale 0 → 1, 200ms)
- **Task types** (vary by patient's prescribed plan):
  - Exercise session (linked to Exercise tab)
  - Log a meal (linked to Nutrition tab Quick Log)
  - Breathing practice (linked to Breathe Module Surgery Prep)
  - Take supplements (linked to Nutrition tab Supplement Tracker)
  - Review medication list (linked to Medication Tracker pre-op review)
  - Anxiety check-in (linked to Mind tab)
  - Specific clinician-added tasks (free text from clinician dashboard)
- **Encouragement text**: Below the checklist, 12sp, italic, Sage Green
  - 0 tasks done: "Every small step matters — हर छोटा कदम मायने रखता है"
  - 1-49% done: "You've made a start — शुरुआत हो गई!"
  - 50-99% done: "Great progress today! — आज बहुत अच्छा!"
  - 100% done: "All done for today! Rest well. — आज का काम पूरा! आराम करें।"
- **Task ordering**: Incomplete tasks first, then completed (greyed out, struck through)

### Task Auto-Population Rules
```
daily_tasks = []

if exercise_plan.has_session_today:
    daily_tasks.add("Complete exercise session")

daily_tasks.add("Log at least one meal")

if nutrition_targets.supplements.count > 0:
    daily_tasks.add("Take supplements")

if days_since_last_breathing_session > 1:
    daily_tasks.add("Breathing practice")

if days_since_last_anxiety_checkin > 2:
    daily_tasks.add("Anxiety check-in")

if clinician_tasks.unfinished.count > 0:
    daily_tasks.add_all(clinician_tasks.unfinished)
```

---

### [D] 4-Pillar Progress Cards

- **Layout**: 2x2 grid, each card 160dp × 100dp, 12dp rounded corners, 8dp gap between cards
- **Card design**: White background, left-coloured accent bar (4dp width), icon + metric + label

| Card | Icon | Metric | Label | Accent Colour | Tap Action |
|------|------|--------|-------|---------------|------------|
| Exercise | 🏃 | "3 / 5 sessions" | "This week" | Sage Green (#7BA68C) | → Exercise tab |
| Nutrition | 🥗 | "45 / 60 g protein" | "Today" | Golden Amber (#E8A838) | → Nutrition tab |
| Mind | 🧘 | 😊 emoji | "Last check-in" | Deep Teal (#2A6B6B) | → Mind tab |
| Medical | 🏥 | "Lab results ready" or "Next: Feb 20" | Status text | Soft Coral (#E87461) | → Checklist or Medication Tracker |

- **Mini progress ring**: Each card has a 32dp thin ring in the top-right corner showing pillar adherence %
- **Empty state**: If a pillar has no data yet, show "Start here →" call-to-action in the card

---

### [E] Quick Actions Row

- **Layout**: Horizontal scrollable row, 64dp circular icons with 10sp label below
- **Actions**:

| Action | Icon | Label (Hindi / English) | Destination |
|--------|------|------------------------|-------------|
| Log Exercise | 🏃 | व्यायाम / Exercise | Exercise tab → Log |
| Log Meal | 🍽️ | भोजन / Meal | Nutrition tab → Quick Log |
| Breathe | 🫁 | साँस / Breathe | Breathe Module (Surgery Prep section) |
| View Checklist | ✅ | चेकलिस्ट / Checklist | Pre-Op Checklist overlay |

- **Touch target**: 44dp minimum per icon (icon itself is 40dp, tap area extends to 48dp)
- **Style**: Matches Home Screen quick actions pattern — outlined circle, coloured icon, grey label
- **Scroll indicator**: Subtle fade on right edge if more actions are hidden

---

## Tab 2: Exercise (व्यायाम)

> The Exercise tab presents the clinician-prescribed exercise plan in a friendly, day-by-day format. Every exercise can be started, timed, and logged — or skipped without guilt.

```
┌──────────────────────────────────────────────────────┐
│  [F] Exercise Plan Header                            │
│  ┌──────────────────────────────────────────────┐    │
│  │  🟢 Gentle Plan · Week 3 of 4                │    │
│  │  Prescribed by Dr. Sharma                    │    │
│  │  Status: Active                              │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [G] Today's Exercises                               │
│  ┌──────────────────────────────────────────────┐    │
│  │  🚶 Morning Walk — सुबह की सैर               │    │
│  │     15 min · Light intensity · 🎬 Video      │    │
│  │     [ Not started ]                          │    │
│  ├──────────────────────────────────────────────┤    │
│  │  🫁 Deep Breathing — गहरी साँस               │    │
│  │     5 min · 3 sets × 10 breaths · 🎬         │    │
│  │     [ ✓ Completed ]                          │    │
│  ├──────────────────────────────────────────────┤    │
│  │  🧘 Gentle Stretching — हल्की स्ट्रेचिंग      │    │
│  │     10 min · Light · 🎬 Video                │    │
│  │     [ Not started ]                          │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [K] Exercise History                                │
│  ┌──────────────────────────────────────────────┐    │
│  │  Mon Tue Wed Thu Fri Sat Sun                 │    │
│  │  ▓▓  ▓▓  ▓▓  ▓   ░   ░   ░                  │    │
│  │  Total: 8 sessions · 95 min · Streak: 4 days │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [L] Exercise Library                                │
│  [ Walking ] [ Breathing ] [ Yoga ] [ Strength ] ... │
│  ┌──────────────────────────────────────────────┐    │
│  │  List of exercises...                         │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### [F] Exercise Plan Header

- **Layout**: Compact horizontal card, 72dp height, white with Sage Green left accent bar
- **Difficulty badge**: Pill-shaped, colour-coded:
  - 🟢 Gentle: Sage Green background, white text
  - 🟡 Moderate: Golden Amber background, dark text
  - 🔴 Active: Soft Coral background, white text
- **Prescribed by**: "Prescribed by Dr. [Name]" — 12sp, grey, builds trust
- **Week indicator**: "Week 3 of 4" — calculated from `exercise_plans.start_date` and `exercise_plans.duration_weeks`
- **Plan status**: Active / Paused / Completed — with status chip
  - Paused: Amber chip, "Your plan is paused — talk to your team if you'd like to restart"
  - Completed: Green chip with checkmark
- **Edge case — No plan**: Show encouraging message: "Your exercise plan hasn't been set up yet. Your team will add it soon." with illustration

---

### [G] Today's Exercises

- **Layout**: Vertical list of exercise cards, each 80dp height, 8dp gap
- **Each exercise card contains**:
  - **Left icon** (32dp): Activity type icon (walking figure, lungs, yoga pose, dumbbell, balance board)
  - **Name**: Bilingual — English 14sp bold, Hindi 12sp regular below
  - **Details line**: Duration or sets/reps + intensity badge + video icon
  - **Status chip** (right side):
    - Not started: Outlined grey chip
    - In progress: Pulsing Sage Green chip
    - Completed: Filled Sage Green chip with ✓
    - Skipped: Light grey chip with "—"
  - **Video icon**: 🎬 small badge if video tutorial is available (tap → opens video player)
- **Tap card** → Expands to [H] Exercise Card Expanded
- **Empty state**: "No exercises scheduled for today — enjoy your rest! / आज कोई व्यायाम नहीं — आराम करें!"
- **Sorting**: Incomplete first, then completed, then skipped

### Exercise Type Icons

| Type | Icon | Colour |
|------|------|--------|
| Walking | 🚶 | Sage Green |
| Breathing | 🫁 | Deep Teal |
| Yoga | 🧘 | Lavender |
| Stretching | 🤸 | Golden Amber |
| Strengthening | 💪 | Soft Coral |
| Balance | ⚖️ | Deep Teal |
| Stair climbing | 🪜 | Sage Green |
| Cycling | 🚴 | Golden Amber |

---

### [H] Exercise Card Expanded

When a patient taps an exercise card, it expands in-place (Material expand animation, 300ms) to show:

```
┌──────────────────────────────────────────────────────┐
│  🚶 Morning Walk — सुबह की सैर                       │
│                                                      │
│  Duration: 15 minutes                                │
│  Intensity: Light (आसान)                              │
│  Sets: — (continuous)                                │
│                                                      │
│  Instructions:                                       │
│  Walk at a comfortable pace around your home or      │
│  neighbourhood. Stop if you feel breathless or       │
│  unwell. You can split this into shorter walks.      │
│                                                      │
│  निर्देश:                                             │
│  अपने घर या पड़ोस में आरामदायक गति से चलें।            │
│  सांस फूलने या अस्वस्थ महसूस होने पर रुकें।            │
│  इसे छोटी-छोटी सैर में बाँट सकते हैं।                  │
│                                                      │
│  Intensity: [ 🟢 Light ] 🟡 🔴                       │
│                                                      │
│  ┌──────────────────────┐                            │
│  │  🎬 Watch Video Guide │  (if video available)     │
│  └──────────────────────┘                            │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │         [ Start Exercise / शुरू करें ]         │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  Not today? →  (skip reason selector)                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

- **Instructions**: Clinician-written or default template, always bilingual
- **Intensity indicator**: Visual scale showing where this exercise falls (light/moderate/vigorous)
- **Video thumbnail**: If video URL exists in `exercise_plans.exercises[].video_url`, show thumbnail with play overlay
- **"Start Exercise" button**: Full-width, 48dp height, Deep Teal (#2A6B6B) fill, white text, 16sp bold
- **"Not today" link**: 12sp, grey, underlined — opens skip reason selector
- **Collapse**: Tap the card header or swipe up

### Video Player
- In-app video player (Flutter `video_player` package)
- Controls: Play/pause, seek, fullscreen toggle
- Videos cached after first view for offline playback
- Auto-pause when patient starts the exercise timer
- Maximum video length: 3 minutes (clinician-uploaded or curated library)

---

### [I] Exercise Timer/Guide

Full-screen mode activated when "Start Exercise" is tapped:

```
┌──────────────────────────────────────────────────────┐
│  ← End                        🔊 Voice: Hindi      │
│                                                      │
│                Morning Walk                          │
│                सुबह की सैर                             │
│                                                      │
│                                                      │
│                ┌──────────┐                           │
│               │  12:34   │                           │
│               │  minutes  │                           │
│                └──────────┘                           │
│                                                      │
│            ╭──────────────────╮                       │
│           │  🚶  (animated)   │                       │
│            ╰──────────────────╯                       │
│                                                      │
│  "Keep going — you're doing great!"                  │
│  "चलते रहें — बहुत अच्छा कर रहे हैं!"                 │
│                                                      │
│           [ ⏸ Pause ]    [ ■ Stop ]                  │
│                                                      │
│  Pain check at halfway: (slider appears)             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Timer Specifications
- **Countdown timer**: 48sp, Sora Bold, centre of screen
- **Format**: mm:ss for timed exercises; rep counter (e.g., "Rep 3 of 10") for rep-based exercises
- **Animated guide**: Simple looping animation appropriate to exercise type:
  - Walking: stepping figure
  - Breathing: expanding/contracting circle (shared with Breathe Module)
  - Yoga: static pose illustration with transition arrows
  - Stretching: hold timer with "hold..." text
- **Background**: Dark warm charcoal (#2D2D2D) for focus, minimal UI chrome
- **Pause/Resume**: Centre-left button, outlined white, 44dp
- **Stop**: Centre-right button, Soft Coral outlined, 44dp
- **Voice guidance toggle**: Top-right, Hindi/English selector

#### Mid-Exercise Pain Check
- **Trigger**: Appears at the halfway mark of the exercise duration
- **Presentation**: Gentle slide-up card from bottom (does not pause the timer unless patient interacts)
- **Content**:
  ```
  How's your pain? / दर्द कैसा है?
  ─────────●──────────
  0  1  2  3  4  5  6  7  8  9  10
  ```
- **Slider**: 0-10 NRS scale, 44dp thumb, Sage Green track
- **Behaviour based on response**:
  - Pain 0-3: "Wonderful, keep going! / बहुत अच्छा, चलते रहें!" — card auto-dismisses after 2 seconds
  - Pain 4-6: "Take it easy — slow down if you need to. / आराम से — ज़रूरत हो तो धीमे करें।" — card dismisses
  - Pain 7-10: **Auto-pause timer** with message:
    ```
    "That's okay — let's take a break.
    You can try again later or stop for today."
    "कोई बात नहीं — थोड़ा आराम करते हैं।
    बाद में फिर कोशिश कर सकते हैं या आज यहीं रुक सकते हैं।"

    [ Resume / फिर शुरू ] [ Stop / बंद करें ]
    ```
  - Pain > 6 auto-pause is logged as a clinical safety event

#### Rep Counter Mode
For exercises with sets/reps instead of timed duration:
- Large rep counter: "Rep 3 of 10" / "दोहराव 3 / 10"
- Set counter below: "Set 2 of 3" / "सेट 2 / 3"
- "Next rep" button (patient taps after each rep) or auto-advance with timer
- Rest timer between sets (configurable, default 30s)

---

### [J] Post-Exercise Check

Displayed immediately after exercise completion (timer ends or patient taps Stop):

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              ✓ Session Complete                       │
│              सत्र पूरा हुआ                             │
│                                                      │
│  "Every step counts — हर कदम मायने रखता है"          │
│                                                      │
│  How was that? / कैसा रहा?                           │
│                                                      │
│  Pain during exercise / व्यायाम के दौरान दर्द:        │
│  ─────────●──────────                                │
│  0  1  2  3  4  5  6  7  8  9  10                    │
│                                                      │
│  Completed? / पूरा किया?                              │
│  (●) Yes / हाँ                                       │
│  ( ) Partially / आंशिक                               │
│  ( ) No / नहीं                                       │
│                                                      │
│  [If No ↓]                                           │
│  Why not? / क्यों नहीं?                               │
│  ┌─────────────────────────────────┐                 │
│  │ Pain     │ Fatigue  │ Nausea   │                  │
│  │ Breathless│ Unwell  │ No time  │                  │
│  │ Forgot   │ Other    │          │                  │
│  └─────────────────────────────────┘                 │
│                                                      │
│  Notes (optional) / टिप्पणी (वैकल्पिक):               │
│  ┌─────────────────────────────────┐                 │
│  │                                 │                 │
│  └─────────────────────────────────┘                 │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │     [ Save & Continue / सहेजें और आगे बढ़ें ]  │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  "Every step counts — हर कदम मायने रखता है"          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Skip Reason Selector
When patient taps "Not today" or selects "No" in completion:

| Reason | Hindi | Icon |
|--------|-------|------|
| Pain | दर्द | 😣 |
| Fatigue | थकान | 😴 |
| Nausea | मतली | 🤢 |
| Breathlessness | सांस फूलना | 😮‍💨 |
| Not feeling well | तबीयत ठीक नहीं | 🤒 |
| No time | समय नहीं | ⏰ |
| Forgot | भूल गए | 💭 |
| Other | अन्य | ✏️ (opens text field) |

- Multiple reasons can be selected (multi-select chips)
- Data logged to `exercise_logs` with `skip_reason` field
- **Never guilt-inducing**: After skip, show "That's completely okay — tomorrow is a new day. / कोई बात नहीं — कल नया दिन है।"

#### Post-Exercise Encouragement Messages (Rotating)
```
"Every step counts — हर कदम मायने रखता है"
"You showed up today — that's what matters — आज आपने कोशिश की, यही मायने रखता है"
"Your body is getting stronger — आपका शरीर मज़बूत हो रहा है"
"Small efforts, big difference — छोटी कोशिश, बड़ा फ़र्क"
"You're preparing well — आपकी तैयारी अच्छी चल रही है"
```

---

### [K] Exercise History

- **Layout**: Section below today's exercises, collapsible with "View History" header
- **7-day bar chart**: Horizontal bars for each day (Mon–Sun)
  - Bar height proportional to minutes exercised
  - Colour: Sage Green for completed, light grey for missed
  - Today highlighted with outline border
- **Stats cards** (horizontal scroll, 4 cards):

| Stat | Value Example | Icon |
|------|---------------|------|
| Total sessions (this week) | "8 sessions" | 🏃 |
| Total minutes | "95 min" | ⏱️ |
| Average pain during exercise | "3.2 / 10" | 📊 |
| Current streak | "4 days" | 🔥 |

- **Week-over-week comparison**: Single line of encouragement text:
  - Improvement: "You did 2 more sessions than last week! — पिछले हफ़्ते से 2 सत्र ज़्यादा!"
  - Same: "Consistent effort this week — इस हफ़्ते लगातार कोशिश!"
  - Decline: "Every week is different — it's okay. — हर हफ़्ता अलग होता है, कोई बात नहीं।"

---

### [L] Exercise Library

- **Layout**: Horizontally scrollable filter chips at top, vertical list below
- **Filter chips**: Walking | Breathing | Stretching | Strengthening | Yoga | Balance | All
  - Active chip: Sage Green fill, white text
  - Inactive chip: Outlined grey
- **Exercise list item** (each 72dp height):
  - Icon (32dp), Name (bilingual, 14sp/12sp), Duration, Difficulty badge
  - 🎬 badge if video available
  - Tap → opens exercise detail with "Start" option
- **Search bar**: Top of library — "Search exercises / व्यायाम खोजें"
- **Library is always available**: Even exercises not in today's plan can be started from here
- **Library source**: Combination of clinician-prescribed exercises + PalliCare curated library
- **Offline**: Entire library cached locally, including video thumbnails (full videos cached after first view)

---

## Tab 3: Nutrition (पोषण)

> The Nutrition tab helps patients meet their clinician-set protein, calorie, and hydration targets. It features an Indian food database, simple meal logging, and supplement tracking — all designed for patients who may have poor appetite and limited energy to log.

```
┌──────────────────────────────────────────────────────┐
│  [M] Nutrition Dashboard                             │
│  ┌──────────────────────────────────────────────┐    │
│  │  ╭──╮    ╭──╮    ╭──╮                       │    │
│  │  │45│    │1200│   │800│                      │    │
│  │  │/60│   │/1800│  │/2000│                    │    │
│  │  │ g │   │ cal │  │ ml │                     │    │
│  │  ╰──╯    ╰──╯    ╰──╯                       │    │
│  │ Protein  Calories Hydration                  │    │
│  │ प्रोटीन   कैलोरी   पानी                       │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [N] Quick Log Meal                                  │
│  ┌──────────────────────────────────────────────┐    │
│  │ [ Breakfast ][ Lunch ][ Dinner ][ Snack ]    │    │
│  │ [ Supplement ]                               │    │
│  │                                              │    │
│  │ Portion: 🍽️¼  🍽️½  🍽️¾  🍽️Full  🍽️+Extra    │    │
│  │                                              │    │
│  │ Appetite: 😫 😐 😊 😋 🤩                      │    │
│  │                                              │    │
│  │ Nausea: None / Mild / Moderate / Severe      │    │
│  │                                              │    │
│  │ [ Quick Save / जल्दी सहेजें ]                  │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [O] Food Item Entry                                 │
│  ┌──────────────────────────────────────────────┐    │
│  │ 🔍 Search food / खाना खोजें                   │    │
│  │                                              │    │
│  │ Recent: [ Dal ] [ Roti ] [ Egg ] [ Curd ]    │    │
│  │                                              │    │
│  │ Popular:                                     │    │
│  │ Moong dal · 7g protein/cup                   │    │
│  │ Roti · 3g protein each                       │    │
│  │ Paneer · 14g / 100g                          │    │
│  │ Egg · 6g each                                │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [P] Supplement Tracker                              │
│  [Q] Nutrition Tips                                  │
│  [R] Weekly Summary                                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### [M] Nutrition Dashboard

- **Layout**: Three circular progress rings side by side, centred, 80dp diameter each
- **Ring specifications**:

| Ring | Metric | Units | Ring Colour | Track Colour | Label |
|------|--------|-------|-------------|--------------|-------|
| Protein | current / target | grams | Sage Green (#7BA68C) | Light grey (#E0E0E0) | प्रोटीन / Protein |
| Calories | current / target | kcal | Golden Amber (#E8A838) | Light grey | कैलोरी / Calories |
| Hydration | current / target | ml | Deep Teal (#2A6B6B) | Light grey | पानी / Hydration |

- **Ring interior**: Bold number (current), "/" divider, smaller number (target)
- **Ring animation**: Fill from 0 to current on tab load (600ms, ease-out)
- **Overflow**: If patient exceeds target, ring shows 100% with a gold sparkle animation and "Target met!" label
- **Tap ring** → shows 7-day trend as a small pop-up line chart (same colour as ring)
- **Targets source**: `nutrition_targets` table (set by clinician via Clinician Dashboard)
- **Default targets** (if clinician hasn't set custom values): Protein 60g, Calories 1800 kcal, Hydration 2000ml

### Hydration Quick-Add
- Below the hydration ring: small "+ Glass" button (250ml per tap)
- Long-press → custom amount entry (50ml increments)
- Each tap shows a water drop animation and increments the ring

---

### [N] Quick Log Meal

> Designed for minimum effort. A patient can log a meal in under 10 seconds.

- **Meal type selector**: Horizontal chips, single-select
  - Breakfast (सुबह) | Lunch (दोपहर) | Dinner (रात) | Snack (नाश्ता) | Supplement (पूरक)
  - Active chip: Golden Amber fill
  - Auto-selects based on time of day (before 10am → Breakfast, 10am-2pm → Lunch, 2pm-5pm → Snack, after 5pm → Dinner)

- **Portion size**: Visual emoji-based selector (single row, horizontally scrollable)

| Option | Emoji | Hindi | Estimated % |
|--------|-------|-------|-------------|
| Quarter | 🍽️¼ | चौथाई | 25% of normal meal |
| Half | 🍽️½ | आधा | 50% |
| Three-quarter | 🍽️¾ | तीन-चौथाई | 75% |
| Full | 🍽️ | पूरा | 100% |
| Extra | 🍽️+ | ज़्यादा | >100% |

- **Appetite**: "How's your appetite? / भूख कैसी है?"
  - 5-emoji scale: 😫 None / 😐 Low / 😊 Okay / 😋 Good / 🤩 Excellent
  - Single tap selection, Golden Amber highlight on selected

- **Nausea check**: "Any nausea? / कोई मतली?"
  - 4-option chips: None (कोई नहीं) | Mild (हल्की) | Moderate (मध्यम) | Severe (तेज़)
  - If Severe selected: show gentle note "Please tell your care team if this continues. / अगर ऐसा जारी रहे तो अपनी टीम को बताएं।"

- **"Quick Save" button**: Full-width, Golden Amber, 48dp — saves the meal log without food item details
- **Quick Save data captured**: meal_type, portion_size, appetite_level, nausea_level, timestamp
- **Below Quick Save**: "Add food details →" link to [O] Food Item Entry for patients who want to log specific items

---

### [O] Food Item Entry

- **Search bar**: 48dp, outlined, magnifying glass icon, placeholder "Search food / खाना खोजें"
- **Search behaviour**: Real-time filtering as patient types (debounced 300ms)
- **Search language**: Accepts Hindi or English (e.g., "dal" or "दाल" both find lentils)

#### Indian Food Database (Pre-loaded, Offline-Available)

| Category | Items | Protein (approx.) | Calories (approx.) |
|----------|-------|-------------------|---------------------|
| **Dals / Lentils** | | | |
| Moong dal (cooked) | 1 cup | 7g | 200 kcal |
| Toor dal (cooked) | 1 cup | 8g | 210 kcal |
| Masoor dal (cooked) | 1 cup | 7g | 190 kcal |
| Chana dal (cooked) | 1 cup | 9g | 220 kcal |
| Rajma (cooked) | 1 cup | 9g | 230 kcal |
| **Breads / Rotis** | | | |
| Roti / Chapati | 1 piece | 3g | 100 kcal |
| Paratha (plain) | 1 piece | 4g | 200 kcal |
| Naan | 1 piece | 5g | 260 kcal |
| Rice (cooked) | 1 cup | 4g | 240 kcal |
| Poha | 1 plate | 4g | 250 kcal |
| **Dairy** | | | |
| Paneer | 100g | 14g | 265 kcal |
| Curd / Dahi | 1 cup | 11g | 100 kcal |
| Milk (full fat) | 1 glass | 8g | 150 kcal |
| Lassi | 1 glass | 8g | 160 kcal |
| Buttermilk / Chaas | 1 glass | 4g | 60 kcal |
| Kheer | 1 bowl | 6g | 200 kcal |
| **Eggs & Meat** | | | |
| Egg (boiled/fried) | 1 piece | 6g | 80 kcal |
| Chicken curry | 100g | 27g | 240 kcal |
| Mutton curry | 100g | 25g | 290 kcal |
| Fish curry | 100g | 22g | 180 kcal |
| **High Protein** | | | |
| Sattu drink | 2 tbsp | 7g | 90 kcal |
| Soy chunks (cooked) | 100g | 52g | 345 kcal |
| Chana (roasted) | 50g | 10g | 180 kcal |
| Sprouts (mixed) | 1 cup | 8g | 100 kcal |
| Peanuts | 50g | 13g | 280 kcal |
| **Supplements** | | | |
| Protein powder | 1 scoop | 20-25g | 120 kcal |
| Ensure / Protinex | 1 serve | 10-15g | 200 kcal |
| **Fruits** | | | |
| Banana | 1 piece | 1g | 100 kcal |
| Apple | 1 piece | 0.5g | 80 kcal |
| Papaya | 1 cup | 1g | 60 kcal |
| **Beverages** | | | |
| Tea with milk | 1 cup | 2g | 50 kcal |
| Nimbu pani | 1 glass | 0g | 30 kcal |
| Coconut water | 1 glass | 1g | 45 kcal |

- **Serving size**: Default shown (customisable with +/- stepper or manual entry)
- **Add to meal**: Tap food item → amount selector → "Add" button → item appears in meal log
- **Multiple items per meal**: Patients can add as many items as they want; running total shown at top
- **Custom food entry**: "Can't find it? Add custom food →" — form with name, estimated protein (g), estimated calories (kcal)
- **Recent foods carousel**: Last 10 logged items shown as horizontal scrollable chips above search results for quick re-add
- **Meal photo capture**: Camera icon next to meal type selector — optional photo stored locally, not uploaded (for patient's own reference)

#### Meal Summary (After Adding Items)
```
┌──────────────────────────────────────────────┐
│  Lunch — दोपहर                               │
│                                              │
│  2 Roti              6g protein    200 kcal  │
│  Dal (Moong)         7g protein    200 kcal  │
│  Curd (1 cup)       11g protein    100 kcal  │
│  ──────────────────────────────────────────   │
│  Total:             24g protein    500 kcal  │
│                                              │
│  [ Save Meal / भोजन सहेजें ]                  │
│  [ Add more items / और जोड़ें ]                │
└──────────────────────────────────────────────┘
```

---

### [P] Supplement Tracker

- **Layout**: List of clinician-prescribed supplements with daily toggle
- **Each supplement row**:
  - Supplement name (bilingual): "Iron Tablets — आयरन की गोलियाँ"
  - Dosage: "1 tablet, twice daily"
  - Toggle: Simple switch — Taken / Not taken per dose
  - Streak: Small number badge showing consecutive days taken (e.g., "7 days")
  - If linked to lab target: Show target (e.g., "Hb target: 10 g/dL")

| Supplement Type | Hindi | Common Dosage | Notes |
|----------------|-------|---------------|-------|
| Iron tablets | आयरन की गोलियाँ | 1-2 tablets/day | Hb target reminder |
| Protein powder | प्रोटीन पाउडर | 1-2 scoops/day | Shows protein contribution in dashboard |
| Immunonutrition | इम्युनोन्यूट्रिशन | As prescribed | If prescribed pre-surgery |
| Vitamin D | विटामिन D | 1 tablet/day | |
| Calcium | कैल्शियम | 1-2 tablets/day | |
| Multivitamin | मल्टीविटामिन | 1 tablet/day | |
| Custom | कस्टम | Variable | Clinician can add any supplement |

- **Reminder integration**: Each supplement can be linked to medication reminders (synced with Medication Tracker)
- **Empty state**: "No supplements prescribed yet. / अभी कोई पूरक दवाई नहीं।"

---

### [Q] Nutrition Tips

- **Layout**: Single rotating card, Golden Amber accent border, 100dp height
- **Rotation**: One new tip per day, contextualised to meal time:
  - Morning (6-10am): Breakfast tips
  - Midday (10am-3pm): Lunch protein boosters
  - Evening (3-8pm): Dinner and hydration tips
  - Night (8pm+): Next day preparation tips

#### Tip Content Examples

| Tip | Hindi | Context |
|-----|-------|---------|
| "Add 2 eggs to breakfast for 12g extra protein" | "नाश्ते में 2 अंडे = 12g प्रोटीन" | Morning |
| "Sattu drink recipe: 2 tbsp sattu + water + lemon + salt" | "सत्तू पेय: 2 चम्मच सत्तू + पानी + नींबू + नमक" | Morning |
| "Paneer paratha has ~17g protein per serving" | "पनीर पराठा = ~17g प्रोटीन" | Lunch |
| "Try adding dahi with every meal for 11g protein" | "हर भोजन के साथ दही = 11g प्रोटीन" | Lunch |
| "Soy chunks are protein powerhouses — 52g per 100g" | "सोया चंक्स = 52g प्रोटीन / 100g" | Lunch/Dinner |
| "A glass of milk before bed adds 8g protein" | "सोने से पहले दूध = 8g प्रोटीन" | Night |
| "Sprouts salad with lemon for easy protein" | "अंकुरित सलाद नींबू के साथ = आसान प्रोटीन" | Snack |
| "Roasted chana is a great protein snack — 10g per 50g" | "भुने चने = 10g प्रोटीन / 50g" | Snack |
| "Stay hydrated — aim for 8 glasses today" | "पानी ज़रूरी — आज 8 गिलास का लक्ष्य" | All day |
| "If appetite is low, try small frequent meals" | "भूख कम? छोटे-छोटे भोजन बार-बार लें" | All day |

- **Tip source**: Curated from Learn Module Phase 0 nutritional content and ERAS nutritional guidelines
- **Dismiss**: Swipe left to dismiss (new tip shows next meal time)
- **Save tip**: Bookmark icon (saves to patient's tip collection in My Journey)

---

### [R] Weekly Nutrition Summary

- **Layout**: Expandable section at bottom of Nutrition tab
- **Protein intake trend**: 7-day line chart (Sage Green line, filled area below)
  - Target line shown as dashed horizontal line
  - Days where target was met shown with green dot, missed with amber dot
- **Appetite trend**: 7-day emoji row (one emoji per day showing reported appetite)
- **Supplement adherence**: Percentage donut chart
  - "You took your supplements 6 of 7 days this week — 86%"
- **Weight tracking** (if clinician-enabled):
  - Weekly weight log: "Log today's weight" → number entry with kg/lb toggle
  - Weight trend line chart (4-week view)
  - Weight target shown if set by clinician
  - **Sensitivity**: Never labels weight as "good" or "bad" — purely informational

---

## Tab 4: Mind (मन)

> The Mind tab addresses pre-surgical anxiety, fear, and emotional wellbeing. It provides coping tools, journaling, guided visualisations, and culturally sensitive spiritual support. Every element is optional and framed as supportive, never prescriptive.

```
┌──────────────────────────────────────────────────────┐
│  [S] Anxiety Check-In                                │
│  ┌──────────────────────────────────────────────┐    │
│  │  How are you feeling about your surgery?      │    │
│  │  सर्जरी के बारे में कैसा लग रहा है?             │    │
│  │                                              │    │
│  │  😌  🙂  😟  😰  😨                           │    │
│  │ Calm Okay Worried Anxious Very               │    │
│  │                         Anxious              │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [T] Coping Tools Quick Access                       │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │🫁 Pre-Op│ │📖 About │ │🧘 Guided│ │📝 Talk │        │
│  │Breathing│ │Surgery │ │ Calm   │ │to Team │        │
│  └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                      │
│  [U] Pre-Op Worry Journal                            │
│  ┌──────────────────────────────────────────────┐    │
│  │  "What's on your mind today?"                │    │
│  │  "आज मन में क्या चल रहा है?"                  │    │
│  │  ┌──────────────────────────────────┐        │    │
│  │  │                                  │        │    │
│  │  │  (text entry)                    │        │    │
│  │  │                                  │        │    │
│  │  └──────────────────────────────────┘        │    │
│  │  [ Save / सहेजें ]                            │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [V] Guided Visualizations                           │
│  [W] Advance Directive Awareness                     │
│  [X] Faith & Spiritual Support                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### [S] Anxiety Check-In

- **Layout**: Full-width card, Deep Teal gradient border, 140dp height
- **Prompt**: "How are you feeling about your surgery?" / "सर्जरी के बारे में कैसा लग रहा है?"
- **5-emoji scale**: Horizontally centred, 48dp each, 16dp gap

| Emoji | Label (English) | Label (Hindi) | Colour |
|-------|----------------|---------------|--------|
| 😌 | Calm | शांत | Sage Green |
| 🙂 | Okay | ठीक | Light Green |
| 😟 | Worried | चिंतित | Golden Amber |
| 😰 | Anxious | बेचैन | Soft Coral |
| 😨 | Very Anxious | बहुत बेचैन | Red |

- **Selection**: Tap emoji → brief haptic → emoji enlarges slightly (1.2x, 200ms) → response card appears below

#### Response Logic

| Selection | Response Card Content | Follow-up Actions |
|-----------|----------------------|-------------------|
| Calm / Okay | "That's wonderful — keep going! / बहुत अच्छा — ऐसे ही चलते रहें!" + general wellness tip | None |
| Worried | "It's natural to feel worried. Here are some tools that might help. / चिंतित होना स्वाभाविक है। ये कुछ उपकरण मदद कर सकते हैं।" | Show coping tool links (Breathe, Learn, Journal) |
| Anxious | "Many people feel this way before surgery. You're not alone. / बहुत से लोग सर्जरी से पहले ऐसा महसूस करते हैं। आप अकेले नहीं हैं।" | Show coping tools + "Would you like to talk to your team?" button |
| Very Anxious | "It's completely normal to feel this way. We're here for you. / ऐसा महसूस होना बिल्कुल सामान्य है। हम आपके साथ हैं।" | Direct link to Breathe module + "Talk to your team" prominent button + "Call helpline" option |

- **Frequency**: Check-in prompt shown once per day (can be dismissed, reappears next day)
- **Clinical escalation**: If "Very Anxious" selected 3 or more times in a rolling 7-day window, an automatic alert is sent to the clinician dashboard (patient is NOT informed of this alert to avoid meta-anxiety)
- **Data stored**: `prehab_assessments` table with `assessment_type = 'anxiety_checkin'`, `score` (1-5), timestamp

---

### [T] Coping Tools Quick Access

- **Layout**: Horizontal scrollable row of 4 cards, each 100dp × 80dp, 12dp rounded corners
- **Cards**:

| Card | Icon | Label | Hindi | Destination |
|------|------|-------|-------|-------------|
| Pre-Op Breathing | 🫁 | Pre-Op Breathing | सर्जरी पूर्व साँस | Breathe Module → Surgery Prep section |
| Understanding Surgery | 📖 | About Your Surgery | सर्जरी की जानकारी | Learn Module → Phase 0 content |
| Guided Calm | 🧘 | Guided Calm | निर्देशित शांति | Breathe Module → Guided Meditations |
| Talk to Team | 📝 | Talk to Team | टीम से बात करें | Contact clinician (message or call) |

- **Card design**: White background, coloured top accent bar (Deep Teal), centred icon, label below
- **Single tap navigation**: Opens target module directly; back button returns to Mind tab

---

### [U] Pre-Op Worry Journal

- **Layout**: Card with text entry area, 200dp minimum height (expandable)
- **Header**: "What's on your mind today?" / "आज मन में क्या चल रहा है?" — 16sp, Deep Teal
- **Text field**:
  - Placeholder: "Write anything — no one will see this unless you choose to share. / कुछ भी लिखें — बिना आपकी अनुमति कोई नहीं देखेगा।"
  - Multi-line, auto-expand up to 400dp
  - Character limit: 2000 characters
  - 14sp, line height 1.5
- **Voice input**: Microphone icon in text field — tap to dictate (Hindi/English auto-detect)
- **Save button**: "Save / सहेजें" — Deep Teal, 44dp height
- **After save**: Entry appears in journal history below with timestamp
- **Journal history**: Scrollable list of previous entries, date-stamped, most recent first
  - Each entry: Date header, preview (first 50 characters), tap to expand full text
  - Delete: Swipe left on entry → "Delete this entry?" confirmation
- **Privacy**:
  - Prominent privacy notice: "🔒 Private — only you can see your journal / केवल आप देख सकते हैं"
  - Journal entries are stored locally (encrypted) and in `prehab_assessments` (encrypted at rest)
  - Never synced to clinician dashboard unless patient explicitly shares
  - "Share with my doctor" option on each entry (requires confirmation)
- **Integration**: Entries are also accessible from My Journey → Journal stream

---

### [V] Guided Visualizations

- **Layout**: Vertical list of visualization cards, each 100dp height

| Visualization | Hindi | Duration | Description |
|--------------|-------|----------|-------------|
| Your Recovery Journey | आपकी रिकवरी यात्रा | 5 min | Gentle narration walking through successful surgery, waking up comfortable, gradual recovery |
| Safe Place | सुरक्षित जगह | 5 min | Guided imagery of a peaceful, comfortable place (adapted from Breathe Module) |
| Healing Light | उपचार की रोशनी | 3 min | Visualise a warm, healing light flowing through your body preparing for surgery |
| The Day After | सर्जरी के बाद का दिन | 5 min | Guided visualisation of the day after surgery — waking up, first meal, family visiting |
| Strength Within | आंतरिक शक्ति | 3 min | Connecting to inner resilience and the body's natural healing ability |

#### Visualization Player
- **Same player framework as Breathe Module** (full-screen, dark background, minimal UI)
- **Background**: Soft abstract visual (gradient colour shifts), calm ambient sound
- **Audio**: Professional narrator, available in Hindi and English
- **Controls**: Play/Pause (centre), 15s rewind (left), 15s forward (right)
- **Progress**: Thin progress line at bottom
- **Post-session**: "How do you feel?" — emoji check (😌 Better / 😐 Same / Skip)
- **Download**: Each visualisation downloadable for offline use (10-15 MB per audio file)
- **New content**: One new visualisation added per month (content team cadence)

---

### [W] Advance Directive Awareness

- **Layout**: Informational card, muted border (Light grey), 160dp height
- **Visibility rules**:
  - Shown once per week (not daily — avoids pressure)
  - Patient can dismiss with "Don't show again" option
  - Never shown to patients under 18

```
┌──────────────────────────────────────────────────────┐
│  ℹ️ Did You Know? / क्या आप जानते हैं?               │
│                                                      │
│  In India, you have the right to make an             │
│  advance directive — a document that records          │
│  your wishes about medical treatment.                │
│                                                      │
│  भारत में, आपको अग्रिम निर्देश बनाने का अधिकार        │
│  है — एक दस्तावेज़ जो आपकी चिकित्सा इच्छाओं          │
│  को दर्ज करता है।                                      │
│                                                      │
│  (Supreme Court of India, 2018)                      │
│                                                      │
│  "This is entirely your choice — no pressure"        │
│  "यह पूरी तरह आपकी इच्छा है — कोई दबाव नहीं"         │
│                                                      │
│  [ Learn More / और जानें ] [ Discuss with Doctor ]    │
│                          [ डॉक्टर से बात करें ]       │
│                                                      │
│  (×) Don't show again                                │
└──────────────────────────────────────────────────────┘
```

- **"Learn More"**: Links to Learn Module → Advance Directives educational content
- **"Discuss with Doctor"**: Opens contact/message to clinician with pre-filled subject "Advance Directive Discussion"
- **Tone**: Purely informational. Never uses words like "must", "should", "important that you", or "before it's too late"
- **Design**: Deliberately understated — no bright colours, no urgency indicators, no countdown
- **Data**: Interaction logged to `advance_directives` table (viewed / learned_more / discussed / dismissed / dont_show_again)

---

### [X] Faith & Spiritual Support

- **Layout**: Section with faith selector at top, content cards below
- **Faith selector**: "Select your tradition / अपनी परंपरा चुनें"
  - Horizontal chips: Hindu | Muslim | Christian | Sikh | Buddhist | Secular | Show All
  - Patient's selection saved to profile preferences (changeable anytime)
  - Default: "Show All" if no preference set

#### Content by Faith Tradition

**Hindu (हिंदू)**
- Healing mantra references: Mahamrityunjaya Mantra context, Hanuman Chalisa for strength
- "A moment of prayer before your journey — अपनी यात्रा से पहले प्रार्थना का एक पल"
- Suggested offering: Light a diya or lamp with family before surgery day
- Content rotated weekly from curated library

**Muslim (मुस्लिम / اسلام)**
- Dua for healing and protection before medical procedures
- Surah Al-Fatiha and Ayat-ul-Kursi references for comfort
- "Trust in Allah's plan — अल्लाह के फ़ैसले पर भरोसा"
- Guidance on prayer timing adjustments during hospital stay

**Christian (ईसाई)**
- Healing prayers and Psalm references (Psalm 23, Psalm 91)
- "The Lord is my shepherd — प्रभु मेरा चरवाहा है"
- Prayer for the surgical team
- Suggested: Prayer with family before surgery

**Sikh (सिख)**
- Gurbani healing shabads and Ardas references
- "Waheguru's grace — वाहेगुरु की कृपा"
- Mool Mantar for peace and comfort
- Suggested: Paath or recitation before surgery

**Buddhist (बौद्ध)**
- Loving-kindness (Metta) meditation adapted for pre-surgery
- Mindfulness practice for accepting uncertainty
- "May I be free from suffering — मैं दुख से मुक्त हो जाऊँ"
- Guided compassion meditation (3 min audio)

**Secular (धर्मनिरपेक्ष)**
- Positive affirmation cards:
  - "I am strong and I am ready — मैं मज़बूत हूँ और तैयार हूँ"
  - "My body has wisdom to heal — मेरे शरीर में ठीक होने की शक्ति है"
  - "This is one step toward feeling better — यह बेहतर महसूस करने की ओर एक कदम है"
- Mindfulness reflection exercises
- Gratitude journaling prompts

#### Content Card Design
- Each card: White background, left accent bar matching faith colour (varied pastels), 120dp height
- Icon/symbol at top left (respectfully chosen, culturally appropriate)
- Text: 14sp, line height 1.6
- "New this week" badge for fresh content
- Save/bookmark icon for favourite passages
- **Audio option**: Key prayers/meditations available as 1-2 min audio clips (Hindi and English)

#### Sensitivity Guidelines
- All content reviewed by multi-faith advisory panel
- Never positions one faith as superior to another
- "Show All" option presents content in rotating, equal-weight display
- No proselytising or conversion references
- Cultural practices (not strictly religious) also included (e.g., tulsi plant, family blessings)
- Patient can disable this section entirely in Settings

---

## Pre-Op Checklist (Accessed from Overview → View Checklist)

> The Pre-Op Checklist is a patient-facing preparation list that helps patients feel organized and in control. It is accessed from the Overview tab's Quick Actions or by tapping the checklist pillar card.

### [Y] Interactive Checklist

```
┌──────────────────────────────────────────────────────┐
│  ✅ Pre-Op Checklist / सर्जरी पूर्व चेकलिस्ट          │
│                                                      │
│  ▓▓▓▓▓▓▓▓░░░░  8 of 12 complete                     │
│                                                      │
│  ☑ I understand my surgery procedure                 │
│    मुझे अपनी सर्जरी प्रक्रिया समझ आ गई है              │
│                                                      │
│  ☑ I've discussed my concerns with my doctor         │
│    मैंने अपनी चिंताएँ डॉक्टर से बात की हैं             │
│                                                      │
│  ☑ My medications have been reviewed                 │
│    मेरी दवाइयों की समीक्षा हो गई है                    │
│                                                      │
│  ☑ I know which medicines to stop/continue           │
│    मुझे पता है कौन सी दवाइयाँ बंद/जारी रखनी हैं       │
│                                                      │
│  ☑ I've completed breathing exercises this week      │
│    इस हफ़्ते साँस की कसरत पूरी की                     │
│                                                      │
│  ☑ I've told my family about my surgery plan         │
│    मैंने परिवार को सर्जरी की योजना बताई है              │
│                                                      │
│  ☑ I know who will accompany me on surgery day       │
│    मुझे पता है सर्जरी के दिन कौन साथ आएगा            │
│                                                      │
│  ☑ I've packed my hospital bag (if applicable)       │
│    अस्पताल का बैग तैयार कर लिया है                    │
│                                                      │
│  ☐ I know my fasting (NPO) instructions              │
│    मुझे उपवास (NPO) के निर्देश पता हैं                │
│                                                      │
│  ☐ I have my identity documents and ABHA card ready  │
│    मेरे पहचान पत्र और ABHA कार्ड तैयार हैं            │
│                                                      │
│  ☐ I've discussed advance directive options          │
│    (optional)                                        │
│    अग्रिम निर्देश विकल्पों पर चर्चा की (वैकल्पिक)      │
│                                                      │
│  ☐ I feel as prepared as I can be                    │
│    मैं जितना तैयार हो सकता/सकती हूँ, हूँ               │
│                                                      │
│  ──────────────────────────────────────────────       │
│                                                      │
│  [ View NPO Instructions / NPO निर्देश देखें ]        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Checklist Specifications
- **Progress bar**: Top of overlay, Sage Green fill, rounded, "8 of 12 complete" label
- **Items**: Soft circular checkboxes (24dp), bilingual text
- **Check interaction**: Tap checkbox → haptic + green fill animation (200ms)
- **Uncheck**: Tap again to uncheck (no confirmation needed)
- **Item order**: Fixed order as shown (not sortable by patient)
- **Auto-check rules**:
  - Item 5 (breathing exercises): Auto-checks if exercise_logs show breathing session this week
  - Item 3 (medications reviewed): Auto-checks if clinician marks medication review complete
  - All other items: Manual patient check
- **Optional items**: Item 11 (advance directive) marked with "(optional / वैकल्पिक)" — never auto-prompted

#### Completion Celebration
When all 12 items are checked:
- Confetti animation (300ms burst, gravity fall)
- Message: "You're ready! — आप तैयार हैं! 🎉"
- Sub-message: "You've done an amazing job preparing. / आपने तैयारी बहुत अच्छी की है।"
- Share option: "Tell your family — परिवार को बताएँ" (generates a simple shareable message)
- Animation plays once; subsequent views show static "All complete" badge

---

### [Z] NPO Reminder

- **Activation**: Automatically activates 24 hours before surgery date
- **Presentation**: Takes over the top of the Overview tab as a priority card (above Countdown Hero)
- **Visual**: Soft Coral (#E87461) gradient background, high visibility

```
┌──────────────────────────────────────────────────────┐
│  ⚠️ Fasting Instructions / उपवास निर्देश              │
│                                                      │
│  Fasting begins in 6 hours (10:00 PM tonight)        │
│  उपवास 6 घंटे में शुरू (आज रात 10:00 बजे)            │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  🍽️ STOP eating solid food at:                │    │
│  │     10:00 PM / रात 10 बजे                    │    │
│  │                                              │    │
│  │  🥤 STOP drinking clear liquids at:           │    │
│  │     6:00 AM / सुबह 6 बजे                     │    │
│  │                                              │    │
│  │  💊 Take these medicines with a small sip      │    │
│  │     of water at 6:00 AM:                     │    │
│  │     • [Med 1]                                │    │
│  │     • [Med 2]                                │    │
│  │     (as per doctor's orders)                 │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ℹ️ "Clear liquids" = water, apple juice, black      │
│     tea or coffee (no milk, no cream)                │
│     "साफ तरल" = पानी, सेब का रस, काली चाय            │
│     या कॉफी (दूध नहीं)                               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### NPO Logic
```
npo_food_time = surgical_pathways.npo_food_time  // Set by clinician
npo_liquid_time = surgical_pathways.npo_liquid_time  // Set by clinician
npo_medications = surgical_pathways.npo_medications  // List of meds to take with sip

Push notifications:
  1. 24 hours before surgery: "Your surgery is tomorrow. Review your fasting instructions."
  2. At NPO food time: "Fasting has started — no more solid food from now."
  3. At NPO liquid time: "Stop all liquids now — only medications with a tiny sip of water."
```

#### NPO Violation Detection
- If patient logs a meal (via Nutrition Quick Log) after NPO food time:
  - **Gentle warning** (not blocking): "It looks like you logged a meal after your fasting time started. Please check with your team if you're unsure. / ऐसा लगता है कि आपने उपवास शुरू होने के बाद भोजन दर्ज किया। कृपया अपनी टीम से जाँच करें।"
  - Warning is informational, does NOT prevent the log from saving
  - Clinician alert generated in dashboard

---

## Data Architecture

### Database Tables Mapped

| Table | Type | Purpose | Key Fields |
|-------|------|---------|------------|
| `surgical_pathways` | Standard | Patient's surgical pathway | patient_id, surgery_type, surgery_date, surgeon_id, facility, npo_food_time, npo_liquid_time, status |
| `prehab_assessments` | Standard | Readiness scores, functional assessments, anxiety check-ins | patient_id, pathway_id, assessment_type, score, notes, created_at |
| `exercise_plans` | Standard | Clinician-prescribed exercise plans | patient_id, pathway_id, difficulty, start_date, duration_weeks, status |
| `exercise_plans_exercises` | Standard | Individual exercises within a plan | plan_id, exercise_id, day_of_week, duration_min, sets, reps, video_url |
| `exercise_logs` | TimescaleDB | Patient exercise session records | patient_id, exercise_id, plan_id, started_at, duration_actual, pain_during, pain_after, completed, skip_reason, local_id, synced_at |
| `nutrition_logs` | TimescaleDB | Patient meal/supplement records | patient_id, meal_type, portion_size, appetite, nausea, items_json, protein_total, calories_total, photo_local_path, local_id, synced_at |
| `nutrition_targets` | Standard | Clinician-set daily targets | patient_id, pathway_id, protein_g, calories_kcal, hydration_ml, updated_by |
| `supplement_logs` | TimescaleDB | Daily supplement adherence | patient_id, supplement_id, taken, taken_at, local_id, synced_at |
| `advance_directives` | Standard | Advance directive documents and interactions | patient_id, interaction_type, document_url, created_at |
| `prehab_checklists` | Standard | Checklist item completion state | patient_id, pathway_id, item_index, checked, checked_at |
| `journal_entries` | Standard | Worry journal entries (encrypted) | patient_id, entry_text_encrypted, shared_with_clinician, created_at |
| `food_items` | Standard (read-only) | Indian food database | item_id, name_en, name_hi, category, protein_g, calories_kcal, serving_size, serving_unit |

### Offline-First Architecture

```
┌──────────────────────────────────────────────────────┐
│  LOCAL (Device)                                       │
│  ┌─────────────┐   ┌─────────────┐                   │
│  │ SQLite DB   │   │ CRDT Sync   │                   │
│  │ (food items,│   │ Engine      │                   │
│  │  exercise   │   │ (exercise & │                   │
│  │  plans,     │   │  nutrition  │                   │
│  │  cache)     │   │  logs)      │                   │
│  └──────┬──────┘   └──────┬──────┘                   │
│         │                 │                           │
│  ┌──────┴─────────────────┴──────┐                   │
│  │  Sync Manager                  │                   │
│  │  local_id + synced_at pattern │                   │
│  └──────────────┬────────────────┘                   │
│                 │ (when online)                       │
│  ═══════════════╪═══════════════════                 │
│                 │                                     │
│  REMOTE (Server)│                                     │
│  ┌──────────────┴────────────────┐                   │
│  │  TimescaleDB / PostgreSQL      │                   │
│  │  (authoritative store)         │                   │
│  └────────────────────────────────┘                   │
└──────────────────────────────────────────────────────┘
```

- **All exercise and nutrition logging** works fully offline via CRDT sync
- **Exercise plans** cached locally on device when pathway is activated
- **Food database** pre-loaded in device SQLite (approximately 200 items, 50 KB)
- **Sync pattern**: Each record has `local_id` (UUID, generated on device) and `synced_at` (null until synced)
- **Conflict resolution**: Last-write-wins for simple fields; merge for multi-field entries
- **Background sync**: Automatic when device regains connectivity; manual "Sync now" button in Settings
- **Offline indicator**: Subtle banner at top "Offline — data will sync when connected / ऑफ़लाइन — कनेक्ट होने पर डेटा सिंक होगा"

### FHIR R4 Mapping

| PalliCare Resource | FHIR R4 Resource | LOINC / Code | Notes |
|--------------------|-----------------|--------------|-------|
| Exercise plan | CarePlan.activity | — | Category: physical-activity |
| Exercise log | Observation | LOINC 73985-4 (Exercise activity) | value: duration, component: pain score |
| Nutrition log | NutritionOrder + Observation | LOINC 9052-2 (Calorie intake) | NutritionOrder for plan, Observation for actual |
| Protein intake | Observation | LOINC 9069-6 (Protein intake) | value: grams |
| Hydration intake | Observation | LOINC 9066-2 (Fluid intake) | value: mL |
| Anxiety assessment | Observation | LOINC 69737-5 (Anxiety severity) | value: 1-5 scale |
| Weight | Observation | LOINC 29463-7 (Body weight) | value: kg |
| Surgical pathway | CarePlan | — | Category: surgery-preparation |
| Readiness score | Observation | Custom code | value: 0-100 percentage |

---

## Component Specifications

### Visual Design

| Element | Colour | Hex | Usage |
|---------|--------|-----|-------|
| Prehab primary accent | Lavender Mist | #D9D4E7 | Tab bar, headers, countdown hero background |
| Exercise | Sage Green | #7BA68C | Exercise progress, completed states, exercise tab highlights |
| Nutrition | Golden Amber | #E8A838 | Nutrition rings, meal logging, nutrition tab highlights |
| Mind | Deep Teal | #2A6B6B | Anxiety tools, journal, mind tab highlights |
| Medical | Soft Coral | #E87461 | Medical alerts, NPO warnings, medical pillar card |
| Background | Warm White | #FAFAF8 | Screen background |
| Card background | Pure White | #FFFFFF | Card surfaces |
| Text primary | Charcoal | #2D2D2D | Body text |
| Text secondary | Grey | #757575 | Labels, hints, secondary info |
| Disabled | Light Grey | #BDBDBD | Inactive states |

### Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Screen title | Sora | 24sp | Bold | 1.2 |
| Tab label (Hindi) | Noto Sans Devanagari | 11sp | Medium | 1.3 |
| Tab label (English) | Sora | 10sp | Regular | 1.2 |
| Section header | Sora | 18sp | SemiBold | 1.3 |
| Card title | Sora | 16sp | Medium | 1.3 |
| Body text | Sora / Noto Sans Devanagari | 14sp | Regular | 1.5 |
| Small label | Sora | 12sp | Regular | 1.4 |
| Countdown number | Sora | 56sp | Bold | 1.0 |
| Timer display | Sora Mono | 48sp | Bold | 1.0 |

### Interaction Specifications

| Interaction | Specification |
|-------------|--------------|
| Touch targets | 44dp minimum (WCAG AAA compliance) |
| Button height | 48dp for primary actions, 36dp for secondary |
| Card corner radius | 12dp |
| Card elevation | 2dp (Material 3 shadow) |
| Haptic — task complete | Light impact (UIImpactFeedbackGenerator.light) |
| Haptic — exercise complete | Medium impact |
| Haptic — milestone unlock | Success (UINotificationFeedbackGenerator.success) |
| Haptic — daily check-off | Selection (UISelectionFeedbackGenerator.selectionChanged) |
| Animation — readiness meter fill | Spring curve, duration 800ms, damping ratio 0.7 |
| Animation — exercise timer circle | Linear interpolation, 60fps |
| Animation — nutrition ring progress | Ease-out curve, duration 600ms |
| Animation — card expand/collapse | Material expand, 300ms |
| Animation — confetti (checklist complete) | Particle system, 300ms burst, 1.5s gravity fall |
| Loading states | Skeleton screens (shimmer) for data-heavy tabs |
| Pull-to-refresh | Available on all tabs, triggers sync |

### Accessibility

| Feature | Specification |
|---------|--------------|
| Screen reader | Full VoiceOver / TalkBack support with descriptive labels for all interactive elements |
| ARIA labels | Every progress ring: "Protein: 45 grams of 60 gram target"; every button: action + state |
| Voice commands | "Log my exercise" / "मेरा व्यायाम दर्ज करें", "Log a meal" / "भोजन दर्ज करें" |
| Reduce motion | Static progress indicators replace animations; no expanding circles; instant state changes |
| High contrast | All indicators use patterns (stripes, dots) in addition to colours; tested at WCAG AAA ratio |
| Font scaling | All text scales to 200% without layout breakage; tested at system accessibility zoom |
| Hindi translations | Every user-facing string has Hindi equivalent; language toggle in header |
| Focus management | Tab key navigation follows visual order; focus ring visible on all interactive elements |
| Skip navigation | "Skip to content" link available for screen reader users at top of each tab |
| Colour-blind safe | Red/green distinctions always paired with secondary indicator (icon, pattern, or text) |
| Minimum contrast | All text meets 4.5:1 ratio (AA) for normal text, 3:1 for large text |

---

## Clinical Safety Rules

| # | Rule | Implementation |
|---|------|----------------|
| 1 | **No guilt messaging** | Missed tasks show "That's okay — tomorrow is a new day" not "You missed your exercise." Skip reasons are logged without judgment. |
| 2 | **Exercise pain threshold** | Auto-pause if mid-exercise pain > 6/10. Suggest rest. Log incident to `exercise_logs.pain_event`. Clinician notified if pain > 8 or 3+ pain events in a week. |
| 3 | **NPO violation detection** | Alert if food logged after NPO start time. Gentle warning only — does NOT prevent logging. Clinician dashboard alerted. |
| 4 | **Anxiety escalation** | If "Very Anxious" (score 5) selected 3+ times in rolling 7 days, automated alert to clinician dashboard. Patient NOT informed of the alert. |
| 5 | **Never mandatory** | Every exercise, nutrition log, check-in, and journal entry is optional. No blocking gates. No "complete this to proceed" patterns. |
| 6 | **No performance comparison** | Never show patient rankings, comparisons with other patients, or population benchmarks. Progress is individual only. |
| 7 | **Advance directive — informational only** | Always framed as "Did you know?" educational content. Never says "You should" or "You need to." Shown once per week maximum. Dismissible permanently. |
| 8 | **Supplement safety** | Supplements are only those prescribed by the clinician. Patient cannot self-add prescription supplements — only food items. |
| 9 | **Weight sensitivity** | Weight logging never labels values as "good", "bad", "overweight", or "underweight." Shows trend only, no judgment. |
| 10 | **Faith sensitivity** | All spiritual content reviewed by multi-faith advisory panel. Equal treatment. No proselytising. Always optional. |
| 11 | **Journal privacy** | Journal entries encrypted at rest. Never shared with clinician unless patient explicitly opts in per-entry. |
| 12 | **Notification limits** | Maximum 3 prehab notifications per day. Respect Quiet Hours. Stop all prehab notifications immediately on pathway cancellation. |

---

## Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| **Surgery cancelled** | Graceful message: "Your surgery plan has changed. Your care team will be in touch. — आपकी सर्जरी योजना बदल गई है। आपकी टीम संपर्क करेगी।" Archive all prehab data (not deleted). Prep tab disappears. Insights tab returns. Prehab data remains accessible in My Journey as historical record. |
| **Surgery postponed** | Update countdown automatically. Adjust exercise plan dates (extend or restart week counter, clinician choice). Message: "Your surgery date has been updated to [new date]. — सर्जरी की तारीख़ बदलकर [नई तारीख़] हो गई है।" All existing progress preserved. |
| **Patient not engaging (3+ days no activity)** | Day 3: Gentle nudge push notification — "We're here whenever you're ready. — जब भी तैयार हों, हम यहाँ हैं।" Day 5: Second nudge — "Would you like to talk to your team? — क्या आप अपनी टीम से बात करना चाहेंगे?" After Day 5: Clinician alert in dashboard. Maximum 1 nudge/day. |
| **Offline mode** | Full exercise and nutrition logging via CRDT. Checklist viewable and editable. Exercise plans cached. Food database available. Visualisation audio available if previously downloaded. Sync banner shown. |
| **No exercise plan prescribed** | Exercise tab shows: "Your exercise plan hasn't been set up yet. In the meantime, here are some general tips from our library." Show curated low-intensity exercises from Exercise Library. Hide "Today's Exercises" section. |
| **No nutrition targets set** | Use default targets (Protein 60g, Calories 1800 kcal, Hydration 2000ml). Label as "General targets — your doctor may adjust." |
| **Patient declines prehab** | Respect immediately. Remove Prep tab. Log declination to `surgical_pathways.status = 'declined'`. Show: "We respect your choice. Your care team is always here if you change your mind." No follow-up nudges about prehab (regular PalliCare continues). |
| **Multiple surgeries** | Show most imminent surgery in Countdown Hero. Dropdown selector to switch between pathways if >1 active. Each pathway has independent progress tracking. |
| **Surgery day arrived** | Switch to "Surgery Day" mode: NPO card takes priority. Exercise and nutrition logging paused. Mind tab shows calming content prominently. Emergency contacts card shown. Checklist shows final review. Quick-access to hospital directions and arrival time. |
| **Post-surgery transition** | When clinician marks surgery as complete: Countdown changes to "Recovery Day X." Prehab content transitions to post-operative recovery content (future module). Exercise plans may update to post-op rehabilitation. |
| **Very short prehab window (<3 days)** | Condensed view: Hide weekly progress/history sections. Focus on checklist, NPO, and Mind tab. Exercise plan adjusted to urgent essentials only. |
| **Clinician modifies plan mid-pathway** | Patient notified: "Your exercise plan has been updated by Dr. [Name]." Changed items highlighted with "Updated" badge for 48 hours. |
| **App force-closed during exercise timer** | On next app open: "You had an exercise in progress — would you like to log it?" with estimated duration based on start time and crash time. |
| **Low device storage** | Prioritise: SQLite database > exercise plans > text content > audio downloads > video cache. Warn if <100MB available. |

---

## Notifications

| Trigger | Type | Timing | Message Example (Bilingual) |
|---------|------|--------|----------------------------|
| Daily prehab reminder | Push | Morning (customisable, default 8:00 AM) | "Good morning! Ready for today's preparation? — सुप्रभात! आज की तैयारी शुरू करें?" |
| Exercise reminder | Push | Per plan schedule | "Time for your walking exercise — सैर का समय 🚶" |
| NPO start (food) | Push | At NPO food time | "Fasting has started — no more solid food. — उपवास शुरू — अब ठोस भोजन नहीं।" |
| NPO start (liquids) | Push | At NPO liquid time | "Stop all liquids now. — अब सभी तरल बंद करें।" |
| Supplement reminder | Push | Aligned with medication reminders | "Don't forget your iron supplement — आयरन की गोली याद रखें 💊" |
| Weekly progress summary | In-app | Sunday evening (6:00 PM) | "This week: 5 exercises, 85% protein target! — शाबाश! 🎉" |
| Milestone achievement | In-app | On achievement | "You've completed 2 weeks of preparation! — 2 हफ़्ते पूरे! 🌟" |
| Surgery eve | Push | Evening before surgery | "Tomorrow is your surgery day. You've prepared well. Rest tonight. — कल सर्जरी है। आपने अच्छी तैयारी की है। आज रात आराम करें। 💚" |
| Anxiety escalation (to clinician) | Silent alert | On 3rd "Very Anxious" in 7 days | [Clinician dashboard only — patient not notified] |
| Plan updated by clinician | In-app | On update | "Dr. [Name] has updated your preparation plan. — डॉ. [नाम] ने आपकी तैयारी योजना अपडेट की है।" |
| Engagement nudge | Push | After 3 days inactivity | "We're here whenever you're ready. — जब भी तैयार हों, हम यहाँ हैं। 🤗" |

### Notification Rules
- **Maximum**: 3 prehab notifications per day (separate budget from existing PalliCare notifications)
- **Priority order**: NPO > Medication > Exercise > General reminder (if budget exceeded, lower priority notifications are deferred)
- **Quiet Hours**: Respect system and app Quiet Hours settings (default: 10 PM – 7 AM)
- **Opt-out**: Patient can disable individual notification categories in Settings → Notifications
- **Surgery cancelled**: All prehab notifications cease immediately upon pathway cancellation
- **Language**: Notifications follow patient's language preference setting

---

## State Management (Flutter)

### Riverpod Providers

```
// Core prehab state
final prehabPathwayProvider = StreamProvider<SurgicalPathway?>
final prehabActiveProvider = Provider<bool>  // derived: pathway != null && status == active
final daysRemainingProvider = Provider<int?>

// Overview
final readinessScoreProvider = FutureProvider<ReadinessScore>
final dailyTasksProvider = StreamProvider<List<PrehabTask>>

// Exercise
final exercisePlanProvider = StreamProvider<ExercisePlan?>
final todayExercisesProvider = Provider<List<PlannedExercise>>
final exerciseHistoryProvider = FutureProvider<ExerciseHistory>
final activeExerciseTimerProvider = StateNotifierProvider<ExerciseTimerNotifier, ExerciseTimerState>

// Nutrition
final nutritionTargetsProvider = StreamProvider<NutritionTargets>
final todayNutritionProvider = StreamProvider<DailyNutritionSummary>
final foodSearchProvider = StateNotifierProvider<FoodSearchNotifier, FoodSearchState>
final supplementsProvider = StreamProvider<List<SupplementStatus>>

// Mind
final anxietyHistoryProvider = StreamProvider<List<AnxietyCheckIn>>
final journalEntriesProvider = StreamProvider<List<JournalEntry>>
final faithPreferenceProvider = Provider<String>

// Checklist
final checklistProvider = StreamProvider<List<ChecklistItem>>
final npoStatusProvider = Provider<NpoStatus>
```

### Offline Sync State Machine
```
enum SyncState { synced, pending, syncing, error }

Each loggable entity (exercise_log, nutrition_log, supplement_log) carries:
  - local_id: UUID (generated on device at creation)
  - synced_at: DateTime? (null = unsynced)
  - sync_state: SyncState
  - retry_count: int (max 5, then manual retry)
```

---

## Testing Checklist

### Unit Tests
- [ ] Readiness score calculation with various inputs (all pillars, missing pillars, zero data)
- [ ] NPO countdown calculation (timezone handling, DST edge cases)
- [ ] Daily task auto-population logic
- [ ] Food database search (Hindi input, English input, partial matches)
- [ ] Anxiety escalation trigger (3+ Very Anxious in 7 days)
- [ ] Exercise pain threshold auto-pause logic

### Widget Tests
- [ ] Countdown Hero renders correctly for all countdown states (>30, 7-30, 2-6, 1, 0, negative)
- [ ] Readiness Meter colour changes at thresholds (39→40, 69→70)
- [ ] Exercise timer pause/resume/stop flow
- [ ] Nutrition ring overflow (>100% target)
- [ ] Checklist confetti triggers only at 12/12
- [ ] NPO warning appears only after NPO time

### Integration Tests
- [ ] Exercise log: Start → Timer → Mid-pain check → Complete → Post-check → Save → History updates
- [ ] Nutrition log: Quick Log → Add items → Save → Dashboard ring updates
- [ ] Offline exercise log → Sync when online → Verify server record
- [ ] Pathway cancellation → Prep tab disappears → Data archived
- [ ] Surgery postponement → Countdown updates → Plan dates adjust

### Accessibility Tests
- [ ] Full screen reader walkthrough of all 4 tabs
- [ ] Voice command exercise logging
- [ ] Reduce motion mode: no animations on any tab
- [ ] 200% font scaling: no layout breakage
- [ ] High contrast mode: all indicators distinguishable

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Tab switch | <100ms | Frame timing |
| Exercise timer jank | 0 dropped frames | 60fps monitoring |
| Food database search | <50ms per keystroke | Profiler |
| Offline log save | <200ms | User-perceived |
| Sync batch (50 records) | <5s | Network timing |
| Initial tab load (cold) | <500ms | First meaningful paint |
| Nutrition ring animation | 60fps | Frame timing |
| Memory (Prehab module active) | <80MB additional | Heap profiling |

---

## File References

| Document | Link |
|----------|------|
| Blueprint Master | [00_Blueprint_Master.md](00_Blueprint_Master.md) |
| Home Screen (Prehab Card) | [02_Screen_Home.md](02_Screen_Home.md) |
| Symptom Logger (Functional Assessment) | [03_Screen_Symptom_Logger.md](03_Screen_Symptom_Logger.md) |
| Medication Tracker (Pre-Op Review) | [05_Screen_Medication_Tracker.md](05_Screen_Medication_Tracker.md) |
| Learn Module (Phase 0) | [06_Screen_Learn_Module.md](06_Screen_Learn_Module.md) |
| Breathe Module (Pre-Op Exercises) | [07_Screen_Breathe_Module.md](07_Screen_Breathe_Module.md) |
| My Journey (Prehab Milestones) | [08_Screen_My_Journey.md](08_Screen_My_Journey.md) |
| Clinician Dashboard (Prehab Panel) | [10_Screen_Clinician_Dashboard.md](10_Screen_Clinician_Dashboard.md) |
| Perioperative Pathway (Clinician) | [14_Screen_Perioperative_Pathway.md](14_Screen_Perioperative_Pathway.md) |
| Prehab Research | [Research_Prehabilitation_Palliative_Care.md](Research_Prehabilitation_Palliative_Care.md) |
| Technical Design Document | [Output/Technical/Technical_Design_Document.md](Output/Technical/Technical_Design_Document.md) |
| Database Migration | [Output/Code/database/002_prehabilitation_schema.sql](Output/Code/database/002_prehabilitation_schema.sql) |
| Design System | [Output/Technical/Design_System.md](Output/Technical/Design_System.md) |

---

*PalliCare v1.1 — Prehabilitation Integration*
*Screen 13: Preparing patients for surgery with compassion, culture, and clinical evidence.*
*Created: 2026-02-16 | Updated: 2026-02-16*
*Status: Draft — Ready for clinical review*
