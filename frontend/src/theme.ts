import { createTheme } from '@mui/material/styles';

const FONT_DISPLAY = '"Cormorant Garamond", Georgia, serif';
const FONT_BODY = '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif';
const FONT_MONO = '"IBM Plex Mono", "Fira Code", monospace';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#253D2E',
      light: '#3A5C47',
      dark: '#1A2D21',
      contrastText: '#F5F0E8',
    },
    secondary: {
      main: '#B5622D',
      light: '#C97840',
      dark: '#8F4D23',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F0E8',
      paper: '#FDFAF5',
    },
    text: {
      primary: '#1A1208',
      secondary: '#5C5045',
    },
    grey: {
      100: '#EDE8DF',
      200: '#DDD5C8',
      300: '#CEC4B5',
      400: '#B0A292',
      500: '#8C7D6E',
      600: '#6E6055',
      700: '#52453C',
      800: '#382E27',
      900: '#1A1208',
    },
    divider: '#DDD5C8',
    success: {
      main: '#3A6B48',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#B5622D',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#B83232',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: FONT_BODY,
    h1: {
      fontFamily: FONT_DISPLAY,
      fontWeight: 600,
      fontSize: '3rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.1,
      color: '#1A1208',
    },
    h2: {
      fontFamily: FONT_DISPLAY,
      fontWeight: 600,
      fontSize: '2.25rem',
      letterSpacing: '-0.005em',
      lineHeight: 1.15,
      color: '#1A1208',
    },
    h3: {
      fontFamily: FONT_DISPLAY,
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '0',
      lineHeight: 1.2,
      color: '#1A1208',
    },
    h4: {
      fontFamily: FONT_DISPLAY,
      fontWeight: 600,
      fontSize: '1.375rem',
      letterSpacing: '0',
      lineHeight: 1.25,
      color: '#1A1208',
      textTransform: 'none',
    },
    h5: {
      fontFamily: FONT_DISPLAY,
      fontWeight: 600,
      fontSize: '1.1875rem',
      letterSpacing: '0',
      lineHeight: 1.3,
      color: '#1A1208',
      textTransform: 'none',
    },
    h6: {
      fontFamily: FONT_BODY,
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '0',
      lineHeight: 1.45,
      color: '#1A1208',
      textTransform: 'none',
    },
    body1: {
      fontFamily: FONT_BODY,
      fontWeight: 400,
      fontSize: '0.9375rem',
      letterSpacing: '0',
      lineHeight: 1.7,
      color: '#1A1208',
    },
    body2: {
      fontFamily: FONT_BODY,
      fontWeight: 400,
      fontSize: '0.875rem',
      letterSpacing: '0',
      lineHeight: 1.65,
      color: '#5C5045',
    },
    subtitle1: {
      fontFamily: FONT_BODY,
      fontWeight: 500,
      fontSize: '0.9375rem',
      letterSpacing: '0',
      lineHeight: 1.5,
      color: '#1A1208',
    },
    subtitle2: {
      fontFamily: FONT_BODY,
      fontWeight: 600,
      fontSize: '0.8125rem',
      letterSpacing: '0.01em',
      textTransform: 'none',
      lineHeight: 1.6,
      color: '#5C5045',
    },
    button: {
      fontFamily: FONT_BODY,
      fontWeight: 500,
      fontSize: '0.9375rem',
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
    caption: {
      fontFamily: FONT_BODY,
      fontWeight: 400,
      fontSize: '0.8125rem',
      letterSpacing: '0',
      lineHeight: 1.5,
      color: '#8C7D6E',
    },
    overline: {
      fontFamily: FONT_BODY,
      fontWeight: 600,
      fontSize: '0.75rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      lineHeight: 2,
      color: '#5C5045',
    },
  },
  shape: {
    borderRadius: 6,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(26, 18, 8, 0.05)',
    '0 1px 3px rgba(26, 18, 8, 0.06), 0 1px 2px rgba(26, 18, 8, 0.04)',
    '0 1px 3px rgba(26, 18, 8, 0.06), 0 1px 2px rgba(26, 18, 8, 0.04)',
    '0 4px 6px rgba(26, 18, 8, 0.07), 0 2px 4px rgba(26, 18, 8, 0.05)',
    '0 4px 12px rgba(26, 18, 8, 0.1), 0 2px 4px rgba(26, 18, 8, 0.06)',
    '0 4px 12px rgba(26, 18, 8, 0.1), 0 2px 4px rgba(26, 18, 8, 0.06)',
    '0 4px 12px rgba(26, 18, 8, 0.1), 0 2px 4px rgba(26, 18, 8, 0.06)',
    '0 4px 12px rgba(26, 18, 8, 0.1), 0 2px 4px rgba(26, 18, 8, 0.06)',
    '0 8px 24px rgba(26, 18, 8, 0.12), 0 4px 8px rgba(26, 18, 8, 0.06)',
    '0 8px 24px rgba(26, 18, 8, 0.12), 0 4px 8px rgba(26, 18, 8, 0.06)',
    '0 8px 24px rgba(26, 18, 8, 0.12), 0 4px 8px rgba(26, 18, 8, 0.06)',
    '0 8px 24px rgba(26, 18, 8, 0.12), 0 4px 8px rgba(26, 18, 8, 0.06)',
    '0 16px 32px rgba(26, 18, 8, 0.14), 0 8px 16px rgba(26, 18, 8, 0.08)',
    '0 16px 32px rgba(26, 18, 8, 0.14), 0 8px 16px rgba(26, 18, 8, 0.08)',
    '0 16px 32px rgba(26, 18, 8, 0.14), 0 8px 16px rgba(26, 18, 8, 0.08)',
    '0 16px 32px rgba(26, 18, 8, 0.14), 0 8px 16px rgba(26, 18, 8, 0.08)',
    '0 16px 32px rgba(26, 18, 8, 0.14), 0 8px 16px rgba(26, 18, 8, 0.08)',
    '0 16px 32px rgba(26, 18, 8, 0.14), 0 8px 16px rgba(26, 18, 8, 0.08)',
    '0 16px 32px rgba(26, 18, 8, 0.14), 0 8px 16px rgba(26, 18, 8, 0.08)',
    '0 16px 32px rgba(26, 18, 8, 0.14), 0 8px 16px rgba(26, 18, 8, 0.08)',
    '0 16px 32px rgba(26, 18, 8, 0.14), 0 8px 16px rgba(26, 18, 8, 0.08)',
    '0 16px 32px rgba(26, 18, 8, 0.14), 0 8px 16px rgba(26, 18, 8, 0.08)',
    '0 16px 32px rgba(26, 18, 8, 0.14), 0 8px 16px rgba(26, 18, 8, 0.08)',
    '0 24px 48px rgba(26, 18, 8, 0.2)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F0E8',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FDFAF5',
        },
        elevation3: {
          boxShadow: '0 1px 3px rgba(26, 18, 8, 0.06), 0 1px 2px rgba(26, 18, 8, 0.04)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(26, 18, 8, 0.06), 0 1px 2px rgba(26, 18, 8, 0.04)',
          border: '1px solid #DDD5C8',
          borderRadius: 8,
          backgroundColor: '#FDFAF5',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(26, 18, 8, 0.1), 0 2px 4px rgba(26, 18, 8, 0.06)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '9px 22px',
          fontWeight: 500,
          textTransform: 'none',
          fontSize: '0.9375rem',
          fontFamily: FONT_BODY,
          transition: 'all 0.15s ease',
        },
        containedPrimary: {
          backgroundColor: '#253D2E',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#1A2D21',
            boxShadow: '0 2px 8px rgba(37, 61, 46, 0.3)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: 'none',
          },
        },
        containedSecondary: {
          backgroundColor: '#B5622D',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#8F4D23',
            boxShadow: '0 2px 8px rgba(181, 98, 45, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          borderColor: '#253D2E',
          color: '#253D2E',
          '&:hover': {
            borderColor: '#1A2D21',
            backgroundColor: 'rgba(37, 61, 46, 0.05)',
          },
        },
        outlinedError: {
          borderColor: 'rgba(184, 50, 50, 0.4)',
          color: '#B83232',
          '&:hover': {
            borderColor: '#B83232',
            backgroundColor: 'rgba(184, 50, 50, 0.05)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(37, 61, 46, 0.06)',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
          borderRadius: 7,
        },
        sizeSmall: {
          padding: '5px 14px',
          fontSize: '0.875rem',
          borderRadius: 5,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.15s ease',
          '&:hover': {
            backgroundColor: 'rgba(37, 61, 46, 0.07)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: FONT_BODY,
          fontSize: '0.8125rem',
          fontWeight: 400,
          borderRadius: 4,
          height: 26,
          letterSpacing: '0',
        },
        outlinedPrimary: {
          borderColor: 'rgba(37, 61, 46, 0.3)',
          color: '#253D2E',
          backgroundColor: 'rgba(37, 61, 46, 0.06)',
          '&:hover': {
            backgroundColor: 'rgba(37, 61, 46, 0.1)',
          },
        },
        filledPrimary: {
          backgroundColor: 'rgba(37, 61, 46, 0.1)',
          color: '#253D2E',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontFamily: FONT_BODY,
            backgroundColor: '#FDFAF5',
            borderRadius: 6,
            '& fieldset': {
              borderColor: '#DDD5C8',
              transition: 'border-color 0.15s ease',
            },
            '&:hover fieldset': {
              borderColor: '#B0A292',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#253D2E',
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: FONT_BODY,
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#8C7D6E',
            opacity: 1,
            fontFamily: FONT_BODY,
          },
          '& .MuiInputBase-input': {
            fontSize: '0.9375rem',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: FONT_BODY,
          fontWeight: 400,
          fontSize: '0.9375rem',
          textTransform: 'none',
          letterSpacing: '0',
          color: '#5C5045',
          padding: '10px 0',
          marginRight: '24px',
          minWidth: 'unset',
          '&.Mui-selected': {
            color: '#253D2E',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 44,
        },
        indicator: {
          backgroundColor: '#253D2E',
          height: 2,
          borderRadius: 1,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#DDD5C8',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: '1px solid #DDD5C8',
          boxShadow: 'none',
          borderRadius: '6px !important',
          backgroundColor: '#FDFAF5',
          overflow: 'hidden',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
            borderColor: '#B0A292',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: '#F0EBE2',
          '&.Mui-expanded': {
            minHeight: 48,
            borderBottom: '1px solid #DDD5C8',
          },
        },
        content: {
          '&.Mui-expanded': {
            margin: '12px 0',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#B0A292',
          '&.Mui-checked': {
            color: '#253D2E',
          },
          padding: '4px 8px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: FONT_BODY,
          fontSize: '0.9rem',
          borderRadius: 7,
        },
        standardInfo: {
          backgroundColor: 'rgba(181, 98, 45, 0.08)',
          color: '#8F4D23',
          '& .MuiAlert-icon': {
            color: '#B5622D',
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: '#253D2E',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#F5F0E8',
          borderRight: '1px solid #DDD5C8',
        },
      },
    },
  },
});

export { FONT_MONO };
