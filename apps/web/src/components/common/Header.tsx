'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WavesIcon from '@mui/icons-material/Waves';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import Stack from '@mui/material/Stack';
import { DemonstrationMunicipality } from '@flood-control/shared';

interface HeaderProps {
  municipality: DemonstrationMunicipality;
}

export function Header({ municipality }: HeaderProps) {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 }, px: { xs: 2, md: 3 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <WavesIcon sx={{ color: '#64B5F6', fontSize: 26 }} />
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.05rem', sm: '1.25rem' },
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                }}
              >
                Lucena City Flood Control
              </Typography>
              <Chip
                label="CITIZEN VALIDATED"
                size="small"
                icon={<HowToVoteIcon sx={{ fontSize: '13px !important' }} />}
                sx={{
                  bgcolor: 'rgba(46, 125, 50, 0.35)',
                  color: '#A5D6A7',
                  border: '1px solid rgba(165, 214, 167, 0.5)',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  height: 22,
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
              />
            </Stack>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                display: 'block',
                lineHeight: 1.2,
                fontSize: { xs: '0.72rem', sm: '0.8rem' },
              }}
            >
              Lucena City CDRRMO &bull; Tayabas Bay & Iyam-Dumacaa River Barangay Monitoring
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <PhoneInTalkIcon sx={{ fontSize: 16, color: '#90CAF9' }} />
            <Typography variant="caption" sx={{ color: '#E3F2FD', fontWeight: 500 }}>
              CDRRMO Hotline: (042) 710-3882
            </Typography>
          </Box>

          <Chip
            label="LUCENA PILOT"
            size="small"
            sx={{
              bgcolor: '#0077B6',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 24,
            }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
