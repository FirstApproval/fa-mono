import React, { type FunctionComponent, useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  InputAdornment,
  Snackbar,
  TextField
} from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward, LockOutlined } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  FullWidthButton,
  Logo,
  Parent,
  Header
} from '../../common.styled';
import { routerStore } from '../../../core/router';
import { userService } from '../../../core/service';
import { LoadingButton } from '@mui/lab';
import logo from '../../../assets/logo-black.svg';

interface SetPasswordPageProps {
  onSignUpClick: () => void;
  onSignInClick: () => void;
}

export const ResetPasswordPage: FunctionComponent<SetPasswordPageProps> =
  observer((props: SetPasswordPageProps) => {
    const [passwordResetRequestId] = useState(
      () => routerStore.lastPathSegment
    );
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [changed, setChanged] = useState(false);

    const resetPassword = async (): Promise<void> => {
      setIsSubmitting(true);
      await userService.resetPassword({ passwordResetRequestId, password });
      setIsSubmitting(false);
      setChanged(true);
    };

    const validate = (): boolean => {
      const isVP = password.length >= 8;
      setIsValidPassword(isVP);
      return isVP;
    };

    const passwordNonEmpty = password.length > 0;

    return (
      <Parent>
        <FlexHeader>
          <Logo onClick={routerStore.goHome}>
            <img src={logo} />
          </Logo>
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
          {!changed && (
            <FlexBody>
              <Header>Password recovery</Header>
              <Label>Now, set your password:</Label>
              <div>
                <FullWidthTextField
                  autoFocus
                  error={!isValidPassword}
                  helperText={
                    !isValidPassword ? 'Enter 8+ characters' : undefined
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
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
              {isSubmitting && <CircularProgress />}
              {!isSubmitting && (
                <FullWidthButton
                  disabled={!passwordNonEmpty}
                  variant="contained"
                  size={'large'}
                  endIcon={<ArrowForward />}
                  onClick={async () => {
                    const isValid = validate();
                    if (isValid) {
                      await resetPassword();
                    }
                  }}>
                  Continue
                </FullWidthButton>
              )}
            </FlexBody>
          )}
          {changed && (
            <FlexBody>
              <SuccessWrap>
                <Header>Success</Header>
                <Label>Your password has been changed</Label>
                <LoadingButton
                  variant="contained"
                  size={'large'}
                  onClick={props.onSignInClick}>
                  Back to Sign In
                </LoadingButton>
              </SuccessWrap>
            </FlexBody>
          )}
        </FlexBodyCenter>
        {error && (
          <Snackbar
            open={error}
            autoHideDuration={6000}
            onClose={() => {
              setError(false);
            }}>
            <Alert
              onClose={() => {
                setError(false);
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

const Label = styled('div')`
  margin-top: 12px;
  margin-bottom: 32px;
`;

const SuccessWrap = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
