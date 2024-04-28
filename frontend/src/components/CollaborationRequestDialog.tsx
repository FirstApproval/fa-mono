import { Button, Dialog, DialogContent, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { FlexWrapRow, HeightElement } from '../pages/common.styled';
import styled from '@emotion/styled';
import DialogActions from '@mui/material/DialogActions';
import { AuthorElement } from '../pages/publication/editors/element/AuthorElement';
import { collaborationRequestService } from '../core/service';
import { collaborationStore } from '../pages/publication/store/downloadsStore';
import { getDaysAgoString } from '../util/dateUtil';

export const CollaborationRequestDialog = (props: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  const { isOpen, onClose } = props;
  const { collaborationRequest } = collaborationStore;
  const daysAgo = getDaysAgoString(collaborationRequest!.creationTime!);

  return collaborationRequest ? (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DeleteDialogTitle id="alert-dialog-title" variant={'h5'}>
        Collaboration request
      </DeleteDialogTitle>
      <DialogContentWrap>
        <AuthorElement
          isReadonly={true}
          useMarginBottom={false}
          author={collaborationRequest!.userInfo!}
          shouldOpenInNewTab={true}
        />
        <HeightElement value={'12px'} />
        <DialogDescriptionWrap variant={'body'}>
          {collaborationRequest.description}
        </DialogDescriptionWrap>
        <HeightElement value={'12px'} />
        <DaysAgo variant={'body2'}>{daysAgo}</DaysAgo>
      </DialogContentWrap>
      <ConfirmDialogActions>
        <FlexWrapRow>
          <RejectButton
            size={'large'}
            color="error"
            variant="text"
            onClick={async () =>
              collaborationRequestService
                .rejectCollaborationRequest(collaborationRequest!.id)
                .then((response) =>
                  collaborationStore.closeCollaborationRequest()
                )
            }>
            Reject
          </RejectButton>
          <AcceptButton
            color="primary"
            variant="text"
            size={'large'}
            onClick={async () =>
              collaborationRequestService
                .approveCollaborationRequest(collaborationRequest!.id)
                .then((response) =>
                  collaborationStore.closeCollaborationRequest()
                )
            }>
            Accept
          </AcceptButton>
        </FlexWrapRow>
      </ConfirmDialogActions>
    </Dialog>
  ) : (
    <></>
  );
};

const DialogDescriptionWrap = styled(Typography)`
  margin-top: 120px !important;
`;

const DeleteDialogTitle = styled(Typography)`
  padding-top: 32px;
  padding-left: 32px;
  padding-right: 32px;
`;

const DialogContentWrap = styled(DialogContent)`
  min-width: 600px;
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
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 24px;

  border: 1px solid;
`;

const AcceptButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 1px solid;
`;

const DaysAgo = styled(Typography)`
  color: var(--text-secondary, #68676e);
`;
