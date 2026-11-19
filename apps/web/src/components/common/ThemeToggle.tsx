'use client';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '../../theme/ThemeModeContext';

const CONTROL_HEIGHT = 36;
const CONTROL_RADIUS = '10px';

export function ThemeToggle() {
  const { resolvedMode, toggleMode } = useThemeMode();
  const isDark = resolvedMode === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'} arrow>
      <IconButton
        onClick={toggleMode}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        sx={{
          width: CONTROL_HEIGHT,
          height: CONTROL_HEIGHT,
          borderRadius: CONTROL_RADIUS,
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F8FAFC',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : '#E2E8F0',
          color: isDark ? '#38BDF8' : '#0B4F8A',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.14)' : '#EDF2F7',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : '#CBD5E1',
          },
        }}
      >
        {isDark ? (
          <LightModeIcon sx={{ fontSize: 19, color: '#FBBF24' }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: 19, color: '#0B4F8A' }} />
        )}
      </IconButton>
    </Tooltip>
  );
}
