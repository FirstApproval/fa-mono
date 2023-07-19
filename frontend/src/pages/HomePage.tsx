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
import { publicationService } from '../core/service';
import { authStore } from '../core/auth';
import { routerStore } from '../core/router';

export const HomePage: FunctionComponent = () => {
  const createPublication = async (): Promise<void> => {
    const response = await publicationService.createPublication();
    const pub: string = response.data.id;
    window.history.pushState(undefined, 'Publication', `/publication/${pub}`);
  };

  return (
    <Parent>
      <FlexHeader>
        <Logo onClick={routerStore.goHome}>First Approval</Logo>
        <FlexHeaderRight>
          <Button
            variant="outlined"
            size={'large'}
            onClick={() => {
              authStore.token = undefined;
            }}>
            Sign out
          </Button>
        </FlexHeaderRight>
      </FlexHeader>
      <FlexBodyCenter>
        <FlexBody>
          <Button onClick={createPublication} variant="contained">
            Create publication
          </Button>
        </FlexBody>
      </FlexBodyCenter>
    </Parent>
  );
};
