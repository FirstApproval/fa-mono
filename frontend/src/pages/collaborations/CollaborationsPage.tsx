import { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { HeaderComponent } from '../../components/HeaderComponent';
import { Helmet } from 'react-helmet';
import { Button } from '@mui/material';
import NoPublicationsImage from '../../assets/no-publications.svg';
import { collaborationsPageStore } from '../publication/store/downloadsStore';
import { observer } from 'mobx-react-lite';
import { PublicationCollaborationsPage } from './PublicationCollaborations';
import { LeftPanelPublicationsPage } from './LeftPanelPublications';
import { PublicationType } from "../publication/store/CollaborationsPageStore"
import { routerStore } from "../../core/router"
import { Page } from "../../core/router/constants"

export const CollaborationsPage = observer((): ReactElement => {
  const {
    myPublications,
    downloadedPublications,
    selectedPublication,
    selectedPublicationType
  } = collaborationsPageStore;
  const hasPublications =
    (myPublications?.length ?? 0) + (downloadedPublications?.length ?? 0) > 0;

  const goToChat = (collaborationRequestId: string) => routerStore.navigatePage(
    Page.DOWNLOADED_PUBLICATION_COLLABORATIONS_CHAT,
    `chat/${collaborationRequestId}`,
    true
  );

  return (
    <>
      <Helmet>
        <meta name="description" content={'Collaboration dashboard'} />
        <title>Collaboration dashboard</title>
      </Helmet>
      <Parent>
        <HeaderBorderColorFix>
          <HeaderComponent
            showPublishButton={true}
            showCollaborateButton={true}
            showBottomStyleGap={false}
          />
        </HeaderBorderColorFix>
        <Container>
          {hasPublications ? (
            <>
              <LeftPanelPublicationsPage />
              <RightPanel>
                {selectedPublication &&
                  selectedPublicationType === PublicationType.MY && (
                    <PublicationCollaborationsPage
                      publicationInfo={selectedPublication}
                    />
                  )}
              </RightPanel>
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxHeight: 'calc(100% - 195px)',
                margin: '0 auto'
              }}>
              <div style={{ textAlign: 'center' }}>
                <img src={NoPublicationsImage} />
                <h3>Download dataset to start collaboration</h3>
                <StyledButton variant="outlined" onClick={() => false}>
                  Main page →
                </StyledButton>
              </div>
            </div>
          )}
        </Container>
      </Parent>
    </>
  );
});

const HeaderBorderColorFix = styled.div`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #d2d2d6;
  }
`;

const Parent = styled.div`
  width: 100%;
  padding-bottom: 40px;
  min-height: calc(100vh - 104px);
`;

const LeftPanel = styled.div`
  flex: 22%;
  display: flex;
  max-width: 300px;
  flex-direction: column;
  align-items: start;
  border-right: 1px solid #d2d2d6;

  justify-content: space-between;
  padding: 22px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 88%;
  overflow-y: auto;
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;

  &:hover {
    background: rgb(0 0 0 / 4%);
    border-color: #040036;
  }
`;
