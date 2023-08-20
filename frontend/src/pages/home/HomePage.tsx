import React, { type FunctionComponent, useState } from 'react';
import {
  Button,
  Divider,
  InputAdornment,
  LinearProgress,
  TextField
} from '@mui/material';
import {
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
import { Edit, Search } from '@mui/icons-material';
import styled from '@emotion/styled';
import { PublicationBox } from './PublicationSection';
import { CallToAction } from './CallToAction';
import PopularAuthorsSection from './PopularAuthorsSection';
import RecommendedPublicationsSection from './RecommendedPublicationsSection';

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
      <Wrap>
        <FullWidthTextField
          placeholder={'Search the data you need...'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
      </Wrap>
      <RecommendedPublicationsSection
        publications={store.recommendedPublications}
      />
      <CallToAction />
      <FlexBodyCenter>
        <FlexBody>
          <PopularAuthorsSection authors={store.popularAuthors} />
          <DividerWrap />
          {store.isLoadingPublications && <LinearProgress />}
          {!store.isLoadingPublications && (
            <>
              {store.publications.map((p) => (
                <PublicationBox key={p.id} publication={p} />
              ))}
            </>
          )}
        </FlexBody>
      </FlexBodyCenter>
    </Parent>
  );
});

export const FlexBody = styled('div')`
  max-width: 680px;
  padding-left: 40px;
  padding-right: 40px;
`;

const DividerWrap = styled(Divider)`
  margin-top: 8px;
  margin-bottom: 40px;
`;

export const Wrap = styled('div')`
  width: 80%;
  margin-left: auto;
  margin-right: auto;

  margin-bottom: 40px;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
`;
