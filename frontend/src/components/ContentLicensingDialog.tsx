import { Button, Dialog, FormControlLabel, Radio } from '@mui/material';
import React, { ReactElement } from 'react';
import {
  HeightElement,
  SpaceBetween,
  WidthElement
} from '../pages/common.styled';
import { FlexWrapRow } from '../pages/home/CallToAction';
import { PublicationStore } from '../pages/publication/store/PublicationStore';
import { LicenseType } from '../apis/first-approval-api';
import Launch from '@mui/icons-material/Launch';
import styled from '@emotion/styled';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { routerStore } from '../core/router';
import humanInCircle from '../assets/human-in-circle.svg';
import dollarStrikethrough from '../assets/dollar-strikethrough.svg';
import equalInCircle from '../assets/equal-in-circle.svg';

export const ContentLicensingDialog = (props: {
  publicationStore: PublicationStore;
  licenseType: LicenseType | null;
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  const { isOpen, onClose, publicationStore, licenseType } = props;
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DeleteDialogTitle id="alert-dialog-title">
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
          {licenseType ===
            LicenseType.ATTRIBUTION_NO_DERIVATIVES_NON_COMMERCIAL && (
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
                    licenseType === LicenseType.ATTRIBUTION_NO_DERIVATIVES
                  }
                  onChange={() => {
                    publicationStore.licenseType =
                      LicenseType.ATTRIBUTION_NO_DERIVATIVES;
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
              value={LicenseType.ATTRIBUTION_NO_DERIVATIVES_NON_COMMERCIAL}
              label="Attribution, non-commercial, no derivatives"
              control={
                <Radio
                  checked={
                    licenseType ===
                    LicenseType.ATTRIBUTION_NO_DERIVATIVES_NON_COMMERCIAL
                  }
                  onChange={() => {
                    publicationStore.licenseType =
                      LicenseType.ATTRIBUTION_NO_DERIVATIVES_NON_COMMERCIAL;
                  }}
                />
              }
            />
            <LinkWrap
              onClick={() => {
                routerStore.openInNewTab(
                  'https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode'
                );
              }}>
              CC BY-NC-ND
              <Launch sx={{ width: 24, height: 24, marginLeft: '4px' }} />
            </LinkWrap>
          </SpaceBetween>
        </div>
      </DialogContentWrap>
      <ConfirmDialogActions>
        <FlexWrapRow>
          <CancelButton color={'primary'} variant="text" onClick={onClose}>
            {'Cancel'}
          </CancelButton>
          <WidthElement value={'24px'} />
          <ConfirmButton
            color="primary"
            variant={'contained'}
            onClick={() => {
              publicationStore.editLicenseType();
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
