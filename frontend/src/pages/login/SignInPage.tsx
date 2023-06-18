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
  SignInHeader
} from '../common.styled';

interface SignInPageProps {
  authError: boolean;
  setAuthError: (value: boolean) => void;
  onSignUpClick: () => void;
}

export const SignInPage: FunctionComponent<SignInPageProps> = (
  props: SignInPageProps
) => {
  const { authError, setAuthError } = props;

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
          <SignInHeader>Sign in</SignInHeader>
          <LoginOauth />
          <EmailLabel>or use your email to sign in:</EmailLabel>
          <div>
            <FullWidthTextField label="Email" variant="outlined" />
          </div>
          <div>
            <FullWidthTextField label="Password" variant="outlined" />
          </div>
          <ForgotPasswordLabel>
            <Link href="#" color="inherit">
              I forgot my password
            </Link>
          </ForgotPasswordLabel>
          <FullWidthButton variant="contained" size={'large'}>
            Sign in
          </FullWidthButton>
          <DividerWrap />
          <CreateAccount>
            No account? <Link href="#">Create one</Link>
          </CreateAccount>
          <FooterWrap>
            By clicking “Sign in” above, you acknowledge that you have read and
            understood, and agree to Terms & Conditions and Privacy Policy.
          </FooterWrap>
        </FlexBody>
      </FlexBodyCenter>
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
    </Parent>
  );
};

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`;

const EmailLabel = styled('div')`
  margin-top: 24px;
  margin-bottom: 24px;
`;

const ForgotPasswordLabel = styled('div')`
  margin-bottom: 24px;
`;

const DividerWrap = styled(Divider)`
  margin-top: 40px;
  margin-bottom: 40px;
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
