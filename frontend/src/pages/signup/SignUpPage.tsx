import React, { type FunctionComponent, useState } from 'react';
import {
  Alert,
  Divider,
  InputAdornment,
  Link,
  TextField,
  Typography
} from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward, MailOutlined } from '@mui/icons-material';
import { type SignUpStore } from './SignUpStore';
import { observer } from 'mobx-react-lite';
import { LoginOauth } from '../login/LoginOauth';
import {
  FlexBody,
  FlexBodyCenter,
  FullWidthButton,
  Header,
  Parent
} from '../common.styled';
import { validateEmail } from 'src/util/emailUtil';
import { HeaderComponent } from '../../components/HeaderComponent';

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

    const validateAndContinue = (event: any): void => {
      if (event.key === 'Enter' || event.keyCode === 13 || event.button === 0) {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
          void props.store.existsByEmail(props.store.email).then((exist) => {
            if (exist) {
              setUsedEmail(true);
            } else {
              props.onContinueClick();
            }
          });
        }
      }
    };

    const emailNonEmpty = props.store.email.length > 0;

    return (
      <Parent>
        <HeaderComponent showLoginOutlinedButton={true} />
        <FlexBodyCenter>
          <FlexBody>
            <Header>Sign up for free</Header>
            <EmailLabel variant={'body'} component={'div'}>
              Join the future of scientific discovery today
            </EmailLabel>
            <div style={{ marginBottom: '12px' }}>
              <FullWidthTextField
                autoComplete={'email'}
                autoFocus
                error={!isValidEmail}
                helperText={!isValidEmail ? 'Invalid address' : undefined}
                value={props.store.email}
                type={'email'}
                onChange={(e) => {
                  props.store.email = e.currentTarget.value;
                }}
                onKeyDown={validateAndContinue}
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
                Email address already registered
              </AlertWrap>
            )}
            <FullWidthButton
              loading={props.store.isSubmitting}
              disabled={!emailNonEmpty}
              variant="contained"
              size={'large'}
              endIcon={<ArrowForward />}
              onClick={validateAndContinue}>
              Continue with email
            </FullWidthButton>
            <DividerWrap>or</DividerWrap>
            <LoginOauth />
            <DividerWrap2 />
            <CreateAccount variant={'body'}>
              Already have an account?{' '}
              <LinkWrap onClick={props.onSignInClick}>Sign in</LinkWrap>
            </CreateAccount>
            <FooterWrap>
              By clicking “Continue with Email/Google/ORCID/Facebook/LinkedIn”
              above, you acknowledge that you have read and understood, and
              agree to{' '}
              <LinkWrap color="inherit" href={'/docs/terms_and_conditions.pdf'}>
                Terms & Conditions
              </LinkWrap>{' '}
              and{' '}
              <LinkWrap color="inherit" href={'/docs/privacy_policy.pdf'}>
                Privacy Policy
              </LinkWrap>
              .
            </FooterWrap>
          </FlexBody>
        </FlexBodyCenter>
      </Parent>
    );
  }
);

const LinkWrap = styled(Link)`
  cursor: pointer;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`;

const EmailLabel = styled(Typography)`
  margin-top: 28px;
  margin-bottom: 32px;
` as typeof Typography;

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
  margin-bottom: 32px;
  width: 100%;
`;

const CreateAccount = styled(Typography)`
  margin-top: 48px;
`;

const FooterWrap = styled('div')`
  text-align: center;
  margin-top: 36px;
  font-weight: 400;
  font-size: 12px;
  color: #68676e;
`;
