# Flood Control MD — Architecture & System Design

## 1. System Overview

Flood Control MD is a municipal flood monitoring and civil-defense alert dashboard built to provide real-time visibility into river basins, drainage catchments, water level telemetry, and public safety advisories.

Milestone 1 establishes the baseline monorepo foundation, responsive municipal portal UI with Material UI, an interactive Leaflet map with simulated flood zones, and an independent Fastify backend service.

```
                    ┌────────────────────────────┐
                    │    Civilian / Operator     │
                    │      Browser Client        │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │     apps/web (Next.js)     │
                    │  App Router + Material UI  │
                    │  Leaflet Client Boundary   │
                    └──────┬──────────────┬──────┘
                           │              │
           Local Shared    │              │ HTTP Fetch / REST
           Mock Fallback   │              │ Votes & Ground Reports
                           ▼              ▼
           ┌──────────────────────┐ ┌──────────────────────┐
           │   packages/shared    │ │   apps/api (Fastify) │
           │ TypeScript Types &   │ │ Health & Telemetry   │
           │ Lucena City Barangays│ │ Citizen Validation   │
           │ Community Validation │ │ REST Endpoints       │
           └──────────────────────┘ └──────────────────────┘
```

---

## 2. Monorepo Organization

The project uses npm workspaces with clear boundaries between the frontend, backend, and shared domain models:

- **`apps/web`**: Next.js 14 (App Router) user interface.
  - Implements Material UI v5 with custom municipal emergency management palette and typography.
  - Uses `react-leaflet` within an explicit dynamic client boundary (`ssr: false`) to avoid server-side rendering DOM errors.
  - Consumes flood data through `src/services/floodDataService.ts`, decoupling visual components from data retrieval mechanics.
- **`apps/api`**: Fastify HTTP server.
  - Separate application factory (`buildApp()`) and runtime entrypoint (`server.ts`).
  - Structured error handling, schema validation, and health probe (`GET /health`).
  - Environment-based configuration with explicit port and host parsing.
- **`packages/shared`**: Shared TypeScript contracts.
  - Standardized domain models: `FloodZone`, `FloodAlertSummary`, `DemonstrationMunicipality`, `SeverityLevel`, `WaterLevelMetric`.
  - Realistic demonstration data bundle for testing and simulation.
- **`docs/`**: Architecture diagrams, operational playbooks, and milestone records.

---

## 3. Map Cartography & Client Boundary Design

### Leaflet Server-Side Rendering (SSR) Boundary
Leaflet depends directly on browser DOM APIs (`window`, `navigator`, `document`). In Next.js App Router, all components default to React Server Components (RSC) unless explicitly marked `'use client'`. Even client components undergo server-side pre-rendering on first request.

To avoid `window is not defined` crashes:
1. `apps/web/src/components/map/FloodMapWrapper.tsx` dynamically imports `FloodMap.tsx` via `next/dynamic(..., { ssr: false })`.
2. A responsive skeleton loader (`MapLoadingState`) is rendered until the browser window is available and Leaflet mounts.
3. Custom SVG `divIcon` pins replace default Leaflet raster assets, eliminating broken icon URL paths in Webpack bundles.

### Cartography Provider & Terms of Use
- **Tile Provider**: OpenStreetMap Standard Cartography (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
- **Attribution**: Displayed on all map views (`© OpenStreetMap contributors`).
- **Terms of Use**: Adheres to the OpenStreetMap Foundation Tile Usage Policy. Permitted for open-source development, evaluation, and non-bulk demonstration. No commercial API key or proprietary token is required for Milestone 1.

---

## 4. Visual Identity & Design System

The application implements a municipal civil-defense visual identity via Material UI:
- **Palette**: Deep maritime primary (`#0B2545`) with emergency blue accents (`#0077B6`).
- **Severity Classification**:
  - `Extreme`: Crimson (`#C62828`) — Critical floodwall breaches, immediate evacuation staging.
  - `Major`: Alert Orange (`#E65100`) — Significant creek overflow, arterial roads impassable.
  - `Moderate`: Caution Amber (`#F57F17`) — Drainage canals operating near capacity, watch issued.
  - `Minor`: Advisory Blue (`#0288D1`) — Nuisance surface water, structures secure.
- **Simulation Disclaimer**: Prominent top banners and card badges explicitly clarify that all telemetry represents fictional simulation data for interface testing.
