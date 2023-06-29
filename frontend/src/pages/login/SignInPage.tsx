import { type FunctionComponent } from 'react';
import {
  Alert,
  Button,
  Divider,
  Link,
  Snackbar,
  TextField
} from '@mui/material';
import styled from '@emotion/styled';
import { LoginOauth } from './LoginOauth';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  FullWidthButton,
  Logo,
  Parent,
  Header
} from '../common.styled';
import { routerStore } from '../../core/router';
import { type SignInStore } from './SignInStore';
import { observer } from 'mobx-react-lite';

interface SignInPageProps {
  store: SignInStore;
  onSignUpClick: () => void;
  onRestorePasswordClick: () => void;
}

export const SignInPage: FunctionComponent<SignInPageProps> = observer(
  (props: SignInPageProps) => {
    const { initialPageError: authError, setInitialPageError } = routerStore;

    return (
      <Parent>
        <FlexHeader>
          <Logo>First Approval</Logo>
          <FlexHeaderRight>
            <Button
              variant="outlined"
              size={'large'}
              onClick={props.onSignUpClick}>
              Sign up
            </Button>
          </FlexHeaderRight>
        </FlexHeader>
        <FlexBodyCenter>
          <FlexBody>
            <Header>Sign in</Header>
            <LoginOauth />
            <EmailLabel>or use your email to sign in:</EmailLabel>
            <div>
              <FullWidthTextField
                autoFocus
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                value={props.store.email || null}
                onChange={(e) => {
                  props.store.setEmail(e.currentTarget.value);
                }}
                type={'email'}
                label="Email"
                variant="outlined"
                size={'medium'}
              />
            </div>
            <div>
              <FullWidthTextField
                type={'password'}
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                value={props.store.password || null}
                onChange={(e) => {
                  props.store.setPassword(e.currentTarget.value);
                }}
                label="Password"
                variant="outlined"
              />
            </div>
            <ForgotPasswordLabel>
              <Link color="inherit" onClick={props.onRestorePasswordClick}>
                I forgot my password
              </Link>
            </ForgotPasswordLabel>
            <FullWidthButton
              onClick={() => {
                void props.store.submitAuthorizationRequest();
              }}
              variant="contained"
              size={'large'}>
              Sign in
            </FullWidthButton>
            <DividerWrap />
            <CreateAccount>
              No account? <Link onClick={props.onSignUpClick}>Create one</Link>
            </CreateAccount>
            <FooterWrap>
              By clicking “Sign in” above, you acknowledge that you have read
              and understood, and agree to Terms & Conditions and Privacy
              Policy.
            </FooterWrap>
          </FlexBody>
        </FlexBodyCenter>
        {authError !== undefined && (
          <Snackbar
            open={authError !== undefined}
            autoHideDuration={6000}
            onClose={() => {
              setInitialPageError(undefined);
            }}>
            <Alert
              onClose={() => {
                setInitialPageError(undefined);
              }}
              severity="error"
              sx={{ width: '100%' }}>
              {authError}
            </Alert>
          </Snackbar>
        )}
      </Parent>
    );
  }
);

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`;

const EmailLabel = styled('div')`
  margin-top: 32px;
  margin-bottom: 24px;
  font-weight: 400;
  font-size: 20px;
`;

const ForgotPasswordLabel = styled('div')`
  margin-bottom: 36px;
`;

const DividerWrap = styled(Divider)`
  margin-top: 44px;
  margin-bottom: 48px;
  width: 100%;
`;

const CreateAccount = styled('div')`
  font-weight: 400;
  font-size: 20px;
`;

const FooterWrap = styled('div')`
  text-align: center;
  margin-top: 36px;
  font-weight: 400;
  font-size: 12px;
  color: #68676e;
`;