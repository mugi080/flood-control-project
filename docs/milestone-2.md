# Milestone 2: Lucena City Barangay Assessment & Citizen Crowd-Validation

## Executive Summary

Milestone 2 narrows the focus of Flood Control MD to **Lucena City (Quezon Province, Philippines)** and introduces a **Citizen Crowd-Validation & Field Observation System**. This feature transforms residents from passive viewers into active community ground validators, ensuring warning notices and water level conditions are corroborated by on-the-ground observations.

---

## 1. Geographic Focus: Lucena City

The system models the hydrological basin of Lucena City, shaped by the confluence of the **Iyam River** and **Dumacaa River** draining into **Tayabas Bay**:

- **Barangay Cotta** (`BRGY-COTTA`): River confluence and coastal wharf area. Highest flood vulnerability during high tide and monsoon runoff. Status: *Emergency Inundation*.
- **Barangay Market View** (`BRGY-MKT-VIEW`): Commercial center along the Dumacaa River embankment. Vulnerable to market perimeter overflow. Status: *Flood Warning*.
- **Barangay Dalahican** (`BRGY-DALAHICAN`): Major fishing port along Tayabas Bay. Vulnerable to storm surge and tidal inundation. Status: *Flood Warning*.
- **Barangay Ibabang Dupay** (`BRGY-IB-DUPAY`): Major residential and highway corridor along Maharlika Highway. Vulnerable to culvert ponding. Status: *Flood Watch*.
- **Barangay Barra** (`BRGY-BARRA`): Coastal strip along Tayabas Bay. Vulnerable to wave splash and coastal surging. Status: *Flood Watch*.
- **Barangay Gulang-Gulang** (`BRGY-GULANG`): Northern upland terrace with natural drainage buffers. Status: *Advisory*.

---

## 2. Citizen Crowd-Validation Architecture

### Concept & Value Proposition
Official municipal sensors and predictions benefit from ground-truth verification. The participatory validation model empowers citizens to:
1. **Confirm or Dispute Alert Accuracy**: Civilians vote whether an alert reflects reality on the street.
2. **Submit Field Observations**: Citizens report localized water depth (Gutter-deep, Knee-deep, Waist-deep, Submerged), vehicle passability, and landmark observations.
3. **Consensus Indicator**: Alerts display a transparent verification metric (e.g., *"Community Verified (93% Consensus)*"), increasing trust and urgency.

### Backend Endpoints (`apps/api`)
- `POST /api/v1/flood-zones/:id/vote`:
  - Body: `{ "type": "confirm" | "dispute" }`
  - Recomputes consensus percentage and updates validation tally.
- `POST /api/v1/flood-zones/:id/reports`:
  - Body: `{ "waterDepth": "knee_deep", "isPassableForVehicles": false, "comment": "...", "landmark": "...", "reporterName": "..." }`
  - Records field report with timestamp and triggers a positive confirmation vote.
- `GET /api/v1/flood-zones/:id/reports`:
  - Returns recent chronological field observations for the barangay.

### Frontend Components (`apps/web`)
- **`CitizenValidationWidget.tsx`**:
  - Interactive Confirm/Dispute buttons with instant feedback.
  - Dynamic consensus progress bar.
  - "Add Ground Report" modal dialog with depth level selectors and vehicle passability switch.
  - Chronological observation feed with relative timestamps.
- **`FloodMap.tsx`**:
  - Centroid pins displaying barangay codes (`COTT`, `MKTV`, `DALA`, `DUPA`, `BARR`, `GULA`).
  - Interactive popups featuring the citizen consensus badge and quick "Validate / Rate Alert" launcher.
- **`AlertSummaryPanel.tsx`**:
  - Displays Barangay names, community verification badges, and expands to show the validation widget when clicked.

---

## 3. How to Run Locally

### 1. Build Workspaces
```powershell
npm run build
```

### 2. Start Backend API
```powershell
npm run dev:api
```
- API listening on `http://localhost:4000`.
- Health check: `http://localhost:4000/health`.
- Lucena flood zones: `http://localhost:4000/api/v1/flood-zones`.

### 3. Start Frontend Web Portal
```powershell
npm run dev:web
```
- Open `http://localhost:3000` in your browser.
- Select any barangay (e.g. Barangay Cotta or Barangay Market View) to rate the alert, cast a confirmation vote, or post a ground observation!
