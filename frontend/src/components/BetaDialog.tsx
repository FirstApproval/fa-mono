import { Dialog, DialogContent, Divider, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import {
  FullWidthButton,
  TitleRowWrap,
  WidthElement
} from '../pages/common.styled';
import DialogTitle from '@mui/material/DialogTitle';
import { Close } from '@mui/icons-material';
import styled from '@emotion/styled';
import Launch from '@mui/icons-material/Launch';
import Telegram from '@mui/icons-material/Telegram';
import { routerStore } from 'src/core/router';
import x from '../assets/x.svg';

export const BetaDialog = (props: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogContentWrap>
        <TitleRowWrap>
          <DialogTitle style={{ padding: 0 }}>FA is in Beta 👨‍💻</DialogTitle>
          <Close
            style={{ cursor: 'pointer' }}
            htmlColor={'gray'}
            onClick={props.onClose}
          />
        </TitleRowWrap>
        <Typography variant={'body2'}>
          We keep data safe but we are still fine-tuning the platform and would
          love your feedback. Please choose how you would like to send us a
          message:
        </Typography>
        <div style={{ width: '100%' }}>
          <FullWidthButton
            variant={'contained'}
            href={'mailto:info@firstapproval.io'}
            onClick={props.onClose}>
            Email us to info@firstapproval.io
          </FullWidthButton>
          <TitleRowWrap style={{ paddingTop: '6px', paddingBottom: '6px', alignItems: 'center' }}>
            <Divider
              style={{ width: '45%', marginRight: '5px' }}
              color={'#D2D2D6'}
            />
            <span>or</span>
            <Divider
              style={{ width: '45%', marginLeft: '5px' }}
              color={'#D2D2D6'}
            />
          </TitleRowWrap>
          <TitleRowWrap>
            <FullWidthButton
              variant={'outlined'}
              onClick={() => {
                routerStore.openInNewTab('https://twitter.com/FirstApproval');
                props.onClose();
              }}>
              <img style={{ marginRight: '8px' }} src={x} />
              ex. Twitter
              <Launch sx={{ width: 20, height: 20, marginLeft: '8px' }} />
            </FullWidthButton>
            <WidthElement value={'6px'} />
            <FullWidthButton
              variant={'outlined'}
              onClick={() => {
                routerStore.openInNewTab('https://t.me/First_Approval');
                props.onClose();
              }}>
              <Telegram sx={{ width: 20, height: 20, marginRight: '8px' }} />
              Telegram
              <Launch sx={{ width: 20, height: 20, marginLeft: '8px' }} />
            </FullWidthButton>
          </TitleRowWrap>
        </div>
      </DialogContentWrap>
    </Dialog>
  );
};

const DialogContentWrap = styled(DialogContent)`
  display: flex;
  width: 428px;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  border-radius: 4px;
  background: var(--primary-contrast, #fff);

  /* elevation/15 */
  box-shadow: 0 8px 9px -5px rgba(0, 0, 0, 0.2),
    0px 15px 22px 2px rgba(0, 0, 0, 0.14), 0px 6px 28px 5px rgba(0, 0, 0, 0.12);
`;
