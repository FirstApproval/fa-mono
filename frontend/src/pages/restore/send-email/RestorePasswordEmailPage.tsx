import React, { type FunctionComponent, useState } from 'react';
import {
  CircularProgress,
  InputAdornment,
  Link,
  TextField
} from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward, MailOutlined } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import {
  FlexBody,
  FlexBodyCenter,
  FullWidthButton,
  Header,
  Parent
} from '../../common.styled';
import { type RestorePasswordStore } from './RestorePasswordStore';
import { validateEmail } from 'src/util/emailUtil';
import { LoadingButton } from '@mui/lab';
import { HeaderComponent } from '../../../components/HeaderComponent';

interface RestorePasswordEmailProps {
  store: RestorePasswordStore;
  onSignUpClick: () => void;
  onSignInClick: () => void;
}

export const RestorePasswordEmailPage: FunctionComponent<RestorePasswordEmailProps> =
  observer((props: RestorePasswordEmailProps) => {
    const [isValidEmail, setIsValidEmail] = useState(true);

    const validate = (): boolean => {
      const isVE =
        props.store.email.length > 0 && validateEmail(props.store.email);
      setIsValidEmail(isVE);
      return isVE;
    };

    const emailNonEmpty = props.store.email.length > 0;

    return (
      <Parent>
        <HeaderComponent showSignUpOutlinedButton={true} />
        <FlexBodyCenter>
          {!props.store.isSubmitted && (
            <FlexBody>
              <Header>Password recovery</Header>
              <EmailLabel>
                Enter the email you use for firstapproval.io
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
              {props.store.isSubmitting && <CircularProgress />}
              {!props.store.isSubmitting && (
                <FullWidthButton
                  disabled={!emailNonEmpty}
                  variant="contained"
                  size={'large'}
                  endIcon={<ArrowForward />}
                  onClick={async () => {
                    const isValid = validate();
                    if (isValid) {
                      await props.store.submitRegistrationRequest();
                    }
                  }}>
                  Continue
                </FullWidthButton>
              )}
              <LinkTextCenterWrap color="inherit" onClick={props.onSignInClick}>
                Back to Sign In
              </LinkTextCenterWrap>
            </FlexBody>
          )}
          {props.store.isSubmitted && (
            <FlexBody>
              <Header>Reset your password</Header>
              <EmailLabel>
                If an account exists for {props.store.email} we&apos;ll send
                instructions for resetting your password. Didn&apos;t get them?
                Check the email address or ask to resend the instructions.
              </EmailLabel>
              <LoadingButton
                variant="contained"
                size={'large'}
                onClick={props.onSignInClick}>
                Back to Sign In
              </LoadingButton>
              {props.store.isSentAgain && (
                <ContactUsWrap>
                  If you still haven&apos;t received the email, please{' '}
                  {<Link color="inherit">contact us.</Link>}
                </ContactUsWrap>
              )}
              <LinkTextLeftWrap
                color="inherit"
                onClick={async () => {
                  await props.store.submitRegistrationRequest();
                }}>
                Resend the instructions again
              </LinkTextLeftWrap>
            </FlexBody>
          )}
        </FlexBodyCenter>
      </Parent>
    );
  });

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

const LinkTextCenterWrap = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 32px;
`;

const LinkTextLeftWrap = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  margin-top: 32px;
`;

const ContactUsWrap = styled('div')`
  margin-top: 32px;
`;
