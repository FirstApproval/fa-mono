import React, { type FunctionComponent } from 'react';
import {
  Alert,
  Divider,
  Link,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import styled from '@emotion/styled';
import { LoginOauth } from './LoginOauth';
import {
  FlexBody,
  FlexBodyCenter,
  FullWidthButton,
  Header,
  HeightElement,
  Parent,
  ValidationError,
  ValidationErrorText,
  WidthElement
} from '../common.styled';
import { routerStore } from '../../core/router';
import { type SignInStore } from './SignInStore';
import { observer } from 'mobx-react-lite';
import { HeaderComponent } from '../../components/HeaderComponent';
import ErrorOutline from '@mui/icons-material/ErrorOutline';

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
        <HeaderComponent showSignUpOutlinedButton={true} />
        <FlexBodyCenter>
          <FlexBody>
            <Header>Sign in</Header>
            <LoginOauth />
            <EmailLabel variant={'body'} component={'div'}>
              or use your email to sign in:
            </EmailLabel>
            <div>
              <FullWidthTextField
                autoFocus
                value={props.store.email}
                onChange={(e) => {
                  props.store.setEmail(e.currentTarget.value);
                }}
                type={'email'}
                label="Email"
                variant="outlined"
                size={'medium'}
                error={props.store.isError}
              />
            </div>
            <div>
              <FullWidthTextField
                type={'password'}
                value={props.store.password}
                onChange={(e) => {
                  props.store.setPassword(e.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.keyCode === 13) {
                    void props.store.submitAuthorizationRequest();
                  }
                }}
                label="Password"
                variant="outlined"
                error={props.store.isError}
              />
            </div>
            {props.store.isError && (
              <>
                <ValidationError>
                  <ErrorOutline
                    htmlColor={'#D32F2F'}
                    sx={{ width: '22px', height: '22px' }}
                  />
                  <WidthElement value={'12px'} />
                  <ValidationErrorText variant={'body2'}>
                    Enter a valid email address and password.
                  </ValidationErrorText>
                </ValidationError>
                <HeightElement value={'24px'} />
              </>
            )}
            <ForgotPasswordLabel>
              <LinkWrap color="inherit" onClick={props.onRestorePasswordClick}>
                I forgot my password
              </LinkWrap>
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
            <Typography variant={'body'}>
              No account?{' '}
              <LinkWrap onClick={props.onSignUpClick}>Create one</LinkWrap>
            </Typography>
            <FooterWrap>
              By clicking “Sign in” above, you acknowledge that you have read
              and understood, and agree to{' '}
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
  margin-bottom: 24px;
`;

const EmailLabel = styled(Typography)`
  margin-top: 32px;
  margin-bottom: 24px;
` as typeof Typography;

const ForgotPasswordLabel = styled('div')`
  margin-bottom: 36px;
`;

const DividerWrap = styled(Divider)`
  margin-top: 44px;
  margin-bottom: 48px;
  width: 100%;
`;

const FooterWrap = styled('div')`
  text-align: center;
  margin-top: 36px;
  font-weight: 400;
  font-size: 12px;
  color: #68676e;
`;

const LinkWrap = styled(Link)`
  cursor: pointer;
`;
