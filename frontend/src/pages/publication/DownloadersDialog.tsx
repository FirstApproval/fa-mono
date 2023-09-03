import { Dialog, DialogContent, styled } from '@mui/material';
import React, { ReactElement } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { PublicationStore } from './store/PublicationStore';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthorElement } from './editors/element/AuthorElement';
import { Close } from '@mui/icons-material';
import { HeightElement, TitleRowWrap } from '../common.styled';
import { UserInfo } from '../../apis/first-approval-api';

export const DownloadersDialog = (props: {
  isOpen: boolean;
  onClose: () => void;
  publicationStore: PublicationStore;
  downloaders: UserInfo[];
}): ReactElement => {
  const { onClose, publicationStore } = props;
  return (
    <Dialog
      open={props.isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogContentWrap>
        <TitleRowWrap>
          <DialogTitle style={{ paddingLeft: 0, paddingTop: 0 }}>
            {`${publicationStore.downloadsCount} downloads`}
          </DialogTitle>
          <Close
            onClick={onClose}
            style={{ cursor: 'pointer' }}
            htmlColor={'#68676E'}
          />
        </TitleRowWrap>
        <HeightElement value={'16px'} />
        <InfiniteScroll
          pageStart={-1}
          loadMore={(page) => publicationStore.loadDownloaders(page)}
          initialLoad={true}
          loader={<div key="loading">Loading ...</div>}
          useWindow={false}
          hasMore={!publicationStore.downloadersIsLastPage}>
          {props.downloaders.map((downloader, index) => (
            <AuthorElement key={index} isReadonly={true} author={downloader} />
          ))}
        </InfiniteScroll>
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
