import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const severityColorMap = {
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
} as const;

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0B2545',
      light: '#134074',
      dark: '#05192D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0077B6',
      light: '#0096C7',
      dark: '#03045E',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F7FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F1E2E',
      secondary: '#4A5D73',
    },
    divider: 'rgba(15, 30, 46, 0.08)',
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
      color: '#4A5D73',
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0B2545',
          boxShadow: '0 2px 8px rgba(11, 37, 69, 0.15)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(15, 30, 46, 0.08), 0 1px 2px rgba(15, 30, 46, 0.04)',
          border: '1px solid rgba(15, 30, 46, 0.08)',
          borderRadius: 10,
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
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
