import { type FunctionComponent } from 'react';
import { Button, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward } from '@mui/icons-material';
import { type SignUpStore } from './SignUpStore';
import { observer } from 'mobx-react-lite';

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

const Parent = styled('div')`
  width: 100%;
`;

const FlexHeader = styled('div')`
  display: flex;
  padding: 40px;
  align-items: center;
`;

const FlexHeaderRight = styled('div')`
  margin-left: auto;
`;

const FlexBodyCenter = styled('div')`
  display: flex;
  justify-content: center;
`;

const FlexBody = styled('div')`
  width: 580px;
  padding-left: 40px;
  padding-right: 40px;
`;

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

const Logo = styled('div')`
  font-weight: 860;
  font-size: 20px;
`;
