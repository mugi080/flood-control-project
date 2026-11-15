'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { keyframes } from '@mui/material/styles';
import WavesIcon from '@mui/icons-material/Waves';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import VerifiedIcon from '@mui/icons-material/Verified';
import { DemonstrationMunicipality } from '@flood-control/shared';

interface HeaderProps {
  municipality: DemonstrationMunicipality;
}

const HOTLINE_DISPLAY = '(042) 710-3882';
const HOTLINE_TEL = '+63427103882';

const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55); }
  70%  { box-shadow: 0 0 0 7px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
`;

export function Header({ municipality }: HeaderProps) {
  // Flat with a hairline border at the top of the page, soft shadow once scrolled.
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'saturate(180%) blur(14px)',
        WebkitBackdropFilter: 'saturate(180%) blur(14px)',
        borderBottom: '1px solid',
        borderColor: scrolled ? 'transparent' : 'rgba(15, 23, 42, 0.08)',
        boxShadow: scrolled ? '0 4px 24px rgba(15, 23, 42, 0.08)' : 'none',
        transition: 'box-shadow 200ms ease, border-color 200ms ease',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 60, md: 68 },
          px: { xs: 2, md: 4 },
          gap: 2,
          maxWidth: 1440,
          width: '100%',
          mx: 'auto',
        }}
      >
        {/* Brand */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flexGrow: 1 }}>
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
              boxShadow: '0 4px 12px rgba(0, 119, 182, 0.35)',
            }}
          >
            <WavesIcon sx={{ color: '#fff', fontSize: 24 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h1"
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.125rem' },
                lineHeight: 1.2,
                letterSpacing: '-0.015em',
                color: '#0F172A',
              }}
            >
              Lucena City Flood Control
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: '#64748B',
                lineHeight: 1.3,
                fontSize: '0.78rem',
              }}
            >
              Lucena CDRRMO · Tayabas Bay & Iyam-Dumacaa River barangay monitoring
            </Typography>
          </Box>
        </Stack>

        {/* Status + actions */}
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flexShrink: 0 }}>
          <Chip
            size="small"
            label="Live"
            icon={
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  ml: '10px !important',
                  borderRadius: '50%',
                  bgcolor: '#22C55E',
                  animation: `${pulse} 2s ease-out infinite`,
                  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                }}
              />
            }
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              height: 28,
              bgcolor: '#F0FDF4',
              color: '#166534',
              border: '1px solid #BBF7D0',
              fontWeight: 600,
              fontSize: '0.78rem',
            }}
          />

          <Chip
            size="small"
            label="Citizen validated"
            icon={<VerifiedIcon sx={{ fontSize: '15px !important', color: '#0077B6 !important' }} />}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              height: 28,
              bgcolor: '#EFF6FF',
              color: '#1E40AF',
              border: '1px solid #BFDBFE',
              fontWeight: 600,
              fontSize: '0.78rem',
            }}
          />

          {/* Desktop: labeled call button */}
          <Button
            href={`tel:${HOTLINE_TEL}`}
            variant="contained"
            disableElevation
            startIcon={<PhoneInTalkIcon sx={{ fontSize: 18 }} />}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              borderRadius: '999px',
              px: 2.25,
              py: 0.75,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              bgcolor: '#0F172A',
              color: '#fff',
              '&:hover': { bgcolor: '#1E293B' },
              '&:focus-visible': { outline: '2px solid #0077B6', outlineOffset: 2 },
            }}
          >
            Hotline {HOTLINE_DISPLAY}
          </Button>

          {/* Mobile: icon-only call button */}
          <Tooltip title={`Call CDRRMO ${HOTLINE_DISPLAY}`}>
            <IconButton
              href={`tel:${HOTLINE_TEL}`}
              aria-label={`Call CDRRMO hotline ${HOTLINE_DISPLAY}`}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                bgcolor: '#0F172A',
                color: '#fff',
                '&:hover': { bgcolor: '#1E293B' },
              }}
            >
              <PhoneInTalkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}