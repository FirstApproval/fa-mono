import { Button, Dialog, DialogContent, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { FlexWrapRow } from '../pages/common.styled';
import styled from '@emotion/styled';
import DialogActions from '@mui/material/DialogActions';
import { CollaborationRequestInfo } from '../apis/first-approval-api';
import { AuthorElement } from '../pages/publication/editors/element/AuthorElement';
import { collaborationRequestService } from '../core/service';

export const CollaborationRequestDialog = (props: {
  isOpen: boolean;
  onClose: () => void;
  collaborationRequest: CollaborationRequestInfo;
}): ReactElement => {
  const { isOpen, onClose, collaborationRequest } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DeleteDialogTitle id="alert-dialog-title" variant={'h5'}>
        Collaboration request
      </DeleteDialogTitle>
      <DialogContentWrap>
        <DialogWidthWrap variant={'body'}>
          <AuthorElement
            isReadonly={true}
            useMarginBottom={false}
            author={collaborationRequest.userInfo!}
            shouldOpenInNewTab={true}
          />
        </DialogWidthWrap>
      </DialogContentWrap>
      <ConfirmDialogActions>
        <FlexWrapRow>
          <RejectButton
            size={'large'}
            color="error"
            variant="text"
            onClick={async () =>
              collaborationRequestService
                .rejectCollaborationRequest(collaborationRequest.id)
                .then((response) => onClose())
            }>
            Reject
          </RejectButton>
          <AcceptButton
            color="primary"
            variant={'contained'}
            size={'large'}
            onClick={async () =>
              collaborationRequestService
                .approveCollaborationRequest(collaborationRequest.id)
                .then((response) => onClose())
            }>
            Accept
          </AcceptButton>
        </FlexWrapRow>
      </ConfirmDialogActions>
    </Dialog>
  );
};

const DialogWidthWrap = styled(Typography)`
  min-width: 600px;
  max-height: 700px;
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

const RejectButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 11px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 24px;

  color: var(--primary-main, #3b4eff);
`;

const AcceptButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--error-contrast, #fff);
`;
