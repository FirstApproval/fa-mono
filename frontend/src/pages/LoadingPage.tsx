import { type FunctionComponent } from 'react';
import { LinearProgress } from '@mui/material';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  Logo,
  Parent
} from './common.styled';

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
