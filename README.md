# PalliCare

> **Palliative Care & Pain Management Platform**
> For AIIMS Bhopal — Department of Palliative Medicine & Anaesthesiology

## Architecture

```
pallicare/
  apps/
    mobile/         # Flutter patient app (Android + iOS)
    dashboard/      # Next.js clinician web dashboard
  packages/
    shared-types/   # TypeScript type definitions (shared)
    db/             # Database migrations & seeds
  infrastructure/
    docker/         # Docker Compose for local dev
    nginx/          # Production reverse proxy config
  docs/             # Design specs (symlinked from Obsidian)
  scripts/          # Utility scripts
```

## Quick Start

### Prerequisites
- Node.js >= 20 (clinician dashboard)
- Flutter >= 3.x (patient mobile app)
- Docker (local PostgreSQL + TimescaleDB + Redis)

### Development

```bash
# Install dependencies
npm install

# Start clinician dashboard
npm run dev:dashboard

# Start Flutter app (when Flutter is installed)
cd apps/mobile && flutter run
```

### Database

```bash
# Start local PostgreSQL + TimescaleDB + Redis
npm run db:migrate

# Apply migrations
docker exec -i pallicare-db psql -U pallicare -d pallicare < packages/db/001_initial_schema.sql
```

## Design Documentation

Complete design specifications (15 screen specs, 447-page PDF package) are in the Obsidian vault at:
`E:\Obsidian Vault\Projects\PalliCare_App\`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Patient Mobile | Flutter 3.x + Riverpod |
| Clinician Web | Next.js 14 + React Query + Zustand + Tailwind |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Database | PostgreSQL 15 + TimescaleDB |
| Cache | Redis 7 |
| Storage | MinIO (dev) / S3 (prod) |

## License

Proprietary — AIIMS Bhopal. All rights reserved.
