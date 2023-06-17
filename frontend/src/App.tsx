import './App.css';
import { type FunctionComponent, useEffect, useState } from 'react';
import { SignInPage } from './pages/login/SignInPage';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { SignUpPage } from './pages/login/SignUpPage';
import { EnterNamePage } from './pages/signup/EnterNamePage';
import { SetPasswordPage } from './pages/signup/SetPasswordPage';
import { usePath } from './core/history';
import { authStore } from './core/auth';
import { LoadingPage } from './pages/LoadingPage';
import { Alert, Snackbar } from '@mui/material';
import { HomePage } from './pages/HomePage';
import { observer } from 'mobx-react-lite';

enum Page {
  LOADING,

  SIGN_IN,
  SIGN_UP,

  HOME_PAGE,

  SIGN_UP_NAME,
  SIGN_UP_PASSWORD
}

const App: FunctionComponent = observer(() => {
  const [page, setPage] = useState(Page.LOADING);

  const { path, queryParams } = usePath();

  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (path === '/google-callback') {
      const code = queryParams.get('code');
      if (code !== null) {
        authStore
          .exchangeToken(code)
          .then(() => {
            window.history.replaceState({}, document.title, '/');
            setPage(Page.HOME_PAGE);
          })
          .catch(() => {
            setAuthError(true);
            setPage(Page.SIGN_IN);
          });
      }
    } else {
      const token = authStore.token;
      if (token !== undefined) {
        setPage(Page.HOME_PAGE);
      } else {
        setPage(Page.SIGN_IN);
      }
    }
  }, [path, queryParams]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {page === Page.LOADING && <LoadingPage />}
      {page === Page.HOME_PAGE && <HomePage />}
      {page === Page.SIGN_IN && (
        <SignInPage
          onSignUpClick={() => {
            setPage(Page.SIGN_UP);
          }}
        />
      )}
      {page === Page.SIGN_UP && <SignUpPage onContinueClick={() => {}} />}
      {page === Page.SIGN_UP_NAME && <EnterNamePage onSignUpClick={() => {}} />}
      {page === Page.SIGN_UP_PASSWORD && (
        <SetPasswordPage onSignUpClick={() => {}} />
      )}
      {authError && (
        <Snackbar
          open={authError}
          autoHideDuration={6000}
          onClose={() => {
            setAuthError(false);
          }}>
          <Alert
            onClose={() => {
              setAuthError(false);
            }}
            severity="error"
            sx={{ width: '100%' }}>
            Authorization failed
          </Alert>
        </Snackbar>
      )}
    </ThemeProvider>
  );
});

export default App;
