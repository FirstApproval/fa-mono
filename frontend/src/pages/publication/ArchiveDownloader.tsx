import React, { ReactElement } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Close, CopyAll } from '@mui/icons-material';
import DialogContent from '@mui/material/DialogContent';
import { ColumnElement, TitleRowWrap } from '../common.styled';
import { copyTextToClipboard } from '../../fire-browser/utils';
import Dialog from '@mui/material/Dialog';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { PublicationPageStore } from './store/PublicationPageStore';
import { LinearProgress } from '@mui/material';

export const ArchiveDownloader = observer(
  (props: {
    isPasscodeOpen: boolean;
    setIsPasscodeOpen: (value: boolean) => void;
    publicationPageStore: PublicationPageStore;
  }): ReactElement => {
    const { isPasscodeOpen, setIsPasscodeOpen, publicationPageStore } = props;

    const onClosePasscodePopup = (): void => {
      setIsPasscodeOpen(false);
      publicationPageStore.passcode = '';
    };

    return (
      <Dialog
        open={isPasscodeOpen}
        onClose={onClosePasscodePopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogContentWrap>
          <TitleRowWrap>
            <DialogTitle
              style={{
                paddingLeft: '16px',
                paddingTop: 0,
                paddingBottom: 0
              }}
              id="alert-dialog-title">
              Passcode for archive
            </DialogTitle>
            <Close
              onClick={onClosePasscodePopup}
              style={{
                cursor: 'pointer',
                marginRight: '16px'
              }}
              htmlColor={'#68676E'}
            />
          </TitleRowWrap>
          <DialogContent
            style={{
              paddingLeft: '16px',
              paddingRight: '16px'
            }}>
            <ColumnElement style={{ maxWidth: '368px' }}>
              <TextWrap>
                Please use this code to unzip the downloaded archive on your
                device:
              </TextWrap>
              <PasscodeRowWrap>
                <PasscodeContainer>
                  {publicationPageStore.passcode && (
                    <Passcode>{publicationPageStore.passcode}</Passcode>
                  )}
                  {!publicationPageStore.passcode && (
                    <LinearProgress style={{ width: '100%' }} />
                  )}
                </PasscodeContainer>
                <CopyAll
                  onClick={() => {
                    void copyTextToClipboard(
                      publicationPageStore.passcode
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
    );
  }
);

const DialogContentWrap = styled.div`
  padding: 16px !important;
`;

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
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
  height: 76px;
  flex: 1 0 0;

  border-radius: 4px;
  background: var(--grey-100, #f3f2f5);
  margin-right: 12px;
`;

const Passcode = styled.div`
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
