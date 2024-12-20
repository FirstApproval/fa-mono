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
  Tooltip,
  Typography
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
  DataCollectionType,
  LicenseType,
  StorageType
} from '../../apis/first-approval-api';
import { Page } from '../../core/router/constants';
import {
  FlexWrapColumn,
  FlexWrapRow,
  FlexWrapRowRadioLabel,
  HeightElement
} from '../common.styled';
import { ContentLicensingDialog } from '../../components/ContentLicensingDialog';
import { getContentLicensingAbbreviation } from '../../util/publicationUtils';

const MAX_PREVIEW_LENGTH = 200;
const MAX_PREVIEW_SUBTITLE_LENGTH = 300;
const MAX_FILES_SIZE = 2_147_483_648;

export const SharingOptionsPage = (props: {
  publicationTitle: string;
  publicationSummary: string;
  licenseType: LicenseType;
  dataCollectionType: DataCollectionType;
  filesSize: number;
}): ReactElement => {
  const [isIpfsDisabled] = useState(props.filesSize > MAX_FILES_SIZE);
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
  debugger;
  const [storageType, setStorageType] = useState(
    props.dataCollectionType === DataCollectionType.AGING ? StorageType.IPFS : StorageType.CLOUD_SECURE_STORAGE
  );
  const [accessType, setAccessType] = useState(AccessType.OPEN)
  const [contentLicensingDialogOpen, setContentLicensingDialogOpen] =
    useState(false);

  const licenseTypeAbbreviation = getContentLicensingAbbreviation(licenseType);
  return (
    <Container>
      <LeftPanel>
        <FlexWrapColumn>
          <LeftPanelHeader variant={'h5'}>Preview</LeftPanelHeader>
          <HeightElement value={'48px'} />
          <InputPreviewTextField
            variant={'standard'}
            multiline={true}
            error={!previewTitle || previewTitle.length > MAX_PREVIEW_LENGTH}
            value={previewTitle}
            helperText={`${previewTitle?.length}/${MAX_PREVIEW_LENGTH}`}
            onChange={(e) => setPreviewTitle(e.currentTarget.value)}
            placeholder={'Write a preview title...'}
          />
          <HeightElement value={'32px'} />
          <InputPreviewTextField
            variant={'standard'}
            multiline={true}
            error={
              !previewSubtitle ||
              previewSubtitle.length > MAX_PREVIEW_SUBTITLE_LENGTH
            }
            value={previewSubtitle}
            helperText={`${previewSubtitle?.length}/${MAX_PREVIEW_SUBTITLE_LENGTH}`}
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
          onClick={() => setContentLicensingDialogOpen(true)}>
          {`Content licensing: ${licenseTypeAbbreviation}`}
        </ContentLicensingButton>
        <ContentLicensingDialog
          licenseType={licenseType}
          isOpen={contentLicensingDialogOpen}
          onConfirm={(licenseType) => setLicenseType(licenseType)}
          onClose={() => setContentLicensingDialogOpen(false)}
        />
      </LeftPanel>
      <RightPanel>
        <BodyWrap>
          <BodyContentWrap>
            <HeaderWrap>
              <Typography variant={'h5'}>Publishing</Typography>
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
                isSelected={accessType === AccessType.OPEN}
                onClick={() => setAccessType(AccessType.OPEN)}
                description={
                  'All registered users can download your attached files instantly. '
                }
              />
              <SharingOption
                icon={<MessageOutlined fontSize={'large'} />}
                label={'Personal share'}
                isSelected={accessType === AccessType.PERSONAL_SHARE}
                onClick={() => setAccessType(AccessType.PERSONAL_SHARE)}
                description={
                  'Access is via a personal link. The dataset will not be published but will receive a reserved DOI and can later be converted into a publication.'
                }
              />
              <Tooltip title="Like science, we value openness and are excited to share what we're working on. New features currently in our 'lab', are being tested and perfected, so stay tuned.">
                <SharingOption
                  icon={<MonetizationOnOutlined fontSize={'large'} />}
                  label={<>{'Monetize or Co-Authorship'}</>}
                  isSelected={accessType === AccessType.MONETIZE_OR_CO_AUTHORSHIP}
                  description={
                    'Set a price for access or/and accept requests for co-authorship.'
                  }
                  noMargin={true}
                  isDisabled={true}
                />
              </Tooltip>
            </SharingOptionsWrap>
            <StorageOptionsWrap>
              <Typography variant={'h6'}>
                How would you like to store your dataset?
              </Typography>
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
                    <StorageOptionDescription
                      variant={'body1'}
                      disabled={false}>
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
                disabled={isIpfsDisabled}
                value={StorageType.IPFS}
                labelPlacement={'end'}
                label={
                  <FlexWrapColumn>
                    <FlexWrapRowRadioLabel>
                      <StorageOptionLabelWrap disabled={isIpfsDisabled}>
                        Decentralized Storage (IPFS)
                      </StorageOptionLabelWrap>
                      <ViewInArOutlined />
                    </FlexWrapRowRadioLabel>
                    <StorageOptionDescription
                      variant={'body1'}
                      disabled={isIpfsDisabled}>
                      Distribute dataset across a decentralized network for
                      added resilience and permanence. Maximum dataset size 2GB
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
                previewTitle.length > MAX_PREVIEW_LENGTH ||
                !previewSubtitle ||
                previewSubtitle.length > MAX_PREVIEW_SUBTITLE_LENGTH
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
      </RightPanel>
    </Container>
  );
};

interface SharingOptionsProps {
  icon: ReactElement;
  label: string | ReactElement;
  description: string;
  isSelected?: boolean;
  noMargin?: boolean;
  isDisabled?: boolean;
  onClick?: () => void
}

// eslint-disable-next-line react/display-name
const SharingOption = React.forwardRef<HTMLDivElement, SharingOptionsProps>(
  (props: SharingOptionsProps, ref): ReactElement => {
    const {
      label,
      description,
      isDisabled,
      isSelected,
      noMargin,
      onClick
    } = props;

    return (
      <SharingOptionWrap
        {...props}
        ref={ref}
        isSelected={isSelected}
        onClick={onClick}
        noMargin={noMargin}>
        <FlexWrapRow>
          <IconWrap>{props.icon}</IconWrap>
          {isDisabled && (
            <MarginLeftAuto>
              <SoonChip />
            </MarginLeftAuto>
          )}
        </FlexWrapRow>

        <SharingOptionLabel variant={'h6'} isDisabled={isDisabled}>
          {label}
        </SharingOptionLabel>
        <SharingOptionDescription isDisabled={isDisabled}>
          <Typography variant={'body2'}>{description}</Typography>
        </SharingOptionDescription>
      </SharingOptionWrap>
    );
  }
);

const PeerReviewSection = (): ReactElement => {
  return (
    <PeerReviewSectionWrap variant={'h6'} component={'div'}>
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

const PeerReviewSectionWrap = styled(Typography)`
  border-radius: 8px;
  background: var(--grey-50, #f8f7fa);
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-top: 48px;
  margin-bottom: 48px;

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
` as typeof Typography;

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
  height: 292px;
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

const SharingOptionLabel = styled(Typography)<{ isDisabled?: boolean }>`
  ${(props) =>
    props.isDisabled
      ? 'color: var(--text-disabled, rgba(4, 0, 54, 0.38));'
      : ''}
`;

const SharingOptionDescription = styled.div<{ isDisabled?: boolean }>`
  margin-top: 6px;
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

const MarginLeftAuto = styled.div`
  margin-left: auto;
`;

const BodyWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BodyContentWrap = styled.div`
  width: 680px;
  padding: 48px;
  padding-left: 32px;
  padding-right: 32px;
`;

const LeftPanel = styled.div`
  flex: 22%;
  display: flex;
  flex-direction: column;
  align-items: start;
  background: var(--grey-50, #f8f7fa);

  justify-content: space-between;
  padding: 48px;
`;

const LeftPanelHeader = styled(Typography)`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

const LeftPanelSubtitle = styled.div`
  color: var(--text-secondary, #68676e);

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

const StorageOptionLabelWrap = styled.div<{
  disabled: boolean;
}>`
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

const StorageOptionDescription = styled(Typography)<{
  disabled: boolean;
}>`
  margin-top: 4px;
  color: ${(props) => (props.disabled ? '#04003661' : '#040036')};
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

export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 88%;
  overflow-y: auto;
`;

export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;
