import { observer } from 'mobx-react-lite';
import { ReactElement, useEffect, useState } from "react"
import { Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { FullWidth, HeightElement } from '../common.styled'
import {
  CollaborationRequestBox,
} from './CollaborationRequestBox';
import { routerStore } from '../../core/router';
import { Page } from '../../core/router/constants';
import { collaborationStore } from '../publication/store/downloadsStore';
import { CollaborationRequestInfo } from "../../apis/first-approval-api"
import { PublicationCollaborationsStore } from "./dashboard/PublicationCollaborationsStore"
import { PublicationInfoBox } from "./elements/PublicationInfoBox"

export const PublicationCollaborationsPage = observer((): ReactElement => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);
  const [publicationCollaborationsStore] = useState(new PublicationCollaborationsStore(publicationId));


  useEffect(() => {
    // collaborationStore.clearAndOpen(publicationInfo.id, publicationInfo.collaboratorsCount);
    // if (publicationInfo.creator!!.id === userStore.user!!.id) {
    //   collaborationStore.loadCollaborationRequests(0);
    // }
    // collaborationStore.loadCollaborationRequests(0);
  }, []);
  const goToChat = (collaborationRequestId: string) => routerStore.navigatePage(
    Page.COLLABORATIONS_CHAT,
    `/publication/${publicationId}/chat/${collaborationRequestId}`,
    true
  );

  function mapToCollaborationRequestBox(collaborationRequestInfo: CollaborationRequestInfo) {
    return (
      <CollaborationRequestBox
        onClick={() => goToChat(collaborationRequestInfo.id)}
        avatar={'PL'}
        name={`${collaborationRequestInfo?.userInfo?.firstName} ${collaborationRequestInfo?.userInfo?.lastName}`}
        status={collaborationRequestInfo.status}>
        {collaborationRequestInfo.description}
      </CollaborationRequestBox>
    );
  }

  return (
    <>
      <BodyWrap>
        <BodyContentWrap>
          <HeaderWrap>
            <HeaderTitleWrap>
              <Typography variant={'h5'}>
                Collaboration dashboard
              </Typography>
              <MarginLeftAuto />
            </HeaderTitleWrap>
            <HeightElement value={'36px'} />
          </HeaderWrap>
          <div
            style={{
              marginBottom: '24px',
              color: '#68676E',
              fontSize: '16px',
              fontWeight: '400',
              lineHeight: '150%',
              letterSpacing: '0.15px'
            }}>
            This page helps you manage collaboration requests from
            data users who plan to reuse/include your data in their
            upcoming publications.
          </div>
          <DatasetStatsWrapper>
            {
              publicationCollaborationsStore.publication &&
              <PublicationInfoBox publicationInfo={publicationCollaborationsStore.publication} />
            }
          </DatasetStatsWrapper>
          <HeightElement value={'36px'} />
          <Typography variant={'h6'}>{collaborationStore.collaborationRequests.length ?
            'Received requests' : 'There are no collaboration requests for this publication yet.'}</Typography>
          <HeightElement value={'12px'} />
          <FullWidth>
            {collaborationStore.collaborationRequests.map(mapToCollaborationRequestBox)}
          </FullWidth>
        </BodyContentWrap>
      </BodyWrap>
    </>
  )
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

const HeaderWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeaderTitleWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const MarginLeftAuto = styled.div`
  margin-left: auto;
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

const DatasetStatsWrapper = styled.div`
  border: 1px solid #d2d2d6;
  padding: 16px 24px;
  border-radius: 8px;
`;

const StyledButton = styled(Button)`
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
  &:hover {
    background: rgb(0 0 0 / 4%);
    border-color: #040036;
  }
`;

