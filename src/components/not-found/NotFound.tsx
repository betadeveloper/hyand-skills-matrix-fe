import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import image from './404error.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Endpoint } from '../../routes/endpoint';

const theme = createTheme({
  typography: {
    fontFamily: 'Open Sans',
    h2: {
      fontSize: '36px',
      lineHeight: '44px',
      color: '#979797',
      textAlign: 'center',
      fontWeight: 600,
    },
    h3: {
      fontSize: '24px',
      lineHeight: '112px',
      color: '#979797',
      letterSpacing: '-1.5px',
      textAlign: 'center',
      fontWeight: 600,
    },
  },
});
const NotFound = ({ marginTop }: { marginTop?: string }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(Endpoint.MAIN_PAGE);
  };
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: marginTop || '146px',
        }}
      >
        <Typography variant="h2">Oops!</Typography>
        <Box
          sx={{
            width: '432px',
            height: '234px',
            marginTop: '69px',
          }}
        >
          <img src={image} alt="error" />
        </Box>
        <Typography variant="h3">Error: 404 Page Not Found</Typography>
        <Button
          onClick={handleClick}
          sx={{
            fontFamily: 'Roboto',
            variant: 'contained',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
            width: '195px',
            height: '42px',
            background: '#404CFA',
            boxShadow:
              '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)',
            borderRadius: '4px',
            color: '#FFFFFF',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: '#404CFA',
              color: '#FFFFFF',
            },
          }}
        >
          Back to main page
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default NotFound;
