import React, { MouseEventHandler, type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import {
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  IconButton,
  Link,
  Switch,
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
  DataCollectionType,
  LicenseType,
  StorageType,
  Reviewer,
  UseType
} from '../../apis/first-approval-api';
import { Page } from '../../core/router/constants';
import {
  FlexWrapColumn,
  FlexWrapRow,
  FullWidthTextField,
  HeightElement,
  SpaceBetweenColumn
} from '../common.styled';
import { ContentLicensingDialog } from '../../components/ContentLicensingDialog';
import { getContentLicensingAbbreviation } from '../../util/publicationUtils';
import { range } from 'lodash';
import { validateEmail } from '../../util/emailUtil';
import { isNonEmptyString } from '../../util/stringUtils';

const MAX_PREVIEW_LENGTH = 200;
const MAX_PREVIEW_SUBTITLE_LENGTH = 300;
const MAX_FILES_SIZE = 2_147_483_648;
const NOT_FOR_COMPETITION_CHIP_LABEL = 'Not for competition';
const SOON_CHIP_LABEL = 'Soon';

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
  const [
    userConfirmedSubmissionCompliance,
    setUserConfirmedSubmissionCompliance
  ] = useState(false);
  const [useType, setUseType] = useState(UseType.CITATION);
  const [storageType, setStorageType] = useState(
    props.dataCollectionType === DataCollectionType.AGING
      ? StorageType.IPFS
      : StorageType.CLOUD_SECURE_STORAGE
  );
  const [accessType, setAccessType] = useState(AccessType.OPEN);
  const [contentLicensingDialogOpen, setContentLicensingDialogOpen] =
    useState(false);
  const [isPeerReviewEnabled, setIsPeerReviewEnabled] = useState(
    props.dataCollectionType === DataCollectionType.AGING
  );
  const [reviewers, setReviewers] = useState<Reviewer[]>(
    range(0, 5).map((index) => ({
      email: '',
      firstName: '',
      lastName: ''
    }))
  );

  const licenseTypeAbbreviation = getContentLicensingAbbreviation(licenseType);

  const notValidReviewers = reviewers.filter((reviewer) => {
    const hasFilled = Object.values(reviewer).some((value) => !!value);
    const hasEmpty = Object.values(reviewer).some((value) => !value);
    return (
      (hasFilled && hasEmpty) ||
      (reviewer.email && !validateEmail(reviewer.email))
    );
  });
  const getValidReviewers = () =>
    reviewers.filter(
      (reviewer) =>
        Object.values(reviewer).some((value) => !!value) &&
        validateEmail(reviewer.email)
    );
  console.log('not valid reviewers length: ' + notValidReviewers.length);

  const reviewersNotValid = notValidReviewers.length === 0;

  const isPublicationNotValid =
    !confirmThatAllAuthorsAgree ||
    !understandAfterPublishingCannotBeEdited ||
    !userConfirmedSubmissionCompliance ||
    !previewTitle ||
    previewTitle.length > MAX_PREVIEW_LENGTH ||
    !previewSubtitle ||
    previewSubtitle.length > MAX_PREVIEW_SUBTITLE_LENGTH ||
    (isPeerReviewEnabled && !reviewersNotValid);

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
                  <Tooltip title={'Back to dataset'}>
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
                  </Tooltip>
                </MarginLeftAuto>
              </HeaderTitleWrap>
              <HeightElement value={'36px'} />
            </HeaderWrap>
            <Typography variant={'h6'}>Access to your dataset</Typography>
            <SharingOptionsContainer>
              <SharingOption
                icon={<Public fontSize={'medium'} />}
                label={'Open access'}
                isSelected={accessType === AccessType.OPEN}
                onClick={() => setAccessType(AccessType.OPEN)}
                description={
                  'All registered users can download your attached files instantly. Set the rules for your data use below.'
                }
              />
              <Tooltip title="Like science, we value openness and are excited to share what we're working on. New features currently in our 'lab', are being tested and perfected, so stay tuned.">
                <SharingOption
                  icon={<MessageOutlined fontSize={'medium'} />}
                  label={'Direct Share'}
                  isSelected={accessType === AccessType.PERSONAL_SHARE}
                  onClick={() => setAccessType(AccessType.PERSONAL_SHARE)}
                  description={
                    'The dataset will not be published but will receive a reserved DOI and will be accessible through a direct link.'
                  }
                  isDisabled={true}
                  disabledChipLabel={
                    props.dataCollectionType === DataCollectionType.STUDENT
                      ? NOT_FOR_COMPETITION_CHIP_LABEL
                      : SOON_CHIP_LABEL
                  }
                />
              </Tooltip>
            </SharingOptionsContainer>
            <SharingOptionSelectedDescription
              variant={'body2'}
              component={'div'}>
              Only the files you upload may be subject to access restrictions.
              Your data annotation text is always accessible to everyone.
            </SharingOptionSelectedDescription>
            <Typography variant={'h6'}>Use of your dataset</Typography>
            <SharingOptionsContainer>
              <SharingOption
                onClick={() => setUseType(UseType.CITATION)}
                isSelected={useType === UseType.CITATION}
                icon={<FormatQuoteIcon fontSize={'medium'} />}
                label={'Citation is enough'}
                description={
                  'Others may use your data, provided that they cite your dataset in their research.'
                }
              />
              <SharingOption
                isDisabled={
                  props.dataCollectionType === DataCollectionType.STUDENT
                }
                onClick={() => setUseType(UseType.CO_AUTHORSHIP)}
                isSelected={useType === UseType.CO_AUTHORSHIP}
                icon={<AlternateEmail fontSize={'medium'} />}
                label={'Co-authorship requirement'}
                disabledChipLabel={NOT_FOR_COMPETITION_CHIP_LABEL}
                description={
                  "Be credited as a co-author in journal publications when your data is vital to others' research. " +
                  'You can accept or reject collaboration requests.'
                }
              />
            </SharingOptionsContainer>
            <Typography variant={'h6'}>Your files storage</Typography>
            <SharingOptionsContainer>
              <SharingOption
                onClick={() => setStorageType(StorageType.CLOUD_SECURE_STORAGE)}
                isSelected={storageType === StorageType.CLOUD_SECURE_STORAGE}
                icon={<CloudOutlined fontSize={'medium'} />}
                label={'Cloud Secure Storage'}
                description={
                  'Store dataset in our secure, centralized cloud system. Easy access and high-speed downloads.'
                }
              />
              <SharingOption
                onClick={() => setStorageType(StorageType.IPFS)}
                isSelected={storageType === StorageType.IPFS}
                icon={<ViewInArOutlined fontSize={'medium'} />}
                label={'Decentralized Storage (IPFS)'}
                description={
                  'Distribute dataset across a decentralized network for added resilience and permanence. Maximum dataset size 2GB '
                }
                isDisabled={isIpfsDisabled}
              />
            </SharingOptionsContainer>
            <FairPeerReviewSection
              disabled={props.dataCollectionType !== DataCollectionType.AGING}
              disabledChipLabel={
                props.dataCollectionType === DataCollectionType.STUDENT
                  ? NOT_FOR_COMPETITION_CHIP_LABEL
                  : SOON_CHIP_LABEL
              }
              isPeerReviewEnabled={isPeerReviewEnabled}
              setIsPeerReviewEnabled={(enabled) =>
                setIsPeerReviewEnabled(enabled)
              }
            />
            <NowAllTheWorksWrap variant={'body1'}>
              {isPeerReviewEnabled
                ? 'Peer review will be performed based on FAIR principles'
                : 'Publication will be performed after editorial check in the format of a specialized aging data repository publication.'}
            </NowAllTheWorksWrap>
            {isPeerReviewEnabled && (
              <>
                <ReviewersSection
                  reviewers={reviewers}
                  setReviewers={setReviewers}
                />
                <HeightElement value="24px" />
              </>
            )}
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
                  <div>
                    <span>I confirm that all authors agree to the content, distribution</span>
                    <span>
                      {'and comply with the First Approval '}
                      <Link
                        color="primary"
                        href={'/docs/terms_and_conditions.pdf'}
                        target={'_blank'}>
                        publishing policy
                      </Link>
                    </span>
                  </div>
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
                  <div>
                    <span>I understand that once published, my dataset cannot be edited or deleted.</span>
                    <span>
                      {'Withdrawal is possible only under '}
                        <Link
                          color="primary"
                          href={'/docs/exceptional_circumstances.pdf'}
                          target={'_blank'}
                        >
                          exceptional circumstances
                        </Link>
                      .
                    </span>
                  </div>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userConfirmedSubmissionCompliance}
                    onChange={(e) => {
                      setUserConfirmedSubmissionCompliance(
                        e.currentTarget.checked
                      );
                    }}
                  />
                }
                label={
                  'I confirm that my submission does not contain sensitive information ' +
                  'and complies with all institutional and legal requirements.'
                }
              />
            </FormGroup>
            <ButtonWrap
              variant="contained"
              disabled={isPublicationNotValid}
              onClick={() => {
                publicationService
                  .submitPublication(publicationId, {
                    accessType,
                    useType,
                    storageType,
                    previewTitle,
                    previewSubtitle,
                    licenseType,
                    isPeerReviewEnabled,
                    reviewers: getValidReviewers()
                  })
                  .then(() => {
                    routerStore.navigatePage(
                      Page.PUBLICATION,
                      routerStore.path,
                      true
                    );
                  });
              }}>
              Submit
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
  onClick?: MouseEventHandler;
  disabledChipLabel?: string;
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
      onClick,
      disabledChipLabel = SOON_CHIP_LABEL
    } = props;

    return (
      <SharingOptionWrap
        {...props}
        ref={ref}
        onClick={isDisabled ? () => {} : onClick}
        isSelected={isSelected}
        noMargin={noMargin}>
        <>
          <FlexWrapRow>
            <IconWrap isDisabled={isDisabled}>{props.icon}</IconWrap>
            <SharingOptionLabel isDisabled={isDisabled}>
              {label}
            </SharingOptionLabel>
          </FlexWrapRow>
          <SharingOptionDescription isDisabled={isDisabled}>
            <Typography variant={'body2'}>{description}</Typography>
          </SharingOptionDescription>
        </>
        {isDisabled && (
          <FlexWrapRow style={{ marginTop: '10px' }}>
            <DisabledChip
              label={disabledChipLabel}
              sx={{ backgroundColor: 'inherit' }}
            />
          </FlexWrapRow>
        )}
      </SharingOptionWrap>
    );
  }
);

const FairPeerReviewSection = (props: {
  disabled: boolean;
  disabledChipLabel: string;
  isPeerReviewEnabled: boolean;
  setIsPeerReviewEnabled: (isPeerReviewEnabled: boolean) => void;
}): ReactElement => {
  return (
    <FairPeerReviewSectionWrap variant={'h6'} component={'div'}>
      <FairPeerReviewTitleWrap>Fair peer review</FairPeerReviewTitleWrap>
      <Switch
        disabled={props.disabled}
        checked={props.isPeerReviewEnabled}
        onClick={() => props.setIsPeerReviewEnabled(!props.isPeerReviewEnabled)}
      />
      {props.disabled  &&
        <DisabledChip
        label={props.disabledChipLabel}
        sx={{ backgroundColor: 'inherit' }}
      />
      }
    </FairPeerReviewSectionWrap>
  );
};

const ReviewersSection = (props: {
  reviewers: Reviewer[];
  setReviewers: React.Dispatch<React.SetStateAction<Reviewer[]>>;
}): ReactElement => {
  const updateReviewer = (index: number, updatedReviewer: Reviewer) => {
    props.setReviewers((prevReviewers) =>
      prevReviewers.map((reviewer, i) =>
        i === index ? { ...updatedReviewer } : reviewer
      )
    );
  };
  return (
    <SpaceBetweenColumn>
      {props.reviewers.map((reviewer, index) => (
        <ul
          style={{
            listStyleType: 'none',
            paddingLeft: '0',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: '-25px',
            marginBottom: 0,
            color: '#727171'
            // color: '#8d8b91f'
          }}>
          <li
            style={{
              fontWeight: '500',
              fontSize: '18px',
              display: 'inline-block',
              marginRight: '10px'
            }}>
            {index + 1}
          </li>
          <li>
            <ReviewerElement
              index={index}
              reviewer={reviewer}
              updateReviewer={updateReviewer}
            />
          </li>
        </ul>
      ))}
    </SpaceBetweenColumn>
  );
};

const ReviewerElement = (props: {
  index: number;
  reviewer: Reviewer;
  updateReviewer: (index: number, reviewers: Reviewer) => void;
}): ReactElement => {
  const { reviewer, index, updateReviewer } = props;
  const [touched, setTouched] = useState({
    email: false,
    lastName: false,
    firstName: false
  });
  return (
    <ReviewerRow>
      <FullWidthTextField
        value={reviewer.email}
        label={
          !validateEmail(reviewer.email) && touched.email
            ? 'Invalid email'
            : 'Email'
        }
        error={!validateEmail(reviewer.email) && touched.email}
        onChange={(e) => {
          reviewer.email = e.currentTarget.value;
          updateReviewer(index, reviewer);
        }}
        onBlur={() =>
          setTouched({
            ...touched,
            email: true
          })
        }
        variant="outlined"
      />
      <FullWidthTextField
        value={reviewer.firstName}
        label={
          !isNonEmptyString(reviewer.firstName) && touched.firstName
            ? 'Invalid first name'
            : 'First name'
        }
        error={!isNonEmptyString(reviewer.firstName) && touched.firstName}
        onChange={(e) => {
          reviewer.firstName = e.currentTarget.value;
          updateReviewer(index, reviewer);
        }}
        onBlur={() =>
          setTouched({
            ...touched,
            firstName: true
          })
        }
        variant="outlined"
      />
      <FullWidthTextField
        value={reviewer.lastName}
        label={
          !isNonEmptyString(reviewer.lastName) && touched.lastName
            ? 'Invalid last name'
            : 'Last name'
        }
        error={!isNonEmptyString(reviewer.lastName) && touched.lastName}
        onChange={(e) => {
          reviewer.lastName = e.currentTarget.value;
          updateReviewer(index, reviewer);
        }}
        onBlur={() =>
          setTouched({
            ...touched,
            lastName: true
          })
        }
        variant="outlined"
      />
    </ReviewerRow>
  );
};

const DisabledChip = (props: { label: string; sx?: any }): ReactElement => {
  return <ChipWrap {...props} />;
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

const ChipWrap = styled(Chip)`
  border-radius: 100px;
  border: 1px solid var(--primary-main, #3b4eff);
  color: var(--primary-main, #3b4eff);

  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  height: 24px;
`;

const SharingOptionsContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px 0;
`;

const SharingOptionWrap = styled.div<{
  noMargin?: boolean;
  isSelected?: boolean;
}>`
  cursor: pointer;
  padding: 16px;
  width: 300px;
  border-radius: 8px;
  border: 1px solid var(--divider, #d2d2d6);
  ${(props) =>
          props.isSelected
                  ? 'border: 2px solid var(--primary-dark, #3C47E5);' +
                  'box-shadow: 0px 0px 4px 0px #3B4EFF;'
                  : ''}
  display: flex;
  flex-direction: column;
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
  align-items: stretch;
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

export const ReviewerRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
`;
