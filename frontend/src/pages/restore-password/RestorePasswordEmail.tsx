import { type FunctionComponent, useState } from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward, MailOutlined } from '@mui/icons-material';
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
} from '../common.styled';
import { type RestorePasswordStore } from './RestorePasswordStore';
import { validateEmail } from 'src/util/emailUtil';
import { routerStore } from '../../core/router';

interface RestorePasswordEmailProps {
  store: RestorePasswordStore;
  onSignInClick: () => void;
  onContinueClick: () => void;
}

export const RestorePasswordEmail: FunctionComponent<RestorePasswordEmailProps> =
  observer((props: RestorePasswordEmailProps) => {
    const [isValidEmail, setIsValidEmail] = useState(true);

    const validate = (): boolean => {
      const isVE =
        props.store.email.length > 0 && validateEmail(props.store.email);
      setIsValidEmail(isVE);
      return isVE;
    };

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
            <Header>Forgot my password</Header>
            <EmailLabel>Please enter your email</EmailLabel>
            <div style={{ marginBottom: '12px' }}>
              <FullWidthTextField
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
            <FullWidthButton
              variant="contained"
              size={'large'}
              endIcon={<ArrowForward />}
              onClick={() => {
                const isValid = validate();
                if (isValid) {
                  props.onContinueClick();
                }
              }}>
              Continue with email
            </FullWidthButton>
          </FlexBody>
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
