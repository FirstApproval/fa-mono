import React, { type FunctionComponent } from 'react';
import { LinearProgress } from '@mui/material';
import { FlexBody, FlexBodyCenter, Parent } from './common.styled';
import { HeaderComponent } from '../components/HeaderComponent';

export const LoadingPage: FunctionComponent = () => {
  return (
    <Parent>
      <HeaderComponent />
      <FlexBodyCenter>
        <FlexBody>
          <LinearProgress />
        </FlexBody>
      </FlexBodyCenter>
    </Parent>
  );
};
