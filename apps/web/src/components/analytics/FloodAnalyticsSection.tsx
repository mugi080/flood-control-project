'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FloodZone, SeverityLevel, WaterDepthLevel } from '@flood-control/shared';
import { severityColorMap } from '../../theme/theme';

interface FloodAnalyticsSectionProps {
  zones: FloodZone[];
  onSelectZone: (zoneId: string) => void;
  selectedZoneId: string | null;
}

export function FloodAnalyticsSection({
  zones,
  onSelectZone,
  selectedZoneId,
}: FloodAnalyticsSectionProps) {
  const [activeTab, setActiveTab] = React.useState<number>(0);

  // Compute metrics
  const totalArea = React.useMemo(
    () => zones.reduce((acc, z) => acc + z.areaSquareKm, 0),
    [zones]
  );
  const totalPop = React.useMemo(
    () => zones.reduce((acc, z) => acc + z.affectedPopulationEstimate, 0),
    [zones]
  );

  // Severity breakdowns
  const severityBreakdown = React.useMemo(() => {
    const res: Record<SeverityLevel, { count: number; pop: number; area: number }> = {
      extreme: { count: 0, pop: 0, area: 0 },
      major: { count: 0, pop: 0, area: 0 },
      moderate: { count: 0, pop: 0, area: 0 },
      minor: { count: 0, pop: 0, area: 0 },
    };
    for (const z of zones) {
      if (res[z.severity]) {
        res[z.severity].count += 1;
        res[z.severity].pop += z.affectedPopulationEstimate;
        res[z.severity].area += z.areaSquareKm;
      }
    }
    return res;
  }, [zones]);

  // Citizen ground report depth counts
  const depthCounts = React.useMemo(() => {
    const counts: Record<WaterDepthLevel, number> = {
      passable_dry: 0,
      gutter_deep: 0,
      knee_deep: 0,
      waist_deep: 0,
      submerged: 0,
    };
    for (const z of zones) {
      for (const rep of z.recentReports || []) {
        if (counts[rep.waterDepth] !== undefined) {
          counts[rep.waterDepth] += 1;
        }
      }
    }
    return counts;
  }, [zones]);

  // Sorted by Risk Index (Highest to lowest)
  const topRiskZones = React.useMemo(() => {
    return [...zones].sort((a, b) => b.floodRiskIndex - a.floodRiskIndex);
  }, [zones]);

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 2.5,
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(15, 30, 46, 0.08)',
        mb: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: 2.5 } }}>
        {/* Header & Tabs */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AssessmentIcon sx={{ color: '#0B2545', fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                Lucena City Flood Analytics & Comparative Insights
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Cross-barangay comparative water telemetry, land area distributions, and ground consensus
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 38,
              '& .MuiTab-root': {
                minHeight: 38,
                fontSize: '0.78rem',
                fontWeight: 600,
                textTransform: 'none',
                py: 0.5,
                px: 1.5,
              },
            }}
          >
            <Tab icon={<BarChartIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Water Gauges & Risk" />
            <Tab icon={<PieChartIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Area & Population" />
            <Tab icon={<VerifiedUserIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Citizen Ground Observations" />
          </Tabs>
        </Stack>

        {/* TAB 0: Water Level vs Threshold Chart */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
              Top Vulnerable Barangays: Current Gauge Level (m) vs Danger Threshold (m)
            </Typography>

            <Grid container spacing={1.5}>
              {topRiskZones.slice(0, 10).map((zone) => {
                const colors = severityColorMap[zone.severity];
                const isSelected = zone.id === selectedZoneId;
                const ratio = Math.min((zone.waterLevel.currentMeters / zone.waterLevel.thresholdMeters) * 100, 150);
                const isOverThreshold = zone.waterLevel.currentMeters >= zone.waterLevel.thresholdMeters;

                return (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={zone.id}>
                    <Box
                      onClick={() => onSelectZone(zone.id)}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: '1.5px solid',
                        borderColor: isSelected ? colors.main : 'rgba(0,0,0,0.08)',
                        bgcolor: isSelected ? '#F0F7FF' : '#FAFCFE',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          borderColor: colors.main,
                          bgcolor: '#F4F9FF',
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            {zone.barangay}
                          </Typography>
                          <Chip
                            label={`Risk ${zone.floodRiskIndex}%`}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              bgcolor: colors.light,
                              color: colors.dark,
                            }}
                          />
                        </Stack>

                        <Stack direction="row" spacing={0.3} alignItems="center">
                          {zone.waterLevel.trend === 'rising' && <TrendingUpIcon sx={{ fontSize: 15, color: '#D32F2F' }} />}
                          {zone.waterLevel.trend === 'steady' && <TrendingFlatIcon sx={{ fontSize: 15, color: '#F57F17' }} />}
                          {zone.waterLevel.trend === 'falling' && <TrendingDownIcon sx={{ fontSize: 15, color: '#388E3C' }} />}
                          <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'capitalize' }}>
                            {zone.waterLevel.trend}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Gauge Bar */}
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.25 }}>
                        <Typography variant="caption" sx={{ color: colors.dark, fontWeight: 700, fontSize: '0.75rem' }}>
                          Current: {zone.waterLevel.currentMeters.toFixed(2)} m
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                          Threshold: {zone.waterLevel.thresholdMeters.toFixed(2)} m
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={Math.min(ratio, 100)}
                        sx={{
                          height: 7,
                          borderRadius: 4,
                          bgcolor: '#E0E7ED',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: isOverThreshold ? colors.main : '#0288D1',
                          },
                        }}
                      />

                      <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.68rem', color: 'text.secondary' }}>
                          Area: <strong>{zone.areaSquareKm} km²</strong> ({zone.landAreaHectares} ha)
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.68rem', color: 'text.secondary' }}>
                          Elev: <strong>{zone.elevationMeters}m</strong>
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* TAB 1: Area and Population Breakdown */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.85rem' }}>
              Lucena City Total Land Area ({totalArea.toFixed(1)} km²) & Population (~{totalPop.toLocaleString()} Citizens)
            </Typography>

            <Grid container spacing={2}>
              {(['extreme', 'major', 'moderate', 'minor'] as SeverityLevel[]).map((sev) => {
                const item = severityBreakdown[sev];
                const colors = severityColorMap[sev];
                const areaPct = totalArea > 0 ? Math.round((item.area / totalArea) * 100) : 0;
                const popPct = totalPop > 0 ? Math.round((item.pop / totalPop) * 100) : 0;

                return (
                  <Grid item xs={12} sm={6} md={3} key={sev}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 1.75,
                        borderRadius: 2,
                        borderLeft: `5px solid ${colors.main}`,
                        bgcolor: '#FFFFFF',
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', color: colors.dark }}>
                          {sev}
                        </Typography>
                        <Chip
                          label={`${item.count} Barangays`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            bgcolor: colors.light,
                            color: colors.dark,
                          }}
                        />
                      </Stack>

                      {/* Area metric */}
                      <Box sx={{ mb: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.3 }}>
                          <Typography variant="caption" color="text.secondary">
                            Land Area
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {item.area.toFixed(1)} km² ({areaPct}%)
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={areaPct}
                          sx={{ height: 6, borderRadius: 3, bgcolor: '#ECEFF1', '& .MuiLinearProgress-bar': { bgcolor: colors.main } }}
                        />
                      </Box>

                      {/* Population metric */}
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.3 }}>
                          <Typography variant="caption" color="text.secondary">
                            Population
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            ~{item.pop.toLocaleString()} ({popPct}%)
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={popPct}
                          sx={{ height: 6, borderRadius: 3, bgcolor: '#ECEFF1', '& .MuiLinearProgress-bar': { bgcolor: colors.main } }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* TAB 2: Citizen Ground Observation Depth Breakdown */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.85rem' }}>
              Citizen Field Depth Reports Distribution Across Lucena
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#FAFCFE', height: '100%' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Street Depth Classification
                  </Typography>

                  <Stack spacing={1.5}>
                    {[
                      { key: 'passable_dry', label: 'Passable / Dry', color: '#2E7D32', desc: 'No standing water' },
                      { key: 'gutter_deep', label: 'Gutter-Deep', color: '#0288D1', desc: '~20 cm (passable for cars)' },
                      { key: 'knee_deep', label: 'Knee-Deep', color: '#ED6C02', desc: '~50 cm (trucks only)' },
                      { key: 'waist_deep', label: 'Waist-Deep', color: '#D32F2F', desc: '~1.0 m (impassable)' },
                      { key: 'submerged', label: 'Submerged', color: '#7B1FA2', desc: '> 1.5 m (extreme danger)' },
                    ].map((d) => {
                      const count = depthCounts[d.key as WaterDepthLevel] || 0;
                      return (
                        <Box key={d.key}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.25 }}>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: d.color }} />
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {d.label}
                              </Typography>
                            </Stack>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: d.color }}>
                              {count} reports
                            </Typography>
                          </Stack>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', display: 'block', pl: 2 }}>
                            {d.desc}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={7}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#FFFFFF', height: '100%' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Citizen Ground Observers & High-Consensus Barangays
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Barangays with the highest community participation and verified reports:
                  </Typography>

                  <Stack spacing={1}>
                    {zones
                      .filter((z) => z.communityValidation.confirmCount > 0)
                      .sort((a, b) => b.communityValidation.confirmCount - a.communityValidation.confirmCount)
                      .slice(0, 5)
                      .map((z) => (
                        <Box
                          key={z.id}
                          onClick={() => onSelectZone(z.id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1.25,
                            borderRadius: 1.5,
                            bgcolor: '#F8FAFC',
                            cursor: 'pointer',
                            border: '1px solid rgba(0,0,0,0.06)',
                            '&:hover': { bgcolor: '#F0F7FF', borderColor: '#0288D1' },
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                              Brgy. {z.barangay}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                              {z.recentReports.length} Observation logs &bull; Area: {z.areaSquareKm} km²
                            </Typography>
                          </Box>

                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              icon={<VerifiedUserIcon sx={{ fontSize: '13px !important' }} />}
                              label={`${z.communityValidation.consensusPercentage}% Consensus`}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.68rem',
                                bgcolor: '#E8F5E9',
                                color: '#2E7D32',
                              }}
                            />
                            <OpenInNewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          </Stack>
                        </Box>
                      ))}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
