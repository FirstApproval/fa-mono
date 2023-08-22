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

  const hasSearch = store.searchQuery.length > 0;

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
          value={store.inputValue}
          onChange={(event) => {
            store.inputValue = event.currentTarget.value;
            if (!store.inputValue) {
              store.searchQuery = '';
            }
          }}
          placeholder={'Search the data you need...'}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.keyCode === 13) {
              void store.search();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
      </Wrap>
      {!hasSearch && (
        <>
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
        </>
      )}
      {hasSearch && (
        <>
          <Wrap>
            <ResultsLabel>Results for {store.searchQuery}</ResultsLabel>
            {store.isSearching && <LinearProgress />}
            {!store.isSearching && (
              <>
                {store.searchResults.map((p) => (
                  <PublicationBox key={p.id} publication={p} />
                ))}
              </>
            )}
          </Wrap>
        </>
      )}
    </Parent>
  );
});

export const ResultsLabel = styled('div')`
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 123.5%; /* 41.99px */
  letter-spacing: 0.25px;

  margin-bottom: 40px;
`;

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
