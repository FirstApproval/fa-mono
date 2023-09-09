import React, { type FunctionComponent, useState } from 'react';
import {
  Divider,
  InputAdornment,
  LinearProgress,
  TextField
} from '@mui/material';
import { FlexBodyCenter, Parent } from '../common.styled';
import { HomePageStore } from './HomePageStore';
import { observer } from 'mobx-react-lite';
import { Search } from '@mui/icons-material';
import styled from '@emotion/styled';
import { PublicationSection } from '../../components/PublicationSection';
import { CallToAction } from './CallToAction';
import PopularAuthorsSection from './PopularAuthorsSection';
import RecommendedPublicationsSection from './RecommendedPublicationsSection';
import developer from '../../assets/developer.svg';
import cloud from '../../assets/cloud.svg';
import { Footer } from './Footer';
import { BetaDialog } from '../../components/BetaDialog';
import { HeaderComponent } from '../../components/HeaderComponent';

export const HomePage: FunctionComponent = observer(() => {
  const [store] = useState(() => new HomePageStore());
  const [isBetaDialogOpen, setIsBetaDialogOpen] = useState(() => false);

  const hasSearch = store.searchQuery.length > 0;

  return (
    <>
      <Parent>
        <div
          onClick={() => {
            setIsBetaDialogOpen(true);
          }}
          style={{
            display: 'flex',
            width: '100%',
            height: '48px',
            backgroundColor: 'var(--primary-main, #3B4EFF)',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            cursor: 'pointer'
          }}>
          <img src={developer} />
          <BetaHeaderText>
            We are fine-tuning the platform and would love your feedback
          </BetaHeaderText>
          <img src={cloud} />
        </div>
        <BetaDialog
          isOpen={isBetaDialogOpen}
          onClose={() => setIsBetaDialogOpen(false)}
        />
        <HeaderComponent
          showPublishButton={true}
          showLoginButton={true}
          showSignUpContainedButton={true}
        />
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
                    <InputAdornment position="end">
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

const BetaHeaderText = styled.span`
  color: var(--primary-contrast, #fff);
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/subtitle2 */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 157%; /* 21.98px */
  letter-spacing: 0.1px;
  margin-left: 12px;
  margin-right: 12px;
`;
