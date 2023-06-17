import { type FunctionComponent } from 'react';
import { Button } from '@mui/material';
import styled from '@emotion/styled';

interface SignInPageProps {
  onSignUpClick: () => void;
}

export const HomePage: FunctionComponent<SignInPageProps> = (
  props: SignInPageProps
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
            Sign out
          </Button>
        </FlexHeaderRight>
      </FlexHeader>
      <FlexBodyCenter>
        <FlexBody></FlexBody>
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

const Logo = styled('div')`
  font-weight: 860;
  font-size: 20px;
`;
