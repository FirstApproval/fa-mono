import React, { type FunctionComponent, useState } from 'react';
import {
  Alert,
  CircularProgress,
  InputAdornment,
  Snackbar,
  TextField
} from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward, LockOutlined, MailOutlined } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { type SignUpStore } from './SignUpStore';
import {
  FlexBody,
  FlexBodyCenter,
  FullWidthButton,
  Header,
  Parent
} from '../common.styled';
import { HeaderComponent } from '../../components/HeaderComponent';
import { PasswordValidation } from '../../components/PasswordValidation';

interface SetPasswordPageProps {
  store: SignUpStore;
  onSignInClick: () => void;
  onContinueClick: () => void;
}

export const SetPasswordPage: FunctionComponent<SetPasswordPageProps> =
  observer((props: SetPasswordPageProps) => {
    const [isValidPassword, setIsValidPassword] = useState(true);

    const validate = (): boolean => {
      const isVP = props.store.password.length >= 8;
      setIsValidPassword(isVP);
      return isVP;
    };

    const isError = props.store.isError;

    const passwordNonEmpty = props.store.password.length > 0;

    return (
      <Parent>
        <HeaderComponent showLoginOutlinedButton={false} />
        <FlexBodyCenter>
          <FlexBody>
            <Header>Welcome, {props.store.firstName}</Header>
            <EmailLabel>Now, set your password:</EmailLabel>
            <div>
              <HiddenTextField
                hidden={true}
                autoComplete={'email'}
                autoFocus
                value={props.store.email}
                type={'email'}
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
              <FullWidthTextField
                autoComplete={'new-password'}
                autoFocus
                error={!isValidPassword}
                helperText={
                  !isValidPassword ? 'Enter 8+ characters' : undefined
                }
                value={props.store.password}
                onChange={(e) => {
                  props.store.password = e.currentTarget.value;
                }}
                onKeyDown={(event: any) => {
                  if (
                    event.key === 'Enter' ||
                    event.keyCode === 13 ||
                    event.button === 0
                  ) {
                    event.preventDefault();
                    const isValid = validate();
                    if (isValid) {
                      props.onContinueClick();
                    }
                  }
                }}
                type={'password'}
                label="Password 8+ characters"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  )
                }}
              />
            </div>
            {props.store.password && (
              <PasswordValidation password={props.store.password} />
            )}
            {props.store.isSubmitting && <CircularProgress />}
            {!props.store.isSubmitting && (
              <FullWidthButton
                disabled={!passwordNonEmpty}
                variant="contained"
                size={'large'}
                endIcon={<ArrowForward />}
                onClick={() => {
                  const isValid = validate();
                  if (isValid) {
                    props.onContinueClick();
                  }
                }}>
                Continue
              </FullWidthButton>
            )}
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

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`;

const HiddenTextField = styled(TextField)`
  display: none;
`;

const EmailLabel = styled('div')`
  margin-top: 24px;
  margin-bottom: 24px;
`;
