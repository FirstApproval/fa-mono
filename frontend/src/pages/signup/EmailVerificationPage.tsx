import { type FunctionComponent } from 'react';
import { Alert, Button, Link, Snackbar, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { type SignUpStore } from './SignUpStore';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  Logo,
  Parent,
  Header
} from '../common.styled';

interface EmailVerificationPageProps {
  store: SignUpStore;
  onSignInClick: () => void;
}

export const EmailVerificationPage: FunctionComponent<EmailVerificationPageProps> =
  observer((props: EmailVerificationPageProps) => {
    const isError = props.store.isError;

    return (
      <Parent>
        <FlexHeader>
          <Logo>First Approval</Logo>
          <FlexHeaderRight>
            <Button
              variant="outlined"
              size={'large'}
              onClick={props.onSignInClick}>
              Sign in
            </Button>
          </FlexHeaderRight>
        </FlexHeader>
        <FlexBodyCenter>
          <FlexBody>
            <Header>Check your email</Header>
            <EmailLabel>
              We&apos;ve sent you a six-digit confirmation code to{' '}
              <b>{props.store.email}</b>. Please enter it below to confirm your
              email address.
            </EmailLabel>
            <div>
              <FullWidthTextField
                value={props.store.code}
                onChange={(e) => {
                  const code = e.currentTarget.value;
                  props.store.code = code;
                  if (code.length === 6) {
                    void props.store.submitSubmitRegistrationRequest();
                  }
                }}
                label="Enter 6-digit code"
                variant="outlined"
              />
            </div>
            <ForgotPasswordLabel>
              <Link href="#" color="inherit">
                Send code again
              </Link>
            </ForgotPasswordLabel>
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
`;

const EmailLabel = styled('div')`
  margin-top: 24px;
  margin-bottom: 32px;
  font-weight: 400;
  font-size: 20px;
`;

const ForgotPasswordLabel = styled('div')`
  margin-top: 16px;
  font-weight: 400;
  font-size: 20px;
`;
