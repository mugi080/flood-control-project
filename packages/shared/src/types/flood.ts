/**
 * Flood Control MD - Shared Type Definitions
 * Complete Lucena City 33 Barangays Assessment, Citizen Crowd-Validation,
 * and Geospatial Heatmap & Analytics Data Models.
 */

export type SeverityLevel = 'minor' | 'moderate' | 'major' | 'extreme';

export type AlertStatus = 'advisory' | 'watch' | 'warning' | 'emergency';

export type WaterDepthLevel =
  | 'passable_dry'
  | 'gutter_deep' // ~0.2m - 0.3m
  | 'knee_deep' // ~0.5m
  | 'waist_deep' // ~1.0m
  | 'submerged'; // > 1.5m

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface WaterLevelMetric {
  currentMeters: number;
  thresholdMeters: number;
  trend: 'rising' | 'steady' | 'falling';
  lastUpdated: string;
}

export interface CommunityValidation {
  confirmCount: number;
  disputeCount: number;
  consensusPercentage: number;
  lastValidatedAt?: string;
}

export interface CommunityReport {
  id: string;
  zoneId: string;
  barangay: string;
  waterDepth: WaterDepthLevel;
  isPassableForVehicles: boolean;
  comment: string;
  reporterName?: string;
  landmark?: string;
  timestamp: string;
  upvotes: number;
}

export interface FloodZone {
  id: string;
  code: string;
  name: string;
  barangay: string;
  barangayNumber?: number;
  municipality: string;
  severity: SeverityLevel;
  status: AlertStatus;
  headline: string;
  description: string;
  recommendedAction: string;
  affectedPopulationEstimate: number; // Census 2020/2024 population
  areaSquareKm: number; // Official land area from City Population / PhilAtlas
  landAreaHectares: number; // Area in hectares (areaSquareKm * 100)
  populationDensity: number; // residents per km²
  elevationMeters: number; // Elevation above sea level
  floodRiskIndex: number; // 0 - 100 calculated vulnerability score
  floodHeatWeight: number; // 0.0 - 1.0 for heatmap visualization
  waterLevel: WaterLevelMetric;
  coordinates: [number, number][]; // Polygon boundary [lat, lng]
  center: [number, number]; // Centroid [lat, lng]
  issuedAt: string;
  expiresAt: string;
  isSimulated: true;
  communityValidation: CommunityValidation;
  recentReports: CommunityReport[];
}

export interface FloodAlertSummary {
  id: string;
  zoneId: string;
  zoneCode: string;
  zoneName: string;
  barangay: string;
  severity: SeverityLevel;
  status: AlertStatus;
  headline: string;
  affectedAreaDescription: string;
  areaSquareKm: number;
  landAreaHectares: number;
  populationDensity: number;
  floodRiskIndex: number;
  issuedAt: string;
  expiresAt: string;
  communityValidation: CommunityValidation;
  isSimulated: true;
}

export interface DemonstrationMunicipality {
  name: string;
  code: string;
  region: string;
  province: string;
  country: string;
  totalBarangays: number;
  totalLandAreaKm2: number;
  totalPopulation: number;
  center: [number, number];
  defaultZoom: number;
  emergencyDeskPhone: string;
  cdrmoDesk: string;
  officialPortalUrl: string;
  dataSourceUrl: string;
  isMockData: true;
  lastSimulatedUpdate: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
}

export interface MockDataResponse {
  municipality: DemonstrationMunicipality;
  zones: FloodZone[];
  alerts: FloodAlertSummary[];
  generatedAt: string;
  disclaimer: string;
}

export interface SubmitVotePayload {
  type: 'confirm' | 'dispute';
}

export interface SubmitReportPayload {
  waterDepth: WaterDepthLevel;
  isPassableForVehicles: boolean;
  comment: string;
  landmark?: string;
  reporterName?: string;
}

export interface CityAnalyticsSummary {
  totalMonitoredAreaKm2: number;
  totalPopulationAtRisk: number;
  averageConsensusPercentage: number;
  severityDistribution: {
    extreme: number;
    major: number;
    moderate: number;
    minor: number;
  };
  highestRiskBarangays: {
    barangay: string;
    riskIndex: number;
    severity: SeverityLevel;
    waterLevelRatio: number;
  }[];
  depthReportCounts: Record<WaterDepthLevel, number>;
}
