'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme } from '@mui/material/styles';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import VerifiedIcon from '@mui/icons-material/Verified';
import { DemonstrationMunicipality } from '@flood-control/shared';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  municipality: DemonstrationMunicipality;
}

const HOTLINE_DISPLAY = '(042) 710-3882';
const HOTLINE_TEL = '+63427103882';

// One size and one corner radius for everything on the right, so it reads as a single group.
const CONTROL_HEIGHT = 36;
const CONTROL_RADIUS = '10px';

/** Flood mark: a water drop with two rising wave lines inside. */
function FloodLogo() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        width: 40,
        height: 40,
        borderRadius: CONTROL_RADIUS,
        bgcolor: isDark ? '#0284C7' : '#0B4F8A',
        boxShadow: isDark
          ? '0 0 12px rgba(56, 189, 248, 0.25), inset 0 0 0 1px rgba(255,255,255,0.2)'
          : 'inset 0 0 0 1px rgba(255,255,255,0.12)',
        transition: 'background-color 200ms ease',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2.5c3.2 4 6 7.1 6 10.6a6 6 0 1 1-12 0c0-3.5 2.8-6.6 6-10.6Z"
          fill="#FFFFFF"
        />
        <path
          d="M7.6 13.6c1.1-.9 2.2-.9 3.2 0s2.2.9 3.2 0 1.7-.7 2.4-.3"
          stroke={isDark ? '#0284C7' : '#0B4F8A'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8.4 16.5c.9-.7 1.8-.7 2.6 0s1.8.7 2.6 0 1.2-.5 1.6-.3"
          stroke="#38A3DC"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </Box>
  );
}

/** Neutral pill used for status info, matched to the call button's size and radius. */
function StatusPill({
  children,
  hideBelow,
}: {
  children: React.ReactNode;
  hideBelow: 'sm' | 'md';
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: { xs: 'none', [hideBelow]: 'inline-flex' },
        alignItems: 'center',
        gap: 0.875,
        height: CONTROL_HEIGHT,
        px: 1.5,
        borderRadius: CONTROL_RADIUS,
        bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0',
        color: isDark ? '#E2E8F0' : '#334155',
        fontSize: '0.8125rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        transition: 'all 200ms ease',
      }}
    >
      {children}
    </Box>
  );
}

export function Header({ municipality }: HeaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: isDark ? 'rgba(17, 29, 56, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'saturate(180%) blur(14px)',
        WebkitBackdropFilter: 'saturate(180%) blur(14px)',
        borderBottom: '1px solid',
        borderColor: scrolled ? 'transparent' : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
        boxShadow: scrolled
          ? isDark
            ? '0 4px 24px rgba(0, 0, 0, 0.5)'
            : '0 4px 24px rgba(15, 23, 42, 0.08)'
          : 'none',
        transition: 'box-shadow 200ms ease, border-color 200ms ease, background-color 200ms ease',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 60, md: 64 },
          px: { xs: 2, md: 4 },
          gap: 2,
          maxWidth: 1440,
          width: '100%',
          mx: 'auto',
        }}
      >
        {/* Brand */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flexGrow: 1 }}>
          <FloodLogo />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h1"
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.0625rem' },
                lineHeight: 1.25,
                letterSpacing: '-0.015em',
                color: isDark ? '#F8FAFC' : '#0F172A',
                transition: 'color 200ms ease',
              }}
            >
              Lucena City Flood Control
            </Typography>
            <Typography
              noWrap
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: isDark ? '#94A3B8' : '#64748B',
                fontSize: '0.78rem',
                lineHeight: 1.3,
                transition: 'color 200ms ease',
              }}
            >
              Citywide barangay monitoring by Lucena CDRRMO
            </Typography>
          </Box>
        </Stack>

        {/* Right side: theme toggle, validation pill, hotline */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
          {/* Quick, accessible theme toggle */}
          <ThemeToggle />

          <StatusPill hideBelow="md">
            <VerifiedIcon sx={{ fontSize: 16, color: isDark ? '#38BDF8' : '#0B4F8A' }} />
            Citizen validated
          </StatusPill>

          <Button
            href={`tel:${HOTLINE_TEL}`}
            variant="contained"
            disableElevation
            startIcon={<PhoneInTalkIcon sx={{ fontSize: 17 }} />}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              height: CONTROL_HEIGHT,
              px: 1.75,
              borderRadius: CONTROL_RADIUS,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              whiteSpace: 'nowrap',
              bgcolor: isDark ? '#0284C7' : '#0B4F8A',
              color: '#FFFFFF',
              '&:hover': { bgcolor: isDark ? '#0369A1' : '#093F6E' },
              '&:focus-visible': { outline: '2px solid #38A3DC', outlineOffset: 2 },
            }}
          >
            Hotline {HOTLINE_DISPLAY}
          </Button>

          <Tooltip title={`Call CDRRMO ${HOTLINE_DISPLAY}`}>
            <IconButton
              href={`tel:${HOTLINE_TEL}`}
              aria-label={`Call CDRRMO hotline ${HOTLINE_DISPLAY}`}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                width: CONTROL_HEIGHT,
                height: CONTROL_HEIGHT,
                borderRadius: CONTROL_RADIUS,
                bgcolor: isDark ? '#0284C7' : '#0B4F8A',
                color: '#fff',
                '&:hover': { bgcolor: isDark ? '#0369A1' : '#093F6E' },
              }}
            >
              <PhoneInTalkIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
