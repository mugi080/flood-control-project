# Milestone 1: Project Foundation and Interactive Map

## Executive Summary

Milestone 1 for **Flood Control MD** is complete. A runnable monorepo with an interactive Next.js + Material UI frontend, an independent Fastify backend, and a Leaflet-based municipal flood map has been implemented with clean separation of concerns and clearly labeled mock demonstration data.

---

## Deliverables & Components

### 1. Monorepo & Workspaces
- Configured npm workspaces containing `apps/web`, `apps/api`, `packages/shared`, and `docs/`.
- Root package scripts for unified development, building, typechecking, and linting.
- Root and workspace-level `.env.example` templates.

### 2. Frontend (`apps/web`)
- **Framework**: Next.js 14 App Router, React 18, TypeScript, Material UI v5.
- **Visual Identity**: Professional municipal emergency-monitoring theme with custom palette, typography, responsive breakpoints, and status chips.
- **Interactive Map**:
  - React Leaflet client-only dynamic boundary (`ssr: false`) preventing SSR window crashes.
  - OpenStreetMap tiles with compliant copyright attribution.
  - Multi-point polygon flood zones with severity color fills.
  - Centroid marker pins with zone codes (`A1`, `B2`, `C3`, `D4`).
  - Interactive popups with water gauge meters, thresholds, trend arrows, and direct selection actions.
  - Synchronized map fly-to animations when selecting zones.
- **Alert Summary Panel**:
  - Cards showing severity, affected area in km², estimated population, issue timestamp, and expiry timestamp.
  - Municipal emergency action directives.
  - Water level progress bars comparing current depth to danger threshold.
- **Interactive Severity Legend**:
  - Visual filter controls allowing operators to filter the map and alert panel by severity level (`Extreme`, `Major`, `Moderate`, `Minor`).
- **States & Disclaimers**:
  - Loading skeleton and spinner while map tiles initialize.
  - Empty filter states with reset button.
  - Prominent simulation disclaimers preventing misinterpretation of mock records as real civil defense warnings.

### 3. Backend (`apps/api`)
- **Framework**: Fastify 4, Node.js, TypeScript.
- **Health Check**: `GET /health` responding with server status, uptime seconds, version, and ISO timestamp.
- **Mock Telemetry Route**: `GET /api/v1/flood-zones` and `GET /api/v1/flood-zones/:id` with schema validation.
- **Architecture**:
  - `src/app.ts`: Fastify application factory with CORS, `@fastify/sensible`, custom 404 handler, and structured error handling.
  - `src/server.ts`: Server startup, port listening, and graceful shutdown handling (`SIGINT`, `SIGTERM`).
  - `src/config.ts`: Environment-based configuration with validation.

### 4. Shared Domain Package (`packages/shared`)
- Strongly typed TypeScript contracts for flood zones, alerts, municipalities, severity tiers, and health responses.
- Fictional demonstration municipality dataset ("Riverdale Municipal District") with realistic coordinates and water levels.

---

## Local Development & Execution

### Prerequisites
- Node.js >= 18 (Tested on Node.js v24.18.0)
- npm >= 10 (Tested on npm 11.16.0)

### 1. Install Dependencies
```powershell
npm install
```

### 2. Build Shared Package & TypeScript Outputs
```powershell
npm run build
```

### 3. Run Applications
- **Start Fastify API** (default port `4000`):
  ```powershell
  npm run dev:api
  ```
  Health probe: `http://localhost:4000/health`
  Mock flood zones: `http://localhost:4000/api/v1/flood-zones`

- **Start Next.js Web Portal** (default port `3000`):
  ```powershell
  npm run dev:web
  ```
  Web interface: `http://localhost:3000`

---

## Cartography & Data Disclaimers

1. **Map Tile Provider**: OpenStreetMap Cartography (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
   - Standard attribution provided (`© OpenStreetMap contributors`).
   - Usage is governed by the OpenStreetMap Foundation Tile Usage Policy. Milestone 1 uses standard non-bulk caching appropriate for evaluation and testing.
2. **Demonstration Notice**:
   - All displayed areas, water levels, and alert statuses are synthetic mock records created solely for software testing. They do NOT represent real-world civil defense hazards.

---

## Out of Scope & Milestone 2 Roadmap

The following capabilities were intentionally excluded from Milestone 1 per the requirements:
- Supabase database persistence and live sync.
- Authentication, user sessions, and role-based access control.
- Real-world hydrological telemetry sensors or predictive models.
- Administrator CRUD editing tools for zones or alerts.
- Push notifications / SMS alert delivery.
