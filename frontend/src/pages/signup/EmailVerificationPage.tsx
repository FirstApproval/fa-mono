import { type FunctionComponent } from 'react';
import { Alert, Button, Link, Snackbar, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { type SignUpStore } from './SignUpStore';

interface EmailVerificationPageProps {
  store: SignUpStore;
  onSignInClick: () => void;
  onContinueClick: () => void;
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
            <SignInHeader>Check your email</SignInHeader>
            <EmailLabel>
              We&apos;ve sent you a six-digit confirmation code to{' '}
              <b>{props.store.email}</b>. Please enter it below to confirm your
              email address.
            </EmailLabel>
            <div>
              <FullWidthTextField
                value={props.store.password}
                onChange={(e) => {
                  props.store.password = e.currentTarget.value;
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
              Registration failed
            </Alert>
          </Snackbar>
        )}
      </Parent>
    );
  });

const Parent = styled('div')`
  width: 100%;
`;

const FlexHeader = styled('div')`
  display: flex;
  padding: 40px;
  align-items: center;
`;

const FlexHeaderRight = styled('div')`
  margin-left: auto;
`;

const FlexBodyCenter = styled('div')`
  display: flex;
  justify-content: center;
`;

const FlexBody = styled('div')`
  width: 580px;
  padding-left: 40px;
  padding-right: 40px;
`;

const SignInHeader = styled('div')`
  font-weight: 700;
  font-size: 48px;
  margin-bottom: 16px;
`;

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

const Logo = styled('div')`
  font-weight: 860;
  font-size: 20px;
`;

const ForgotPasswordLabel = styled('div')`
  margin-top: 16px;
  font-weight: 400;
  font-size: 20px;
`;
