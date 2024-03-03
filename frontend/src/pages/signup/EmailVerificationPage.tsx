import React, { type FunctionComponent, useEffect, useState } from 'react';
import { Alert, Link, Snackbar, TextField, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import {
  REGISTRATION_CONFIRMATION_TOKEN_STORAGE_KEY,
  type SignUpStore
} from './SignUpStore';
import { FlexBody, FlexBodyCenter, Header, Parent } from '../common.styled';
import { routerStore } from '../../core/router';
import { authStore } from '../../core/auth';
import { HeaderComponent } from '../../components/HeaderComponent';
import { UserStore } from 'src/core/UserStore';

interface EmailVerificationPageProps {
  email: string;
  store: SignUpStore;
  userStore: UserStore;
  onSignInClick: () => void;
  onContinueClick: () => void;
  isRegistration: boolean;
}

export const EmailVerificationPage: FunctionComponent<EmailVerificationPageProps> =
  observer((props: EmailVerificationPageProps) => {
    const isError = props.store.isError;
    const [code, setCode] = useState('');
    const [emailConfirmationToken, setEmailConfirmationToken] = useState('');

    useEffect(() => {
      const codeFromUrl = routerStore.lastPathSegment;
      if (codeFromUrl) {
        const registrationConfirmationTokenFromUrl =
          routerStore.registrationConfirmationPath;
        if (props.isRegistration && registrationConfirmationTokenFromUrl) {
          props.store.lastResponse = {
            registrationToken: registrationConfirmationTokenFromUrl
          };
          void props.store.submitRegistrationRequest(codeFromUrl);
          localStorage.removeItem(REGISTRATION_CONFIRMATION_TOKEN_STORAGE_KEY);
        } else {
          const emailConfirmationTokenFromUrl =
            routerStore.emailConfirmationToken;
          if (emailConfirmationTokenFromUrl) {
            void props.userStore
              .confirmChangeEmail(codeFromUrl, emailConfirmationTokenFromUrl)
              .then(() => {
                props.userStore.changeEmailConfirmationToken = undefined;
                props.onContinueClick();
              });
          }
        }
      }
    }, []);

    return (
      <Parent>
        <HeaderComponent showLoginOutlinedButton={false} />
        <FlexBodyCenter>
          <FlexBody>
            <Header>Check your email</Header>
            <EmailLabel variant={'body'} component={'div'}>
              We&apos;ve sent you a six-digit confirmation code to{' '}
              <b>{props.email}</b>. Please enter it below to confirm your email
              address.
            </EmailLabel>
            <div>
              <FullWidthTextField
                error={props.store.isCodeError}
                helperText={
                  props.store.isCodeError ? 'Invalid code' : undefined
                }
                type={'number'}
                value={code}
                onChange={(e) => {
                  const code = e.currentTarget.value;
                  setCode(code);
                  if (code.length === 6) {
                    if (props.isRegistration) {
                      void props.store
                        .submitRegistrationRequest(code)
                        .then(() => {
                          setCode('');
                          setEmailConfirmationToken('');
                          if (authStore.token) {
                            localStorage.removeItem(
                              REGISTRATION_CONFIRMATION_TOKEN_STORAGE_KEY
                            );
                            props.onContinueClick();
                          }
                        });
                    } else {
                      void props.userStore
                        .confirmChangeEmail(
                          code,
                          props.userStore.changeEmailConfirmationToken!
                        )
                        .then(() => {
                          setCode('');
                          setEmailConfirmationToken('');
                          props.userStore.changeEmailConfirmationToken =
                            undefined;
                          props.onContinueClick();
                        });
                    }
                  }
                }}
                label="Enter 6-digit code"
                variant="outlined"
              />
            </div>
            <SendCodeAgain variant={'body'} component={'div'}>
              <Link
                color="inherit"
                onClick={async () => {
                  await props.store.sendCodeAgain();
                }}>
                Send code again
              </Link>
            </SendCodeAgain>
          </FlexBody>
        </FlexBodyCenter>
        {isError && (
          <Snackbar
            open={isError}
            autoHideDuration={6000}
            onClose={() => {
              props.store.isError = false;
            }}>
            <Alert
              onClose={() => {
                props.store.isError = false;
              }}
              severity="error"
              sx={{ width: '100%' }}>
              Verification failed
            </Alert>
          </Snackbar>
        )}
      </Parent>
    );
  });

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const EmailLabel = styled(Typography)`
  margin-top: 24px;
  margin-bottom: 32px;
` as typeof Typography;

const SendCodeAgain = styled(Typography)`
  margin-top: 16px;
` as typeof Typography;
