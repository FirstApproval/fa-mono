import React, { useState } from 'react';

import { type FunctionComponent } from 'react';
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
import { type SignUpStore } from './SignUpStore';
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

interface SetPasswordPageProps {
  store: SignUpStore;
  onSignInClick: () => void;
  onContinueClick: () => void;
}

export const SetPasswordPage: FunctionComponent<SetPasswordPageProps> =
  observer((props: SetPasswordPageProps) => {
    const [passwordError, setPasswordError] = useState('');

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const password = event.target.value;
      props.store.password = password;
  
      if (password.length < 8) {
        setPasswordError('Please use 8+ characters for secure password');
      } else {
        setPasswordError('');
      }
    };
   
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
            <Header>Welcome, {props.store.firstName}</Header>
            <EmailLabel>Now, set your password:</EmailLabel>
            <div>
              <FullWidthTextField
                value={props.store.password}
                onChange={handlePasswordChange}
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
                error={Boolean(passwordError)}
                helperText={passwordError}
              />
            </div>
            {props.store.isSubmitting && <CircularProgress />}
            {!props.store.isSubmitting && (
              <FullWidthButton
                variant="contained"
                size={'large'}
                endIcon={<ArrowForward />}
                onClick={props.onContinueClick}>
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

const EmailLabel = styled('div')`
  margin-top: 24px;
  margin-bottom: 24px;
`;
