'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
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
import { FloodZone, DemonstrationMunicipality } from '@flood-control/shared';
import { severityColorMap } from '../../theme/theme';

import 'leaflet/dist/leaflet.css';

interface FloodMapProps {
  municipality: DemonstrationMunicipality;
  zones: FloodZone[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string | null) => void;
}

type MapDisplayMode = 'radius' | 'flags' | 'heatmap';

function MapViewController({
  selectedZone,
  defaultCenter,
  defaultZoom,
}: {
  selectedZone: FloodZone | undefined;
  defaultCenter: [number, number];
  defaultZoom: number;
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
  }, [selectedZone, defaultCenter, defaultZoom, map]);

  return null;
}

/**
 * Calculates a clean, non-colliding influence radius (in meters) for each barangay.
 * Dense Poblacion barangays (Brgy 1 - 11) receive 75m, leaving a clean buffer of 30m - 150m
 * between neighboring centers so their circular zones never collide or overlap.
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
  return 240; // Outlying rural barangays
}

/**
 * Creates a clean flagpole stick marker planted at the exact barangay coordinate.
 * Anchored by a ground base pin dot and shadow, rising with a vertical stick/pole,
 * finial ball, and swallowtail flag banner colored by severity.
 */
function createFlagMarkerIcon(zone: FloodZone, isSelected: boolean) {
  const colors = severityColorMap[zone.severity];
  const poleHeight = isSelected ? 42 : 34;
  const isExtreme = zone.severity === 'extreme';
  const isMajor = zone.severity === 'major';

  const label = zone.barangayNumber
    ? `B${zone.barangayNumber}`
    : zone.barangay.length > 8
    ? zone.barangay.substring(0, 7) + '…'
    : zone.barangay;

  const html = `
    <div class="custom-flag-marker ${isSelected ? 'is-selected' : ''}" style="
      position: relative;
      width: 90px;
      height: ${poleHeight + 10}px;
      cursor: pointer;
    ">
      <!-- Ground Shadow underneath anchor -->
      <div style="
        position: absolute;
        left: 10px;
        bottom: 0px;
        width: 14px;
        height: 5px;
        background: rgba(15, 23, 42, 0.35);
        border-radius: 50%;
        transform: translateX(-50%);
        filter: blur(1px);
      "></div>

      <!-- Ground Base Pulsing Ring for Active Alerts / Selected -->
      ${isExtreme || isSelected ? `
        <div style="
          position: absolute;
          left: 10px;
          bottom: 2px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid ${colors.main};
          transform: translate(-50%, 50%);
          animation: flagPulseRing 2s infinite ease-out;
          pointer-events: none;
        "></div>
      ` : ''}

      <!-- Ground Pin Anchor Dot (stick base planted directly on the coordinate) -->
      <div style="
        position: absolute;
        left: 10px;
        bottom: 1px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${colors.main};
        border: 2px solid #FFFFFF;
        box-shadow: 0 1px 3px rgba(0,0,0,0.5);
        transform: translateX(-50%);
        z-index: 2;
      "></div>

      <!-- The Vertical Flagpole Stick -->
      <div style="
        position: absolute;
        left: 10px;
        bottom: 4px;
        width: 2.5px;
        height: ${poleHeight}px;
        background: linear-gradient(180deg, #64748B 0%, #334155 45%, #0F172A 100%);
        transform: translateX(-50%);
        border-radius: 1px;
        box-shadow: 1px 1px 2px rgba(0,0,0,0.35);
        z-index: 1;
      ">
        <!-- Top Finial Ball -->
        <div style="
          position: absolute;
          top: -4px;
          left: 50%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${isSelected ? '#F59E0B' : '#E2E8F0'};
          border: 1px solid #1E293B;
          transform: translateX(-50%);
          box-shadow: 0 0 5px ${isSelected ? 'rgba(245, 158, 11, 0.9)' : 'rgba(0,0,0,0.3)'};
        "></div>

        <!-- Swallowtail Flag Banner Attached to Top of Stick -->
        <div style="
          position: absolute;
          top: 0px;
          left: 2px;
          background: linear-gradient(135deg, ${colors.main} 0%, ${colors.dark} 100%);
          color: #FFFFFF;
          height: ${isSelected ? 22 : 19}px;
          padding: 0 12px 0 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1.5px solid #FFFFFF;
          border-left: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          white-space: nowrap;
          z-index: 3;
          clip-path: polygon(0% 0%, 100% 0%, 88% 50%, 100% 100%, 0% 100%);
        ">
          <span style="
            font-size: 8px;
            opacity: 0.95;
            line-height: 1;
          ">${isExtreme ? '⚠' : isMajor ? '▲' : '●'}</span>
          <span style="
            font-size: ${isSelected ? '10.5px' : '9.5px'};
            font-weight: 800;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            letter-spacing: 0.2px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            line-height: 1;
          ">${label}</span>
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-flag-pin',
    iconSize: [90, poleHeight + 10],
    iconAnchor: [10, poleHeight + 5], // Bottom of the stick planted at coordinate
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
}: FloodMapProps) {
  const [displayMode, setDisplayMode] = React.useState<MapDisplayMode>('radius');

  const selectedZone = React.useMemo(
    () => zones.find((z) => z.id === selectedZoneId),
    [zones, selectedZoneId]
  );

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
        '& .custom-flag-marker': {
          transition: 'transform 0.15s ease',
        },
        '& .custom-flag-marker:hover': {
          zIndex: 1000,
          transform: 'scale(1.08)',
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
      {/* Floating Map Mode Toggle Controller */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1000,
          p: 0.5,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stack direction="row" spacing={0.5} alignItems="center">
          <AdjustIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 0.5 }} />
          <ButtonGroup size="small" variant="text">
            <Button
              onClick={() => setDisplayMode('radius')}
              variant={displayMode === 'radius' ? 'contained' : 'text'}
              startIcon={<AdjustIcon sx={{ fontSize: 13 }} />}
              sx={{
                fontSize: '0.7rem',
                py: 0.3,
                px: 1,
                bgcolor: displayMode === 'radius' ? '#0B2545' : undefined,
                color: displayMode === 'radius' ? '#FFFFFF' : 'inherit',
                '&:hover': { bgcolor: displayMode === 'radius' ? '#133966' : undefined },
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
                py: 0.3,
                px: 1,
                bgcolor: displayMode === 'flags' ? '#0B2545' : undefined,
                color: displayMode === 'flags' ? '#FFFFFF' : 'inherit',
                '&:hover': { bgcolor: displayMode === 'flags' ? '#133966' : undefined },
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
                py: 0.3,
                px: 1,
                bgcolor: displayMode === 'heatmap' ? '#D32F2F' : undefined,
                color: displayMode === 'heatmap' ? '#FFFFFF' : '#D32F2F',
                '&:hover': { bgcolor: displayMode === 'heatmap' ? '#B71C1C' : undefined },
              }}
            >
              Heatmap
            </Button>
          </ButtonGroup>
        </Stack>
      </Paper>

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
        />

        {zones.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
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
                      color: isSelected ? '#0B2545' : colors.border,
                      weight: isSelected ? 2.5 : 1.5,
                      fillColor: colors.main,
                      fillOpacity: isSelected
                        ? 0.38
                        : zone.severity === 'extreme'
                        ? 0.28
                        : 0.18,
                      dashArray: isSelected
                        ? undefined
                        : zone.severity === 'minor'
                        ? '4 3'
                        : undefined,
                    }}
                    eventHandlers={{
                      click: () => onSelectZone(zone.id),
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
                      fillOpacity: isSelected ? 0.65 : 0.45,
                    }}
                    eventHandlers={{
                      click: () => onSelectZone(zone.id),
                    }}
                  />
                </>
              )}

              {/* 3. Flagstick Marker Planted at Barangay Centroid */}
              <Marker
                position={zone.center}
                icon={createFlagMarkerIcon(zone, isSelected)}
                eventHandlers={{
                  click: () => onSelectZone(zone.id),
                }}
              >
                <Popup minWidth={280} maxWidth={340}>
                  <Box sx={{ p: 0.5 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
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

                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.25, mb: 0.5 }}>
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
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}>
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
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}>
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
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}>
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
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}>
                              Risk Index
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.dark }}>
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
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#2E7D32', fontSize: '0.72rem' }}>
                          {val.consensusPercentage}% Citizen Consensus ({val.confirmCount} agree, {val.disputeCount} dispute)
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Water Level Gauge */}
                    <Box sx={{ bgcolor: '#F4F7FB', p: 1.25, borderRadius: 1.5, mb: 1.5 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
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
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>
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
                      <Typography variant="caption" sx={{ fontSize: '0.68rem', color: 'text.secondary', mt: 0.5, display: 'block' }}>
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
