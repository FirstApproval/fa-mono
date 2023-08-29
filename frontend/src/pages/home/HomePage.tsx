import React, { type FunctionComponent, useState } from 'react';
import { Button, Divider, InputAdornment, LinearProgress, Stack, TextField } from '@mui/material';
import { FlexBodyCenter, FlexHeader, FlexHeaderRight, Logo, Parent } from '../common.styled';
import { routerStore } from '../../core/router';
import { HomePageStore } from './HomePageStore';
import { observer } from 'mobx-react-lite';
import { Page } from '../../core/RouterStore';
import { UserMenu } from '../../components/UserMenu';
import { Search } from '@mui/icons-material';
import styled from '@emotion/styled';
import { PublicationSection } from '../../components/PublicationSection';
import { CallToAction } from './CallToAction';
import PopularAuthorsSection from './PopularAuthorsSection';
import RecommendedPublicationsSection from './RecommendedPublicationsSection';
import logo from '../../assets/logo-black.svg';
import { authStore } from '../../core/auth';
import { Footer } from './Footer';

export const HomePage: FunctionComponent = observer(() => {
  const [store] = useState(() => new HomePageStore());

  const hasSearch = store.searchQuery.length > 0;

  return (
    <>
      <Parent>
        <FlexHeader>
          <Logo onClick={routerStore.goHome}>
            <img src={logo} />
          </Logo>
          <FlexHeaderRight>
            <Stack direction='row' alignItems='center' spacing={2}>
              <ButtonWrap
                variant='contained'
                onClick={() => {
                  if (authStore.token) {
                    void store.createPublication();
                  } else {
                    routerStore.navigatePage(Page.SIGN_UP);
                  }
                }}
                size={'medium'}>
                Publish
              </ButtonWrap>
              {!authStore.token && (
                <>
                  <ButtonWrap
                    variant='outlined'
                    onClick={() => {
                      routerStore.navigatePage(Page.SIGN_IN);
                    }}
                    size={'medium'}>
                    Sign in
                  </ButtonWrap>
                </>
              )}
            </Stack>
            {authStore.token && <UserMenu />}
          </FlexHeaderRight>
        </FlexHeader>
        <ContentWrap>
          <ContentWrapInner>
            <Wrap>
              <Header>Discover science</Header>
            </Wrap>
            <Wrap>
              <FullWidthTextField
                autoFocus
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
                    <InputAdornment position='end'>
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
                <CallToAction store={store} />
                <FlexBodyCenter>
                  <FlexBody>
                    <PopularAuthorsSection authors={store.popularAuthors} />
                    <DividerWrap />
                    {store.isLoadingPublications && <LinearProgress />}
                    {!store.isLoadingPublications && (
                      <>
                        {store.publications.map((p) => (
                          <PublicationSection key={p.id} publication={p} />
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
                        <PublicationSection key={p.id} publication={p} />
                      ))}
                    </>
                  )}
                </Wrap>
              </>
            )}
          </ContentWrapInner>
        </ContentWrap>
      </Parent>
      <Footer />
    </>
  );
});

export const Header = styled('div')`
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 116.7%;
`;
export const ResultsLabel = styled('div')`
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 123.5%; /* 41.99px */
  letter-spacing: 0.25px;

  margin-bottom: 40px;
`;

export const ContentWrap = styled('div')`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const ContentWrapInner = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1240px;
`;

export const FlexBody = styled('div')`
  max-width: 680px;
`;

const ButtonWrap = styled(Button)`
  width: 90px;
  height: 36px;
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
