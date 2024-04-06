import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography
} from '@mui/material';
import React, { ReactElement, useState } from 'react';
import {
  FlexWrapRow,
  PrefilledDetails,
  PrefilledDetailsText
} from '../pages/common.styled';
import styled from '@emotion/styled';
import DialogActions from '@mui/material/DialogActions';
import { collaborationStore } from '../pages/publication/store/downloadsStore';
import { InfoOutlined } from '@mui/icons-material';
import { C0288D1 } from '../ui-kit/colors';
import { observer } from 'mobx-react-lite';
import { CollaborationRequestTypeOfWork } from 'src/apis/first-approval-api';
import MenuItem from '@mui/material/MenuItem';
import _ from 'lodash';

type CollaborationRequestTypeOfWorkKey =
  keyof typeof CollaborationRequestTypeOfWork;

export const CreateCollaborationRequestDialog = observer(
  (props: { onClose: () => void; publicationId: string }): ReactElement => {
    const { onClose } = props;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [description, setDescription] = useState('');

    const [typeOfWork, setTypeOfWork] = useState<
      CollaborationRequestTypeOfWork | undefined
    >(undefined);
    const [isFocused, setIsFocused] = useState(false);

    return (
      <Dialog
        open={collaborationStore.openCreateCollaborationRequestDialog}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DeleteDialogTitle id="alert-dialog-title" variant={'h5'}>
          Request collaboration
        </DeleteDialogTitle>
        <DialogContentWrap>
          <RowElementSpaceBetween>
            <FullWidthTextField
              value={firstName}
              onChange={(e) => {
                setFirstName(e.currentTarget.value);
              }}
              label="First name (legal)"
              variant="outlined"
            />
            <FullWidthTextField
              value={lastName}
              onChange={(e) => {
                setLastName(e.currentTarget.value);
              }}
              label="Last name (legal)"
              variant="outlined"
            />
          </RowElementSpaceBetween>
          <FormControl>
            <InputLabel id="type-of-work-label">Type of work</InputLabel>
            <Select
              value={typeOfWork}
              label="Type of work"
              onChange={(event) => {
                setTypeOfWork(
                  event.target.value as CollaborationRequestTypeOfWork
                );
              }}>
              {Object.keys(CollaborationRequestTypeOfWork).map((key) => (
                <MenuItem key={key} value={key}>
                  {_.capitalize(key.toLowerCase().replace('_', ' '))}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FullWidthTextField
            multiline={true}
            minRows={4}
            value={collaborationStore.authorResponse}
            onChange={(e) => {
              setDescription(e.currentTarget.value);
            }}
            fullWidth
            InputLabelProps={{
              shrink: isFocused,
              style: {
                whiteSpace: isFocused ? 'nowrap' : 'pre-line'
              }
            }}
            InputProps={{
              onFocus: () => setIsFocused(true),
              onBlur: () => setIsFocused(false)
            }}
            label="Message to the author(s): short description of your Work,
            intended use and anticipated date for the submission of your Work for publication..."
            variant="outlined"
          />
          <PrefilledDetails>
            <InfoOutlined htmlColor={C0288D1} sx={{ marginTop: '7px' }} />
            <PrefilledDetailsText variant={'body2'}>
              The Data Author shall be allowed sufficient time to review draft
              of your Work and you are not allowed to publish it without the
              Data Author's consent. Please send the draft to the Data Author as
              soon as possible.
            </PrefilledDetailsText>
          </PrefilledDetails>
        </DialogContentWrap>
        <ConfirmDialogActions>
          <FlexWrapRow>
            <RejectButton
              size={'large'}
              color="error"
              variant="text"
              onClick={() =>
                (collaborationStore.openCreateCollaborationRequestDialog =
                  false)
              }>
              Cancel
            </RejectButton>
            <AcceptButton
              color="primary"
              variant="text"
              size={'large'}
              onClick={() => {
                collaborationStore
                  .createCollaborationRequest(
                    props.publicationId,
                    firstName,
                    lastName,
                    typeOfWork!,
                    description
                  )
                  .then(() => {
                    collaborationStore.openCreateCollaborationRequestDialog =
                      false;
                    setFirstName('');
                    setLastName('');
                    setDescription('');
                    onClose();
                  });
              }}>
              Send request
            </AcceptButton>
          </FlexWrapRow>
        </ConfirmDialogActions>
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
  display: flex;
  flex-direction: column;
  gap: 32px;
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
`;

const AcceptButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
`;

export const RowElementSpaceBetween = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
`;
