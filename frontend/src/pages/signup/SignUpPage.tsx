import { type FunctionComponent } from 'react';
import {
  Button,
  Divider,
  InputAdornment,
  Link,
  TextField
} from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward, MailOutlined } from '@mui/icons-material';
import { type SignUpStore } from './SignUpStore';
import { observer } from 'mobx-react-lite';
import { LoginOauth } from '../login/LoginOauth';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  Logo,
  Parent
} from '../common.styled';

interface SignUpPageProps {
  store: SignUpStore;
  onSignInClick: () => void;
  onContinueClick: () => void;
}

export const SignUpPage: FunctionComponent<SignUpPageProps> = observer(
  (props: SignUpPageProps) => {
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
            <SignInHeader>Sign up</SignInHeader>
            <EmailLabel>
              Join the future of scientific discovery today
            </EmailLabel>
            <div>
              <FullWidthTextField
                value={props.store.email}
                onChange={(e) => {
                  props.store.email = e.currentTarget.value;
                }}
                label="Email"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlined />
                    </InputAdornment>
                  )
                }}
              />
            </div>
            <FullWidthButton
              variant="contained"
              size={'large'}
              endIcon={<ArrowForward />}
              onClick={props.onContinueClick}>
              Continue with email
            </FullWidthButton>
            <DividerWrap>or</DividerWrap>
            <LoginOauth />
            <DividerWrap />
            <CreateAccount>
              Already have an account? <Link href="#">Sign in</Link>
            </CreateAccount>
            <FooterWrap>
              By clicking “Continue with Email/Google/ORCID/Facebook/LinkedIn”
              above, you acknowledge that you have read and understood, and
              agree to Terms & Conditions and Privacy Policy.
            </FooterWrap>
          </FlexBody>
        </FlexBodyCenter>
      </Parent>
    );
  }
);

const SignInHeader = styled('div')`
  font-weight: 700;
  font-size: 48px;
  margin-bottom: 16px;
`;

const FullWidthButton = styled(Button)`
  width: 100%;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`;

const EmailLabel = styled('div')`
  font-weight: 400;
  font-size: 20px;
  margin-top: 24px;
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
