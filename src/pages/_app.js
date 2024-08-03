// pages/_app.js
import { ClerkProvider } from '@clerk/nextjs';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import { light } from '@clerk/themes';
import { CssBaseline } from '@mui/material';
import '../style.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
  }
});

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider appearance={{ baseTheme: light, variables: { colorPrimary: '#556cd6'} }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default MyApp;
