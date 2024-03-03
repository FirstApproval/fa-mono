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
  store: UserStore;
  signUpStore: SignUpStore;
  onContinueClick: () => void;
}

export const EnterEmailPage: FunctionComponent<EnterEmailPageProps> = observer(
  (props: EnterEmailPageProps) => {
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isUsedEmail, setUsedEmail] = useState(false);

    const validate = (): boolean => {
      const email = props.store.newEmail ?? '';
      const isVE = email.length > 0 && validateEmail(email);
      setIsValidEmail(isVE);
      return isVE;
    };

    const validateAndContinue = (event: any): void => {
      if (event.key === 'Enter' || event.keyCode === 13 || event.button === 0) {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
          void props.signUpStore
            .existsByEmail(props.store.newEmail!)
            .then((exist) => {
              if (exist) {
                setUsedEmail(true);
              } else {
                void userService
                  .changeEmail({
                    email: props.store.newEmail!
                  })
                  .then((response) => {
                    props.store.changeEmailConfirmationToken =
                      response.data.confirmationToken;
                    props.onContinueClick();
                  });
              }
            });
        }
      }
    };

    const emailNonEmpty = !!props.store.newEmail?.length;

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
                value={props.store.newEmail}
                type={'email'}
                onChange={(e) => {
                  props.store.newEmail = e.currentTarget.value;
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
              // loading={props.signUpStore.isSubmitting}
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
