import React, {
  type FunctionComponent,
  type ReactElement,
  useState
} from 'react';
import _ from 'lodash';
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Tabs
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
import { ProfilePageStore } from './ProfilePageStore';
import {
  type Publication,
  PublicationStatus
} from '../../apis/first-approval-api';
import { PublicationSection } from '../../components/PublicationSection';
import {
  copyTextToClipboard,
  getProfileLink,
  renderProfileImage
} from 'src/fire-browser/utils';
import { userStore } from 'src/core/user';
import { downloadersStore } from '../publication/store/downloadsStore';
import { Page } from '../../core/RouterStore';
import { Footer } from '../home/Footer';
import { HeaderComponent } from '../../components/HeaderComponent';
import { DownloadersDialog } from '../publication/DownloadersDialog';

const tabs: string[] = ['published', 'drafts'];

export const ProfilePage: FunctionComponent = observer(() => {
  const [username] = useState(() => routerStore.profileUsername);
  const [profileTab] = useState(() => routerStore.profileTab);
  const [tabNumber, setTabNumber] = React.useState(
    (profileTab && tabs.findIndex((element) => element === profileTab)) ?? 0
  );
  const [store] = useState(() => new ProfilePageStore(username));
  const user = (username ? store : userStore).user!;

  const handleChange = (_: React.SyntheticEvent, newValue: number): void => {
    setTabNumber(newValue);
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
  const loadMoreButton = (status: PublicationStatus): ReactElement => (
    <LoadMorePublicationsButton
      disabled={store.publicationsLastPage.get(status)}
      onClick={async () => {
        await store.load(username, status);
      }}>
      Load more datasets
    </LoadMorePublicationsButton>
  );

  if (!user) {
    return <CircularProgress />;
  }

  if (username && user.id === userStore.user?.id) {
    routerStore.navigatePage(Page.PROFILE, '/profile', true);
  }

  const lastNameAndFirstName = `${user.lastName ?? ''} ${user.firstName ?? ''}`;
  const notEmpty = (publications: Publication[]): boolean => {
    return publications && publications.length > 0;
  };

  const notEmptyPublished = notEmpty(
    store.publications.get(PublicationStatus.PUBLISHED) ?? []
  );
  const notEmptyPending = notEmpty(
    store.publications.get(PublicationStatus.PENDING) ?? []
  );

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
                  <SelfInfo style={{ marginTop: '10px', marginBottom: '10px' }}>
                    {user.selfInfo}
                  </SelfInfo>
                  <EmailElement>
                    <EmailOutlined
                      style={{ marginRight: '12px', marginTop: '2.5px' }}
                      htmlColor={'#68676e'}
                    />
                    <SelfInfo>{user.email}</SelfInfo>
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
                          getProfileLink(user.username)
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
                  <Tabs
                    value={tabNumber}
                    onChange={handleChange}
                    aria-label="basic tabs example">
                    {tabs.map((tab) => (
                      <CustomTab
                        key={tab}
                        sx={{ textTransform: 'none' }}
                        label={_.capitalize(tab.toLowerCase())}
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
                  {tabNumber === 0 && (
                    <TabContainer>
                      <PublicationsContainer>
                        {mapPublications(
                          store.publications.get(PublicationStatus.PUBLISHED) ??
                            []
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
                            <NoPublicationsText>
                              No publications :(
                            </NoPublicationsText>
                            <ItLooksLikeUserHasntUploaded>
                              {`It looks like ${user.firstName} hasn’t uploaded any datasets yet.\nCheck back soon!`}
                            </ItLooksLikeUserHasntUploaded>
                          </div>
                        )}
                      </PublicationsContainer>
                      {notEmptyPublished &&
                        !store.publicationsLastPage.get(
                          PublicationStatus.PUBLISHED
                        ) &&
                        loadMoreButton(PublicationStatus.PUBLISHED)}
                      {!notEmptyPublished && !username && (
                        <Banner>
                          <BannerLeftPart>
                            <UploadYourFirstDatasetHeader>
                              Upload your first dataset
                            </UploadYourFirstDatasetHeader>
                            <HeightElement value={'24px'} />
                            <SelfInfo>
                              Show off your work. Get recognition and be a part
                              of a growing community.
                            </SelfInfo>
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
                  {tabNumber === 1 && (
                    <TabContainer>
                      <PublicationsContainer>
                        {mapPublications(
                          store.publications.get(PublicationStatus.PENDING) ??
                            []
                        )}
                      </PublicationsContainer>
                      {notEmptyPending &&
                        !store.publicationsLastPage.get(
                          PublicationStatus.PENDING
                        ) &&
                        loadMoreButton(PublicationStatus.PENDING)}
                      {!notEmptyPending && !username && (
                        <CenterColumnElement>
                          <YouDontHaveAnyDrafts>
                            {"You don't have any drafts yet 🤷‍"}
                          </YouDontHaveAnyDrafts>
                          <HeightElement value="16px" />
                          <EditProfileAndCreateDraftButtons
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

export const SelfInfo = styled.div`
  color: var(--text-secondary, #68676e);
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body1 */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
  word-break: break-word;
`;

export const EditProfileAndCreateDraftButtons = styled(Button)`
  width: 140px;
  color: var(--inherit-text-primary-main, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  /* components/button-large */
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.46px;
`;

export const CopyProfileLinkButton = styled(Button)`
  width: 180px;
  color: var(--inherit-text-primary-main, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  /* components/button-large */
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.46px;
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
  font-feature-settings: 'clig' off, 'liga' off;
  /* components/button-large */
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.46px;

  width: 215px;
`;

const UploadYourFirstDatasetHeader = styled.span`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h5 */
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 32.016px */
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
  font-feature-settings: 'clig' off, 'liga' off;
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

const NoPublicationsText = styled.span`
  color: var(--text-primary, #040036);
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h5 */
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 32.016px */

  margin-top: 16px;
  margin-bottom: 16px;
`;

const ItLooksLikeUserHasntUploaded = styled.span`
  color: var(--text-secondary, #68676e);
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/body1 */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
  white-space: pre-line;
`;
