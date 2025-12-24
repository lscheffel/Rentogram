import { createTheme, ThemeOptions } from '@mui/material/styles';

// Cores imobiliárias: azul para confiança, verde para crescimento, neutros para estabilidade
const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: {
    main: '#1976d2', // Azul primário
  },
  secondary: {
    main: '#388e3c', // Verde
  },
  background: {
    default: '#f5f5f5', // Neutro claro
    paper: '#ffffff',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
  },
};

const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  primary: {
    main: '#1976d2', // Azul primário consistente
  },
  secondary: {
    main: '#388e3c', // Verde consistente
  },
  background: {
    default: '#121212', // Fundo escuro
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
  },
};

const commonThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: lightPalette,
});

export const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: darkPalette,
});