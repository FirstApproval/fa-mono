import React, { useState, useEffect } from 'react';
import { type FunctionComponent } from 'react';
import { useTheme } from '@mui/material/styles';
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


interface PasswordValidationProps {
    password: string;
}

const PasswordValidation: FunctionComponent<PasswordValidationProps> = ({ password }) => {
  const [passwordHint, setPasswordHint] = useState('');
  const [passwordHintColor, setPasswordHintColor] = useState('');
  const [lineColors, setLineColors] = useState(['', '', '']);
  const theme = useTheme();

  useEffect(() => {
    if (password.length < 8) {
      setPasswordHint('Please use 8+ characters for a secure password');
      setPasswordHintColor(theme.palette.error.dark);
      setLineColors([theme.palette.error.dark, '#D9D9D9', '#D9D9D9']);
    } else if (password.length >= 8 && password.length < 12) {
      setPasswordHint('So-so password');
      setPasswordHintColor(theme.palette.warning.dark);
      setLineColors([theme.palette.warning.dark, theme.palette.warning.dark, '#D9D9D9']);
    } else {
      setPasswordHint('Great password');
      setPasswordHintColor(theme.palette.info.dark);
      setLineColors([theme.palette.info.dark, theme.palette.info.dark, theme.palette.info.dark]);
    }
  }, [password, theme]);

  return (
    <>
      <span style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch', marginBottom: '16px' }}>
        <hr style={{ width: '32%', marginLeft: '0', borderTop: `2px solid ${lineColors[0]}` }} />
        <hr style={{ width: '32%', borderTop: `2px solid ${lineColors[1]}` }} />
        <hr style={{ width: '32%', marginRight: '0', borderTop: `2px solid ${lineColors[2]}` }} />
      </span>
      <div style={{ color: passwordHintColor, fontSize: '20px', marginBottom: '16px' }}>{passwordHint}</div>
    </>
  );
};

interface SetPasswordPageProps {
  store: SignUpStore;
  onSignInClick: () => void;
  onContinueClick: () => void;
}

export const SetPasswordPage: FunctionComponent<SetPasswordPageProps> = observer((props: SetPasswordPageProps) => {
  const [password, setPassword] = useState('');
  const isError = props.store.isError;

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

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
              value={password}
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
            />
            {password && <PasswordValidation password={password} />}
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