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

enum Page {
  SIGN_IN,
  SIGN_UP,

  AUTH_CALLBACK,

  SIGN_UP_NAME,
  SIGN_UP_PASSWORD,
}

const App: FunctionComponent = () => {
  const [page, setPage] = useState(Page.SIGN_IN);

  const { path, queryParams } = usePath();

  useEffect(() => {
    if (path === '/google-callback') {
      const code = queryParams.get('code');
      if (code !== null) {
        authStore.exchangeToken(code);
      }
    }
  }, [path, queryParams]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
};

export default App;
