import React, {
  type FunctionComponent,
  type ReactElement,
  useEffect,
  useState
} from 'react';
import _ from 'lodash';
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Tabs,
  Typography
} from '@mui/material';
import { ContentCopy, EmailOutlined } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import {
  ColumnElement,
  CustomTab,
  FlexBodyCenter,
  HeightElement,
  Parent
} from '../common.styled';
import { routerStore } from '../../core/router';
import noPublications from '../../assets/no-publications.svg';
import upload_your_first_dataset_from from '../../assets/upload-your-first-dataset.svg';
import styled from '@emotion/styled';
import { ProfilePageStore, Tab } from './ProfilePageStore';
import { type Publication } from '../../apis/first-approval-api';
import { PublicationSection } from '../../components/PublicationSection';
import { copyTextToClipboard } from 'src/fire-browser/utils';
import { userStore } from 'src/core/user';
import { downloadersStore } from '../publication/store/downloadsStore';
import { Footer } from '../home/Footer';
import { HeaderComponent } from '../../components/HeaderComponent';
import { DownloadersDialog } from '../publication/DownloadersDialog';
import {
  getCurrentWorkplacesString,
  renderProfileImage
} from '../../util/userUtil';
import { Page } from '../../core/router/constants';
import {
  getShortAuthorLink,
  profileTab,
  profileUsername
} from 'src/core/router/utils';

const tabs = [Tab.PUBLISHED, Tab.DRAFTS];

export const ProfilePage: FunctionComponent = observer(() => {
  const [username] = useState(() => profileUsername());
  const [tabFromPath] = useState(() => profileTab()?.toUpperCase() as Tab);
  const [tab, setTab] = React.useState<Tab>(tabFromPath ?? Tab.PUBLISHED);
  const [store] = useState(() => new ProfilePageStore(username));
  const user = (username ? store : userStore).user!;

  useEffect(() => {
    if (user) {
      store.isLoadingPublications = true;
      void store.load(Tab.PUBLISHED, user.username).then(() => {
        store.isLoadingPublications = false;
      });
    }
  }, [user?.username]);

  if (!user) {
    return <CircularProgress />;
  }

  if (username && user.id === userStore.user?.id) {
    routerStore.navigatePage(Page.PROFILE, '/profile', true);
  }

  const handleChange = (_: React.SyntheticEvent, newValue: number): void => {
    setTab(tabs[newValue]);
  };

  const mapPublications = (publications: Publication[]): ReactElement[] =>
    (publications ?? []).map((publication, index) => (
      <PublicationSection
        publication={publication}
        profilePageStore={store}
        key={publication.id}
        openDownloadersDialog={() => {
          downloadersStore.clearAndOpen(
            publication.id,
            publication.downloadsCount
          );
        }}
      />
    ));
  const loadMoreButton = (tab: Tab): ReactElement => (
    <LoadMorePublicationsButton
      size={'large'}
      disabled={store.publicationsLastPage.get(tab)}
      onClick={async () => {
        await store.load(tab, user.username);
      }}>
      Load more datasets
    </LoadMorePublicationsButton>
  );

  const lastNameAndFirstName = `${user.lastName ?? ''} ${user.firstName ?? ''}`;
  const notEmpty = (publications: Publication[]): boolean => {
    return publications && publications.length > 0;
  };

  const notEmptyPublished = notEmpty(
    store.publications.get(Tab.PUBLISHED) ?? []
  );
  const notEmptyDrafts = notEmpty(store.publications.get(Tab.DRAFTS) ?? []);

  return (
    <>
      <Parent>
        <HeaderComponent
          showPublishButton={true}
          showLoginButton={true}
          showSignUpContainedButton={true}
        />
        <FlexBodyCenter>
          <FlexBody>
            <ColumnElement>
              <RowElement>
                <Avatar
                  src={renderProfileImage(user.profileImage)}
                  sx={{ width: 100, height: 100 }}
                />
                <UserInfoElement>
                  <NameElement>{lastNameAndFirstName}</NameElement>
                  <WorkPlaces
                    variant={'body1'}
                    style={{ marginTop: '10px', marginBottom: '10px' }}>
                    {getCurrentWorkplacesString(user.workplaces)}
                  </WorkPlaces>
                  <EmailElement>
                    <EmailOutlined
                      style={{ marginRight: '12px', marginTop: '2.5px' }}
                      htmlColor={'#68676e'}
                    />
                    <WorkPlaces variant={'body1'}>{user.email}</WorkPlaces>
                  </EmailElement>
                  <RowElement visibility={username ? 'hidden' : 'visible'}>
                    <EditProfileAndCreateDraftButtons
                      onClick={() => {
                        routerStore.navigatePage(
                          Page.ACCOUNT,
                          '/account/profile'
                        );
                      }}
                      variant="outlined"
                      size={'large'}>
                      Edit profile
                    </EditProfileAndCreateDraftButtons>
                    <CopyProfileLinkButton
                      size={'large'}
                      onClick={() => {
                        void copyTextToClipboard(
                          getShortAuthorLink(user.username)
                        ).finally();
                      }}>
                      <ContentCopy style={{ marginRight: '8px' }} />
                      Copy profile link
                    </CopyProfileLinkButton>
                  </RowElement>
                </UserInfoElement>
              </RowElement>
              {!username && (
                <>
                  <HeightElement value={'40px'}></HeightElement>
                  <Tabs value={tabs.indexOf(tab)} onChange={handleChange}>
                    {tabs.map((tab: Tab) => (
                      <CustomTab
                        key={tab}
                        sx={{ textTransform: 'none' }}
                        label={_.capitalize(tab.toString().toLowerCase())}
                      />
                    ))}
                  </Tabs>
                  <Divider style={{ marginTop: '-1.3px' }} />
                  <HeightElement value={'40px'}></HeightElement>
                </>
              )}
              {store.isLoadingPublications && <LinearProgress />}
              {!store.isLoadingPublications && (
                <>
                  {tab === Tab.PUBLISHED && (
                    <TabContainer>
                      <PublicationsContainer>
                        {mapPublications(
                          store.publications.get(Tab.PUBLISHED) ?? []
                        )}
                        {!notEmptyPublished && username && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginTop: '11.5px'
                            }}>
                            <img src={noPublications} />
                            <NoPublicationsText variant={'h5'}>
                              No publications :(
                            </NoPublicationsText>
                            <ItLooksLikeUserHasntUploaded variant={'body1'}>
                              It looks like {user.firstName} hasn&apos;t
                              uploaded any datasets yet.
                              <br />
                              Check back soon!
                            </ItLooksLikeUserHasntUploaded>
                          </div>
                        )}
                      </PublicationsContainer>
                      {notEmptyPublished &&
                        !store.publicationsLastPage.get(Tab.PUBLISHED) &&
                        loadMoreButton(Tab.PUBLISHED)}
                      {!notEmptyPublished &&
                        !username &&
                        !store.isLoadingPublications && (
                          <Banner>
                            <BannerLeftPart>
                              <Typography variant={'h5'}>
                                Upload your first dataset
                              </Typography>
                              <HeightElement value={'24px'} />
                              <WorkPlaces variant={'body1'}>
                                Show off your work. Get recognition and be a
                                part of a growing community.
                              </WorkPlaces>
                              <HeightElement value={'24px'} />
                              <StartPublishingButton
                                color={'primary'}
                                variant={'contained'}
                                onClick={async () => {
                                  await userStore.createPublication();
                                }}>
                                <span
                                  style={{
                                    fontSize: 18,
                                    fontWeight: 500
                                  }}>
                                  Start publishing
                                </span>
                              </StartPublishingButton>
                            </BannerLeftPart>
                            <img src={upload_your_first_dataset_from} />
                          </Banner>
                        )}
                    </TabContainer>
                  )}
                  {tab === Tab.DRAFTS && (
                    <TabContainer>
                      <PublicationsContainer>
                        {mapPublications(
                          store.publications.get(Tab.DRAFTS) ?? []
                        )}
                      </PublicationsContainer>
                      {notEmptyDrafts &&
                        !store.publicationsLastPage.get(Tab.DRAFTS) &&
                        loadMoreButton(Tab.DRAFTS)}
                      {!notEmptyDrafts && !username && (
                        <CenterColumnElement>
                          <YouDontHaveAnyDrafts>
                            You don't have any drafts yet 🤷
                          </YouDontHaveAnyDrafts>
                          <HeightElement value="16px" />
                          <EditProfileAndCreateDraftButtons
                            size={'large'}
                            variant={'outlined'}
                            onClick={async () => {
                              await userStore.createPublication();
                            }}>
                            Create draft
                          </EditProfileAndCreateDraftButtons>
                        </CenterColumnElement>
                      )}
                    </TabContainer>
                  )}
                </>
              )}
            </ColumnElement>
          </FlexBody>
        </FlexBodyCenter>
      </Parent>
      <Footer />
      <DownloadersDialog
        isOpen={downloadersStore.open}
        downloaders={downloadersStore.downloaders}
      />
    </>
  );
});

export const RowElement = styled('div')<{
  visibility?: string | undefined;
}>`
  width: 100%;
  display: flex;
  visibility: ${(props) => props.visibility ?? 'visible'};
`;

export const CenterColumnElement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EmailElement = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const NameElement = styled.span`
  font-family: Roboto;
  font-size: 34px;
  font-weight: 600;
  line-height: 42px;
  letter-spacing: 0.25px;
  text-align: left;
  word-break: break-word;
`;

export const UserInfoElement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 32px;
`;

export const WorkPlaces = styled(Typography)`
  color: var(--text-secondary, #68676e);
  word-break: break-word;
`;

export const EditProfileAndCreateDraftButtons = styled(Button)`
  width: 140px;
  color: var(--inherit-text-primary-main, #040036);
`;

export const CopyProfileLinkButton = styled(Button)`
  width: 180px;
  color: var(--inherit-text-primary-main, #040036);

  padding: 0;
  margin-left: 20px;
  cursor: pointer !important;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadMorePublicationsButton = styled(Button)`
  display: inline-flex;
  height: 40px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 4px;
  border: 1px solid var(--inherit-text-primary-main, #040036);

  color: var(--inherit-text-primary-main, #040036);

  width: 215px;
`;

const Banner = styled.div`
  display: flex;
  width: 100%;
  border-radius: 4px;
  border: 1px dashed var(--divider, #d2d2d6);
`;

const BannerLeftPart = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 32px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const StartPublishingButton = styled(Button)`
  width: 180px;
`;

const YouDontHaveAnyDrafts = styled(Button)`
  color: var(--text-secondary, #68676e);
  text-align: center;

  /* typography/body */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;

const FlexBody = styled.div`
  width: 680px;
`;

const PublicationsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const NoPublicationsText = styled(Typography)`
  text-align: center;

  margin-top: 16px;
  margin-bottom: 16px;
`;

const ItLooksLikeUserHasntUploaded = styled(Typography)`
  color: var(--text-secondary, #68676e);
  text-align: center;
  white-space: pre-line;
`;
