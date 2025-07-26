import { type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import { HeaderComponent } from '../../../components/HeaderComponent';
import { Helmet } from 'react-helmet';
import BreadCrumbs from '../BreadCrumbs';
import { observer } from 'mobx-react-lite';
import { LeftPanelPublicationsPage } from '../LeftPanelPublications';
import { UserInfo } from '../../../apis/first-approval-api';
import { userStore } from '../../../core/user';
import { routerStore } from '../../../core/router';
import { MyPublicationCollaborationChatStore } from '../../publication/store/MyPublicationCollaborationChatStore';
import Chat from "./Chat"

export const MyPublicationCollaborationChatPage = observer((): ReactElement => {
  const [collaborationRequestId] = useState(() => routerStore.lastPathSegment);
  const [collaborationChatStore] = useState(
    () => new MyPublicationCollaborationChatStore(collaborationRequestId)
  );

  // const publicationShortInfo } = props;
  const interlocutorName = (collaborationChatStore.collaborationRequestCreator && extractInterlocutorName(
    collaborationChatStore.collaborationRequestCreator!!,
    collaborationChatStore.publicationCreator!!
  )) ?? '';
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content={`Chat with ${interlocutorName}`}
        />
        <title>Chat with {interlocutorName}</title>
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
                <Chat collaborationChatStore={collaborationChatStore}/>
              </BodyContentWrap>
            </BodyWrap>
          </RightPanel>
        </Container>
      </Parent>
    </>
  );
});

function extractInterlocutorName(
  collaborationRequestCreator: UserInfo,
  publicationCreator: UserInfo
) {
  const interlocutorUser =
    collaborationRequestCreator.id === userStore.user!!.id
      ? publicationCreator
      : collaborationRequestCreator;
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
