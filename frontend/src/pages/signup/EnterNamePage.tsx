import { type FunctionComponent } from 'react';
import { Button, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward } from '@mui/icons-material';
import { type SignUpStore } from './SignUpStore';
import { observer } from 'mobx-react-lite';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  Logo,
  Parent
} from '../common.styled';

interface EnterNamePageProps {
  store: SignUpStore;
  onSignInClick: () => void;
  onContinueClick: () => void;
}

export const EnterNamePage: FunctionComponent<EnterNamePageProps> = observer(
  (props: EnterNamePageProps) => {
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
            <SignInHeader>Welcome</SignInHeader>
            <EmailLabel>To start, what&apos;s your name?</EmailLabel>
            <div>
              <FullWidthTextField
                value={props.store.firstName}
                onChange={(e) => {
                  props.store.firstName = e.currentTarget.value;
                }}
                label="Name"
                variant="outlined"
              />
            </div>
            <div>
              <FullWidthTextField
                value={props.store.lastName}
                onChange={(e) => {
                  props.store.lastName = e.currentTarget.value;
                }}
                label="Surname"
                variant="outlined"
              />
            </div>
            <FullWidthButton
              variant="contained"
              size={'large'}
              endIcon={<ArrowForward />}
              onClick={props.onContinueClick}>
              Continue
            </FullWidthButton>
          </FlexBody>
        </FlexBodyCenter>
      </Parent>
    );
  }
);

const SignInHeader = styled('div')`
  font-weight: 700;
  font-size: 48px;
  margin-bottom: 16px;
`;

const FullWidthButton = styled(Button)`
  width: 100%;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`;

const EmailLabel = styled('div')`
  margin-top: 24px;
  margin-bottom: 24px;
`;
