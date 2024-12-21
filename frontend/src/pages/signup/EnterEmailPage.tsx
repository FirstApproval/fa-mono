import React, { type FunctionComponent, useState } from 'react';
import { Alert, InputAdornment, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward, MailOutlined } from '@mui/icons-material';
import { type SignUpStore } from './SignUpStore';
import { observer } from 'mobx-react-lite';
import {
  FlexBody,
  FlexBodyCenter,
  FullWidthButton,
  Header,
  Parent
} from '../common.styled';
import { validateEmail } from 'src/util/emailUtil';
import { HeaderComponent } from '../../components/HeaderComponent';
import { UserStore } from '../../core/UserStore';
import { userService } from '../../core/service';

interface EnterEmailPageProps {
  userStore: UserStore;
  signUpStore: SignUpStore;
  onContinueClick: () => void;
}

export const EnterEmailPage: FunctionComponent<EnterEmailPageProps> = observer(
  (props: EnterEmailPageProps) => {
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isUsedEmail, setUsedEmail] = useState(false);

    const validate = (): boolean => {
      const email = props.userStore.newEmail ?? '';
      const isVE = email.length > 0 && validateEmail(email);
      setIsValidEmail(isVE);
      return isVE;
    };

    const validateAndContinue = (event: any): void => {
      if (event.key === 'Enter' || event.keyCode === 13 || event.button === 0) {
        event.preventDefault();
        props.userStore.isSubmitting = true;
        const isValid = validate();
        if (isValid) {
          void props.signUpStore
            .existsByEmail(props.userStore.newEmail!)
            .then((exist) => {
              if (exist) {
                setUsedEmail(true);
                props.userStore.isSubmitting = false;
              } else {
                void userService
                  .changeEmail({
                    email: props.userStore.newEmail!
                  })
                  .then((response) => {
                    props.userStore.changeEmailConfirmationToken =
                      response.data.confirmationToken;
                    props.userStore.isSubmitting = false;
                    props.onContinueClick();
                  });
              }
            });
        } else {
          props.userStore.isSubmitting = false;
        }
      }
    };

    const emailNonEmpty = !!props.userStore.newEmail?.length;

    return (
      <Parent>
        <HeaderComponent />
        <FlexBodyCenter>
          <FlexBody>
            <Header>Please add e-mail</Header>
            <div style={{ marginBottom: '12px' }}>
              <FullWidthTextField
                autoComplete={'email'}
                autoFocus
                error={!isValidEmail}
                helperText={!isValidEmail ? 'Invalid address' : undefined}
                value={props.userStore.newEmail}
                type={'email'}
                onChange={(e) => {
                  props.userStore.newEmail = e.currentTarget.value;
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
              loading={props.userStore.isSubmitting}
              disabled={!emailNonEmpty}
              variant="contained"
              size={'large'}
              endIcon={<ArrowForward />}
              onClick={validateAndContinue}>
              Continue
            </FullWidthButton>
          </FlexBody>
        </FlexBodyCenter>
      </Parent>
    );
  }
);

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`;

const AlertWrap = styled(Alert)`
  margin-bottom: 32px;
  width: 100%;
`;
