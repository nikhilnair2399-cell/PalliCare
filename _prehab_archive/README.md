# Prehabilitation Module — Archived for Standalone App

> **Extracted from**: PalliCare v2.1 (2026-02-18)
> **Purpose**: Content preserved for building a standalone Prehabilitation app
> **Original context**: AIIMS Bhopal, Department of Palliative Medicine & Anaesthesiology

## Contents

### Flutter Mobile (Dart)
- `apps/mobile/lib/features/prehab/prehab_screen.dart` — Prehab dashboard screen
- `apps/mobile/lib/models/surgical_pathway.dart` — Surgical pathway model (freezed)
- `apps/mobile/lib/models/prehab_assessment.dart` — Prehab assessment model
- `apps/mobile/lib/models/exercise_plan.dart` — Exercise plan/log model
- `apps/mobile/lib/models/nutrition_log.dart` — Nutrition tracking model
- `apps/mobile/lib/models/advance_directive.dart` — Advance directive model

### Next.js Dashboard (TypeScript/React)
- `apps/dashboard/src/app/(dashboard)/prehab/page.tsx` — Clinician prehab page
- `apps/dashboard/src/components/prehab/PrehabOverview.tsx` — Prehab overview component

### Shared TypeScript Types
- `packages/shared-types/src/prehab-assessment.ts`
- `packages/shared-types/src/surgical-pathway.ts`
- `packages/shared-types/src/exercise.ts`
- `packages/shared-types/src/nutrition.ts`
- `packages/shared-types/src/advance-directive.ts`

### Database
- `packages/db/002_prehabilitation_schema.sql` — 11 prehab tables (PostgreSQL + TimescaleDB)

### Design Documents
- `design-docs/13_Screen_Prehabilitation.md` — Full screen specification
- `design-docs/14_Screen_Perioperative_Pathway.md` — Perioperative pathway spec
- `design-docs/Research_Prehabilitation_Palliative_Care.md` — Research analysis

## Prehab Features Covered
- Surgical pathway tracking (pre-op through recovery)
- Exercise planning and logging (5-pillar model)
- Nutrition assessment and logging
- Advance directive management
- Prehab readiness scoring
- MEDD-aware exercise recommendations
- Perioperative countdown and milestones
