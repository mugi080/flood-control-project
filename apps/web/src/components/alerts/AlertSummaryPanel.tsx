'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import TerrainIcon from '@mui/icons-material/Terrain';
import { FloodZone, SeverityLevel } from '@flood-control/shared';
import { severityColorMap } from '../../theme/theme';
import { EmptyFilterState } from '../common/StateViews';
import { CitizenValidationWidget } from '../validation/CitizenValidationWidget';

interface AlertSummaryPanelProps {
  zones: FloodZone[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string | null) => void;
  selectedSeverity: SeverityLevel | 'all';
  onClearFilter: () => void;
  onRefreshData?: () => void;
  hoveredZoneId?: string | null;
  onHoverZone?: (zoneId: string | null) => void;
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return (
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      ' (' +
      d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ')'
    );
  } catch {
    return isoString;
  }
}

export function AlertSummaryPanel({
  zones,
  selectedZoneId,
  onSelectZone,
  selectedSeverity,
  onClearFilter,
  onRefreshData,
  hoveredZoneId,
  onHoverZone,
}: AlertSummaryPanelProps) {
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const displayedZones = React.useMemo(() => {
    if (!searchQuery.trim()) return zones;
    const q = searchQuery.toLowerCase().trim();
    return zones.filter(
      (z) =>
        z.barangay.toLowerCase().includes(q) ||
        z.name.toLowerCase().includes(q) ||
        z.code.toLowerCase().includes(q)
    );
  }, [zones, searchQuery]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Panel Header & Summary Count */}
      <Box sx={{ mb: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Lucena City 33 Barangays
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Official land area & population assessments
            </Typography>
          </Box>
          <Chip
            label={`${displayedZones.length} of ${zones.length}`}
            size="small"
            sx={{
              bgcolor: '#0B2545',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.72rem',
              height: 22,
            }}
          />
        </Stack>

        {/* Barangay Quick Search Filter */}
        <TextField
          size="small"
          fullWidth
          placeholder="Search by Barangay name (e.g. Cotta, Dalahican, Gulang)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.8rem' } }}
        />
      </Box>

      {/* Empty State if filter yields 0 */}
      {displayedZones.length === 0 ? (
        <EmptyFilterState
          message={
            searchQuery
              ? `No barangay found matching "${searchQuery}".`
              : `No active alerts found matching the "${selectedSeverity}" severity filter.`
          }
          onReset={() => {
            setSearchQuery('');
            onClearFilter();
          }}
        />
      ) : (
        <Stack spacing={2} sx={{ overflowY: 'auto', pr: 0.5, flexGrow: 1 }}>
          {displayedZones.map((zone) => {
            const isSelected = zone.id === selectedZoneId;
            const isHovered = zone.id === hoveredZoneId;
            const colors = severityColorMap[zone.severity];
            const val = zone.communityValidation;

            return (
              <Card
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                onMouseEnter={() => onHoverZone?.(zone.id)}
                onMouseLeave={() => onHoverZone?.(null)}
                sx={{
                  cursor: 'pointer',
                  border: '1.5px solid',
                  borderColor: isSelected
                    ? colors.main
                    : isHovered
                    ? colors.border
                    : 'rgba(15, 30, 46, 0.12)',
                  backgroundColor: isHovered && !isSelected ? `${colors.light}35` : '#FFFFFF',
                  boxShadow: isSelected
                    ? `0 4px 16px ${colors.main}25`
                    : isHovered
                    ? '0 4px 14px rgba(15, 30, 46, 0.12)'
                    : '0 1px 3px rgba(15, 30, 46, 0.06)',
                  transform: isHovered && !isSelected ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: colors.main,
                  },
                }}
              >
                {/* Left accent color bar */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 5,
                    bgcolor: colors.main,
                  }}
                />

                <CardContent sx={{ p: 2, pl: 2.5, '&:last-child': { pb: 2 } }}>
                  {/* Top Badges: Barangay & Severity */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
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

                    <Chip
                      icon={<VerifiedUserIcon sx={{ fontSize: '13px !important' }} />}
                      label={`${val.consensusPercentage}% Confirmed`}
                      size="small"
                      sx={{
                        fontSize: '0.65rem',
                        height: 20,
                        fontWeight: 700,
                        bgcolor: val.consensusPercentage >= 85 ? '#E8F5E9' : '#FFF3E0',
                        color: val.consensusPercentage >= 85 ? '#2E7D32' : '#E65100',
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    />
                  </Stack>

                  {/* Title & Headline */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3, mb: 0.5 }}>
                    {zone.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 1.5, lineHeight: 1.35 }}>
                    {zone.headline}
                  </Typography>

                  {/* Land Area and Demographics Strip */}
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 1.5,
                      bgcolor: '#F4F7FB',
                      border: '1px solid rgba(15, 30, 46, 0.06)',
                      mb: 1.5,
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
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              {zone.areaSquareKm} km² ({zone.landAreaHectares} ha)
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
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              ~{zone.affectedPopulationEstimate.toLocaleString()}
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
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              {zone.elevationMeters} m
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ pl: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}>
                            Density & Risk
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: colors.dark }}>
                            {zone.populationDensity.toLocaleString()}/km² ({zone.floodRiskIndex}%)
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Water Gauge Metric */}
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 1.5,
                      bgcolor: '#F8FAFC',
                      border: '1px solid rgba(15, 30, 46, 0.06)',
                      mb: 1.5,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Water Gauge
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.dark }}>
                            {zone.waterLevel.currentMeters.toFixed(2)} m
                          </Typography>
                          {zone.waterLevel.trend === 'rising' && <TrendingUpIcon sx={{ fontSize: 16, color: '#D32F2F' }} />}
                          {zone.waterLevel.trend === 'steady' && <TrendingFlatIcon sx={{ fontSize: 16, color: '#F57F17' }} />}
                          {zone.waterLevel.trend === 'falling' && <TrendingDownIcon sx={{ fontSize: 16, color: '#388E3C' }} />}
                        </Stack>
                      </Box>

                      <Divider orientation="vertical" flexItem />

                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Threshold Limit
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {zone.waterLevel.thresholdMeters.toFixed(2)} m
                        </Typography>
                      </Box>

                      <Divider orientation="vertical" flexItem />

                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Status
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
                          {zone.status}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Timestamps */}
                  <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                        Issued: {formatDate(zone.issuedAt)} &bull; Valid: {formatDate(zone.expiresAt)}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Recommended Action Box */}
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 1.5,
                      bgcolor: colors.light,
                      border: `1px solid ${colors.border}40`,
                    }}
                  >
                    <Stack direction="row" spacing={0.75} alignItems="flex-start">
                      <SecurityIcon sx={{ fontSize: 16, color: colors.dark, mt: 0.2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: colors.dark, display: 'block' }}>
                          CDRRMO Directive:
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#2C3E50', fontSize: '0.72rem', lineHeight: 1.3 }}>
                          {zone.recommendedAction}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Citizen Crowd-Validation & Reports (Visible when selected or toggled) */}
                  {isSelected && (
                    <Box onClick={(e) => e.stopPropagation()}>
                      <CitizenValidationWidget
                        zone={zone}
                        onZoneUpdated={() => onRefreshData && onRefreshData()}
                      />
                    </Box>
                  )}

                  {/* Action button */}
                  <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {zone.recentReports?.length || 0} Ground reports
                    </Typography>

                    <Button
                      size="small"
                      variant={isSelected ? 'contained' : 'outlined'}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectZone(isSelected ? null : zone.id);
                      }}
                      sx={{
                        fontSize: '0.72rem',
                        py: 0.4,
                        bgcolor: isSelected ? '#0B2545' : undefined,
                      }}
                    >
                      {isSelected ? 'Collapse Details' : 'Inspect Area & Rate Alert'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
