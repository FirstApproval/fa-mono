import { type FunctionComponent } from 'react';
import { LinearProgress } from '@mui/material';
import styled from '@emotion/styled';

export const LoadingPage: FunctionComponent = () => {
  return (
    <Parent>
      <FlexHeader>
        <Logo>First Approval</Logo>
        <FlexHeaderRight></FlexHeaderRight>
      </FlexHeader>
      <FlexBodyCenter>
        <FlexBody>
          <LinearProgress />
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

const Logo = styled('div')`
  font-weight: 860;
  font-size: 20px;
`;
