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
  },
});

export default theme;
