import React, {
  type FunctionComponent,
  type ReactElement,
  useEffect,
  useState
} from 'react';
import { Button, LinearProgress } from '@mui/material';
import {
  FlexBodyCenter,
  FlexHeader,
  Logo,
  Parent,
  StyledMenuItem
} from '../common.styled';
import { FileUploader } from '../../fire-browser/FileUploader';
import { routerStore } from '../../core/router';
import styled from '@emotion/styled';
import {
  AuthorsPlaceholder,
  ExperimentGoalsPlaceholder,
  FilesPlaceholder,
  GrantingOrganisationsPlaceholder,
  MethodPlaceholder,
  ObjectOfStudyPlaceholder,
  RelatedArticlesPlaceholder,
  SampleFilesPlaceholder,
  SoftwarePlaceholder,
  TagsPlaceholder
} from './ContentPlaceholder';
import {
  PublicationStore,
  SavingStatusState,
  type Section,
  ViewMode
} from './store/PublicationStore';
import { observer } from 'mobx-react-lite';
import {
  ExperimentGoalsEditor,
  GrantingOrganizationsEditor,
  MethodEditor,
  ObjectOfStudyEditor,
  RelatedArticlesEditor,
  SoftwareEditor,
  SummaryEditor
} from './editors/ParagraphEditor';
import { ChonkyFileSystem } from '../../fire-browser/ChonkyFileSystem';
import { TagsEditor } from './editors/TagsEditor';
import { AuthorsEditor } from './editors/AuthorsEditor';
import { TitleEditor } from './editors/TitleEditor';
import { ResearchAreaEditor } from './editors/ResearchAreaEditor';
import { ResearchAreaPage } from './ResearchAreaPage';
import logo from '../../assets/logo-black.svg';
import { UserMenu } from '../../components/UserMenu';
import { Page } from '../../core/RouterStore';
import { ValidationDialog } from './ValidationDialog';
import { publicationService } from '../../core/service';
import { DraftText } from './DraftText';
import { Authors } from './Authors';
import { DateViewsDownloads } from './DateViewsDownloads';
import { ChonkySampleFileSystem } from '../../fire-browser/sample-files/ChonkySampleFileSystem';
import { SampleFileUploader } from '../../fire-browser/sample-files/SampleFileUploader';
import { ActionBar } from './ActionBar';
import { authStore } from '../../core/auth';
import { DownloadersDialog } from './DownloadersDialog';
import { BetaDialogWithButton } from '../../components/BetaDialogWithButton';
import developer from '../../assets/developer.svg';
import cloud from '../../assets/cloud.svg';
import { BetaDialog } from '../../components/BetaDialog';
import { PublicationStatus } from '../../apis/first-approval-api';
import { downloadersStore } from './store/downloadsStore';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Menu from '@mui/material/Menu';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';

export const PublicationPage: FunctionComponent = observer(() => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);

  const [fs] = useState(() => new ChonkyFileSystem(publicationId));
  const [sfs] = useState(() => new ChonkySampleFileSystem(publicationId));
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [isBetaDialogOpen, setIsBetaDialogOpen] = useState(() => false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Section[]>([]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const [publicationStore] = useState(
    () => new PublicationStore(publicationId, fs, sfs)
  );

  const { isLoading, researchAreas, validate } = publicationStore;

  const validateSections = (): boolean => {
    const result = validate();
    const isValid = result.length === 0;
    setValidationDialogOpen(!isValid);
    setValidationErrors(result);
    return isValid;
  };

  useEffect(() => {
    if (
      publicationStore.publicationStatus === PublicationStatus.PUBLISHED &&
      !publicationStore.viewCounterUpdated
    ) {
      publicationStore.viewCounterUpdated = true;
      void publicationService.incrementPublicationViewCount(publicationId);
    }
  }, [publicationStore.publicationStatus]);

  const emptyResearchArea = researchAreas.length === 0;

  const nextViewMode =
    publicationStore.viewMode === ViewMode.PREVIEW
      ? ViewMode.EDIT
      : ViewMode.PREVIEW;

  return (
    <>
      <Parent>
        <div
          onClick={() => {
            setIsBetaDialogOpen(true);
          }}
          style={{
            display: 'flex',
            width: '100%',
            height: '48px',
            backgroundColor: 'var(--primary-main, #3B4EFF)',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            cursor: 'pointer'
          }}>
          <img src={developer} />
          <BetaHeaderText>
            We are fine-tuning the platform and would love your feedback
          </BetaHeaderText>
          <img src={cloud} />
        </div>
        <BetaDialog
          isOpen={isBetaDialogOpen}
          onClose={() => setIsBetaDialogOpen(false)}
        />
        <FlexHeader>
          <ToolbarContainer>
            <div style={{ display: 'flex' }}>
              <Logo onClick={routerStore.goHome}>
                <img src={logo} />
              </Logo>
              <BetaDialogWithButton />
              {!publicationStore.isView && (
                <>
                  <DraftedBy>
                    Draft by
                    {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                    {` ${publicationStore.creator?.firstName} ${publicationStore.creator?.lastName}`}
                  </DraftedBy>
                  {publicationStore.savingStatus ===
                    SavingStatusState.SAVING && (
                    <SavingStatus>Saving...</SavingStatus>
                  )}
                  {publicationStore.savingStatus ===
                    SavingStatusState.SAVED && (
                    <SavingStatus>Saved</SavingStatus>
                  )}
                </>
              )}
            </div>
            <FlexDiv>
              {!publicationStore.isView && (
                <>
                  <ButtonWrap
                    variant="contained"
                    size={'medium'}
                    onClick={() => {
                      const isValid = validateSections();
                      if (isValid) {
                        routerStore.navigatePage(
                          Page.SHARING_OPTIONS,
                          routerStore.path,
                          true,
                          { publicationTitle: publicationStore.title }
                        );
                      }
                    }}>
                    Publish
                  </ButtonWrap>
                  <ButtonWrap
                    variant="outlined"
                    size={'medium'}
                    onClick={() => {
                      if (
                        nextViewMode !== ViewMode.PREVIEW ||
                        validateSections()
                      ) {
                        publicationStore.viewMode = nextViewMode;
                      }
                    }}>
                    {nextViewMode}
                  </ButtonWrap>
                  <ButtonWrap
                    marginright="0px"
                    variant="outlined"
                    size={'medium'}
                    onClick={handleClick}>
                    More
                    <ExpandMore
                      sx={{ width: 20, height: 20, marginLeft: '8px' }}
                    />
                  </ButtonWrap>
                </>
              )}
              <UserMenu />
            </FlexDiv>
          </ToolbarContainer>
        </FlexHeader>
        <FlexBodyCenter>
          <PublicationBodyWrap>
            {isLoading && <LinearProgress />}
            {!isLoading && (
              <>
                {!emptyResearchArea && (
                  <PublicationBody
                    publicationId={publicationId}
                    publicationStore={publicationStore}
                    openDownloadersDialog={() => {
                      downloadersStore.clearAndOpen(
                        publicationId,
                        publicationStore.downloadsCount
                      );
                    }}
                    fs={fs}
                    sfs={sfs}
                  />
                )}
                {emptyResearchArea && (
                  <ResearchAreaPage publicationStore={publicationStore} />
                )}
              </>
            )}
          </PublicationBodyWrap>
        </FlexBodyCenter>
      </Parent>
      <ValidationDialog
        publicationStore={publicationStore}
        isOpen={validationDialogOpen}
        onClose={() => {
          setValidationDialogOpen(false);
        }}
        errors={validationErrors}
      />
      <DownloadersDialog
        isOpen={downloadersStore.open}
        downloaders={downloadersStore.downloaders}
      />
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        MenuListProps={{
          'aria-labelledby': 'user-button'
        }}>
        <StyledMenuItem
          onClick={() => {
            setDeleteDialogOpen(true);
            handleClose();
          }}>
          Delete draft
        </StyledMenuItem>
      </Menu>
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          await publicationStore?.deletePublication(publicationId);
        }}
        title={'Delete?'}
        text={
          'Everything will be deleted and you won’t be able to undo this action.'
        }
        yesText={'Delete'}
        noText={'Cancel'}
      />
    </>
  );
});

const PublicationBody = observer(
  (props: {
    publicationId: string;
    publicationStore: PublicationStore;
    openDownloadersDialog: () => void;
    fs: ChonkyFileSystem;
    sfs: ChonkySampleFileSystem;
  }): ReactElement => {
    const { fs, sfs, publicationStore } = props;

    const {
      openExperimentGoals,
      openMethod,
      openObjectOfStudy,
      openSoftware,
      openFiles,
      openSampleFiles,
      openAuthors,
      openGrantingOrganizations,
      openRelatedArticles,
      openTags,
      experimentGoalsEnabled,
      methodEnabled,
      objectOfStudyEnabled,
      softwareEnabled,
      filesEnabled,
      sampleFilesEnabled,
      sampleFilesHidden,
      authorsEnabled,
      grantingOrganizationsEnabled,
      relatedArticlesEnabled,
      tagsEnabled
    } = publicationStore;

    return (
      <>
        {publicationStore.isPreview && <DraftText />}
        {publicationStore.isView && (
          <DateViewsDownloads
            openDownloadersDialog={() => {
              downloadersStore.clearAndOpen(
                props.publicationId,
                publicationStore.downloadsCount
              );
            }}
            publicationStore={publicationStore}
          />
        )}
        <div style={{ height: '16px' }}></div>
        <TitleEditor publicationStore={publicationStore} />
        {publicationStore.isReadonly && (
          <Authors publicationStore={publicationStore} />
        )}
        <ResearchAreaEditor publicationStore={publicationStore} />

        {publicationStore.isView && (
          <ActionBar publicationStore={publicationStore} />
        )}

        <SummaryEditor publicationStore={publicationStore} />
        {!experimentGoalsEnabled && (
          <ExperimentGoalsPlaceholder onClick={openExperimentGoals} />
        )}
        {experimentGoalsEnabled && (
          <ExperimentGoalsEditor publicationStore={publicationStore} />
        )}
        {!methodEnabled && <MethodPlaceholder onClick={openMethod} />}
        {methodEnabled && <MethodEditor publicationStore={publicationStore} />}
        {!objectOfStudyEnabled && (
          <ObjectOfStudyPlaceholder onClick={openObjectOfStudy} />
        )}
        {objectOfStudyEnabled && (
          <ObjectOfStudyEditor publicationStore={publicationStore} />
        )}
        {!softwareEnabled && <SoftwarePlaceholder onClick={openSoftware} />}
        {softwareEnabled && (
          <SoftwareEditor publicationStore={publicationStore} />
        )}
        {!filesEnabled && <FilesPlaceholder onClick={openFiles} />}
        {filesEnabled && (
          <FileUploader
            fs={fs}
            isReadonly={publicationStore.isReadonly}
            onArchiveDownload={() => {
              if (authStore.token) {
                publicationStore.downloadFiles();
                publicationStore.isPasscodeDialogOpen = true;
              } else {
                routerStore.navigatePage(Page.SIGN_UP);
              }
            }}
          />
        )}
        {!sampleFilesEnabled &&
          !sampleFilesHidden &&
          publicationStore.viewMode === ViewMode.EDIT && (
            <SampleFilesPlaceholder onClick={openSampleFiles} />
          )}
        {sampleFilesEnabled && (
          <SampleFileUploader
            sfs={sfs}
            publicationStore={publicationStore}
            isReadonly={publicationStore.isReadonly}
          />
        )}
        {!authorsEnabled && <AuthorsPlaceholder onClick={openAuthors} />}
        {authorsEnabled && (
          <AuthorsEditor publicationStore={publicationStore} />
        )}
        {!grantingOrganizationsEnabled && (
          <GrantingOrganisationsPlaceholder
            onClick={openGrantingOrganizations}
          />
        )}
        {grantingOrganizationsEnabled && (
          <GrantingOrganizationsEditor publicationStore={publicationStore} />
        )}
        {!relatedArticlesEnabled && (
          <RelatedArticlesPlaceholder onClick={openRelatedArticles} />
        )}
        {relatedArticlesEnabled && (
          <RelatedArticlesEditor publicationStore={publicationStore} />
        )}
        {!tagsEnabled && <TagsPlaceholder onClick={openTags} />}
        {tagsEnabled && <TagsEditor publicationStore={publicationStore} />}
        {publicationStore.isPreview && <DraftText />}
      </>
    );
  }
);

const PublicationBodyWrap = styled('div')`
  width: 728px;
  padding-left: 24px;
  padding-right: 24px;
`;

const ButtonWrap = styled(Button)<{ marginright?: string }>`
  margin-right: ${(props) => props.marginright ?? '24px'};
  width: 90px;
  height: 36px;
`;

const ToolbarContainer = styled.div`
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: 100%;
  display: flex;
`;

const DraftedBy = styled.span`
  margin: 0 16px;
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body1 */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
`;

const SavingStatus = styled.span`
  color: var(--text-secondary, #68676e);
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body1 */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
`;

const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BetaHeaderText = styled.span`
  color: var(--primary-contrast, #fff);
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/subtitle2 */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 157%; /* 21.98px */
  letter-spacing: 0.1px;
  margin-left: 12px;
  margin-right: 12px;
`;
