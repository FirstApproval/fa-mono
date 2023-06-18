import { type FunctionComponent } from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward, LockOutlined } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { type SignUpStore } from './SignUpStore';

interface SetPasswordPageProps {
  store: SignUpStore;
  onContinueClick: () => void;
}

export const SetPasswordPage: FunctionComponent<SetPasswordPageProps> =
  observer((props: SetPasswordPageProps) => {
    return (
      <Parent>
        <FlexHeader>
          <Logo>First Approval</Logo>
          <FlexHeaderRight>
            <Button
              variant="outlined"
              size={'large'}
              onClick={props.onContinueClick}>
              Sign up
            </Button>
          </FlexHeaderRight>
        </FlexHeader>
        <FlexBodyCenter>
          <FlexBody>
            <SignInHeader>Welcome, {props.store.firstName}</SignInHeader>
            <EmailLabel>Now, set your password:</EmailLabel>
            <div>
              <FullWidthTextField
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
  });

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
