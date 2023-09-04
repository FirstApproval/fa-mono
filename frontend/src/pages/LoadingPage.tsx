import React, { type FunctionComponent } from 'react';
import { LinearProgress } from '@mui/material';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  Logo,
  Parent
} from './common.styled';
import { routerStore } from '../core/router';
import logo from '../assets/logo-black.svg';
import { BetaDialogWithButton } from '../components/BetaDialogWithButton';

export const LoadingPage: FunctionComponent = () => {
  return (
    <Parent>
      <FlexHeader>
        <Logo onClick={routerStore.goHome}>
          <img src={logo} />
        </Logo>
        <BetaDialogWithButton />
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
