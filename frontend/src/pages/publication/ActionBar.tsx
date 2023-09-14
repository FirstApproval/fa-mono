import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../core/auth';
import { routerStore } from '../../core/router';
import { Page } from '../../core/RouterStore';
import download from './asset/download.svg';
import downloadSample from './asset/download_sample.svg';
import pdf from './asset/pdf.svg';
import citate from './asset/citate.svg';
import { Button, Tooltip } from '@mui/material';
import { PublicationStore } from './store/PublicationStore';
import { ContentCopy } from '@mui/icons-material';
import { ArchiveDownloader } from './ArchiveDownloader';
import { CitateDialog } from './CitateDialog';
import { PublicationStatus } from '../../apis/first-approval-api';
import { PublicationPageStore } from './store/PublicationPageStore';

export const ActionBar = observer(
  (props: {
    publicationStore: PublicationStore;
    publicationPageStore: PublicationPageStore;
  }): ReactElement => {
    const { publicationStore, publicationPageStore } = props;

    const getArchiveSizeTitle = (sizeBytes: number | null): string => {
      if (sizeBytes) {
        const megabytes = sizeBytes / (1024 * 1024);
        if (megabytes > 1000) {
          return (
            '(' + (sizeBytes / (1024 * 1024 * 1024)).toFixed(1) + 'GB' + ')'
          );
        } else {
          return '(' + megabytes.toFixed(0) + 'MB' + ')';
        }
      }
      return '';
    };

    return (
      <div
        style={{
          marginTop: '32px',
          marginBottom: '12px'
        }}>
        <div
          style={{
            height: '1px',
            width: '100%',
            backgroundColor: '#D2D2D6',
            marginBottom: '16px'
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}>
            {publicationStore.publicationStatus ===
              PublicationStatus.PUBLISHED && (
              <Tooltip title="Download publication files">
                <DownloadFilesButtonWrap
                  variant="outlined"
                  onClick={() => {
                    if (authStore.token) {
                      publicationPageStore.downloadFiles();
                      publicationPageStore.isPasscodeDialogOpen = true;
                    } else {
                      routerStore.navigatePage(Page.SIGN_UP);
                    }
                  }}
                  size={'medium'}>
                  <img src={download} style={{ marginRight: '8px' }} />
                  <span>Download</span>
                  <div style={{ marginRight: 4 }}></div>
                  <span style={{ fontWeight: '400' }}>
                    {getArchiveSizeTitle(publicationStore.archiveSize)}
                  </span>
                </DownloadFilesButtonWrap>
              </Tooltip>
            )}
            {publicationPageStore.sampleFilesEnabled &&
              publicationStore.publicationStatus ===
                PublicationStatus.PUBLISHED && (
                <Tooltip title="Download publication sample files">
                  <DownloadSampleFilesButtonWrap
                    hidden={true}
                    variant="outlined"
                    onClick={() => publicationStore.downloadSampleFiles()}
                    size={'medium'}>
                    <img src={downloadSample} style={{ marginRight: '8px' }} />{' '}
                    <span>Download sample</span>
                    <div style={{ marginRight: 4 }}></div>
                    <span style={{ fontWeight: '400' }}>
                      {getArchiveSizeTitle(publicationStore.sampleArchiveSize)}
                    </span>
                  </DownloadSampleFilesButtonWrap>
                </Tooltip>
              )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}>
            <Tooltip title="Download publication PDF">
              <PdfButtonWrap variant="outlined" size={'medium'}>
                <img src={pdf} style={{ marginRight: '8px' }} /> PDF
              </PdfButtonWrap>
            </Tooltip>
            <ActionButtonWrap
              variant="outlined"
              size={'medium'}
              onClick={() => {
                publicationPageStore.isCitateDialogOpen = true;
              }}>
              <img src={citate} />
            </ActionButtonWrap>
            <Tooltip title="Copy publication link">
              <ActionButtonWrap
                variant="outlined"
                onClick={publicationStore.copyPublicationLinkToClipboard}
                size={'medium'}>
                <ContentCopy />
              </ActionButtonWrap>
            </Tooltip>
          </div>
        </div>

        <div
          style={{
            height: '1px',
            width: '100%',
            backgroundColor: '#D2D2D6',
            marginTop: '16px'
          }}
        />
        <ArchiveDownloader
          isPasscodeOpen={publicationPageStore.isPasscodeDialogOpen}
          setIsPasscodeOpen={(value) =>
            (publicationPageStore.isPasscodeDialogOpen = value)
          }
          publicationPageStore={publicationPageStore}
        />
        <CitateDialog
          isOpen={publicationPageStore.isCitateDialogOpen}
          setIsOpen={(value) =>
            (publicationPageStore.isCitateDialogOpen = value)
          }
          publicationStore={publicationStore}
          publicationPageStore={publicationPageStore}
        />
      </div>
    );
  }
);

const DownloadFilesButtonWrap = styled(Button)`
  margin-right: 16px;
  height: 36px;
  border-color: #3b4eff;
  color: #3b4eff;
`;

const DownloadSampleFilesButtonWrap = styled(Button)`
  height: 36px;
`;

const PdfButtonWrap = styled(Button)`
  height: 36px;
  margin-right: 12px;
`;

const ActionButtonWrap = styled(Button)`
  height: 36px;
  border: none;
`;
