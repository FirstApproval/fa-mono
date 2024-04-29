import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography
} from '@mui/material';
import React, { ReactElement, useState } from 'react';
import {
  FlexWrapRow,
  HeightElement,
  PrefilledDetails,
  PrefilledDetailsText
} from '../pages/common.styled';
import styled from '@emotion/styled';
import DialogActions from '@mui/material/DialogActions';
import { collaborationStore } from '../pages/publication/store/downloadsStore';
import { getDaysAgoString } from '../util/dateUtil';
import { InfoOutlined } from '@mui/icons-material';
import { C0288D1 } from '../ui-kit/colors';
import { observer } from 'mobx-react-lite';
import { ConfirmationDialog } from './ConfirmationDialog';

export const CreateCollaborationRequestDialog = observer(
  (props: { onClose: () => void }): ReactElement => {
    const { onClose } = props;
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    return (
      <Dialog
        open={collaborationStore.openCreateCollaborationRequestDialog}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DeleteDialogTitle id="alert-dialog-title" variant={'h5'}>
          Collaboration request
        </DeleteDialogTitle>
        <DialogContentWrap>
          {/* <AuthorElement */}
          {/*   isReadonly={true} */}
          {/*   useMarginBottom={false} */}
          {/*   author={collaborationRequest!.userInfo!} */}
          {/*   shouldOpenInNewTab={true} */}
          {/* /> */}
          <HeightElement value={'12px'} />
          <DialogDescriptionWrap variant={'body'}>{''}</DialogDescriptionWrap>
          <HeightElement value={'12px'} />
          {/* <DaysAgo variant={'body2'}>{daysAgo}</DaysAgo> */}
          <FullWidthTextField
            multiline={true}
            minRows={4}
            value={collaborationStore.authorResponse}
            onChange={(e) => {
              collaborationStore.authorResponse = e.currentTarget.value;
            }}
            label="Write a response (optional)"
            variant="outlined"
          />
          <PrefilledDetails>
            <InfoOutlined htmlColor={C0288D1} sx={{ marginTop: '7px' }} />
            <PrefilledDetailsText variant={'body2'}>
              You have 30 days to respond to this Collaboration Request by its
              acceptance or rejection. If you ignore the request, the Data User
              is allowed to use your Dataset on citation-only basis.
            </PrefilledDetailsText>
          </PrefilledDetails>
        </DialogContentWrap>
        <ConfirmDialogActions>
          <FlexWrapRow>
            <RejectButton
              size={'large'}
              color="error"
              variant="text"
              onClick={() => setConfirmationDialogOpen(true)}>
              Reject
            </RejectButton>
            <AcceptButton
              color="primary"
              variant="text"
              size={'large'}
              onClick={() => {}}>
              Accept
            </AcceptButton>
          </FlexWrapRow>
        </ConfirmDialogActions>
        <ConfirmationDialog
          isOpen={confirmationDialogOpen}
          onClose={() => setConfirmationDialogOpen(false)}
          onConfirm={() => {}}
          text="Are you sure you want to reject the offer to include you as a co-author in
            If you reject the collaboration request,
            can still publish their work without including you as co-author,
            but must cite your Dataset as a source."
        />
      </Dialog>
    );
  }
);

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

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin: 32px 0;
`;
