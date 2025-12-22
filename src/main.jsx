import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6a327aff',
      contrastText: '#ffd61fff',
    },
    secondary: {
      main: '#ffd61fff', // purple
    },
    trim: {
      main: '#ffb11fff', // orange
    },
  },
  typography: {
    fontFamily: `'Space Grotesk', system-ui, -apple-system, sans-serif`,
  },
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
