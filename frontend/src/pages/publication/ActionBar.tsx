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

export const ActionBar = observer(
  (props: { publicationStore: PublicationStore }): ReactElement => {
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
            <DownloadFilesButtonWrap
              variant="outlined"
              onClick={() => {
                if (authStore.token) {
                  props.publicationStore.downloadFiles();
                } else {
                  routerStore.navigatePage(Page.SIGN_UP);
                }
              }}
              size={'medium'}>
              <img src={download} style={{ marginRight: '8px' }} /> Download
            </DownloadFilesButtonWrap>
            {props.publicationStore.sampleFilesEnabled && (
              <DownloadSampleFilesButtonWrap
                hidden={true}
                variant="outlined"
                onClick={props.publicationStore.downloadSampleFiles}
                size={'medium'}>
                <img src={downloadSample} style={{ marginRight: '8px' }} />{' '}
                Download sample
              </DownloadSampleFilesButtonWrap>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}>
            <PdfButtonWrap variant="outlined" size={'medium'}>
              <img src={pdf} style={{ marginRight: '8px' }} /> PDF
            </PdfButtonWrap>
            <ActionButtonWrap variant="outlined" size={'medium'}>
              <img src={citate} />
            </ActionButtonWrap>
            <Tooltip title="Copy link to publication">
              <ActionButtonWrap
                variant="outlined"
                onClick={props.publicationStore.copyPublicationLinkToClipboard}
                size={'medium'}>
                <ContentCopy style={{ marginRight: '8px' }} />
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
      </div>
    );
  }
);
