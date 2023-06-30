import './App.css';
import { type FunctionComponent, useState } from 'react';
import { SignInPage } from './pages/login/SignInPage';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { SignUpPage } from './pages/signup/SignUpPage';
import { EnterNamePage } from './pages/signup/EnterNamePage';
import { SetPasswordPage } from './pages/signup/SetPasswordPage';
import { LoadingPage } from './pages/LoadingPage';
import { HomePage } from './pages/HomePage';
import { observer } from 'mobx-react-lite';
import { SignUpStore } from './pages/signup/SignUpStore';
import { Page } from './core/RouterStore';
import { EmailVerificationPage } from './pages/signup/EmailVerificationPage';
import { routerStore } from './core/router';
import { SignInStore } from './pages/login/SignInStore';
import { RestorePasswordEmail } from './pages/restore-password/RestorePasswordEmail';
import { RestorePasswordStore } from './pages/restore-password/RestorePasswordStore';

const App: FunctionComponent = observer(() => {
  const { page, setPage } = routerStore;

  const [signInStore] = useState(() => new SignInStore());
  const [signUpStore] = useState(() => new SignUpStore());
  const [restorePasswordStore] = useState(() => new RestorePasswordStore());

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {page === Page.LOADING && <LoadingPage />}
      {page === Page.HOME_PAGE && <HomePage />}
      {page === Page.SIGN_IN && (
        <SignInPage
          store={signInStore}
          onSignUpClick={() => {
            setPage(Page.SIGN_UP);
          }}
          onRestorePasswordClick={() => {
            setPage(Page.RESTORE_PASSWORD_EMAIL);
          }}
        />
      )}
      {page === Page.SIGN_UP && (
        <SignUpPage
          store={signUpStore}
          onSignInClick={() => {
            setPage(Page.SIGN_IN);
          }}
          onContinueClick={() => {
            setPage(Page.SIGN_UP_NAME);
          }}
        />
      )}
      {page === Page.SIGN_UP_NAME && (
        <EnterNamePage
          store={signUpStore}
          onSignInClick={() => {
            setPage(Page.SIGN_IN);
          }}
          onContinueClick={() => {
            setPage(Page.SIGN_UP_PASSWORD);
          }}
        />
      )}
      {page === Page.SIGN_UP_PASSWORD && (
        <SetPasswordPage
          store={signUpStore}
          onSignInClick={() => {
            setPage(Page.SIGN_IN);
          }}
          onContinueClick={() => {
            if (!signUpStore.isSubmitting) {
              void signUpStore.submitRegistrationRequest().then(() => {
                if (!signUpStore.isError) {
                  setPage(Page.EMAIL_VERIFICATION);
                }
              });
            }
          }}
        />
      )}
      {page === Page.EMAIL_VERIFICATION && (
        <EmailVerificationPage
          store={signUpStore}
          onSignInClick={() => {
            setPage(Page.SIGN_IN);
          }}
        />
      )}
      {page === Page.RESTORE_PASSWORD_EMAIL && (
        <RestorePasswordEmail
          store={restorePasswordStore}
          onSignInClick={() => {
            setPage(Page.SIGN_IN);
          }}
          onContinueClick={() => {
            if (!restorePasswordStore.isSubmitting) {
              void restorePasswordStore
                .submitRegistrationRequest()
                .then(() => {});
            }
          }}
        />
      )}
    </ThemeProvider>
  );
});

export default App;
