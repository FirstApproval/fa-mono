import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import React, { ReactElement } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthorElement } from './editors/element/AuthorElement';
import { Close } from '@mui/icons-material';
import { HeightElement, TitleRowWrap } from '../common.styled';
import { downloadersStore } from './store/downloadsStore';
import { UserInfo } from '../../apis/first-approval-api';
import styled from '@emotion/styled';

export const DownloadersDialog = (props: {
  isOpen: boolean;
  downloaders: UserInfo[];
}): ReactElement => {
  const { isOpen, downloaders } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        downloadersStore.open = false;
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogContentWrap>
        <TitleRowWrap>
          <DialogTitleWrap>
            {`${downloadersStore.downloadsCount} downloads`}
          </DialogTitleWrap>
          <Close
            onClick={() => {
              downloadersStore.open = false;
            }}
            style={{ cursor: 'pointer' }}
            htmlColor={'#68676E'}
          />
        </TitleRowWrap>
        <HeightElement value={'32px'} />
        <InfiniteScroll
          pageStart={-1}
          loadMore={(page) => downloadersStore.loadDownloaders(page)}
          initialLoad={true}
          loader={<div key="loading">Loading ...</div>}
          useWindow={false}
          hasMore={!downloadersStore.downloadersIsLastPage}>
          {downloaders.map((downloader, index) => (
            <>
              <AuthorElement
                key={index}
                isReadonly={true}
                useMarginBottom={false}
                author={downloader}
                shouldOpenInNewTab={true}
              />
              <HeightElement value={'28px'} />
            </>
          ))}
        </InfiniteScroll>
        {downloadersStore.loadDownloadersLocked && <CircularProgress />}
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
