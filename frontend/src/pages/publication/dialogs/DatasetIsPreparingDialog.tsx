import React, { ReactElement } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';

export const DatasetIsPreparingDialog = observer(
  (props: { isOpen: boolean; onClose: () => void }): ReactElement => {
    const { isOpen, onClose } = props;

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <CustomDialogTitle id="alert-dialog-title">
          Gotta wait - dataset is preparing for download
        </CustomDialogTitle>
        <DialogContentWrap>
          <Content>
            Once ready, we notify you by email and the download link will be
            made available on this page. It may take up to a few hours because
            this dataset was in cold storage.
          </Content>
        </DialogContentWrap>
        <ConfirmDialogActions>
          <Button variant={'contained'} onClick={onClose}>
            Ok, I am waiting
          </Button>
        </ConfirmDialogActions>
      </Dialog>
    );
  }
);

const Content = styled.div`
  width: 100%;
  max-width: 600px;

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

const CustomDialogTitle = styled(DialogTitle)`
  padding: 32px;
`;

const DialogContentWrap = styled(DialogContent)`
  padding: 0 32px;
`;

const ConfirmDialogActions = styled(DialogActions)`
  padding: 32px;
  display: flex;
  justify-content: start;
`;
