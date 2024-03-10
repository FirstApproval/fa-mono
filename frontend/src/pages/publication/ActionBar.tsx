import React, { type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../core/auth';
import { routerStore } from '../../core/router';
import pdf from './asset/pdf.svg';
import citate from './asset/citate.svg';
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Snackbar,
  Tooltip,
  Typography
} from '@mui/material';
import { PublicationStore } from './store/PublicationStore';
import { ContentCopy, FileDownloadOutlined } from '@mui/icons-material';
import { ArchiveDownloader } from './ArchiveDownloader';
import { CitateDialog } from './CitateDialog';
import {
  PublicationContentStatus,
  PublicationStatus
} from '../../apis/first-approval-api';
import { PublicationPageStore } from './store/PublicationPageStore';
import { Page } from '../../core/router/constants';
import { CircularProgressWrap } from '../common.styled';

export const PUBLICATION_TRIED_TO_DOWNLOAD_SESSION_KEY =
  'requested_publication_id';

export const ActionBar = observer(
  (props: {
    publicationStore: PublicationStore;
    publicationPageStore: PublicationPageStore;
    displayDivider: boolean;
  }): ReactElement => {
    const { publicationStore, publicationPageStore } = props;
    const [showLinkCopiedAlert, setShowLinkCopiedAlert] = useState(false);

    const getArchiveSizeTitle = (sizeBytes: number | null): string => {
      if (sizeBytes) {
        const megabytes = sizeBytes / (1024 * 1024);
        if (megabytes > 1000) {
          const gbSize = sizeBytes / (1024 * 1024 * 1024);
          return '(' + gbSize.toFixed(1) + 'GB' + ')';
        } else if (megabytes > 1) {
          return '(' + megabytes.toFixed(0) + 'MB' + ')';
        } else {
          const kbSize = sizeBytes / 1024;
          return '(' + kbSize.toFixed(0) + 'KB' + ')';
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
        {props.displayDivider && (
          <Divider color={'#D2D2D6'} sx={{ marginBottom: '16px' }} />
        )}
        <Grid
          container
          rowSpacing={2}
          spacing={2}
          alignItems={{ xs: 'center', lg: 'space-between' }}>
          <Grid item sm={6} md={8}>
            {publicationStore.publicationStatus ===
              PublicationStatus.READY_FOR_PUBLICATION && (
              <FlexWrapRow>
                <CircularProgressWrap size={24} />
                <Typography variant={'body2'}>
                  Publishing... This may take some time. Please wait.
                </Typography>
              </FlexWrapRow>
            )}
            {publicationStore.publicationStatus ===
              PublicationStatus.MODERATION && (
              <FlexWrapRow>
                <CircularProgressWrap size={24} />
                <Typography variant={'body2'}>
                  Moderation... This may take up to one day. Please wait.
                </Typography>
              </FlexWrapRow>
            )}
            {publicationStore.publicationStatus ===
              PublicationStatus.PUBLISHED && (
              <Tooltip title="Download publication files">
                <DownloadFilesButtonWrap
                  variant="outlined"
                  onClick={() => {
                    if (authStore.token) {
                      publicationPageStore.downloadFiles();
                    } else {
                      sessionStorage.setItem(
                        PUBLICATION_TRIED_TO_DOWNLOAD_SESSION_KEY,
                        publicationStore.publicationId
                      );
                      routerStore.navigatePage(Page.SIGN_UP);
                    }
                  }}
                  size={'medium'}>
                  <FileDownloadOutlined
                    color={'primary'}
                    style={{ marginRight: '8px' }}
                  />
                  <Box display={{ xs: 'none', lg: 'block' }}>
                    <span>
                      {publicationPageStore.contentStatus ===
                      PublicationContentStatus.PREPARING
                        ? 'Preparing...'
                        : 'Download'}
                    </span>
                  </Box>
                  <div style={{ marginRight: 4 }}></div>
                  <span style={{ fontWeight: '400' }}>
                    {getArchiveSizeTitle(publicationStore.archiveSize)}
                  </span>
                </DownloadFilesButtonWrap>
              </Tooltip>
            )}
            {publicationPageStore.sampleFilesEnabled &&
              publicationStore.isPublished && (
                <Tooltip title="Download publication sample files">
                  <DownloadSampleFilesButtonWrap
                    hidden={true}
                    variant="outlined"
                    onClick={() => publicationPageStore.downloadSampleFiles()}
                    size={'medium'}>
                    <FileDownloadOutlined
                      color={'inherit'}
                      style={{ marginRight: '8px' }}
                    />{' '}
                    <Box display={{ xs: 'block', lg: 'block' }}>
                      <span>Sample</span>
                    </Box>
                    <div style={{ marginRight: 4 }}></div>
                    <span style={{ fontWeight: '400' }}>
                      {getArchiveSizeTitle(publicationStore.sampleArchiveSize)}
                    </span>
                  </DownloadSampleFilesButtonWrap>
                </Tooltip>
              )}
          </Grid>
          <Grid
            item
            sm={6}
            md={4}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}>
            <Tooltip title="Download publication PDF">
              <PdfButtonWrap
                variant="outlined"
                size={'medium'}
                onClick={publicationPageStore.downloadPdf}>
                <img src={pdf} style={{ marginRight: '8px' }} /> PDF
              </PdfButtonWrap>
            </Tooltip>
            <Tooltip title="Cite">
              <ActionButtonWrap
                variant="outlined"
                size={'medium'}
                onClick={() => {
                  publicationPageStore.isCitateDialogOpen = true;
                }}>
                <img src={citate} />
              </ActionButtonWrap>
            </Tooltip>
            <Tooltip title="Copy publication link">
              <ActionButtonWrap
                variant="outlined"
                onClick={() => {
                  publicationStore.copyPublicationLinkToClipboard();
                  setShowLinkCopiedAlert(true);
                }}
                size={'medium'}>
                <ContentCopy />
              </ActionButtonWrap>
            </Tooltip>
          </Grid>
        </Grid>

        {props.displayDivider && (
          <Divider color={'#D2D2D6'} sx={{ marginTop: '16px' }} />
        )}
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
          authorNames={publicationStore.authorNames}
          publicationTime={publicationStore.publicationTime}
          publicationTitle={publicationStore.title}
        />
        <Snackbar
          open={showLinkCopiedAlert}
          autoHideDuration={4000}
          onClose={() => {
            setShowLinkCopiedAlert(false);
          }}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Link copied successfully!
          </Alert>
        </Snackbar>
      </div>
    );
  }
);

const FlexWrapRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

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

// const DividerWrap = styled(Divider)<{ value?: string }>`
//   height: 36px;
//   border: none;
// `;
