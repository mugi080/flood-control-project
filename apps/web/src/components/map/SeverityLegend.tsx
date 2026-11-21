'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { useTheme, alpha, lighten } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { SeverityLevel } from '@flood-control/shared';
import { severityColorMap } from '../../theme/theme';

interface SeverityLegendProps {
  selectedSeverity: SeverityLevel | 'all';
  onSelectSeverity: (severity: SeverityLevel | 'all') => void;
  zoneCounts: Record<SeverityLevel, number>;
}

interface LegendItem {
  severity: SeverityLevel;
  label: string;
  stageName: string;
  actionSummary: string;
}

const LEGEND_ITEMS: LegendItem[] = [
  {
    severity: 'extreme',
    label: 'Extreme',
    stageName: 'Emergency Inundation',
    actionSummary: 'Immediate evacuation staging; critical floodwall crest breached.',
  },
  {
    severity: 'major',
    label: 'Major',
    stageName: 'Flood Warning',
    actionSummary: 'Extensive overland flooding; roads impassable; prepare evacuation.',
  },
  {
    severity: 'moderate',
    label: 'Moderate',
    stageName: 'Flood Watch',
    actionSummary: 'Drainage culverts and canals near capacity; monitor access lanes.',
  },
  {
    severity: 'minor',
    label: 'Minor',
    stageName: 'Advisory',
    actionSummary: 'Nuisance water pooling on low-lying grounds; structures secure.',
  },
];

export function SeverityLegend({
  selectedSeverity,
  onSelectSeverity,
  zoneCounts,
}: SeverityLegendProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const idleBg = isDark ? 'rgba(255, 255, 255, 0.04)' : '#FAFCFE';
  const idleBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Flood Severity Legend
            </Typography>
            <Tooltip title="Click any severity category to filter map flags, alert radii, and reports." arrow>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
            </Tooltip>
          </Stack>

          {selectedSeverity !== 'all' && (
            <Chip
              label="Clear Filter"
              size="small"
              onClick={() => onSelectSeverity('all')}
              sx={{ height: 20, fontSize: '0.65rem' }}
            />
          )}
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
        >
          {LEGEND_ITEMS.map((item) => {
            const isSelected = selectedSeverity === item.severity;
            const colors = severityColorMap[item.severity];
            const count = zoneCounts[item.severity] || 0;

            // Pastel fills only work on light surfaces; use a tint of the severity color on dark.
            const activeBg = isDark ? alpha(colors.main, 0.2) : colors.light;
            const labelColor = isDark ? lighten(colors.main, 0.5) : colors.dark;
            const toggle = () => onSelectSeverity(isSelected ? 'all' : item.severity);

            return (
              <Box
                key={item.severity}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={toggle}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                  }
                }}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isSelected ? colors.main : idleBorder,
                  backgroundColor: isSelected ? activeBg : idleBg,
                  transition: 'all 0.15s ease-in-out',
                  '&:hover': {
                    borderColor: colors.main,
                    backgroundColor: activeBg,
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${colors.main}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: colors.main,
                    border: `2px solid ${colors.border}`,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: labelColor,
                    }}
                  >
                    {item.label} ({count})
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: 'text.secondary',
                      fontSize: '0.68rem',
                      lineHeight: 1.1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.stageName}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}