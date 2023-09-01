import React, { type ReactElement, useState } from 'react';
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
import { Close, ContentCopy, CopyAll } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { ColumnElement } from '../common.styled';
import { copyTextToClipboard } from '../../fire-browser/utils';

export const ActionBar = observer(
  (props: { publicationStore: PublicationStore }): ReactElement => {
    const { publicationStore } = props;
    const [isPasscodeOpen, setIsPasscodeOpen] = useState(false);
    const onClosePasscodePopup = (): void => {
      setIsPasscodeOpen(false);
      publicationStore.passcode = '';
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
            <Tooltip title="Download publication files">
              <DownloadFilesButtonWrap
                variant="outlined"
                onClick={() => {
                  if (authStore.token) {
                    publicationStore.downloadFiles();
                    setIsPasscodeOpen(true);
                  } else {
                    routerStore.navigatePage(Page.SIGN_UP);
                  }
                }}
                size={'medium'}>
                <img src={download} style={{ marginRight: '8px' }} /> Download
              </DownloadFilesButtonWrap>
            </Tooltip>
            {publicationStore.sampleFilesEnabled && (
              <Tooltip title="Download publication sample files">
                <DownloadSampleFilesButtonWrap
                  hidden={true}
                  variant="outlined"
                  onClick={publicationStore.downloadSampleFiles}
                  size={'medium'}>
                  <img src={downloadSample} style={{ marginRight: '8px' }} />{' '}
                  Download sample
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
            <ActionButtonWrap variant="outlined" size={'medium'}>
              <img src={citate} />
            </ActionButtonWrap>
            <Tooltip title="Copy link to publication">
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
        <Dialog
          open={isPasscodeOpen}
          onClose={onClosePasscodePopup}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContentWrap>
            <TitleRowWrap>
              <DialogTitle
                style={{ paddingLeft: '16px', paddingTop: 0, paddingBottom: 0 }}
                id="alert-dialog-title">
                Passcode for archive
              </DialogTitle>
              <Close
                onClick={onClosePasscodePopup}
                style={{ cursor: 'pointer', marginRight: '16px' }}
                htmlColor={'#68676E'}
              />
            </TitleRowWrap>
            <DialogContent
              style={{ paddingLeft: '16px', paddingRight: '16px' }}>
              <ColumnElement style={{ maxWidth: '368px' }}>
                <TextWrap>
                  Please use this code to unzip the downloaded archive on your
                  device:
                </TextWrap>
                <PasscodeRowWrap>
                  <PasscodeContainer>
                    <Passcode>{publicationStore.passcode}</Passcode>
                  </PasscodeContainer>
                  <CopyAll
                    onClick={() => {
                      void copyTextToClipboard(
                        publicationStore.passcode
                      ).finally();
                    }}
                    style={{ cursor: 'pointer' }}
                    htmlColor={'#3B4EFF'}
                  />
                </PasscodeRowWrap>
                <TextWrap>
                  {
                    "We've also sent the passcode to your registered email address."
                  }
                </TextWrap>
                <ProtectionInfoText>
                  {
                    "We've protected the archive with a passcode to ensure the integrity and security of the data."
                  }
                </ProtectionInfoText>
              </ColumnElement>
            </DialogContent>
          </DialogContentWrap>
        </Dialog>
      </div>
    );
  }
);

const DialogContentWrap = styled.div`
  padding: 16px !important;
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

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleRowWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PasscodeRowWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 24px;
`;

const PasscodeContainer = styled.div`
  display: flex;
  padding: 16px 32px;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;

  border-radius: 4px;
  background: var(--grey-100, #f3f2f5);
  margin-right: 12px;
`;

const Passcode = styled.div`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h4 */
  font-family: Roboto;
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 123.5%; /* 41.99px */
  letter-spacing: 0.25px;
`;

const ProtectionInfoText = styled.span`
  color: var(--text-secondary, #68676e);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;

  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;

  margin-top: 32px;
  border-radius: 4px;
  background: var(--primary-states-hover, rgba(59, 78, 255, 0.04));
`;
