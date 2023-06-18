import React, { type FunctionComponent } from 'react';
import { Button } from '@mui/material';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  Logo,
  Parent
} from './common.styled';

export const HomePage: FunctionComponent = () => {
  return (
    <Parent>
      <FlexHeader>
        <Logo>First Approval</Logo>
        <FlexHeaderRight>
          <Button variant="outlined" size={'large'}>
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
