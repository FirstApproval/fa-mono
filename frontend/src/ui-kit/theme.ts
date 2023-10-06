import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3B4EFF'
    },
    text: {
      primary: '#040036'
    }
  },
  typography: {
    body: {
      fontSize: '20px',
      fontWeight: 400,
      lineHeight: '32px',
      letterSpacing: '0.15px'
    },
    h5: {
      fontWeight: 600
    }
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '18px',
          fontWeight: 500,
          lineHeight: '26px',
          letterSpacing: '0.46px'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        },
        outlined: {
          textTransform: 'none'
        },
        sizeLarge: {
          fontSize: '18px',
          fontWeight: 500,
          lineHeight: '26px',
          letterSpacing: '0.46px'
        },
        outlinedPrimary: {
          color: '#040036',
          borderColor: '#040036'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#040036'
        }
      }
    }
  }
});
