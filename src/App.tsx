import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './App.css';
import theme from './theme';
import { RouterProvider } from 'react-router';
import {routes} from './routes/routes';

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={routes} />
      </ThemeProvider>
  );
}

export default App;