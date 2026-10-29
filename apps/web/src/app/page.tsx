'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import GroupsIcon from '@mui/icons-material/Groups';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  FloodZone,
  MockDataResponse,
  SeverityLevel,
} from '@flood-control/shared';
import { Header } from '../components/common/Header';
import { DemoDataNotice } from '../components/common/DemoDataNotice';
import { SeverityLegend } from '../components/map/SeverityLegend';
import { FloodMapWrapper } from '../components/map/FloodMapWrapper';
import { AlertSummaryPanel } from '../components/alerts/AlertSummaryPanel';
import { FloodAnalyticsSection } from '../components/analytics/FloodAnalyticsSection';
import { ErrorStateView, MapLoadingState } from '../components/common/StateViews';
import { fetchFloodData } from '../services/floodDataService';

export default function FloodDashboardPage() {
  const [data, setData] = React.useState<MockDataResponse | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = React.useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = React.useState<SeverityLevel | 'all'>('all');

  const loadData = React.useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setLoading(true);
    setError(null);
    try {
      const response = await fetchFloodData();
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to retrieve Lucena City flood monitoring telemetry.'
      );
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Compute counts per severity level
  const zoneCounts = React.useMemo(() => {
    const counts: Record<SeverityLevel, number> = {
      extreme: 0,
      major: 0,
      moderate: 0,
      minor: 0,
    };
    if (data?.zones) {
      for (const z of data.zones) {
        if (counts[z.severity] !== undefined) {
          counts[z.severity]++;
        }
      }
    }
    return counts;
  }, [data]);

  // Filtered zones according to legend filter
  const filteredZones = React.useMemo(() => {
    if (!data?.zones) return [];
    if (severityFilter === 'all') return data.zones;
    return data.zones.filter((z) => z.severity === severityFilter);
  }, [data, severityFilter]);

  // Total population affected across filtered zones
  const totalAffectedPopulation = React.useMemo(() => {
    return filteredZones.reduce((acc, z) => acc + z.affectedPopulationEstimate, 0);
  }, [filteredZones]);

  // Total land area covered
  const totalMonitoredArea = React.useMemo(() => {
    return filteredZones.reduce((acc, z) => acc + z.areaSquareKm, 0).toFixed(1);
  }, [filteredZones]);

  // Total citizen validations (votes + reports) across Lucena
  const totalCitizenValidations = React.useMemo(() => {
    if (!data?.zones) return 0;
    return data.zones.reduce(
      (acc, z) =>
        acc +
        z.communityValidation.confirmCount +
        z.communityValidation.disputeCount +
        (z.recentReports?.length || 0),
      0
    );
  }, [data]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header
          municipality={{
            name: 'Lucena City',
            code: 'LCN-QUEZON',
            region: 'CALABARZON (Region IV-A)',
            province: 'Quezon Province',
            country: 'Philippines',
            totalBarangays: 33,
            totalLandAreaKm2: 80.21,
            totalPopulation: 278924,
            center: [13.935, 121.618],
            defaultZoom: 13,
            emergencyDeskPhone: '(042) 710-3882',
            cdrmoDesk: 'CDRRMO Lucena City',
            officialPortalUrl: 'https://lucenacity.gov.ph',
            dataSourceUrl: 'https://www.citypopulation.de/en/philippines/lucena/',
            isMockData: true,
            lastSimulatedUpdate: new Date().toISOString(),
          }}
        />
        <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
          <MapLoadingState />
        </Container>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header
          municipality={{
            name: 'Lucena City',
            code: 'LCN-QUEZON',
            region: 'CALABARZON (Region IV-A)',
            province: 'Quezon Province',
            country: 'Philippines',
            totalBarangays: 33,
            totalLandAreaKm2: 80.21,
            totalPopulation: 278924,
            center: [13.935, 121.618],
            defaultZoom: 13,
            emergencyDeskPhone: '(042) 710-3882',
            cdrmoDesk: 'CDRRMO Lucena City',
            officialPortalUrl: 'https://lucenacity.gov.ph',
            dataSourceUrl: 'https://www.citypopulation.de/en/philippines/lucena/',
            isMockData: true,
            lastSimulatedUpdate: new Date().toISOString(),
          }}
        />
        <Container maxWidth="md" sx={{ py: 6 }}>
          <ErrorStateView
            message={error || 'No telemetry data received.'}
            onRetry={() => loadData(true)}
          />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F4F7FB' }}>
      {/* Top Municipal Navigation Bar */}
      <Header municipality={data.municipality} />

      {/* Main Content Area */}
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
      >
        {/* Prominent Demo Notice with Data Attribution */}
        <DemoDataNotice />

        {/* Lucena 33-Barangays Metrics Banner */}
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid item xs={6} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: '#E3F2FD',
                      color: '#0D47A1',
                      display: 'flex',
                    }}
                  >
                    <LocationCityIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Lucena City Barangays
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.1 }}>
                      All {data.zones.length} Barangays
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: '#FFEBEE',
                      color: '#C62828',
                      display: 'flex',
                    }}
                  >
                    <WarningAmberIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Severe Warnings
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.1, color: '#C62828' }}
                    >
                      {zoneCounts.extreme + zoneCounts.major} High Risk
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: '#E8F5E9',
                      color: '#2E7D32',
                      display: 'flex',
                    }}
                  >
                    <HowToVoteIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Citizen Validations
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.1, color: '#2E7D32' }}>
                      {totalCitizenValidations} Verified Reports
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: '#E0F2F1',
                      color: '#00695C',
                      display: 'flex',
                    }}
                  >
                    <SquareFootIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Total Assessed Land
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.1 }}>
                      {totalMonitoredArea} km² (100%)
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Map and Alerts Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Interactive Map Column with Heatmap Mode */}
          <Grid item xs={12} lg={7} xl={8} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SeverityLegend
              selectedSeverity={severityFilter}
              onSelectSeverity={(sev) => {
                setSeverityFilter(sev);
                if (sev !== 'all' && selectedZoneId) {
                  const z = data.zones.find((zone) => zone.id === selectedZoneId);
                  if (z && z.severity !== sev) {
                    setSelectedZoneId(null);
                  }
                }
              }}
              zoneCounts={zoneCounts}
            />

            <Box sx={{ flexGrow: 1, minHeight: { xs: 460, md: 580 } }}>
              <FloodMapWrapper
                municipality={data.municipality}
                zones={filteredZones}
                selectedZoneId={selectedZoneId}
                onSelectZone={(id) => setSelectedZoneId(id)}
              />
            </Box>

            {/* Map metadata and cartography / citypopulation notes */}
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: '#FFFFFF' }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1}
              >
                <Typography variant="caption" color="text.secondary">
                  <strong>Demographic & Geospatial Source:</strong> Philippine Statistics Authority (PSA) via{' '}
                  <Link
                    href="https://www.citypopulation.de/en/philippines/lucena/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: '#0288D1', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.3 }}
                  >
                    CityPopulation.de Lucena <OpenInNewIcon sx={{ fontSize: 11 }} />
                  </Link>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  33 Barangays Mapped &bull; Land Area & Elevation Mode Enabled
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          {/* Alert Summary Panel Column with Barangay Search & Validation */}
          <Grid item xs={12} lg={5} xl={4}>
            <Paper
              elevation={1}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 2.5,
                height: { lg: 'calc(100vh - 210px)' },
                minHeight: 580,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                bgcolor: '#FFFFFF',
              }}
            >
              <AlertSummaryPanel
                zones={filteredZones}
                selectedZoneId={selectedZoneId}
                onSelectZone={(id) => setSelectedZoneId(id)}
                selectedSeverity={severityFilter}
                onClearFilter={() => setSeverityFilter('all')}
                onRefreshData={() => loadData(false)}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Visual Analytics & Comparative Charts Section */}
        <FloodAnalyticsSection
          zones={data.zones}
          selectedZoneId={selectedZoneId}
          onSelectZone={(id) => setSelectedZoneId(id)}
        />
      </Container>
    </Box>
  );
}
