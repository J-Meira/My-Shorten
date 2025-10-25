import 'dayjs/locale/pt-br';
import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';

import { closeSnackbar, SnackbarProvider } from 'notistack';
import { MdClose as CloseIcon } from 'react-icons/md';

import { CssBaseline, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DialogBox, Loading } from './components';

import { GlobalError } from './pages';

import { useAppSelector } from './redux/hooks';

export const App = () => {
  const { isDark } = useAppSelector((state) => state.system);

  const theme = useMemo(
    () =>
      createTheme({
        palette: isDark
          ? {
              mode: 'dark',
              primary: { main: '#f5bc6f' },
              secondary: { main: '#dec2a1' },
              error: { main: '#F6285F' },
              success: { main: '#b9cda0' },
              warning: { main: '#F79E1B' },
              info: { main: '#6d99fb' },
            }
          : {
              mode: 'light',
              primary: { main: '#805611' },
              secondary: { main: '#705b40' },
              error: { main: '#ba1a1a' },
              success: { main: '#52643f' },
              warning: { main: '#F79E1B' },
              info: { main: '#6d99fb' },
            },
      }),
    [isDark],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        autoHideDuration={3000}
        maxSnack={5}
        action={(snackbarId) => (
          <IconButton
            size='small'
            onClick={() => closeSnackbar(snackbarId)}
          >
            <CloseIcon />
          </IconButton>
        )}
      >
        <ErrorBoundary FallbackComponent={GlobalError}>
          <HelmetProvider>
            <Outlet />
            <DialogBox />
            <Loading />
          </HelmetProvider>
        </ErrorBoundary>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
