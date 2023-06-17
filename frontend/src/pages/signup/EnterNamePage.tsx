import { type FunctionComponent } from 'react';
import { Button, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward } from '@mui/icons-material';

interface EnterNamePageProps {
  onSignUpClick: () => void;
}

export const EnterNamePage: FunctionComponent<EnterNamePageProps> = (
  props: EnterNamePageProps
) => {
  return (
    <Parent>
      <FlexHeader>
        <Logo>First Approval</Logo>
        <FlexHeaderRight>
          <Button
            variant="outlined"
            size={'large'}
            onClick={props.onSignUpClick}>
            Sign up
          </Button>
        </FlexHeaderRight>
      </FlexHeader>
      <FlexBodyCenter>
        <FlexBody>
          <SignInHeader>Welcome</SignInHeader>
          <EmailLabel>To start, what&apos;s your name?</EmailLabel>
          <div>
            <FullWidthTextField label="Name" variant="outlined" />
          </div>
          <div>
            <FullWidthTextField label="Surname" variant="outlined" />
          </div>
          <FullWidthButton
            variant="contained"
            size={'large'}
            endIcon={<ArrowForward />}>
            Continue
          </FullWidthButton>
        </FlexBody>
      </FlexBodyCenter>
    </Parent>
  );
};

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
