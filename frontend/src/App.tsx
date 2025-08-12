import './App.css';
import React, {type FunctionComponent, useState} from 'react';
import {SignInPage} from './pages/login/SignInPage';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from './ui-kit/theme';
import {SignUpPage} from './pages/signup/SignUpPage';
import {EnterNamePage} from './pages/signup/EnterNamePage';
import {SetPasswordPage} from './pages/signup/SetPasswordPage';
import {LoadingPage} from './pages/LoadingPage';
import {HomePage} from './pages/home/HomePage';
import {CollaborationsPage} from './pages/collaborations/CollaborationsPage';
import {MyPublicationCollaborationChatPage} from './pages/collaborations/chat/MyPublicationCollaborationChatPage';
import {observer} from 'mobx-react-lite';
import {SignUpStore} from './pages/signup/SignUpStore';
import {EmailVerificationPage} from './pages/signup/EmailVerificationPage';
import {routerStore} from './core/router';
import {SignInStore} from './pages/login/SignInStore';
import {RestorePasswordEmailPage} from './pages/restore/send-email/RestorePasswordEmailPage';
import {RestorePasswordStore} from './pages/restore/send-email/RestorePasswordStore';
import {PublicationPage} from './pages/publication/PublicationPage';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';
import {ProfilePage} from './pages/user/ProfilePage';
import {AccountPage} from './pages/user/AccountPage';
import {ResetPasswordPage} from './pages/restore/set-password/RestorePasswordPage';
import {SharingOptionsPage} from './pages/publication/SharingOptionsPage';
import logo from '../src/assets/logo-black.svg';
import developing from '../src/assets/developing.svg';
import {Button} from '@mui/material';
import DesktopMacOutlinedIcon from '@mui/icons-material/DesktopMacOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import {Page} from './core/router/constants';
import {EnterAffiliationsPage} from './pages/signup/EnterAffiliationsPage';
import {userStore} from './core/user';
import {ContactsPage} from './pages/contacts/ContactsPage';
import {EnterEmailPage} from './pages/signup/EnterEmailPage';
import {ContestPage} from "./pages/contest/ContestPage";
import {ChooseDataCollectionPage} from "./pages/publication/ChooseDataCollection"
import {DownloadedCollaborationChatPage} from "./pages/collaborations/chat/DownloadedCollaborationChatPage"
import { PublicationCollaborationsPage } from "./pages/collaborations/PublicationCollaborationsPage"


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
          <>
              {page === Page.LOADING && <LoadingPage />}
              {page === Page.HOME_PAGE && <HomePage key={routerStore.key} />}
              {page === Page.CONTACTS_PAGE && (
                <ContactsPage key={routerStore.key} />
              )}
              {page === Page.CHOOSE_DATA_COLLECTION_PAGE && (
                <ChooseDataCollectionPage
                  key={routerStore.key}
                  dataCollectionType={routerStore.payload.dataCollectionType}
                />
              )}
              {page === Page.COLLABORATIONS_PAGE && (
                <CollaborationsPage key={routerStore.key} />
              )}
              {page === Page.MY_PUBLICATION_COLLABORATION_CHAT && (
                <MyPublicationCollaborationChatPage key={routerStore.key} />
              )}
              {page === Page.DOWNLOADED_PUBLICATION_COLLABORATIONS_CHAT && (
                <DownloadedCollaborationChatPage key={routerStore.key} />
              )}
              {page === Page.MY_PUBLICATION_COLLABORATIONS && (
                <PublicationCollaborationsPage key={routerStore.key} />
              )}
              {page === Page.PUBLICATION && (
                <PublicationPage key={routerStore.key} />
              )}
              {page === Page.SHARING_OPTIONS && (
                <SharingOptionsPage
                  publicationTitle={routerStore.payload.publicationTitle}
                  publicationSummary={routerStore.payload.publicationSummary}
                  licenseType={routerStore.payload.licenseType}
                  dataCollectionType={routerStore.payload.dataCollectionType}
                  filesSize={routerStore.payload.filesSize}
                />
              )}
              {page === Page.PROFILE && <ProfilePage key={routerStore.key} />}
              {page === Page.ACCOUNT && <AccountPage key={routerStore.key} />}
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
              {page === Page.CONTEST_PAGE && <ContestPage/>}
              {page === Page.SIGN_UP && (
                <SignUpPage
                  store={signUpStore}
                  onSignInClick={() => {
                    navigatePage(Page.SIGN_IN);
                  }}
                  onContinueClick={() => {
                    void signUpStore.getUnconfirmedFullName();
                    navigatePage(Page.SIGN_UP_NAME);
                  }}
                />
              )}
              {page === Page.SIGN_UP_NAME && (
                <EnterNamePage
                  firstName={signUpStore.firstName}
                  lastName={signUpStore.lastName}
                  isOauth={false}
                  isPrefilledFullName={signUpStore.isPrefilledFullName}
                  setFirstName={(value) => (signUpStore.firstName = value)}
                  setLastName={(value) => (signUpStore.lastName = value)}
                  onContinueClick={() => {
                    navigatePage(Page.SIGN_UP_PASSWORD);
                  }}
                />
              )}
              {page === Page.NAME && userStore.editableUser && (
                <EnterNamePage
                  firstName={userStore.editableUser!.firstName}
                  lastName={userStore.editableUser!.lastName}
                  isOauth={true}
                  isPrefilledFullName={signUpStore.isPrefilledFullName}
                  setFirstName={(value) =>
                    (userStore.editableUser!.firstName = value)
                  }
                  setLastName={(value) =>
                    (userStore.editableUser!.lastName = value)
                  }
                  onContinueClick={() => {
                    userStore.updateUser([], true).then(() => {
                      navigatePage(Page.AFFILIATIONS, '/', false, {
                        isRegistration: true
                      });
                    });
                  }}
                />
              )}
              {page === Page.EMAIL && userStore.editableUser && (
                <EnterEmailPage
                  onContinueClick={() => {
                    userStore.updateUser([]).then(() => {
                      navigatePage(Page.CHANGE_EMAIL_VERIFICATION);
                    });
                  }}
                  signUpStore={signUpStore}
                  userStore={userStore}
                />
              )}
              {page === Page.AFFILIATIONS && (
                <EnterAffiliationsPage
                  isRegistration={routerStore.payload.isRegistration}
                  onContinueClick={() => void routerStore.navigateAfterLogin()}
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
                      void signUpStore.sendCodeAgain().then(() => {
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
                  email={signUpStore.email}
                  store={signUpStore}
                  userStore={userStore}
                  onSignInClick={() => {
                    navigatePage(Page.SIGN_IN);
                  }}
                  onContinueClick={() => {
                    navigatePage(Page.AFFILIATIONS, '/', false, {
                      isRegistration: true
                    });
                  }}
                  isRegistration={true}
                />
              )}
              {page === Page.CHANGE_EMAIL_VERIFICATION && (
                <EmailVerificationPage
                  email={userStore.newEmail!}
                  store={signUpStore}
                  userStore={userStore}
                  onSignInClick={() => {
                    navigatePage(Page.SIGN_IN);
                  }}
                  onContinueClick={() =>
                    navigatePage(Page.HOME_PAGE, '/', true)
                  }
                  isRegistration={false}
                />
              )}
              {page === Page.RESET_PASSWORD && (
                <ResetPasswordPage
                  onSignInClick={() => {
                    navigatePage(Page.SIGN_IN);
                  }}
                  onSignUpClick={() => {
                    navigatePage(Page.SIGN_UP);
                  }}></ResetPasswordPage>
              )}
              {page === Page.RESTORE_PASSWORD_EMAIL && (
                <RestorePasswordEmailPage
                  store={restorePasswordStore}
                  onSignUpClick={() => {
                    navigatePage(Page.SIGN_UP);
                  }}
                  onSignInClick={() => {
                    navigatePage(Page.SIGN_IN);
                  }}
                />
              )}
            </>
        </ThemeProvider>
      </DndProvider>
    </>
  );
});

export default App;
