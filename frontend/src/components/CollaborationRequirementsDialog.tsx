import { Button, Dialog, DialogContent, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import {
  FlexWrapRow,
  HeightElement,
  WidthElement
} from '../pages/common.styled';
import styled from '@emotion/styled';
import DialogActions from '@mui/material/DialogActions';

export const CollaborationRequirementsDialog = (props: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}): ReactElement => {
  const { isOpen, onClose, onConfirm } = props;
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DeleteDialogTitle id="alert-dialog-title" variant={'h5'}>
        Collaboration requirements
      </DeleteDialogTitle>
      <DialogContentWrap>
        <DialogWidthWrap variant={'body'}>
          Incorporating this dataset into your work or using any part in a
          larger dataset, obligates you to request a collaboration of the
          dataset's author(s).
        </DialogWidthWrap>
        <HeightElement value={'12px'} />
        <DialogWidthWrap variant={'body'}>
          It may lead to including them as co-author(s) following their
          approval.
        </DialogWidthWrap>
      </DialogContentWrap>
      <ConfirmDialogActions>
        <FlexWrapRow>
          <CancelButton
            size={'large'}
            color={'primary'}
            variant="text"
            onClick={onClose}>
            Cancel
          </CancelButton>
          <WidthElement value={'24px'} />
          <ConfirmButton
            color="error"
            variant={'contained'}
            size={'large'}
            onClick={onConfirm}>
            Download
          </ConfirmButton>
        </FlexWrapRow>
      </ConfirmDialogActions>
    </Dialog>
  );
};

const DialogWidthWrap = styled(Typography)`
  max-width: 336px;
`;

const DeleteDialogTitle = styled(Typography)`
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
