import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#FAFBFD',
    },
    primary: {
      main: '#0092E1',
    },
    secondary: {
      main: '#03C48D',
    },
  },
  typography: {
    fontFamily: 'Raleway',
    h1: {
      fontSize: '36px',
      fontWeight: 600,
      lineHeight: '44px',
    },
    h2: {
      fontSize: '32px',
      fontWeight: 600,
      lineHeight: '40px',
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '32px',
    },
    h4: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '28px',
    },
    h5: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '24px',
    },
    h6: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '22px',
    },
  },
});

export default theme;