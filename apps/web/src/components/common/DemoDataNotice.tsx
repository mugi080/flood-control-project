'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';

const STORAGE_KEY = 'lucena-demo-notice-acknowledged';
const HOTLINE_DISPLAY = '(042) 710-3882';
const RADIUS = '10px'; // matches the header controls

const points = [
  {
    label: 'What this is',
    body: 'A pilot for barangay-level flood monitoring across Lucena City.',
  },
  {
    label: 'What you can do',
    body: 'As a Citizen Validator, confirm, rate, or report the water depth you see on the ground.',
  },
  {
    label: 'Please note',
    body: 'Sensor readings are simulated for testing. Do not use them for real evacuation decisions.',
    emphasis: true,
  },
];

export function DemoDataNotice() {
  // Start expanded on every first render so the notice can't be missed or flash closed.
  const [acknowledged, setAcknowledged] = React.useState(false);

  React.useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === '1') setAcknowledged(true);
    } catch {
      /* storage unavailable: keep the notice expanded */
    }
  }, []);

  const setAck = (value: boolean) => {
    setAcknowledged(value);
    try {
      if (value) window.localStorage.setItem(STORAGE_KEY, '1');
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {/* Full notice: shown until the user taps "Got it" */}
      <Collapse in={!acknowledged} unmountOnExit>
        <Box
          component="section"
          aria-label="Demo data notice"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: RADIUS,
            border: '1px solid #FDE68A',
            bgcolor: '#FFFBEB',
            p: { xs: 2, md: 2.5 },
            pl: { xs: 2.5, md: 3 },
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '0 auto 0 0',
              width: 4,
              bgcolor: '#F59E0B',
            },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: RADIUS,
                bgcolor: '#FEF3C7',
                color: '#B45309',
              }}
            >
              <ScienceOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>

            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  lineHeight: 1.35,
                  letterSpacing: '-0.01em',
                  color: '#451A03',
                }}
              >
                You&apos;re viewing a demo with simulated data
              </Typography>
              <Typography sx={{ mt: 0.25, fontSize: '0.8125rem', color: '#92400E' }}>
                Lucena City Pilot · Participatory flood monitoring and citizen validation
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: 'grid',
                  gap: { xs: 1.5, md: 3 },
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                }}
              >
                {points.map((p) => (
                  <Box key={p.label}>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: p.emphasis ? '#B91C1C' : '#92400E',
                        mb: 0.25,
                      }}
                    >
                      {p.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        color: p.emphasis ? '#7F1D1D' : '#451A03',
                        fontWeight: p.emphasis ? 500 : 400,
                      }}
                    >
                      {p.body}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
                sx={{ mt: 2.25 }}
              >
                <Typography sx={{ fontSize: '0.8125rem', color: '#78350F' }}>
                  In a real emergency, call the CDRRMO hotline at{' '}
                  <Box component="strong" sx={{ whiteSpace: 'nowrap' }}>
                    {HOTLINE_DISPLAY}
                  </Box>
                  .
                </Typography>
                <Button
                  onClick={() => setAck(true)}
                  variant="contained"
                  disableElevation
                  sx={{
                    height: 36,
                    px: 2.5,
                    borderRadius: RADIUS,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    bgcolor: '#92400E',
                    '&:hover': { bgcolor: '#78350F' },
                    '&:focus-visible': { outline: '2px solid #F59E0B', outlineOffset: 2 },
                  }}
                >
                  Got it
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Collapse>

      {/* Slim reminder: stays visible after acknowledging so the caveat is never lost */}
      <Collapse in={acknowledged} unmountOnExit>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{
            minHeight: 40,
            px: 1.5,
            borderRadius: RADIUS,
            border: '1px solid #FDE68A',
            bgcolor: '#FFFBEB',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
            <InfoOutlinedIcon sx={{ fontSize: 18, color: '#B45309', flexShrink: 0 }} />
            <Typography noWrap sx={{ fontSize: '0.8125rem', color: '#78350F', fontWeight: 500 }}>
              Demo mode: sensor readings are simulated.
            </Typography>
          </Stack>
          <Button
            onClick={() => setAck(false)}
            size="small"
            sx={{
              flexShrink: 0,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              color: '#92400E',
              borderRadius: RADIUS,
              '&:hover': { bgcolor: '#FEF3C7' },
            }}
          >
            Read details
          </Button>
        </Stack>
      </Collapse>
    </Box>
  );
}