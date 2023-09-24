import React, { type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import {
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  Switch,
  TextField,
  Tooltip
} from '@mui/material';
import {
  Close,
  CloudOutlined,
  MessageOutlined,
  MonetizationOnOutlined,
  Public,
  ViewInArOutlined
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import { routerStore } from '../../core/router';
import { publicationService } from '../../core/service';
import {
  AccessType,
  LicenseType,
  StorageType
} from '../../apis/first-approval-api';
import { Page } from '../../core/router/constants';
import {
  FlexWrapColumn,
  FlexWrapRow,
  HeightElement,
  WidthElement
} from '../common.styled';
import { ContentLicensingDialog } from '../../components/ContentLicensingDialog';

export const SharingOptionsPage = (props: {
  publicationTitle: string;
  publicationSummary: string;
  licenseType: LicenseType;
}): ReactElement => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);
  const [previewTitle, setPreviewTitle] = useState(props.publicationTitle);
  const [previewSubtitle, setPreviewSubtitle] = useState(
    props.publicationSummary
  );
  const [licenseType, setLicenseType] = useState(props.licenseType);
  const [confirmThatAllAuthorsAgree, setConfirmThatAllAuthorsAgree] =
    useState(false);
  const [
    understandAfterPublishingCannotBeEdited,
    setUnderstandAfterPublishingCannotBeEdited
  ] = useState(false);
  const [storageType, setStorageType] = useState(
    StorageType.CLOUD_SECURE_STORAGE
  );
  const [contentLicensingDialogOpen, setContentLicensingDialogOpen] =
    useState(false);

  return (
    <FlexWrapRow>
      <LeftPanel>
        <FlexWrapColumn>
          <LeftPanelHeader>Preview</LeftPanelHeader>
          <HeightElement value={'48px'} />
          <InputPreviewTextField
            variant={'standard'}
            multiline={true}
            error={!previewTitle}
            value={previewTitle}
            helperText={`${previewTitle?.length}/100`}
            onChange={(e) => setPreviewTitle(e.currentTarget.value)}
            placeholder={'Write a preview title...'}
          />
          <HeightElement value={'32px'} />
          <InputPreviewTextField
            variant={'standard'}
            multiline={true}
            error={!previewSubtitle}
            value={previewSubtitle}
            helperText={`${previewSubtitle?.length}/200`}
            onChange={(e) => setPreviewSubtitle(e.currentTarget.value)}
            placeholder={'Write a preview subtitle...'}
          />
          <HeightElement value={'48px'} />
          <LeftPanelSubtitle>
            Changes here will affect how your publication appears in public
            places like FA homepage — not the contents of the publication
            itself.
          </LeftPanelSubtitle>
        </FlexWrapColumn>
        <ContentLicensingButton
          onClick={() => {
            setContentLicensingDialogOpen(true);
          }}>
          Content licensing
        </ContentLicensingButton>
      </LeftPanel>
      <FlexWrapColumn>
        <BodyWrap>
          <BodyContentWrap>
            <HeaderWrap>
              <HeaderTitle>Publishing</HeaderTitle>
              <MarginLeftAuto>
                <IconButton>
                  <Close
                    onClick={() => {
                      routerStore.navigatePage(
                        Page.PUBLICATION,
                        routerStore.path,
                        true
                      );
                    }}
                  />
                </IconButton>
              </MarginLeftAuto>
            </HeaderWrap>
            <SharingOptionsWrap>
              <SharingOption
                icon={<Public fontSize={'large'} />}
                label={'Open access'}
                description={
                  'All registered users can download your attached files instantly. '
                }
                isSelected
              />
              <Tooltip title="Like science, we value openness and are excited to share what we're working on. New features currently in our 'lab', are being tested and perfected, so stay tuned.">
                <SharingOption
                  icon={<MessageOutlined fontSize={'large'} />}
                  label={'On request'}
                  description={
                    'Other users must send a request with their intention cover letter, which you can approve or decline.'
                  }
                  isDisabled={true}
                />
              </Tooltip>
              <Tooltip title="Like science, we value openness and are excited to share what we're working on. New features currently in our 'lab', are being tested and perfected, so stay tuned.">
                <SharingOption
                  icon={<MonetizationOnOutlined fontSize={'large'} />}
                  label={<>{'Monetize or Co-Authorship'}</>}
                  description={
                    'Set a price for access or/and accept requests for co-authorship.'
                  }
                  noMargin={true}
                  isDisabled={true}
                />
              </Tooltip>
            </SharingOptionsWrap>
            <StorageOptionsWrap>
              <StorageOptionsTitle>
                How would you like to store your dataset?
              </StorageOptionsTitle>
              <FormControlLabel
                value={StorageType.CLOUD_SECURE_STORAGE}
                label={
                  <FlexWrapColumn>
                    <FlexWrapRowRadioLabel>
                      <StorageOptionLabelWrap disabled={false}>
                        Cloud Secure Storage
                      </StorageOptionLabelWrap>
                      <CloudOutlined />
                    </FlexWrapRowRadioLabel>
                    <StorageOptionDescription disabled={false}>
                      Store dataset in our secure, centralized cloud system.
                      Easy access and high-speed downloads.
                    </StorageOptionDescription>
                  </FlexWrapColumn>
                }
                control={
                  <Radio
                    checked={storageType === StorageType.CLOUD_SECURE_STORAGE}
                    onChange={() =>
                      setStorageType(StorageType.CLOUD_SECURE_STORAGE)
                    }
                  />
                }
              />
              <FormControlLabel
                disabled={true}
                value={StorageType.IPFS}
                labelPlacement={'end'}
                label={
                  <FlexWrapColumn>
                    <FlexWrapRowRadioLabel>
                      <StorageOptionLabelWrap disabled={true}>
                        Decentralized Storage (IPFS)
                      </StorageOptionLabelWrap>
                      <ViewInArOutlined />
                      <WidthElement value="8px" />
                      <SoonChip />
                    </FlexWrapRowRadioLabel>
                    <StorageOptionDescription disabled={true}>
                      Distribute dataset across a decentralized network for
                      added resilience and permanence.
                    </StorageOptionDescription>
                  </FlexWrapColumn>
                }
                control={
                  <Radio
                    checked={storageType === StorageType.IPFS}
                    onChange={() => {
                      setStorageType(StorageType.IPFS);
                    }}
                  />
                }
              />
            </StorageOptionsWrap>
            <PeerReviewSection />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirmThatAllAuthorsAgree}
                    onChange={(e) => {
                      setConfirmThatAllAuthorsAgree(e.currentTarget.checked);
                    }}
                  />
                }
                label={
                  'I confirm that all authors agree to the content, distribution, \n' +
                  '              and comply with the First Approval publishing policy.'
                }
              />
              <HeightElement value={'24px'} />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={understandAfterPublishingCannotBeEdited}
                    onChange={(e) => {
                      setUnderstandAfterPublishingCannotBeEdited(
                        e.currentTarget.checked
                      );
                    }}
                  />
                }
                label={
                  "I understand that after publishing, my dataset cannot be edited or deleted. I've double-checked all details for accuracy."
                }
              />
            </FormGroup>
            <ButtonWrap
              variant="contained"
              disabled={
                !confirmThatAllAuthorsAgree ||
                !understandAfterPublishingCannotBeEdited ||
                !previewTitle ||
                !previewSubtitle
              }
              onClick={() => {
                void publicationService
                  .submitPublication(publicationId, {
                    accessType: AccessType.OPEN,
                    storageType,
                    previewTitle,
                    previewSubtitle,
                    licenseType
                  })
                  .then(() => {
                    routerStore.navigatePage(
                      Page.PUBLICATION,
                      routerStore.path,
                      true
                    );
                  });
              }}>
              Publish now for free
            </ButtonWrap>
          </BodyContentWrap>
        </BodyWrap>
      </FlexWrapColumn>
      <ContentLicensingDialog
        licenseType={licenseType}
        isOpen={contentLicensingDialogOpen}
        onConfirm={(licenseType) => setLicenseType(licenseType)}
        onClose={() => setContentLicensingDialogOpen(false)}
      />
    </FlexWrapRow>
  );
};

interface SharingOptionsProps {
  icon: ReactElement;
  label: string | ReactElement;
  description: string;
  isSelected?: boolean;
  noMargin?: boolean;
  isDisabled?: boolean;
}

// eslint-disable-next-line react/display-name
const SharingOption = React.forwardRef<HTMLDivElement, SharingOptionsProps>(
  (props: SharingOptionsProps, ref): ReactElement => {
    const { label, description, isDisabled, isSelected, noMargin } = props;
    return (
      <SharingOptionWrap
        {...props}
        ref={ref}
        isSelected={isSelected}
        noMargin={noMargin}>
        <FlexWrapRow>
          <IconWrap>{props.icon}</IconWrap>
          {isDisabled && (
            <MarginLeftAuto>
              <SoonChip />
            </MarginLeftAuto>
          )}
        </FlexWrapRow>

        <SharingOptionLabel isDisabled={isDisabled}>{label}</SharingOptionLabel>
        <SharingOptionDescription isDisabled={isDisabled}>
          {description}
        </SharingOptionDescription>
      </SharingOptionWrap>
    );
  }
);

const PeerReviewSection = (): ReactElement => {
  return (
    <PeerReviewSectionWrap>
      <>
        Peer review
        <MarginLeftAuto>
          <Switch disabled={true} />
          <SoonChip />
        </MarginLeftAuto>
      </>
    </PeerReviewSectionWrap>
  );
};

const SoonChip = (): ReactElement => {
  return (
    <SoonChipWrap
      label={'soon'}
      sx={{ backgroundColor: 'inherit' }}></SoonChipWrap>
  );
};

const ButtonWrap = styled(Button)`
  margin-top: 24px;
`;

const PeerReviewSectionWrap = styled.div`
  border-radius: 8px;
  background: var(--grey-50, #f8f7fa);
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-top: 48px;
  margin-bottom: 48px;

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
`;

const SoonChipWrap = styled(Chip)`
  border-radius: 100px;
  border: 1px solid var(--primary-main, #3b4eff);
  color: var(--primary-main, #3b4eff);

  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  height: 24px;
`;

const SharingOptionWrap = styled.div<{
  noMargin?: boolean;
  isSelected?: boolean;
}>`
  cursor: pointer;
  padding: 24px;
  width: 189px;
  height: 272px;
  border-radius: 8px;
  border: 1px solid var(--divider, #d2d2d6);
  ${(props) =>
    props.isSelected
      ? 'border: 2px solid var(--primary-dark, #3C47E5);' +
        'box-shadow: 0px 0px 4px 0px #3B4EFF;'
      : ''}
  margin-right: ${(props) => (props.noMargin ? '0px' : '24px')};
  display: flex;
  flex-direction: column;
`;

const IconWrap = styled.div`
  color: #04003661;
  margin-bottom: 12px;
`;

const SharingOptionLabel = styled.div<{ isDisabled?: boolean }>`
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h6 */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
  ${(props) =>
    props.isDisabled
      ? 'color: var(--text-disabled, rgba(4, 0, 54, 0.38));'
      : ''}
`;

const SharingOptionDescription = styled.div<{ isDisabled?: boolean }>`
  margin-top: auto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  ${(props) =>
    props.isDisabled
      ? 'color: var(--text-disabled, rgba(4, 0, 54, 0.38));'
      : ''}
`;

const HeaderWrap = styled.div`
  margin-bottom: 48px;
  display: flex;
  justify-content: center;
`;

const HeaderTitle = styled.div`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h5 */
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 32.016px */
`;

const MarginLeftAuto = styled.div`
  margin-left: auto;
`;

const BodyWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BodyContentWrap = styled.div`
  padding: 48px;
  width: 70%;
`;

const LeftPanel = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: start;
  background: var(--grey-50, #f8f7fa);

  justify-content: space-between;
  padding: 48px 48px 100px;
`;

const LeftPanelHeader = styled.div`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h5 */
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 32.016px */
`;

const LeftPanelSubtitle = styled.div`
  color: var(--text-secondary, #68676e);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/caption */
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 166%; /* 19.92px */
  letter-spacing: 0.4px;
`;

const InputPreviewTextField = styled(TextField)`
  width: 100%;
`;

const SharingOptionsWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StorageOptionsWrap = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: column;
`;

const StorageOptionsTitle = styled.span`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h6 */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;

const StorageOptionLabelWrap = styled.div<{
  disabled: boolean;
}>`
  font-feature-settings: 'clig' off, 'liga' off;

  /* components/alert-title */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;

  margin-right: 8px;
  color: ${(props) => (props.disabled ? '#04003661' : '#040036')};
`;

const StorageOptionDescription = styled.div<{
  disabled: boolean;
}>`
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/body1 */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;

  margin-top: 4px;
  color: ${(props) => (props.disabled ? '#04003661' : '#040036')};
`;

const FlexWrapRowRadioLabel = styled.span`
  margin-top: 27.5px;
  display: flex;
`;

const ContentLicensingButton = styled.div`
  cursor: pointer;
  &:hover {
    background-color: transparent;
  }

  margin-bottom: 0;
  text-decoration: underline;
  text-decoration-color: lightgray;
  text-decoration-thickness: 1.5px;
`;
