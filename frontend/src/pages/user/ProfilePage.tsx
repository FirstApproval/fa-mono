import React, {
  type FunctionComponent,
  type ReactElement,
  useState
} from 'react';
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Tabs
} from '@mui/material';
import { EmailOutlined, IosShare } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import {
  CustomTab,
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  HeightElement,
  Logo,
  Parent
} from '../common.styled';
import { routerStore } from '../../core/router';
import { UserMenu } from '../../components/UserMenu';
import logo from '../../assets/logo.svg';
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
import { Page } from '../../core/RouterStore';

export const ProfilePage: FunctionComponent = observer(() => {
  const [username] = useState(() => routerStore.profileUsername);
  debugger;
  const [store] = useState(() => new ProfilePageStore(username));
  const user = (username ? store : userStore).user!;
  const [tabNumber, setTabNumber] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number): void => {
    setTabNumber(newValue);
  };

  const mapPublications = (publications: Publication[]): ReactElement[] =>
    publications.map((publication, index) => (
      <PublicationSection publication={publication} key={publication.id} />
    ));
  const loadMoreButton = (status: PublicationStatus): ReactElement => (
    <LoadMorePublicationsButton
      disabled={store.publicationsLastPage.get(status)}
      onClick={async () => {
        await store.load(status);
      }}>
      Load more datasets
    </LoadMorePublicationsButton>
  );

  if (!user) {
    return <CircularProgress />;
  }

  const lastNameAndFirstName = `${user.lastName ?? ''} ${user.firstName ?? ''}`;
  const notEmpty = (publications: Publication[]): boolean => {
    return publications && publications.length > 0;
  };

  return (
    <Parent>
      <FlexHeader>
        <Logo onClick={routerStore.goHome}>
          <img src={logo} />
        </Logo>
        <FlexHeaderRight>
          <UserMenu />
        </FlexHeaderRight>
      </FlexHeader>
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
                  <EditProfileButton
                    onClick={() => {
                      routerStore.navigatePage(
                        Page.ACCOUNT,
                        '/account/profile'
                      );
                    }}
                    variant="outlined"
                    size={'large'}>
                    Edit profile
                  </EditProfileButton>
                  <CopyProfileLinkButton
                    size={'large'}
                    onClick={() => {
                      void copyTextToClipboard(
                        getProfileLink(user.username)
                      ).finally();
                    }}>
                    <IosShare style={{ marginRight: '8px' }} />
                    Copy profile link
                  </CopyProfileLinkButton>
                </RowElement>
              </UserInfoElement>
            </RowElement>
            <HeightElement value={'40px'}></HeightElement>
            <Tabs
              value={tabNumber}
              onChange={handleChange}
              aria-label="basic tabs example">
              <CustomTab sx={{ textTransform: 'none' }} label="Published" />
              <CustomTab sx={{ textTransform: 'none' }} label="Drafts" />
            </Tabs>
            <Divider style={{ marginTop: '-1.3px' }} />
            <HeightElement value={'40px'}></HeightElement>
            {store.isLoadingPublications && <LinearProgress />}
            {!store.isLoadingPublications && (
              <>
                {tabNumber === 0 && (
                  <TabContainer>
                    <div>
                      {mapPublications(
                        store.publications.get(PublicationStatus.PUBLISHED) ??
                          []
                      )}
                    </div>
                    {notEmpty(
                      store.publications.get(PublicationStatus.PUBLISHED) ?? []
                    ) && loadMoreButton(PublicationStatus.PUBLISHED)}
                    <Banner>
                      <BannerLeftPart>
                        <UploadYourFirstDatasetHeader>
                          Upload you first dataset
                        </UploadYourFirstDatasetHeader>
                        <HeightElement value={'8px'} />
                        <SelfInfo>
                          Show off your work. Get recognition and be a part of a
                          growing community.
                        </SelfInfo>
                        <HeightElement value={'10px'} />
                        <StartPublishingButton
                          color={'primary'}
                          variant={'contained'}
                          onClick={async () => {
                            await store.createPublication();
                          }}>
                          Start publishing
                        </StartPublishingButton>
                      </BannerLeftPart>
                      <img src={upload_your_first_dataset_from} />
                    </Banner>
                  </TabContainer>
                )}
                {tabNumber === 1 && (
                  <TabContainer>
                    <div>
                      {mapPublications(
                        store.publications.get(PublicationStatus.PENDING) ?? []
                      )}
                    </div>
                    {notEmpty(
                      store.publications.get(PublicationStatus.PENDING) ?? []
                    ) && loadMoreButton(PublicationStatus.PENDING)}
                  </TabContainer>
                )}
              </>
            )}
          </ColumnElement>
        </FlexBody>
      </FlexBodyCenter>
    </Parent>
  );
});

export const RowElement = styled('div')<{
  visibility?: string | undefined;
}>`
  width: 100%;
  display: flex;
  visibility: ${(props) => props.visibility ?? 'visible'};
`;

export const ColumnElement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
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
`;

export const EditProfileButton = styled(Button)`
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
  border-style: dashed;
  border-color: gray;
`;

const BannerLeftPart = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 32px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

export const StartPublishingButton = styled(Button)`
  width: 180px;
`;
