import {
  Button,
  Dialog,
  FormControlLabel,
  Radio,
  Typography
} from '@mui/material';
import React, { ReactElement, useEffect, useState } from 'react';
import {
  FlexWrapRow,
  HeightElement,
  SpaceBetween,
  WidthElement
} from '../pages/common.styled';
import { LicenseType } from '../apis/first-approval-api';
import Launch from '@mui/icons-material/Launch';
import styled from '@emotion/styled';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { routerStore } from '../core/router';
import humanInCircle from '../assets/human-in-circle.svg';
import dollarStrikethrough from '../assets/dollar-strikethrough.svg';
import equalInCircle from '../assets/equal-in-circle.svg';
import { getAppConfig } from '../core/config';

export const ContentLicensingDialog = (props: {
  licenseType: LicenseType | null;
  isOpen: boolean;
  onConfirm: (licenseType: LicenseType) => void;
  onClose: () => void;
}): ReactElement => {
  const { isOpen, onConfirm, onClose, licenseType } = props;
  const [newLicenseType, setNewLicenseType] = useState(licenseType);
  useEffect(() => {
    setNewLicenseType(licenseType);
  }, []);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={'md'}
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DeleteDialogTitle id="alert-dialog-title" variant={'h5'}>
        Content licensing
      </DeleteDialogTitle>
      <DialogContentWrap>
        <DialogWidthWrap>
          <DescriptionElement>
            <img src={humanInCircle} />
            <WidthElement value={'8px'} />
            <span>
              Others can distribute, remix, and build upon your work as long as
              they credit you.
            </span>
          </DescriptionElement>
          {newLicenseType ===
            LicenseType.FIRST_APPROVAL_COLLABORATION_REQUIREMENT && (
            <DescriptionElement>
              <img src={dollarStrikethrough} />
              <WidthElement value={'8px'} />
              <span>
                Others can use your work for non-commercial purposes only.
              </span>
            </DescriptionElement>
          )}
          <DescriptionElement>
            <img src={equalInCircle} />
            <WidthElement value={'8px'} />
            <span>
              Others can only distribute non-derivative copies of your work.
            </span>
          </DescriptionElement>
        </DialogWidthWrap>
        <HeightElement value={'16px'} />
        <div>
          <SpaceBetween>
            <FormControlLabel
              value={LicenseType.ATTRIBUTION_NO_DERIVATIVES}
              label="Attribution, no derivatives"
              control={
                <Radio
                  checked={
                    newLicenseType === LicenseType.ATTRIBUTION_NO_DERIVATIVES
                  }
                  onChange={() => {
                    setNewLicenseType(LicenseType.ATTRIBUTION_NO_DERIVATIVES);
                  }}
                />
              }
            />
            <LinkWrap
              onClick={() => {
                routerStore.openInNewTab(
                  'https://creativecommons.org/licenses/by-nd/4.0/legalcode'
                );
              }}>
              CC BY-ND
              <Launch sx={{ width: 24, height: 24, marginLeft: '4px' }} />
            </LinkWrap>
          </SpaceBetween>
          <HeightElement value={'8px'} />
          <SpaceBetween>
            <FormControlLabel
              value={LicenseType.FIRST_APPROVAL_COLLABORATION_REQUIREMENT}
              label="Author-curated data reuse (collaboration required):
                     Open access for exploration and analysis
                     Publication requires inviting the data authors to collaborate"
              control={
                <Radio
                  checked={
                    newLicenseType ===
                    LicenseType.FIRST_APPROVAL_COLLABORATION_REQUIREMENT
                  }
                  onChange={() => {
                    setNewLicenseType(
                      LicenseType.FIRST_APPROVAL_COLLABORATION_REQUIREMENT
                    );
                  }}
                />
              }
            />
            <LinkWrap
              onClick={() => {
                const config = getAppConfig();
                routerStore.openInNewTab(
                  config?.collaborationLicenseDescriptionUrl ??
                    'https://firstapproval.io/publication/XFJXD3J'
                );
              }}>
              FA-CRL-ND
              <Launch sx={{ width: 24, height: 24, marginLeft: '4px' }} />
            </LinkWrap>
          </SpaceBetween>
        </div>
      </DialogContentWrap>
      <ConfirmDialogActions>
        <FlexWrapRow>
          <CancelButton
            size={'large'}
            color={'primary'}
            variant="text"
            onClick={onClose}>
            {'Cancel'}
          </CancelButton>
          <WidthElement value={'24px'} />
          <ConfirmButton
            size={'large'}
            color="primary"
            variant={'contained'}
            disabled={!newLicenseType}
            onClick={() => {
              onConfirm(newLicenseType!);
              onClose();
            }}>
            {'Save'}
          </ConfirmButton>
        </FlexWrapRow>
      </ConfirmDialogActions>
    </Dialog>
  );
};

const DialogWidthWrap = styled.div`
  display: flex;
  padding: 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;

  border-radius: 4px;
  background: var(--grey-50, #f8f7fa);
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

const LinkWrap = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: lightgray;
  text-decoration-thickness: 1.5px;
`;

const DescriptionElement = styled.div`
  display: flex;
  align-items: start;
`;
