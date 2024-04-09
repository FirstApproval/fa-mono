import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Typography
} from '@mui/material';
import React, { ReactElement, useState } from 'react';
import {
  FlexWrapRow,
  FlexWrapRowAlignTop,
  HeightElement,
  WidthElement
} from '../pages/common.styled';
import styled from '@emotion/styled';
import DialogActions from '@mui/material/DialogActions';
import collaborationRequirementsImage from '../assets/collaboration_requirements.svg';

export const CollaborationRequirementsDialog = (props: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}): ReactElement => {
  const { isOpen, onClose, onConfirm } = props;
  const [agreeToTheFirstApprovalLicense, setAgreeToTheFirstApprovalLicense] =
    useState(false);
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setAgreeToTheFirstApprovalLicense(false);
        onClose();
      }}
      aria-labelledby="collaboration-requirements-dialog-title"
      aria-describedby="collaboration-requirements-dialog-description">
      <DialogContentWrap>
        <img src={collaborationRequirementsImage} />
        <Title id="collaboration-requirements-dialog-title" variant={'h5'}>
          Collaboration requirements
        </Title>
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
        <HeightElement value={'21px'} />
        <DialogWidthWrap variant={'body'}>
          <FlexWrapRowAlignTop>
            <Checkbox
              style={{ marginLeft: '-11px' }}
              checked={agreeToTheFirstApprovalLicense}
              onChange={(e) =>
                setAgreeToTheFirstApprovalLicense(e.currentTarget.checked)
              }
            />
            <IAgreeCheckboxTitle>
              I Agree to the First Approval License, including sending a
              collaboration request to the dataset’s author(s) when required.
            </IAgreeCheckboxTitle>
          </FlexWrapRowAlignTop>
        </DialogWidthWrap>
      </DialogContentWrap>
      <HeightElement value={'32px'} />
      <ConfirmDialogActions>
        <FlexWrapRow>
          <CancelButton
            size={'large'}
            color={'primary'}
            variant="text"
            onClick={() => {
              setAgreeToTheFirstApprovalLicense(false);
              onClose();
            }}>
            Cancel
          </CancelButton>
          <WidthElement value={'24px'} />
          <ConfirmButton
            color="primary"
            variant={'contained'}
            size={'large'}
            disabled={!agreeToTheFirstApprovalLicense}
            onClick={() => {
              onConfirm();
              setAgreeToTheFirstApprovalLicense(false);
            }}>
            Download
          </ConfirmButton>
        </FlexWrapRow>
      </ConfirmDialogActions>
    </Dialog>
  );
};

const DialogWidthWrap = styled(Typography)`
  max-width: 336px;
  margin-bottom: 16px;
`;

const Title = styled(Typography)`
  margin-top: 32px;
  margin-bottom: 16px;
`;

const DialogContentWrap = styled(DialogContent)`
  padding-left: 32px !important;
  padding-right: 32px !important;
  width: 500px;
  gap: 33px;
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
  cursor: pointer;

  color: var(--primary-main, #3b4eff);
`;

const ConfirmButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  color: var(--error-contrast, #fff);
`;

export const IAgreeCheckboxTitle = styled.div`
  margin-top: 5px;
`;
