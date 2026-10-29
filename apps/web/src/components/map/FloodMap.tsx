'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Polygon, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
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
import LayersIcon from '@mui/icons-material/Layers';
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

type MapDisplayMode = 'combined' | 'zones' | 'heatmap';

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

function createZoneMarkerIcon(zone: FloodZone, isSelected: boolean) {
  const colors = severityColorMap[zone.severity];
  const size = isSelected ? 42 : 32;
  const label = zone.barangayNumber
    ? `B${zone.barangayNumber}`
    : zone.barangay.substring(0, 4).toUpperCase();

  const html = `
    <div style="
      background-color: ${colors.main};
      color: #FFFFFF;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid #FFFFFF;
      box-shadow: 0 3px 8px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    ">
      <span style="
        transform: rotate(45deg);
        font-size: ${isSelected ? '10px' : '9px'};
        font-weight: 800;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        line-height: 1;
      ">${label}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-flood-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
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
  const [displayMode, setDisplayMode] = React.useState<MapDisplayMode>('combined');

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
        '& .custom-flood-pin': {
          background: 'transparent',
          border: 'none',
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
          <LayersIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 0.5 }} />
          <ButtonGroup size="small" variant="text">
            <Button
              onClick={() => setDisplayMode('combined')}
              variant={displayMode === 'combined' ? 'contained' : 'text'}
              sx={{
                fontSize: '0.7rem',
                py: 0.3,
                px: 1,
                bgcolor: displayMode === 'combined' ? '#0B2545' : undefined,
              }}
            >
              Combined
            </Button>
            <Button
              onClick={() => setDisplayMode('zones')}
              variant={displayMode === 'zones' ? 'contained' : 'text'}
              sx={{
                fontSize: '0.7rem',
                py: 0.3,
                px: 1,
                bgcolor: displayMode === 'zones' ? '#0B2545' : undefined,
              }}
            >
              Zones
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

          return (
            <React.Fragment key={zone.id}>
              {/* 1. Heatmap Intensity Circles */}
              {(displayMode === 'heatmap' || displayMode === 'combined') && (
                <>
                  {/* Outer gradient blur ring */}
                  <Circle
                    center={zone.center}
                    radius={Math.max(zone.areaSquareKm * 280, 450)}
                    pathOptions={{
                      color: 'transparent',
                      fillColor: heatColor,
                      fillOpacity: displayMode === 'heatmap' ? zone.floodHeatWeight * 0.45 : zone.floodHeatWeight * 0.28,
                    }}
                  />
                  {/* Inner intense core */}
                  <Circle
                    center={zone.center}
                    radius={Math.max(zone.areaSquareKm * 140, 200)}
                    pathOptions={{
                      color: heatColor,
                      weight: 1,
                      fillColor: heatColor,
                      fillOpacity: displayMode === 'heatmap' ? zone.floodHeatWeight * 0.65 : zone.floodHeatWeight * 0.4,
                    }}
                  />
                </>
              )}

              {/* 2. Polygon Boundary Zones */}
              {(displayMode === 'zones' || displayMode === 'combined') && (
                <Polygon
                  positions={zone.coordinates}
                  pathOptions={{
                    color: colors.border,
                    fillColor: colors.main,
                    fillOpacity: isSelected
                      ? 0.65
                      : displayMode === 'combined'
                      ? colors.fillOpacity * 0.75
                      : colors.fillOpacity,
                    weight: isSelected ? 3.5 : 2,
                    dashArray: isSelected ? undefined : '3 3',
                  }}
                  eventHandlers={{
                    click: () => onSelectZone(zone.id),
                  }}
                />
              )}

              {/* 3. Centroid Marker */}
              <Marker
                position={zone.center}
                icon={createZoneMarkerIcon(zone, isSelected)}
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
