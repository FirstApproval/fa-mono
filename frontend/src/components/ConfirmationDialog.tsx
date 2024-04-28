import { Button, Dialog, DialogContent, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { FlexWrapRow, WidthElement } from '../pages/common.styled';
import styled from '@emotion/styled';
import DialogActions from '@mui/material/DialogActions';

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
      <ConfirmDialogTitle id="alert-dialog-title" variant={'h5'}>
        {title ?? 'Confirmation'}
      </ConfirmDialogTitle>
      <DialogContentWrap>
        <DialogWidthWrap variant={'body'}>
          {text ?? 'Are you sure?'}
        </DialogWidthWrap>
      </DialogContentWrap>
      <ConfirmDialogActions>
        <FlexWrapRow>
          <CancelButton
            size={'large'}
            color={'primary'}
            variant="text"
            onClick={onClose}>
            {noText ?? 'No'}
          </CancelButton>
          <WidthElement value={'24px'} />
          <ConfirmButton
            color="error"
            variant={'contained'}
            size={'large'}
            onClick={onConfirm}>
            {yesText ?? 'Yes'}
          </ConfirmButton>
        </FlexWrapRow>
      </ConfirmDialogActions>
    </Dialog>
  );
};

const DialogWidthWrap = styled(Typography)`
  max-width: 336px;
`;

const ConfirmDialogTitle = styled(Typography)`
  padding-top: 32px;
  padding-left: 32px;
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
`;

const ConfirmButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--error-contrast, #fff);
`;
