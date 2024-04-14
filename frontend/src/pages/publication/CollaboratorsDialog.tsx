import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import React, { ReactElement } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthorElement } from './editors/element/AuthorElement';
import { Close } from '@mui/icons-material';
import { HeightElement, TitleRowWrap } from '../common.styled';
import { collaboratorsStore } from './store/downloadsStore';
import { CollaboratorInfo, UserInfo } from '../../apis/first-approval-api';
import styled from '@emotion/styled';

export const CollaboratorsDialog = (props: {
  isOpen: boolean;
  collaborators: CollaboratorInfo[];
}): ReactElement => {
  const { isOpen, collaborators } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        collaboratorsStore.open = false;
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogContentWrap>
        <TitleRowWrap>
          <DialogTitleWrap>
            {`${collaboratorsStore.collaboratorsCount} collaborators`}
          </DialogTitleWrap>
          <Close
            onClick={() => {
              collaboratorsStore.open = false;
            }}
            style={{ cursor: 'pointer' }}
            htmlColor={'#68676E'}
          />
        </TitleRowWrap>
        <HeightElement value={'32px'} />
        <InfiniteScroll
          pageStart={-1}
          loadMore={(page) => collaboratorsStore.loadDownloaders(page)}
          initialLoad={true}
          loader={<div key="loading">Loading ...</div>}
          useWindow={false}
          hasMore={!collaboratorsStore.collaboratorsIsLastPage}>
          {collaborators.map((downloader, index) => (
            <>
              <AuthorElement
                key={index}
                isReadonly={true}
                useMarginBottom={false}
                author={downloader.userInfo}
                shouldOpenInNewTab={true}
              />
              <HeightElement value={'28px'} />
            </>
          ))}
        </InfiniteScroll>
        {collaboratorsStore.loadCollaboratorsLocked && <CircularProgress />}
      </DialogContentWrap>
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
