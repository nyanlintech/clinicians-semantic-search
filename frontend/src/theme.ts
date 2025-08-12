import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#6D8B74',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D6A07C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FAF9F7',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#3A3A35',
    },
    grey: {
      100: '#E6E6E2',
      300: '#CFCFCB',
      500: '#A9A9A3',
      700: '#7F7F7B',
      900: '#3A3A35',
    },
  },
  typography: {
    fontFamily: 'IBM Plex Mono, monospace',

    h4: {
      fontWeight: 900,
      fontSize: '2rem',          // big, but not too huge
      letterSpacing: '0.05em',
      color: '#1A1A1A',
      textTransform: 'uppercase',
      lineHeight: 1.25,
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',        // noticeable but smaller than h4
      letterSpacing: '0.04em',
      color: '#1A1A1A',
      textTransform: 'uppercase',
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',       // smaller heading, still strong
      letterSpacing: '0.03em',
      color: '#1A1A1A',
      textTransform: 'uppercase',
      lineHeight: 1.35,
    },
    body1: {
      fontWeight: 600,
      fontSize: '1rem',          // normal readable text size
      color: '#1A1A1A',
      letterSpacing: '0.02em',
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 500,
      fontSize: '0.9rem',        // smaller secondary text
      color: '#3A3A35',
      letterSpacing: '0.015em',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: '#FAF9F7',
    },
  },
});
