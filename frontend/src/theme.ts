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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        },
        outlined: {
          textTransform: 'none'
        },
        outlinedPrimary: {
          color: '#040036',
          borderColor: '#040036'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          padding: '13px 14px !important'
        }
      }
    }
  }
});
