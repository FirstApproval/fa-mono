import { type FunctionComponent, useState } from 'react';
import {
  Alert,
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
  FullWidthButton,
  Logo,
  Parent,
  Header
} from '../common.styled';
import { validateEmail } from 'src/util/emailUtil';
import { routerStore } from '../../core/router';

interface SignUpPageProps {
  store: SignUpStore;
  onSignInClick: () => void;
  onContinueClick: () => void;
}

export const SignUpPage: FunctionComponent<SignUpPageProps> = observer(
  (props: SignUpPageProps) => {
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isUsedEmail, setUsedEmail] = useState(false);

    const validate = (): boolean => {
      const isVE =
        props.store.email.length > 0 && validateEmail(props.store.email);
      setIsValidEmail(isVE);
      return isVE;
    };

    const emailNonEmpty = props.store.email.length > 0;

    return (
      <Parent>
        <FlexHeader>
          <Logo onClick={routerStore.goHome}>First Approval</Logo>
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
            <Header>Sign up for free</Header>
            <EmailLabel>
              Join the future of scientific discovery today
            </EmailLabel>
            <div style={{ marginBottom: '12px' }}>
              <FullWidthTextField
                autoFocus
                error={!isValidEmail}
                helperText={!isValidEmail ? 'Invalid address' : undefined}
                value={props.store.email}
                type={'email'}
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
            {isUsedEmail && (
              <AlertWrap severity="error">
                Email address already registered by another user
              </AlertWrap>
            )}
            <FullWidthButton
              loading={props.store.isSubmitting}
              disabled={!emailNonEmpty}
              variant="contained"
              size={'large'}
              endIcon={<ArrowForward />}
              onClick={() => {
                const isValid = validate();
                if (isValid) {
                  void props.store
                    .existsByEmail(props.store.email)
                    .then((exist) => {
                      if (exist) {
                        setUsedEmail(true);
                      } else {
                        props.onContinueClick();
                      }
                    });
                }
              }}>
              Continue with email
            </FullWidthButton>
            <DividerWrap>or</DividerWrap>
            <LoginOauth />
            <DividerWrap2 />
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

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`;

const EmailLabel = styled('div')`
  font-weight: 400;
  font-size: 20px;
  margin-top: 28px;
  margin-bottom: 32px;
`;

const DividerWrap = styled(Divider)`
  margin-top: 32px;
  margin-bottom: 40px;
  width: 100%;
`;

const DividerWrap2 = styled(Divider)`
  margin-top: 42px;
  margin-bottom: 40px;
  width: 100%;
`;

const AlertWrap = styled(Alert)`
  margin-bottom: 16px;
  width: 100%;
`;

const CreateAccount = styled('div')`
  margin-top: 48px;
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
