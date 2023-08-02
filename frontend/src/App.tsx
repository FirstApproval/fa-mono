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
import { HomePage } from './pages/home/HomePage';
import { observer } from 'mobx-react-lite';
import { SignUpStore } from './pages/signup/SignUpStore';
import { Page } from './core/RouterStore';
import { EmailVerificationPage } from './pages/signup/EmailVerificationPage';
import { routerStore } from './core/router';
import { SignInStore } from './pages/login/SignInStore';
import { RestorePasswordEmailPage } from './pages/restore/send-email/RestorePasswordEmailPage';
import { RestorePasswordStore } from './pages/restore/send-email/RestorePasswordStore';
import { PublicationPage } from './pages/publication/PublicationPage';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { ProfilePage } from './pages/user/ProfilePage';
import { AccountPage } from './pages/user/AccountPage';
import { ResetPasswordPage } from './pages/restore/set-password/RestorePasswordPage';

const App: FunctionComponent = observer(() => {
  const { page, navigatePage } = routerStore;

  const [signInStore] = useState(() => new SignInStore());
  const [signUpStore] = useState(() => new SignUpStore());
  const [restorePasswordStore] = useState(() => new RestorePasswordStore());

  return (
    <>
      {/*
      // @ts-expect-error error types */}
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {page === Page.LOADING && <LoadingPage />}
          {page === Page.HOME_PAGE && <HomePage />}
          {page === Page.PUBLICATION && <PublicationPage />}
          {page === Page.PROFILE && <ProfilePage />}
          {page === Page.ACCOUNT && <AccountPage />}
          {page === Page.SIGN_IN && (
            <SignInPage
              store={signInStore}
              onSignUpClick={() => {
                navigatePage(Page.SIGN_UP);
              }}
              onRestorePasswordClick={() => {
                navigatePage(Page.RESTORE_PASSWORD_EMAIL);
              }}
            />
          )}
          {page === Page.SIGN_UP && (
            <SignUpPage
              store={signUpStore}
              onSignInClick={() => {
                navigatePage(Page.SIGN_IN);
              }}
              onContinueClick={() => {
                navigatePage(Page.SIGN_UP_NAME);
              }}
            />
          )}
          {page === Page.SIGN_UP_NAME && (
            <EnterNamePage
              store={signUpStore}
              onSignInClick={() => {
                navigatePage(Page.SIGN_IN);
              }}
              onContinueClick={() => {
                navigatePage(Page.SIGN_UP_PASSWORD);
              }}
            />
          )}
          {page === Page.SIGN_UP_PASSWORD && (
            <SetPasswordPage
              store={signUpStore}
              onSignInClick={() => {
                navigatePage(Page.SIGN_IN);
              }}
              onContinueClick={() => {
                if (!signUpStore.isSubmitting) {
                  void signUpStore.submitRegistrationRequest().then(() => {
                    if (!signUpStore.isError) {
                      navigatePage(Page.EMAIL_VERIFICATION);
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
                navigatePage(Page.SIGN_IN);
              }}
            />
          )}
          {page === Page.RESTORE_PASSWORD && (
            <ResetPasswordPage
              onSignUpClick={() => {
                setPage(Page.SIGN_UP);
              }}></ResetPasswordPage>
          )}
          {page === Page.RESTORE_PASSWORD_EMAIL && (
            <RestorePasswordEmailPage
              store={restorePasswordStore}
              onSignUpClick={() => {
                setPage(Page.SIGN_UP);
              }}
              onSignInClick={() => {
                navigatePage(Page.SIGN_IN);
              }}
            />
          )}
        </ThemeProvider>
      </DndProvider>
    </>
  );
});

export default App;
