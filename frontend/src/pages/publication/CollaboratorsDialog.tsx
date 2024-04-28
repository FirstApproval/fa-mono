import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import React, { ReactElement, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import DialogTitle from '@mui/material/DialogTitle';
import { Circle, Close } from '@mui/icons-material';
import {
  HeightElement,
  RowElementSpaceBetween,
  TitleRowWrap
} from '../common.styled';
import { collaborationStore } from './store/downloadsStore';
import {
  CollaborationRequestInfo,
  CollaborationRequestStatus
} from '../../apis/first-approval-api';
import styled from '@emotion/styled';
import { CollaborationRequestDialog } from '../../components/CollaborationRequestDialog';
import { routerStore } from '../../core/router';
import { Page } from '../../core/router/constants';
import { getAuthorLink } from '../../core/router/utils';
import { AuthorElement } from './editors/element/AuthorElement';

export const CollaboratorsDialog = (props: {
  isOpen: boolean;
  collaborationRequests: CollaborationRequestInfo[];
}): ReactElement => {
  const { isOpen, collaborationRequests } = props;
  const [collaborationRequestDialogOpen, setCollaborationRequestDialogOpen] =
    useState(false);
  const [collaborationRequest, setCollaborationRequest] =
    useState<CollaborationRequestInfo | null>(null);
  debugger;

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        collaborationStore.open = false;
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogContentWrap>
        <TitleRowWrap>
          <DialogTitleWrap>
            {`${collaborationStore.approvedCollaborationRequestCount} collaborators`}
          </DialogTitleWrap>
          <Close
            onClick={() => {
              collaborationStore.open = false;
            }}
            style={{ cursor: 'pointer' }}
            htmlColor={'#68676E'}
          />
        </TitleRowWrap>
        <HeightElement value={'32px'} />
        <InfiniteScroll
          pageStart={-1}
          loadMore={(page) =>
            collaborationStore.loadCollaborationRequests(page)
          }
          initialLoad={true}
          loader={<div key="loading">Loading ...</div>}
          useWindow={false}
          hasMore={!collaborationStore.collaborationRequestsIsLastPage}>
          {collaborationRequests.map((collaborationRequest, index) => (
            <>
              <RowElementSpaceBetween
                onClick={() => {
                  if (
                    collaborationRequest.status ===
                    CollaborationRequestStatus.PENDING
                  ) {
                    setCollaborationRequest(collaborationRequest);
                    setCollaborationRequestDialogOpen(true);
                  } else {
                    routerStore.openInNewTab(
                      Page.PROFILE +
                        getAuthorLink(collaborationRequest.userInfo.username)
                    );
                  }
                }}>
                <AuthorElement
                  key={index}
                  isReadonly={true}
                  useMarginBottom={false}
                  author={collaborationRequest.userInfo!}
                  shouldOpenInNewTab={true}
                />
                {collaborationRequest.status ===
                  CollaborationRequestStatus.PENDING && (
                  <Circle
                    sx={{
                      width: '16px',
                      height: '16px'
                    }}
                    htmlColor={'#3B4EFF'}
                  />
                )}
              </RowElementSpaceBetween>
              <HeightElement value={'28px'} />
            </>
          ))}
        </InfiniteScroll>
        {collaborationStore.loadCollaborationRequestsLocked && (
          <CircularProgress />
        )}
      </DialogContentWrap>
      {collaborationRequest && (
        <CollaborationRequestDialog
          isOpen={collaborationRequestDialogOpen}
          onClose={() => {
            setCollaborationRequestDialogOpen(false);
            setCollaborationRequest(null);
          }}
          collaborationRequest={collaborationRequest!}
        />
      )}
    </Dialog>
  );
};

const DialogContentWrap = styled(DialogContent)`
  min-width: 600px;
  max-height: 700px;
  padding: 32px 32px 4px !important;
  overflow-y: scroll;
`;

const DialogTitleWrap = styled(DialogTitle)`
  padding-bottom: 0;
  padding-left: 0;
  padding-top: 0;
`;
