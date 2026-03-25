import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#253D2E',
      light: '#3D6B4F',
      dark: '#162218',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#B5622D',
      light: '#D4845A',
      dark: '#8A4520',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F0E8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1208',
      secondary: '#6B5B4F',
    },
    grey: {
      100: '#F0EBE2',
      200: '#EDE8DF',
      300: '#DDD5C8',
      400: '#C8BFB4',
      500: '#9E9088',
      600: '#7D7068',
      700: '#6B5B4F',
      800: '#4A3D35',
      900: '#1A1208',
    },
    divider: '#DDD5C8',
    success: {
      main: '#3D6B4F',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#3A5270',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#A83030',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"DM Sans", -apple-system, sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      fontSize: '3.75rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.08,
      color: '#1A1208',
    },
    h2: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      fontSize: '2.75rem',
      letterSpacing: '-0.015em',
      lineHeight: 1.12,
      color: '#1A1208',
    },
    h3: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      fontSize: '2.25rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.18,
      color: '#1A1208',
    },
    h4: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      fontSize: '1.875rem',
      letterSpacing: '-0.005em',
      lineHeight: 1.22,
      color: '#1A1208',
      textTransform: 'none',
    },
    h5: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.0625rem',
      letterSpacing: '0',
      lineHeight: 1.4,
      color: '#1A1208',
      textTransform: 'none',
    },
    h6: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: '0.9375rem',
      letterSpacing: '0',
      lineHeight: 1.45,
      color: '#1A1208',
      textTransform: 'none',
    },
    body1: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 400,
      fontSize: '0.9375rem',
      letterSpacing: '0',
      lineHeight: 1.65,
      color: '#1A1208',
    },
    body2: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 400,
      fontSize: '0.8125rem',
      letterSpacing: '0',
      lineHeight: 1.6,
      color: '#6B5B4F',
    },
    subtitle1: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 500,
      fontSize: '0.9375rem',
      letterSpacing: '0',
      lineHeight: 1.5,
      color: '#1A1208',
    },
    subtitle2: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: '0.6875rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      lineHeight: 1.6,
      color: '#6B5B4F',
    },
    button: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      letterSpacing: '0',
      lineHeight: 1.5,
      color: '#9E9088',
    },
    overline: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: '0.625rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      lineHeight: 2.5,
      color: '#6B5B4F',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(26, 18, 8, 0.06)',
    '0 1px 3px rgba(26, 18, 8, 0.06), 0 2px 8px rgba(26, 18, 8, 0.06)',
    '0 1px 3px rgba(26, 18, 8, 0.05), 0 4px 20px rgba(26, 18, 8, 0.07)',
    '0 2px 6px rgba(26, 18, 8, 0.07), 0 6px 24px rgba(26, 18, 8, 0.09)',
    '0 4px 12px rgba(26, 18, 8, 0.08), 0 12px 32px rgba(26, 18, 8, 0.1)',
    '0 4px 12px rgba(26, 18, 8, 0.08), 0 12px 32px rgba(26, 18, 8, 0.1)',
    '0 4px 12px rgba(26, 18, 8, 0.08), 0 12px 32px rgba(26, 18, 8, 0.1)',
    '0 4px 12px rgba(26, 18, 8, 0.08), 0 12px 32px rgba(26, 18, 8, 0.1)',
    '0 6px 16px rgba(26, 18, 8, 0.1), 0 20px 48px rgba(26, 18, 8, 0.12)',
    '0 6px 16px rgba(26, 18, 8, 0.1), 0 20px 48px rgba(26, 18, 8, 0.12)',
    '0 6px 16px rgba(26, 18, 8, 0.1), 0 20px 48px rgba(26, 18, 8, 0.12)',
    '0 6px 16px rgba(26, 18, 8, 0.1), 0 20px 48px rgba(26, 18, 8, 0.12)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
    '0 8px 20px rgba(26, 18, 8, 0.12), 0 28px 60px rgba(26, 18, 8, 0.14)',
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
          backgroundColor: '#FFFFFF',
        },
        elevation3: {
          boxShadow: '0 1px 3px rgba(26, 18, 8, 0.05), 0 4px 20px rgba(26, 18, 8, 0.07)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(26, 18, 8, 0.05), 0 4px 20px rgba(26, 18, 8, 0.07)',
          border: '1px solid rgba(221, 213, 200, 0.6)',
          borderRadius: 12,
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 2px 6px rgba(26, 18, 8, 0.08), 0 8px 28px rgba(26, 18, 8, 0.11)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '9px 22px',
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '0.875rem',
          transition: 'all 0.15s ease',
        },
        containedPrimary: {
          backgroundColor: '#253D2E',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#1A2E22',
            boxShadow: '0 2px 8px rgba(37, 61, 46, 0.35)',
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
            backgroundColor: '#9A5225',
            boxShadow: '0 2px 8px rgba(181, 98, 45, 0.35)',
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          borderColor: '#253D2E',
          color: '#253D2E',
          '&:hover': {
            borderColor: '#1A2E22',
            backgroundColor: 'rgba(37, 61, 46, 0.05)',
          },
        },
        outlinedError: {
          borderColor: '#C8A0A0',
          color: '#A83030',
          '&:hover': {
            borderColor: '#A83030',
            backgroundColor: 'rgba(168, 48, 48, 0.05)',
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
          borderRadius: 10,
        },
        sizeSmall: {
          padding: '5px 14px',
          fontSize: '0.8125rem',
          borderRadius: 6,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.15s ease',
          '&:hover': {
            backgroundColor: 'rgba(37, 61, 46, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 5,
          height: 24,
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
            fontFamily: '"DM Sans", sans-serif',
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#DDD5C8',
              transition: 'border-color 0.15s ease',
            },
            '&:hover fieldset': {
              borderColor: '#9E9088',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#253D2E',
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"DM Sans", sans-serif',
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#9E9088',
            opacity: 1,
            fontFamily: '"DM Sans", sans-serif',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 500,
          fontSize: '0.875rem',
          textTransform: 'none',
          letterSpacing: '0',
          color: '#6B5B4F',
          padding: '10px 0',
          marginRight: '24px',
          minWidth: 'unset',
          '&.Mui-selected': {
            color: '#253D2E',
            fontWeight: 700,
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
          borderRadius: '8px !important',
          overflow: 'hidden',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
            borderColor: '#9E9088',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: '#FDFAF5',
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
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(26, 18, 8, 0.16), 0 32px 72px rgba(26, 18, 8, 0.18)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 600,
          fontSize: '1.375rem',
          color: '#1A1208',
          borderBottom: '1px solid #DDD5C8',
          paddingBottom: 16,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#9E9088',
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
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.875rem',
          borderRadius: 10,
        },
        standardInfo: {
          backgroundColor: '#EEF3F0',
          color: '#253D2E',
          '& .MuiAlert-icon': {
            color: '#3D6B4F',
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
  },
});
