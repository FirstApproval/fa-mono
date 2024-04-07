import React, { MouseEventHandler, type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import {
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import {
  AlternateEmail,
  Close,
  CloudOutlined,
  MessageOutlined,
  Public,
  ViewInArOutlined
} from '@mui/icons-material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import Button from '@mui/material/Button';
import { routerStore } from '../../core/router';
import { publicationService } from '../../core/service';
import {
  AccessType,
  LicenseType,
  StorageType
} from '../../apis/first-approval-api';
import { Page } from '../../core/router/constants';
import { FlexWrapColumn, FlexWrapRow, HeightElement } from '../common.styled';
import { ContentLicensingDialog } from '../../components/ContentLicensingDialog';
import { getContentLicensingAbbreviation } from '../../util/publicationUtils';

const MAX_PREVIEW_LENGTH = 200;
const MAX_PREVIEW_SUBTITLE_LENGTH = 300;
const MAX_FILES_SIZE = 2_147_483_648;

export const SharingOptionsPage = (props: {
  publicationTitle: string;
  publicationSummary: string;
  licenseType: LicenseType;
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
  const [storageType, setStorageType] = useState(
    StorageType.CLOUD_SECURE_STORAGE
  );
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
              <HeaderTitleWrap>
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
              </HeaderTitleWrap>
              <HeightElement value={'36px'} />
            </HeaderWrap>
            <Typography variant={'h6'}>Access to your dataset</Typography>
            <SharingOptionsWrap>
              <SharingOption
                icon={<Public fontSize={'medium'} />}
                label={'Open access'}
                description={
                  'All registered users can download your attached files instantly. Set the rules for your data use below.'
                }
                height={'128px'}
                isSelected
              />
              <Tooltip title="Like science, we value openness and are excited to share what we're working on. New features currently in our 'lab', are being tested and perfected, so stay tuned.">
                <SharingOption
                  icon={<MessageOutlined fontSize={'medium'} />}
                  label={'On request'}
                  description={''}
                  isDisabled={true}
                  noMargin={true}
                  height={'128px'}
                />
              </Tooltip>
            </SharingOptionsWrap>
            <SharingOptionSelectedDescription
              variant={'body2'}
              component={'div'}>
              Only the files you upload may be subject to access restrictions.
              Your data annotation text is always accessible to everyone.
            </SharingOptionSelectedDescription>
            <Typography variant={'h6'}>Use of your dataset</Typography>
            <SharingOptionsWrap>
              <SharingOption
                icon={<FormatQuoteIcon fontSize={'medium'} />}
                label={'Citation is enough'}
                description={
                  'Others may use your data, provided that they cite your dataset in their research.'
                }
                height={'168px'}
                isSelected
              />
              <SharingOption
                icon={<AlternateEmail fontSize={'medium'} />}
                label={'Co-authorship requirement'}
                description={
                  "Be credited as a co-author in journal publications when your data is vital to others' research. You can accept or reject collaboration requests. "
                }
                noMargin={true}
                height={'168px'}
              />
            </SharingOptionsWrap>
            <SharingOptionSelectedDescription
              variant={'body2'}
              component={'div'}>
              Co-authorship license is active for five years from the date of
              publication. After that, the data becomes available under an open
              CC BY-ND license.
            </SharingOptionSelectedDescription>
            <Typography variant={'h6'}>Your files storage</Typography>
            <SharingOptionsWrap>
              <SharingOption
                onClick={() => setStorageType(StorageType.CLOUD_SECURE_STORAGE)}
                icon={<CloudOutlined fontSize={'medium'} />}
                label={'Cloud Secure Storage'}
                description={
                  'Store dataset in our secure, centralized cloud system. Easy access and high-speed downloads.'
                }
                height={'164px'}
                isSelected
              />
              <SharingOption
                onClick={() => setStorageType(StorageType.IPFS)}
                icon={<ViewInArOutlined fontSize={'medium'} />}
                label={'Decentralized Storage (IPFS)'}
                height={'164px'}
                description={
                  'Distribute dataset across a decentralized network for added resilience and permanence. Maximum dataset size 2GB '
                }
                noMargin={true}
                isDisabled={isIpfsDisabled}
              />
              {/* <FormControlLabel */}
              {/*  value={StorageType.CLOUD_SECURE_STORAGE} */}
              {/*  label={ */}
              {/*    <FlexWrapColumn> */}
              {/*      <FlexWrapRowRadioLabel> */}
              {/*        <StorageOptionLabelWrap disabled={false}> */}
              {/*          Cloud Secure Storage */}
              {/*        </StorageOptionLabelWrap> */}
              {/*        <CloudOutlined /> */}
              {/*      </FlexWrapRowRadioLabel> */}
              {/*      <StorageOptionDescription */}
              {/*        variant={'body1'} */}
              {/*        disabled={false}> */}
              {/*        Store dataset in our secure, centralized cloud system. */}
              {/*        Easy access and high-speed downloads. */}
              {/*      </StorageOptionDescription> */}
              {/*    </FlexWrapColumn> */}
              {/*  } */}
              {/*  control={ */}
              {/*    <Radio */}
              {/*      checked={storageType === StorageType.CLOUD_SECURE_STORAGE} */}
              {/*      onChange={() => */}
              {/*        setStorageType(StorageType.CLOUD_SECURE_STORAGE) */}
              {/*      } */}
              {/*    /> */}
              {/*  } */}
              {/* /> */}
              {/* <FormControlLabel */}
              {/*  disabled={isIpfsDisabled} */}
              {/*  value={StorageType.IPFS} */}
              {/*  labelPlacement={'end'} */}
              {/*  label={ */}
              {/*    <FlexWrapColumn> */}
              {/*      <FlexWrapRowRadioLabel> */}
              {/*        <StorageOptionLabelWrap disabled={isIpfsDisabled}> */}
              {/*          Decentralized Storage (IPFS) */}
              {/*        </StorageOptionLabelWrap> */}
              {/*        <ViewInArOutlined /> */}
              {/*      </FlexWrapRowRadioLabel> */}
              {/*      <StorageOptionDescription */}
              {/*        variant={'body1'} */}
              {/*        disabled={isIpfsDisabled}> */}
              {/*        Distribute dataset across a decentralized network for */}
              {/*        added resilience and permanence. Maximum dataset size 2GB */}
              {/*      </StorageOptionDescription> */}
              {/*    </FlexWrapColumn> */}
              {/*  } */}
              {/*  control={ */}
              {/*    <Radio */}
              {/*      checked={storageType === StorageType.IPFS} */}
              {/*      onChange={() => { */}
              {/*        setStorageType(StorageType.IPFS); */}
              {/*      }} */}
              {/*    /> */}
              {/*  } */}
              {/* /> */}
            </SharingOptionsWrap>
            <FairPeerReviewSection />
            <NowAllTheWorksWrap variant={'body1'}>
              Now all the works are undergoing pre-moderation. We are still
              working to organize an honest peer review based on the quality of
              the data, not on your outcomes. Stay tuned!
            </NowAllTheWorksWrap>
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
  height: string;
  onClick?: MouseEventHandler;
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
      height,
      onClick
    } = props;
    return (
      <SharingOptionWrap
        {...props}
        ref={ref}
        onClick={onClick}
        isSelected={isSelected}
        height={height}
        noMargin={noMargin}>
        <div>
          <FlexWrapRow>
            <IconWrap isDisabled={isDisabled}>{props.icon}</IconWrap>
            <SharingOptionLabel isDisabled={isDisabled}>
              {label}
            </SharingOptionLabel>
          </FlexWrapRow>
          <SharingOptionDescription isDisabled={isDisabled}>
            <Typography variant={'body2'}>{description}</Typography>
          </SharingOptionDescription>
        </div>
        {isDisabled && (
          <FlexWrapRow>
            <SoonChip />
          </FlexWrapRow>
        )}
      </SharingOptionWrap>
    );
  }
);

const FairPeerReviewSection = (): ReactElement => {
  return (
    <FairPeerReviewSectionWrap variant={'h6'} component={'div'}>
      <FairPeerReviewTitleWrap>Fair peer review</FairPeerReviewTitleWrap>
      <SoonChip />
    </FairPeerReviewSectionWrap>
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

const SharingOptionSelectedDescription = styled(Typography)`
  border-radius: 4px;
  gap: 8px;
  background: var(--grey-50, #f8f7fa);
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 24px;

  color: var(--text-secondary, #68676e);
` as typeof Typography;

const FairPeerReviewSectionWrap = styled(Typography)`
  border-radius: 8px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-top: 16px;
  margin-bottom: 24px;
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
` as typeof Typography;

const FairPeerReviewTitleWrap = styled.div`
  margin-right: 8px;
`;

const NowAllTheWorksWrap = styled(Typography)`
  border: 1px solid var(--divider, #d2d2d6);
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
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
  height: string;
}>`
  cursor: pointer;
  padding: 16px;
  width: 300px;
  height: 128px;
  border-radius: 8px;
  border: 1px solid var(--divider, #d2d2d6);
  ${(props) =>
    props.isSelected
      ? 'border: 2px solid var(--primary-dark, #3C47E5);' +
        'box-shadow: 0px 0px 4px 0px #3B4EFF;'
      : ''}
  height: ${(props) => props.height};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const IconWrap = styled.div<{ isDisabled?: boolean }>`
  margin-right: 8px;
  ${(props) =>
    props.isDisabled
      ? 'color: var(--text-disabled, rgba(4, 0, 54, 0.38));'
      : 'black'}
`;

const SharingOptionLabel = styled(Typography)<{ isDisabled?: boolean }>`
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
  ${(props) =>
    props.isDisabled
      ? 'color: var(--text-disabled, rgba(4, 0, 54, 0.38));'
      : ''}
`;

const SharingOptionDescription = styled.div<{ isDisabled?: boolean }>`
  color: var(--text-secondary, #68676e);
`;

const HeaderWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeaderTitleWrap = styled.div`
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
  padding: 48px 32px;
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
  padding-top: 24px;
  padding-bottom: 24px;
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
