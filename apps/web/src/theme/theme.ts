import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';
import { SeverityLevel } from '@flood-control/shared';

export interface SeverityColorEntry {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
  border: string;
  fillOpacity: number;
}

export const lightSeverityColorMap: Record<SeverityLevel, SeverityColorEntry> = {
  extreme: {
    main: '#C62828',
    light: '#FFEBEE',
    dark: '#8E0000',
    contrastText: '#FFFFFF',
    border: '#B71C1C',
    fillOpacity: 0.45,
  },
  major: {
    main: '#E65100',
    light: '#FFF3E0',
    dark: '#AC1900',
    contrastText: '#FFFFFF',
    border: '#BF360C',
    fillOpacity: 0.40,
  },
  moderate: {
    main: '#F57F17',
    light: '#FFFDE7',
    dark: '#BC5100',
    contrastText: '#212121',
    border: '#F57F17',
    fillOpacity: 0.35,
  },
  minor: {
    main: '#0288D1',
    light: '#E1F5FE',
    dark: '#005B9F',
    contrastText: '#FFFFFF',
    border: '#0277BD',
    fillOpacity: 0.30,
  },
};

export const darkSeverityColorMap: Record<SeverityLevel, SeverityColorEntry> = {
  extreme: {
    main: '#EF4444',
    light: 'rgba(239, 68, 68, 0.22)',
    dark: '#FCA5A5',
    contrastText: '#FFFFFF',
    border: '#F87171',
    fillOpacity: 0.50,
  },
  major: {
    main: '#F97316',
    light: 'rgba(249, 115, 22, 0.22)',
    dark: '#FDBA74',
    contrastText: '#FFFFFF',
    border: '#FB923C',
    fillOpacity: 0.45,
  },
  moderate: {
    main: '#FBBF24',
    light: 'rgba(251, 191, 36, 0.22)',
    dark: '#FDE047',
    contrastText: '#18181B',
    border: '#FCD34D',
    fillOpacity: 0.40,
  },
  minor: {
    main: '#38BDF8',
    light: 'rgba(56, 189, 248, 0.22)',
    dark: '#BAE6FD',
    contrastText: '#0B132B',
    border: '#7DD3FC',
    fillOpacity: 0.35,
  },
};

/** Backwards compatible light severity map */
export const severityColorMap = lightSeverityColorMap;

/** Get mode-aware severity color mapping */
export function getSeverityColors(severity: SeverityLevel, mode: 'light' | 'dark' = 'light'): SeverityColorEntry {
  const map = mode === 'dark' ? darkSeverityColorMap : lightSeverityColorMap;
  return map[severity] || map.minor;
}

export function buildTheme(mode: 'light' | 'dark'): Theme {
  const isDark = mode === 'dark';

  let theme = createTheme({
    palette: {
      mode,
      primary: isDark
        ? {
            main: '#38BDF8',
            light: '#7DD3FC',
            dark: '#0284C7',
            contrastText: '#0B132B',
          }
        : {
            main: '#0B2545',
            light: '#134074',
            dark: '#05192D',
            contrastText: '#FFFFFF',
          },
      secondary: isDark
        ? {
            main: '#60A5FA',
            light: '#93C5FD',
            dark: '#2563EB',
            contrastText: '#0B132B',
          }
        : {
            main: '#0077B6',
            light: '#0096C7',
            dark: '#03045E',
            contrastText: '#FFFFFF',
          },
      background: isDark
        ? {
            default: '#0B132B',
            paper: '#111D38',
          }
        : {
            default: '#F4F7FB',
            paper: '#FFFFFF',
          },
      text: isDark
        ? {
            primary: '#F1F5F9',
            secondary: '#94A3B8',
          }
        : {
            primary: '#0F1E2E',
            secondary: '#4A5D73',
          },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 30, 46, 0.08)',
      action: isDark
        ? {
            hover: 'rgba(255, 255, 255, 0.06)',
            selected: 'rgba(56, 189, 248, 0.16)',
            active: '#38BDF8',
          }
        : {
            hover: 'rgba(15, 30, 46, 0.04)',
            selected: 'rgba(11, 37, 69, 0.08)',
            active: '#0B2545',
          },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h5: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      subtitle1: {
        fontWeight: 600,
      },
      subtitle2: {
        fontWeight: 500,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#0B132B' : '#F4F7FB',
            color: isDark ? '#F1F5F9' : '#0F1E2E',
            transition: 'background-color 200ms ease, color 200ms ease',
            scrollbarColor: isDark ? '#1E293B #0B132B' : '#CBD5E1 #F1F5F9',
          },
          // Optimized dark styling for Leaflet elements
          '.leaflet-container': {
            backgroundColor: isDark ? '#0B132B !important' : '#EAEFF5 !important',
          },
          '.dark .leaflet-popup-content-wrapper, [data-theme="dark"] .leaflet-popup-content-wrapper': {
            backgroundColor: '#111D38 !important',
            color: '#F1F5F9 !important',
            border: '1px solid rgba(255, 255, 255, 0.12) !important',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6) !important',
            borderRadius: '10px !important',
          },
          '.dark .leaflet-popup-tip, [data-theme="dark"] .leaflet-popup-tip': {
            backgroundColor: '#111D38 !important',
          },
          '.dark .leaflet-bar, [data-theme="dark"] .leaflet-bar': {
            border: '1px solid rgba(255, 255, 255, 0.15) !important',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4) !important',
          },
          '.dark .leaflet-bar a, [data-theme="dark"] .leaflet-bar a': {
            backgroundColor: '#111D38 !important',
            color: '#F1F5F9 !important',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1) !important',
            '&:hover': {
              backgroundColor: '#1A2C54 !important',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(17, 29, 56, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(11, 37, 69, 0.15)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#111D38' : '#FFFFFF',
            boxShadow: isDark
              ? '0 2px 8px rgba(0, 0, 0, 0.3)'
              : '0 1px 3px rgba(15, 30, 46, 0.08), 0 1px 2px rgba(15, 30, 46, 0.04)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 30, 46, 0.08)'}`,
            borderRadius: 10,
            transition: 'background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Disable MUI elevation overlay in dark mode for pure colors
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 6,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.12)',
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#111D38' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : undefined,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? '#1E293B' : '#0B2545',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            borderRadius: 6,
            border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : undefined,
          },
          arrow: {
            color: isDark ? '#1E293B' : '#0B2545',
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
}

const defaultTheme = buildTheme('light');
export default defaultTheme;
