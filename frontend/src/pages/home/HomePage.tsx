import React, { type FunctionComponent, ReactElement, useState } from 'react';
import {
  Box,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography
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
import { DownloadersDialog } from '../publication/DownloadersDialog';
import { downloadersStore } from '../publication/store/downloadsStore';
import { Publication } from '../../apis/first-approval-api';

export const HomePage: FunctionComponent = observer(() => {
  const [store] = useState(() => new HomePageStore());
  const [isBetaDialogOpen, setIsBetaDialogOpen] = useState(() => false);

  const hasSearch = store.searchQuery.length > 0;

  const mapPublications = (publications: Publication[]): ReactElement[] =>
    (publications ?? []).map((publication, index) => (
      <PublicationSection
        publication={publication}
        key={publication.id}
        openDownloadersDialog={() => {
          downloadersStore.clearAndOpen(
            publication.id,
            publication.downloadsCount
          );
        }}
      />
    ));

  return (
    <>
      <Parent>
        <BetaBannerWrap
          onClick={() => {
            setIsBetaDialogOpen(true);
          }}
          style={{}}>
          <img src={developer} />
          <BetaHeaderText variant={'subtitle2'}>
            We are fine-tuning the platform and would love your feedback
          </BetaHeaderText>
          <img src={cloud} />
        </BetaBannerWrap>
        <BetaDialog
          isOpen={isBetaDialogOpen}
          onClose={() => setIsBetaDialogOpen(false)}
        />
        <HeaderComponent
          showAboutUsButton={true}
          showPublishButton={true}
          showCollaborateButton={true}
          showLoginButton={true}
          showSignUpContainedButton={true}
        />
        <Box sx={{ flexGrow: 1 }}>
          <ContentWrap>
            <ContentWrapInner>
              <Grid
                container
                spacing={3}
                justifyContent={'center'}
                maxWidth={'1240px'}>
                <Grid item xs={12} md={11} lg={11}>
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
                </Grid>
              </Grid>
              {!hasSearch && (
                <Grid
                  container
                  spacing={3}
                  justifyContent={'center'}
                  maxWidth={'1240px'}>
                  <Grid item xs={12} md={11} lg={11}>
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
                          <>{mapPublications(store.publications)}</>
                        )}
                      </FlexBody>
                    </FlexBodyCenter>
                  </Grid>
                </Grid>
              )}
              {hasSearch && (
                <ResultsWrap>
                  <ResultsLabel variant={'h4'} component={'div'}>
                    Results for {store.searchQuery}
                  </ResultsLabel>
                  {store.isSearching && <LinearProgress />}
                  {!store.isSearching && store.searchResults.length !== 0 && (
                    <>{mapPublications(store.searchResults)}</>
                  )}
                  {!store.isSearching && store.searchResults.length === 0 && (
                    <ContentWrap>
                      <SearchHintText variant={'body'}>
                        Make sure all words are spelled correctly or try more
                        general keywords.
                      </SearchHintText>
                    </ContentWrap>
                  )}
                </ResultsWrap>
              )}
            </ContentWrapInner>
          </ContentWrap>
        </Box>
      </Parent>
      <Footer />
      <DownloadersDialog
        isOpen={downloadersStore.open}
        downloaders={downloadersStore.downloaders}
      />
    </>
  );
});

const BetaBannerWrap = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  background-color: var(--primary-main, #3b4eff);
  justify-content: center;
  align-items: center;
  align-content: center;
  cursor: pointer;

  padding: 8px 24px;

  @media (min-width: 768px) {
    padding: 12px 32px;
  }
`;

const Header = styled('div')`
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 116.7%;
`;

const ResultsLabel = styled(Typography)`
  margin-bottom: 40px;
` as typeof Typography;

const ContentWrap = styled('div')`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0px 24px 0px 24px;
`;

const ContentWrapInner = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FlexBody = styled('div')`
  max-width: 680px;
`;

const DividerWrap = styled(Divider)`
  margin-top: 8px;
  margin-bottom: 40px;
`;

const ResultsWrap = styled('div')`
  width: 100%;
  max-width: 1110px;
  margin-left: auto;
  margin-right: auto;

  margin-bottom: 40px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Wrap = styled('div')`
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  margin-bottom: 40px;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
`;

const BetaHeaderText = styled(Typography)`
  color: var(--primary-contrast, #fff);
  text-align: center;
  margin-left: 12px;
  margin-right: 12px;
`;

const SearchHintText = styled(Typography)`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  text-align: center;

  word-wrap: break-word;
  width: 380px;
`;
