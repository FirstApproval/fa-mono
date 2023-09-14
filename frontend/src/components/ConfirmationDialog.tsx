import { Button, Dialog, DialogContent } from '@mui/material';
import React, { ReactElement } from 'react';
import { WidthElement } from '../pages/common.styled';
import DialogTitle from '@mui/material/DialogTitle';
import styled from '@emotion/styled';
import DialogActions from '@mui/material/DialogActions';
import { FlexWrapRow } from '../pages/home/CallToAction';

export const ConfirmationDialog = (props: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  text?: string;
  yesText?: string;
  noText?: string;
}): ReactElement => {
  const { isOpen, onClose, onConfirm, title, text, yesText, noText } = props;
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DeleteDialogTitle id="alert-dialog-title">
        {title ?? 'Confirmation'}
      </DeleteDialogTitle>
      <DialogContentWrap>
        <DialogWidthWrap>{text ?? 'Are you sure?'}</DialogWidthWrap>
      </DialogContentWrap>
      <ConfirmDialogActions>
        <FlexWrapRow>
          <CancelButton color={'primary'} variant="text" onClick={onClose}>
            {noText ?? 'No'}
          </CancelButton>
          <WidthElement value={'24px'} />
          <ConfirmButton
            color="error"
            variant={'contained'}
            onClick={onConfirm}>
            {yesText ?? 'Yes'}
          </ConfirmButton>
        </FlexWrapRow>
      </ConfirmDialogActions>
    </Dialog>
  );
};

const DialogWidthWrap = styled.div`
  max-width: 336px;
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/body */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;

const DeleteDialogTitle = styled(DialogTitle)`
  padding-top: 32px !important;
  padding-left: 32px !important;

  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h5 */
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 32.016px */
`;

const DialogContentWrap = styled(DialogContent)`
  padding-left: 32px !important;
  padding-right: 32px !important;
`;

const ConfirmDialogActions = styled(DialogActions)`
  padding: 0 32px 32px 32px !important;
  display: flex;
  align-items: end;
`;

const CancelButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 11px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--primary-main, #3b4eff);
  font-feature-settings: 'clig' off, 'liga' off;

  /* components/button-large */
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.46px;
`;

const ConfirmButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--error-contrast, #fff);
  font-feature-settings: 'clig' off, 'liga' off;

  /* components/button-large */
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.46px;
`;
