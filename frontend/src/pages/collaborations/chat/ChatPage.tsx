import { type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import { HeaderComponent } from '../../../components/HeaderComponent';
import { Helmet } from 'react-helmet';
import BreadCrumbs from '../BreadCrumbs';

import Chat from './Chat';
import { Typography } from '@mui/material';
// import Button from '@mui/material/Button';
import { observer } from 'mobx-react-lite';
import { LeftPanelPublicationsPage } from '../LeftPanelPublications';
import {
  CollaborationRequestInfo,
  PublicationShortInfo
} from '../../../apis/first-approval-api';
import { userStore } from '../../../core/user';
import { routerStore } from '../../../core/router';
import { collaborationStore } from "../../publication/store/downloadsStore"
import { PublicationStore } from "../../publication/store/PublicationStore"
import { CollaborationChatStore } from "../../publication/store/CollaborationChatStore"

export const ChatPage = observer((): ReactElement => {
  const [collaborationRequestId] = useState(() => routerStore.lastPathSegment);
  const [publicationStore] = useState(
    () => new CollaborationChatStore(collaborationRequestId)
  );

  // const publicationShortInfo } = props;
  const interlocutorName = extractInterlocutorName(
    collaborationRequestInfo,
    publicationShortInfo
  );
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content={'Chat with __firstname__ __lastname__'}
        />
        <title>Chat with __firstname__ __lastname__</title>
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
          <LeftPanelPublicationsPage />
          <RightPanel>
            <BreadCrumbs name={interlocutorName} />
            <BodyWrap>
              <BodyContentWrap>
                <Chat />
              </BodyContentWrap>
            </BodyWrap>
          </RightPanel>
        </Container>
      </Parent>
    </>
  );
});

function extractInterlocutorName(
  collaborationRequestInfo: CollaborationRequestInfo,
  publicationShortInfo: PublicationShortInfo
) {
  const interlocutorUser =
    collaborationRequestInfo.userInfo.id === userStore.user!!.id
      ? publicationShortInfo.creator
      : collaborationRequestInfo.userInfo;
  return `${interlocutorUser!!.firstName} ${interlocutorUser!!.lastName}`;
}

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

const BodyWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BodyContentWrap = styled.div`
  width: 680px;
  padding: 48px 32px;
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

const LeftPanelHeader = styled(Typography)`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-size: 0.8rem;
  padding-left: 16px;
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
