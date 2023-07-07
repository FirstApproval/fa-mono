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
    const [passwordHint, setPasswordHint] = useState('');
    const [passwordHintColor, setPasswordHintColor] = useState('');
    const [lineColors, setLineColors] = useState(['', '', '']);
   
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const password = event.target.value;
      props.store.password = password;

  
      if (password.length < 8) {
        setPasswordHint('Please use 8+ characters for secure password');
        setPasswordHintColor('#D32F2F');
        setLineColors(['#D32F2F', '#D9D9D9', '#D9D9D9'])
      } else if (password.length === 8) {
        setPasswordHint('So-so password')
        setPasswordHintColor('#FF9800')
        setLineColors(['#FF9800', '#FF9800', '#D9D9D9'])
      } else {
        setPasswordHint('Great password')
        setPasswordHintColor('#3B4EFF')
        setLineColors(['#3B4EFF', '#3B4EFF', '#3B4EFF'])
      }
      const shouldRenderComponent = true;
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
              />

            {props.store.password &&  
              (<span  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch', marginBottom: '8px' }}>
                <hr style={{ width: '30%', marginLeft: '0', borderTop: `2px solid ${lineColors[0]}` }}/>
                <hr style={{ width: '30%', borderTop: `2px solid ${lineColors[1]}` }} /> 
                <hr style={{ width: '30%', marginRight: '0', borderTop: `2px solid ${lineColors[2]}` }} />
              </span>)
  }
            <div style={{color: passwordHintColor, fontSize: '20px', marginBottom: '8px'}}>{passwordHint}</div>  
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
