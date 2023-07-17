import { type FunctionComponent, useState } from 'react';
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
import { routerStore } from '../../core/router';
import { validateEmail } from '../../util/emailUtil';

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
            <Header>Welcome, {props.store.firstName}</Header>
            <EmailLabel>Now, set your password:</EmailLabel>
            <div>
              <FullWidthTextField
                autoFocus
                error={!isValidPassword}
                helperText={
                  !isValidPassword ? 'Enter 8+ characters' : undefined
                }
                value={props.store.password}
                onChange={(e) => {
                  props.store.password = e.currentTarget.value;
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

const EmailLabel = styled('div')`
  margin-top: 24px;
  margin-bottom: 24px;
`;
