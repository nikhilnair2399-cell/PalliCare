# PalliCare

**Palliative Care & Pain Management Platform**
AIIMS Bhopal | Department of Anaesthesiology & Palliative Medicine

---

## Overview

PalliCare is a comprehensive digital platform for palliative care delivery, designed for use at AIIMS Bhopal. It provides real-time patient monitoring, symptom tracking, medication management, care team collaboration, and patient education tailored for India's palliative care context.

## Architecture

```
pallicare/
  apps/
    dashboard/      Next.js 15 clinician web dashboard
    mobile/         Flutter 3.x patient & caregiver app
    api/            NestJS 10 REST + WebSocket backend
  packages/
    shared-types/   TypeScript type definitions
    db/             Database schema & migrations (001_initial_schema.sql)
  infrastructure/
    docker/         Docker Compose for local development
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS 4, Recharts |
| **Mobile** | Flutter 3.x, Dart, Riverpod |
| **Backend** | NestJS 10, TypeScript, pg (raw SQL, no ORM) |
| **Database** | PostgreSQL 16 + TimescaleDB 2.14 |
| **Cache** | Redis 7.2 |
| **Storage** | MinIO (S3-compatible) |
| **Real-time** | Socket.IO (WebSocket gateway) |
| **Auth** | JWT (HS256) + OTP-based login |
| **Containerisation** | Docker multi-stage builds |

---

## Quick Start

### Prerequisites

- **Node.js** >= 20.0.0 and **npm** >= 10.0.0
- **Docker Desktop** 4.x+ (allocate at least 4 GB RAM)
- **Flutter SDK** 3.x (for mobile app, optional)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Infrastructure

```bash
npm run infra:up
```

Starts PostgreSQL + TimescaleDB, Redis, MinIO (S3), MailHog, and the NestJS API container.

### 3. Seed the Database

```bash
npm run db:seed
```

Populates the database with realistic demo data: 8 patients, medications, symptom logs, care plans, education modules, caregivers, milestones, and 15 palliative medications.

### 4. Start Development Servers

```bash
# Terminal 1 — API server (port 3001)
npm run dev:api

# Terminal 2 — Dashboard (port 3000)
npm run dev:dashboard

# Terminal 3 — Mobile app (optional)
cd apps/mobile && flutter run
```

### 5. Access the Application

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| Login | http://localhost:3000/login |
| API | http://localhost:3001/api/v1 |
| Swagger Docs | http://localhost:3001/api/v1/docs |
| WebSocket | ws://localhost:3002 |
| MinIO Console | http://localhost:9001 (minioadmin / minioadmin) |
| MailHog | http://localhost:8025 |

**Login:** Enter any phone number. Use OTP `000000` (dev bypass).

---

## Dashboard Pages

| Route | Description |
|-------|-------------|
| `/` | Home dashboard with patient overview, alerts, KPI stats |
| `/login` | OTP-based clinician authentication |
| `/patients` | Patient list with search, status filtering, sorting |
| `/patients/[id]` | Detailed patient view (pain, meds, symptoms, care plan, caregivers, education, messages) |
| `/alerts` | Clinical alerts with severity management (critical / warning / info) |
| `/notes` | Clinical notes with 8-type filtering (progress, SOAP, SBAR, MDT, etc.) |
| `/care-plans` | Care plan management with goals, interventions, versioning |
| `/messages` | Care team communication threads with role-based styling |
| `/mdt` | Multi-disciplinary team collaboration & SBAR handover |
| `/analytics` | Department metrics, pain distribution, quality metrics, research export |
| `/medication-db` | Palliative drug reference with MEDD conversion, dosing, interactions |
| `/settings` | Profile, alert preferences, DPDPA consent, system status, feature flags |

## API Modules

21 modules covering: Auth, Patients, Medications, Clinical Alerts, Clinical Notes, Care Plans, Caregivers, Messages, Analytics, Wellness (Goals, Gratitude, Intentions, Milestones), Education, Breathe Sessions, Uploads, Devices, Medication Database, Consent (DPDPA 2023), Notifications, Sync, Health, WebSocket Gateway.

## Database

24 tables including TimescaleDB hypertables for time-series symptom data, continuous aggregates for daily summaries, and Row-Level Security (RLS) policies. Schema: `packages/db/001_initial_schema.sql`.

---

## Key Features

### Clinician Dashboard
- Real-time NRS pain tracking with colour-coded trends
- MEDD (Morphine Equivalent Daily Dose) calculation and threshold alerts
- Clinical alerts with severity levels and escalation timeouts
- Versioned care plans with goals and interventions
- MDT collaboration with SBAR handover notes
- Medication database with dosing, interactions, renal/hepatic adjustments
- Analytics with quality metrics and research data export

### Patient Mobile App
- Daily symptom logging with Hindi language support
- Medication schedule with adherence tracking
- Breathing exercises for comfort (4-7-8, Box, etc.)
- Phased education modules
- Gratitude journal and wellness goals
- Milestone achievements
- Secure messaging with care team

### Caregiver Support
- Patient schedule visibility
- Handover notes (SBAR format)
- Wellness check-ins with distress scoring
- Care schedule management

---

## Scripts

```bash
# Development
npm run dev:dashboard       # Next.js dev server (port 3000)
npm run dev:api             # NestJS dev server (port 3001)

# Build
npm run build:dashboard     # Production build
npm run build:api           # Production build

# Testing
npm run test:api            # Run API tests

# Database
npm run db:seed             # Seed database with demo data

# Infrastructure
npm run infra:up            # Start Docker services
npm run infra:down          # Stop Docker services
npm run infra:logs          # View Docker logs

# Code Quality
npm run lint:dashboard      # Lint dashboard
npm run lint:api            # Lint API
npm run typecheck           # Type-check all workspaces
```

---

## Compliance

| Standard | Status |
|----------|--------|
| **DPDPA 2023** | Implemented (consent management) |
| **ABDM / ABHA** | Planned (feature flag disabled) |
| **FHIR R4** | Planned (feature flag disabled) |
| **NDPS Act** | Opioid tracking with MEDD alerts |

---

## Environment Variables

All configuration is in `infrastructure/docker/docker-compose.yml`. Key variables:

- `JWT_SECRET` - JWT signing key (**change in production**)
- `DB_*` - PostgreSQL connection
- `REDIS_*` - Redis connection
- `S3_*` - MinIO / S3 storage
- `FEATURE_*` - Feature flags (voice input, caregiver mode, offline sync, etc.)

---

## License

Proprietary. AIIMS Bhopal. All rights reserved.
