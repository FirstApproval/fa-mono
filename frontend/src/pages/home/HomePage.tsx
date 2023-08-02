import React, { type FunctionComponent, useState } from 'react';
import { Button, LinearProgress, Link } from '@mui/material';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  Logo,
  Parent
} from '../common.styled';
import { publicationService } from '../../core/service';
import { routerStore } from '../../core/router';
import { HomePageStore } from './HomePageStore';
import { observer } from 'mobx-react-lite';
import { Page } from '../../core/RouterStore';
import { UserMenu } from '../../components/UserMenu';
import { Edit } from '@mui/icons-material';

export const HomePage: FunctionComponent = observer(() => {
  const [store] = useState(() => new HomePageStore());
  const createPublication = async (): Promise<void> => {
    const response = await publicationService.createPublication();
    const pub: string = response.data.id;
    routerStore.navigatePage(Page.PUBLICATION, `/publication/${pub}`);
  };

  return (
    <Parent>
      <FlexHeader>
        <Logo onClick={routerStore.goHome}>First Approval</Logo>
        <FlexHeaderRight>
          <Button
            onClick={createPublication}
            startIcon={<Edit />}
            size={'medium'}
            variant="outlined">
            Create
          </Button>
          <UserMenu />
        </FlexHeaderRight>
      </FlexHeader>
      <FlexBodyCenter>
        <FlexBody>
          {store.isLoading && <LinearProgress />}
          {!store.isLoading && (
            <>
              {store.publications.map((p) => {
                return (
                  <div key={p.id} style={{ marginBottom: '16px' }}>
                    <Link href={`/publication/${p.id}`}>{p.title ?? p.id}</Link>
                  </div>
                );
              })}
            </>
          )}
        </FlexBody>
      </FlexBodyCenter>
    </Parent>
  );
});
