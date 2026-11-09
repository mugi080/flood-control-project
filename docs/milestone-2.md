# Milestone 2: Complete 33-Barangay Lucena City Assessment, Flood Heatmap & Analytics

## Executive Summary

Milestone 2 expands Flood Control MD to comprehensively cover **all 33 official administrative barangays of Lucena City (Quezon Province, Philippines)** using demographic and geospatial data from the Philippine Statistics Authority (PSA) and CityPopulation.de. It introduces:
1. **Complete 33-Barangay Hydrological Coverage** with land area in $\text{km}^2$ and hectares, elevation, population, density, and flood risk index.
2. **Interactive Flood Risk Heatmap** with graduated heat blur circles and toggleable visualization modes (`Combined`, `Zones`, `Heatmap`).
3. **Participatory Citizen Crowd-Validation & Field Reporting System** enabling citizens to confirm or dispute alerts and post street-level flood depth reports.
4. **Flood Analytics & Comparative Visual Charts** comparing water gauges against critical danger thresholds, land area and population risk distribution, and citizen depth distributions.

---

## 1. Geographic Coverage: All 33 Lucena City Barangays

Covering the complete **$80.21 \text{ km}^2$ ($8,021 \text{ ha}$)** land area and **$\sim 278,924$ citizens** of Lucena City:

### A. River Confluence & Coastal Estuary (Highest Inundation Risk)
- **Barangay Cotta** (`BRGY-COTTA`): $2.85 \text{ km}^2$ ($285 \text{ ha}$), pop: 21,603, elev: $3.2\text{m}$. Flood Risk Index: 96%. Status: **Emergency Inundation**.
- **Barangay Market View** (`BRGY-MKT-VIEW`): $1.82 \text{ km}^2$ ($182 \text{ ha}$), pop: 13,245, elev: $5.4\text{m}$. Flood Risk Index: 92%. Status: **Emergency Inundation**.
- **Barangay Dalahican** (`BRGY-DALAHICAN`): $5.12 \text{ km}^2$ ($512 \text{ ha}$), pop: 25,346, elev: $2.4\text{m}$. Flood Risk Index: 85%. Status: **Flood Warning**.
- **Barangay Barra** (`BRGY-BARRA`): $2.78 \text{ km}^2$ ($278 \text{ ha}$), pop: 6,812, elev: $2.1\text{m}$. Flood Risk Index: 79%. Status: **Flood Warning**.
- **Barangay Talao-Talao** (`BRGY-TALAO`): $2.45 \text{ km}^2$ ($245 \text{ ha}$), pop: 5,640, elev: $2.8\text{m}$. Flood Risk Index: 74%. Status: **Flood Warning**.
- **Barangay Salinas** (`BRGY-SALINAS`): $3.65 \text{ km}^2$ ($365 \text{ ha}$), pop: 4,120, elev: $3.5\text{m}$. Flood Risk Index: 52%. Status: **Flood Watch**.
- **Barangay Ransohan** (`BRGY-RANSOHAN`): $4.80 \text{ km}^2$ ($480 \text{ ha}$), pop: 4,890, elev: $3.0\text{m}$. Flood Risk Index: 58%. Status: **Flood Watch**.

### B. Central Urban Corridor & Highway Hub
- **Barangay Ibabang Dupay** (`BRGY-IB-DUPAY`): $5.24 \text{ km}^2$ ($524 \text{ ha}$), pop: 28,119, elev: $9.8\text{m}$. Flood Risk Index: 61%. Status: **Flood Watch**.
- **Barangay Ibabang Iyam** (`BRGY-IB-IYAM`): $3.58 \text{ km}^2$ ($358 \text{ ha}$), pop: 18,920, elev: $8.5\text{m}$. Flood Risk Index: 82%. Status: **Flood Warning**.
- **Barangay Ibabang Talim** (`BRGY-IB-TALIM`): $3.48 \text{ km}^2$ ($348 \text{ ha}$), pop: 4,980, elev: $14.2\text{m}$. Status: **Advisory**.

### C. Downtown Poblacion Core (Barangays 1 to 11)
- **Barangay 1 to 11 (Poblacion)**: Urban commercial and heritage district, each between $0.17\text{ km}^2$ and $0.24\text{ km}^2$, density up to $7,600/\text{km}^2$. Monitored for culvert saturation and curb-level pooling during cloudbursts.

### D. Western Sector (Mayao Cluster)
- **Mayao Crossing** ($3.42 \text{ km}^2$, Risk: 49%), **Mayao Castillo** ($3.12 \text{ km}^2$, Risk: 77%), **Mayao Kanluran** ($3.84 \text{ km}^2$, Risk: 25%), **Mayao Parada** ($3.25 \text{ km}^2$, Risk: 24%), **Mayao Silangan** ($3.55 \text{ km}^2$, Risk: 51%).

### E. Northern Upland Terrace
- **Gulang-Gulang** ($6.42 \text{ km}^2$, pop: 28,405, elev: $24.5\text{m}$), **Ilayang Dupay** ($3.82 \text{ km}^2$), **Ilayang Iyam** ($3.45 \text{ km}^2$), **Ilayang Talim** ($4.25 \text{ km}^2$), **Isabang** ($4.52 \text{ km}^2$), **Domoit** ($4.15 \text{ km}^2$), **Bocohan** ($3.22 \text{ km}^2$).

---

## 2. Interactive Heatmap & Intensity Visualization

- **Multi-Mode Map Controller**:
  - `Combined`: Renders polygon boundaries along with graduated intensity heat rings.
  - `Zones`: Choropleth polygon boundaries colored by severity tier.
  - `Heatmap`: Intensity gradient circles (Deep Crimson $\rightarrow$ Orange $\rightarrow$ Amber $\rightarrow$ Teal) highlighting flashpoints along rivermouths and coastal estuaries.
- **Land Area & Elevation In-Popup Tooltips**: Displays area in $\text{km}^2$ and hectares, elevation above sea level, census population, density, and flood risk index upon clicking any barangay.

---

## 3. Data Analytics & Visual Charts

The **Flood Analytics & Comparative Visual Charts** section (`FloodAnalyticsSection.tsx`) provides three interactive tabs:
1. **Water Gauges & Risk Tab**: Bar charts comparing current water levels (m) against danger thresholds (m) with rising/steady/falling trend icons and direct click-to-focus on the map.
2. **Area & Population Tab**: Segmented progress breakdown showing total hectares, square kilometers, and population under Extreme, Major, Moderate, and Advisory status.
3. **Citizen Ground Observations Tab**: Distribution of field reports by water depth (`Passable / Dry`, `Gutter-Deep`, `Knee-Deep`, `Waist-Deep`, `Submerged`) and listing top participatory barangays.

---

## 4. How to Run Locally

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
- 33 Barangays endpoint: `http://localhost:4000/api/v1/flood-zones`.

### 3. Start Frontend Web Portal
```powershell
npm run dev:web
```
- Open `http://localhost:3000` in your browser.
- Switch between **Combined**, **Zones**, and **Heatmap** modes.
- Search for any barangay (e.g. *Cotta*, *Dalahican*, *Gulang-Gulang*, *Market View*), view its land area and elevation, rate the alert accuracy, or post a localized street flood depth report.
