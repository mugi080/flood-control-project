'use client';

import * as React from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FlagIcon from '@mui/icons-material/Flag';
import AdjustIcon from '@mui/icons-material/Adjust';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import TerrainIcon from '@mui/icons-material/Terrain';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { FloodZone, DemonstrationMunicipality } from '@flood-control/shared';
import { severityColorMap } from '../../theme/theme';
import { BarangaySearch } from '../common/BarangaySearch';
import { getBarangayName } from '../../data/lucenaBarangays';

import 'leaflet/dist/leaflet.css';

interface FloodMapProps {
  municipality: DemonstrationMunicipality;
  zones: FloodZone[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string | null) => void;
  hoveredZoneId?: string | null;
  onHoverZone?: (zoneId: string | null) => void;
}

type MapDisplayMode = 'radius' | 'flags' | 'heatmap';

function MapViewController({
  selectedZone,
  defaultCenter,
  defaultZoom,
  resetCount,
}: {
  selectedZone: FloodZone | undefined;
  defaultCenter: [number, number];
  defaultZoom: number;
  resetCount: number;
}) {
  const map = useMap();

  React.useEffect(() => {
    if (selectedZone) {
      map.flyTo(selectedZone.center, 14, {
        duration: 1.2,
      });
    } else {
      map.flyTo(defaultCenter, defaultZoom, {
        duration: 1.0,
      });
    }
  }, [selectedZone, defaultCenter, defaultZoom, resetCount, map]);

  return null;
}

/**
 * Flag label: just the barangay name, no "Brgy"/"Barangay" prefix.
 * Poblacion barangays show their number only.
 */
function getFlagLabel(zone: FloodZone): string {
  return zone.barangayNumber ? `${zone.barangayNumber}` : zone.barangay;
}

/**
 * Calculates a clean, non-colliding influence radius (in meters) for each barangay.
 * Dense Poblacion core (Brgy 1 - 11) receives 75m, leaving a clean buffer of 30m - 150m
 * between neighboring centers so their circular zones never collide.
 */
function getZoneInfluenceRadius(zone: FloodZone): number {
  if (zone.barangayNumber || zone.areaSquareKm <= 0.25) {
    return 75; // Downtown Poblacion core
  }
  if (zone.areaSquareKm <= 0.60) {
    return 110;
  }
  if (zone.areaSquareKm <= 2.0) {
    return 160;
  }
  if (zone.areaSquareKm <= 4.0) {
    return 200;
  }
  return 240; // Outlying municipal barangays
}

/**
 * Creates an architectural flagpole marker.
 * The flag is static and shows only the barangay name.
 */
function createFlagMarkerIcon(zone: FloodZone, isSelected: boolean) {
  const colors = severityColorMap[zone.severity];
  const poleHeight = isSelected ? 44 : 34;
  const isExtreme = zone.severity === 'extreme';
  const label = getFlagLabel(zone);

  const statusDotColor =
    zone.severity === 'extreme'
      ? '#EF4444'
      : zone.severity === 'major'
      ? '#F97316'
      : zone.severity === 'moderate'
      ? '#FBBF24'
      : '#38BDF8';

  const html = `
    <div class="custom-flag-marker ${isSelected ? 'is-selected' : ''}" style="
      position: relative;
      width: 280px;
      height: ${poleHeight + 12}px;
      cursor: pointer;
      pointer-events: none;
    ">
      <!-- Ground Shadow underneath benchmark pin -->
      <div style="
        position: absolute;
        left: 12px;
        bottom: 0px;
        width: 16px;
        height: 6px;
        background: rgba(15, 23, 42, 0.35);
        border-radius: 50%;
        transform: translateX(-50%);
        filter: blur(1.5px);
        pointer-events: none;
      "></div>

      <!-- Ground Base Pulsing Sonar Ring for Active Alerts or Focus -->
      ${isExtreme || isSelected ? `
        <div style="
          position: absolute;
          left: 12px;
          bottom: 2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid ${colors.main};
          transform: translate(-50%, 50%);
          animation: flagPulseRing 2s infinite ease-out;
          pointer-events: none;
        "></div>
      ` : ''}

      <!-- Precision Survey Ground Benchmark Reticle -->
      <div style="
        position: absolute;
        left: 12px;
        bottom: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px dashed rgba(255, 255, 255, 0.85);
        transform: translate(-50%, 50%);
        box-shadow: 0 0 3px rgba(0,0,0,0.4);
        pointer-events: none;
      "></div>

      <!-- Solid Benchmark Ground Dot -->
      <div style="
        position: absolute;
        left: 12px;
        bottom: 1px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${colors.main};
        border: 2px solid #FFFFFF;
        box-shadow: 0 1px 4px rgba(0,0,0,0.6);
        transform: translateX(-50%);
        z-index: 2;
        pointer-events: auto;
      "></div>

      <!-- The Vertical Flagpole Stick (Brushed Steel Mast) -->
      <div style="
        position: absolute;
        left: 12px;
        bottom: 4px;
        width: 2.5px;
        height: ${poleHeight}px;
        background: linear-gradient(180deg, #94A3B8 0%, #475569 40%, #1E293B 100%);
        transform: translateX(-50%);
        border-radius: 1px;
        box-shadow: 1px 1px 3px rgba(0,0,0,0.4);
        z-index: 1;
        pointer-events: auto;
      ">
        <!-- Top Milled Brass Finial Ball -->
        <div style="
          position: absolute;
          top: -4px;
          left: 50%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${isSelected ? 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)' : '#CBD5E1'};
          border: 1px solid #1E293B;
          transform: translateX(-50%);
          box-shadow: 0 0 6px ${isSelected ? 'rgba(245, 158, 11, 0.9)' : 'rgba(0,0,0,0.3)'};
        "></div>

        <!-- Municipal Swallowtail Flag Placard (static, shows barangay name only) -->
        <div class="flag-banner-placard" style="
          position: absolute;
          top: 0px;
          left: 2px;
          background: linear-gradient(135deg, ${colors.main} 0%, ${colors.dark} 100%);
          color: #FFFFFF;
          height: ${isSelected ? 22 : 19}px;
          padding: 0 12px 0 6px;
          display: flex;
          align-items: center;
          gap: 5px;
          border: 1.5px solid #FFFFFF;
          border-left: none;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
          white-space: nowrap;
          z-index: 3;
          clip-path: polygon(0% 0%, 100% 0%, calc(100% - 7px) 50%, 100% 100%, 0% 100%);
          pointer-events: auto;
        ">
          <!-- Status pip -->
          <span style="
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: ${statusDotColor};
            box-shadow: 0 0 4px ${statusDotColor};
            display: inline-block;
            flex-shrink: 0;
          "></span>
          <span style="
            font-size: ${isSelected ? '10.5px' : '9.5px'};
            font-weight: 800;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            letter-spacing: 0.25px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.6);
            line-height: 1;
          ">${label}</span>
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-flag-pin',
    iconSize: [280, poleHeight + 12],
    iconAnchor: [12, poleHeight + 5], // Pinned precisely at base anchor dot
    popupAnchor: [24, -(poleHeight + 6)],
  });
}

function getHeatColor(weight: number): string {
  if (weight >= 0.85) return '#D32F2F'; // Dark Red / Extreme
  if (weight >= 0.70) return '#E65100'; // Orange / Major
  if (weight >= 0.45) return '#F57F17'; // Amber / Moderate
  return '#0288D1'; // Blue / Minor
}

export function FloodMap({
  municipality,
  zones,
  selectedZoneId,
  onSelectZone,
  hoveredZoneId: externalHoveredId,
  onHoverZone,
}: FloodMapProps) {
  const [displayMode, setDisplayMode] = React.useState<MapDisplayMode>('radius');
  const [internalHoveredId, setInternalHoveredId] = React.useState<string | null>(null);
  const [resetCount, setResetCount] = React.useState<number>(0);

  const activeHoveredId = externalHoveredId ?? internalHoveredId;

  const handleHover = React.useCallback(
    (id: string | null) => {
      setInternalHoveredId(id);
      onHoverZone?.(id);
    },
    [onHoverZone]
  );

  const selectedZone = React.useMemo(
    () => zones.find((z) => z.id === selectedZoneId),
    [zones, selectedZoneId]
  );

  const handleResetView = React.useCallback(() => {
    onSelectZone(null);
    setResetCount((prev) => prev + 1);
  }, [onSelectZone]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: { xs: 460, md: 580 },
        position: 'relative',
        borderRadius: 2.5,
        overflow: 'hidden',
        border: '1px solid rgba(15, 30, 46, 0.12)',
        boxShadow: '0 2px 10px rgba(11, 37, 69, 0.08)',
        '& .leaflet-container': {
          width: '100%',
          height: '100%',
          minHeight: { xs: 460, md: 580 },
          fontFamily: 'inherit',
          zIndex: 1,
        },
        '& .custom-flag-pin': {
          background: 'transparent',
          border: 'none',
        },
        '@keyframes flagPulseRing': {
          '0%': {
            transform: 'translate(-50%, 50%) scale(0.5)',
            opacity: 0.9,
          },
          '100%': {
            transform: 'translate(-50%, 50%) scale(2.2)',
            opacity: 0,
          },
        },
      }}
    >
      {/* Top Floating Command Bar: Telemetry + Futuristic Autocomplete Search + Reset + Modes */}
      <Paper
        elevation={4}
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          zIndex: 1000,
          p: 0.75,
          borderRadius: 2.5,
          bgcolor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(11, 37, 69, 0.12)',
          boxShadow: '0 8px 32px rgba(11, 37, 69, 0.12)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        {/* Left Side: Live Telemetry Indicator & Futuristic Barangay Search Autocomplete */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.75,
              px: 1.25,
              py: 0.6,
              borderRadius: 2,
              bgcolor: 'rgba(15, 23, 42, 0.05)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: '#16A34A',
                boxShadow: '0 0 8px #16A34A',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                fontSize: '0.68rem',
                color: '#0F172A',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              CDRRMO Telemetry
            </Typography>
          </Box>

          {/* Barangay search: names only */}
          <BarangaySearch
            value={selectedZone ? getBarangayName(selectedZone) : null}
            onChange={(name) => {
              const zone = name ? zones.find((z) => getBarangayName(z) === name) : null;
              onSelectZone(zone ? zone.id : null);
            }}
            sx={{ flexGrow: 1, maxWidth: { xs: '100%', sm: 300 } }}
          />
        </Stack>

        {/* Right Side: Re-center / Reset Button + Segmented Display Mode Buttons */}
        <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="flex-end">
          <Tooltip title="Reset to Full Lucena City Overview" arrow>
            <IconButton
              size="small"
              onClick={handleResetView}
              sx={{
                border: '1px solid rgba(11, 37, 69, 0.14)',
                borderRadius: 2,
                p: 0.65,
                color: '#0F172A',
                bgcolor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#F1F5F9',
                  borderColor: '#0288D1',
                },
              }}
            >
              <CenterFocusStrongIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          <ButtonGroup
            size="small"
            variant="text"
            sx={{ bgcolor: '#F1F5F9', borderRadius: 2, p: 0.25 }}
          >
            <Button
              onClick={() => setDisplayMode('radius')}
              variant={displayMode === 'radius' ? 'contained' : 'text'}
              startIcon={<AdjustIcon sx={{ fontSize: 13 }} />}
              sx={{
                fontSize: '0.7rem',
                py: 0.4,
                px: 1.1,
                bgcolor: displayMode === 'radius' ? '#0B2545' : undefined,
                color: displayMode === 'radius' ? '#FFFFFF' : '#334155',
                fontWeight: 700,
                borderRadius: '7px !important',
                boxShadow: displayMode === 'radius' ? '0 2px 6px rgba(11, 37, 69, 0.2)' : 'none',
                '&:hover': { bgcolor: displayMode === 'radius' ? '#133966' : '#E2E8F0' },
              }}
            >
              Radii & Flags
            </Button>
            <Button
              onClick={() => setDisplayMode('flags')}
              variant={displayMode === 'flags' ? 'contained' : 'text'}
              startIcon={<FlagIcon sx={{ fontSize: 13 }} />}
              sx={{
                fontSize: '0.7rem',
                py: 0.4,
                px: 1.1,
                bgcolor: displayMode === 'flags' ? '#0B2545' : undefined,
                color: displayMode === 'flags' ? '#FFFFFF' : '#334155',
                fontWeight: 700,
                borderRadius: '7px !important',
                boxShadow: displayMode === 'flags' ? '0 2px 6px rgba(11, 37, 69, 0.2)' : 'none',
                '&:hover': { bgcolor: displayMode === 'flags' ? '#133966' : '#E2E8F0' },
              }}
            >
              Flags Only
            </Button>
            <Button
              onClick={() => setDisplayMode('heatmap')}
              variant={displayMode === 'heatmap' ? 'contained' : 'text'}
              startIcon={<WhatshotIcon sx={{ fontSize: 13 }} />}
              sx={{
                fontSize: '0.7rem',
                py: 0.4,
                px: 1.1,
                bgcolor: displayMode === 'heatmap' ? '#DC2626' : undefined,
                color: displayMode === 'heatmap' ? '#FFFFFF' : '#DC2626',
                fontWeight: 700,
                borderRadius: '7px !important',
                boxShadow: displayMode === 'heatmap' ? '0 2px 6px rgba(220, 38, 38, 0.25)' : 'none',
                '&:hover': { bgcolor: displayMode === 'heatmap' ? '#B91C1C' : '#FEE2E2' },
              }}
            >
              Heatmap
            </Button>
          </ButtonGroup>
        </Stack>
      </Paper>

      {/* Bottom GIS Scale & Dynamic Grid Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 1000,
          bgcolor: 'rgba(15, 23, 42, 0.88)',
          color: '#FFFFFF',
          px: 1.25,
          py: 0.5,
          borderRadius: 2,
          backdropFilter: 'blur(6px)',
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          gap: 1,
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        <Typography variant="caption" sx={{ fontSize: '0.66rem', fontWeight: 600, letterSpacing: '0.02em' }}>
          Dynamic Grid: 75m Poblacion Buffer &bull; 160m Riverfront &bull; Zero Collision
        </Typography>
      </Box>

      <MapContainer
        center={municipality.center}
        zoom={municipality.defaultZoom}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &bull; Lucena City 33 Barangays'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        <MapViewController
          selectedZone={selectedZone}
          defaultCenter={municipality.center}
          defaultZoom={municipality.defaultZoom}
          resetCount={resetCount}
        />

        {zones.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
          const isHovered = zone.id === activeHoveredId;
          const colors = severityColorMap[zone.severity];
          const val = zone.communityValidation;
          const waterLevelRatio = Math.min(
            (zone.waterLevel.currentMeters / (zone.waterLevel.thresholdMeters * 1.5)) * 100,
            100
          );
          const isAboveThreshold =
            zone.waterLevel.currentMeters >= zone.waterLevel.thresholdMeters;
          const heatColor = getHeatColor(zone.floodHeatWeight);
          const radiusMeters = getZoneInfluenceRadius(zone);

          return (
            <React.Fragment key={zone.id}>
              {/* 1. Heatmap Thermal Glow (Only in heatmap mode) */}
              {displayMode === 'heatmap' && (
                <Circle
                  center={zone.center}
                  radius={radiusMeters * 1.6}
                  pathOptions={{
                    color: 'transparent',
                    fillColor: heatColor,
                    fillOpacity: zone.floodHeatWeight * 0.35,
                  }}
                />
              )}

              {/* 2. Non-Colliding Circular Flood Influence Radius */}
              {(displayMode === 'radius' || displayMode === 'heatmap') && (
                <>
                  {/* Outer alert influence circle */}
                  <Circle
                    center={zone.center}
                    radius={radiusMeters}
                    pathOptions={{
                      color: isSelected ? '#0B2545' : isHovered ? colors.dark : colors.border,
                      weight: isSelected ? 3 : isHovered ? 2.5 : 1.5,
                      fillColor: colors.main,
                      fillOpacity: isSelected
                        ? 0.40
                        : isHovered
                        ? 0.32
                        : zone.severity === 'extreme'
                        ? 0.26
                        : 0.18,
                      dashArray: isSelected
                        ? undefined
                        : zone.severity === 'minor'
                        ? '4 3'
                        : undefined,
                    }}
                    eventHandlers={{
                      click: () => onSelectZone(zone.id),
                      mouseover: () => handleHover(zone.id),
                      mouseout: () => handleHover(null),
                    }}
                  />

                  {/* Concentric core epicenter dot */}
                  <Circle
                    center={zone.center}
                    radius={Math.max(Math.round(radiusMeters * 0.32), 22)}
                    pathOptions={{
                      color: colors.main,
                      weight: 1,
                      fillColor: colors.main,
                      fillOpacity: isSelected ? 0.65 : isHovered ? 0.55 : 0.45,
                    }}
                    eventHandlers={{
                      click: () => onSelectZone(zone.id),
                      mouseover: () => handleHover(zone.id),
                      mouseout: () => handleHover(null),
                    }}
                  />
                </>
              )}

              {/* 3. Flagstick Marker: static, shows barangay name only */}
              <Marker
                position={zone.center}
                icon={createFlagMarkerIcon(zone, isSelected)}
                eventHandlers={{
                  click: () => onSelectZone(zone.id),
                }}
              >
                {/* Full Inspection Popup on Click */}
                <Popup minWidth={280} maxWidth={340}>
                  <Box sx={{ p: 0.5 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 1 }}
                    >
                      <Chip
                        label={`Brgy. ${zone.barangay}`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          height: 22,
                          bgcolor: colors.main,
                          color: '#FFFFFF',
                        }}
                      />
                      <Chip
                        label={zone.severity.toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 20,
                          bgcolor: colors.light,
                          color: colors.dark,
                          border: `1px solid ${colors.border}`,
                        }}
                      />
                    </Stack>

                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, lineHeight: 1.25, mb: 0.5 }}
                    >
                      {zone.name}
                    </Typography>

                    {/* Official Land Area & Demographic Data */}
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: 1.5,
                        bgcolor: '#F8FAFC',
                        border: '1px solid rgba(0,0,0,0.06)',
                        mb: 1.25,
                      }}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <SquareFootIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}
                              >
                                Land Area
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                                {zone.areaSquareKm} km² ({zone.landAreaHectares} ha)
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>

                        <Grid item xs={6}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <TerrainIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}
                              >
                                Elevation
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                                {zone.elevationMeters} m above sea
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>

                        <Grid item xs={6}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <PeopleOutlineIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}
                              >
                                Population
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                                ~{zone.affectedPopulationEstimate.toLocaleString()}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>

                        <Grid item xs={6}>
                          <Box sx={{ pl: 0.5 }}>
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}
                            >
                              Risk Index
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.dark }}
                            >
                              {zone.floodRiskIndex}% ({zone.status})
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Community Validation pill */}
                    <Box sx={{ mb: 1.25 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <VerifiedUserIcon sx={{ fontSize: 14, color: '#2E7D32' }} />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: '#2E7D32', fontSize: '0.72rem' }}
                        >
                          {val.consensusPercentage}% Citizen Consensus ({val.confirmCount} agree,{' '}
                          {val.disputeCount} dispute)
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Water Level Gauge */}
                    <Box sx={{ bgcolor: '#F4F7FB', p: 1.25, borderRadius: 1.5, mb: 1.5 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mb: 0.5 }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Water Gauge: {zone.waterLevel.currentMeters.toFixed(2)} m
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.25}>
                          {zone.waterLevel.trend === 'rising' && (
                            <TrendingUpIcon sx={{ fontSize: 15, color: '#D32F2F' }} />
                          )}
                          {zone.waterLevel.trend === 'steady' && (
                            <TrendingFlatIcon sx={{ fontSize: 15, color: '#F57F17' }} />
                          )}
                          {zone.waterLevel.trend === 'falling' && (
                            <TrendingDownIcon sx={{ fontSize: 15, color: '#388E3C' }} />
                          )}
                          <Typography
                            variant="caption"
                            sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                          >
                            {zone.waterLevel.trend}
                          </Typography>
                        </Stack>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={waterLevelRatio}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#CFD8DC',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: isAboveThreshold ? colors.main : '#0288D1',
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.68rem',
                          color: 'text.secondary',
                          mt: 0.5,
                          display: 'block',
                        }}
                      >
                        Threshold limit: {zone.waterLevel.thresholdMeters.toFixed(2)} m
                      </Typography>
                    </Box>

                    <Button
                      variant={isSelected ? 'contained' : 'outlined'}
                      size="small"
                      fullWidth
                      startIcon={<RateReviewIcon sx={{ fontSize: 14 }} />}
                      onClick={() => onSelectZone(zone.id)}
                      sx={{
                        fontSize: '0.72rem',
                        py: 0.5,
                        textTransform: 'none',
                        bgcolor: isSelected ? '#0B2545' : undefined,
                      }}
                    >
                      {isSelected ? 'View Citizen Validation' : 'Inspect Area & Rate Alert'}
                    </Button>
                  </Box>
                </Popup>
              </Marker> 
            </React.Fragment>
          );
        })}
      </MapContainer>
    </Box>
  );
}