import React, {
  type FunctionComponent,
  type ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Button, DialogContent, LinearProgress } from '@mui/material';
import {
  FlexBodyCenter,
  FlexHeader,
  Logo,
  Parent,
  StyledMenuItem,
  TitleRowWrap
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
  TagsPlaceholder,
  TagsWrap
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
import { FileSystemFA } from '../../fire-browser/FileSystemFA';
import { TagsEditor } from './editors/TagsEditor';
import { AuthorsEditor } from './editors/AuthorsEditor';
import { TitleEditor } from './editors/TitleEditor';
import { ResearchAreaEditor } from './editors/ResearchAreaEditor';
import { ResearchAreaPage } from './ResearchAreaPage';
import logo from '../../assets/logo-black.svg';
import { UserMenu } from '../../components/UserMenu';
import { ValidationDialog } from './ValidationDialog';
import {
  fileService,
  publicationService,
  sampleFileService
} from '../../core/service';
import { DraftText } from './DraftText';
import { Authors } from './Authors';
import { DateViewsDownloads } from './DateViewsDownloads';
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
import { ContentLicensingDialog } from '../../components/ContentLicensingDialog';
import { PublicationPageStore } from './store/PublicationPageStore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Close } from '@mui/icons-material';
import { FileBrowserFA } from '../../fire-browser/FileBrowserFA';
import { Page } from '../../core/router/constants';

export const PublicationPage: FunctionComponent = observer(() => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);

  const [fs] = useState(() => new FileSystemFA(publicationId, fileService));
  const [sfs] = useState(
    () => new FileSystemFA(publicationId, sampleFileService)
  );
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [isBetaDialogOpen, setIsBetaDialogOpen] = useState(() => false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentLicensingDialogOpen, setContentLicensingDialogOpen] =
    useState(false);
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
    () => new PublicationStore(publicationId, fs)
  );

  const publicationPageStore = useMemo(
    () => new PublicationPageStore(publicationStore, fs, sfs),
    [publicationStore, fs, sfs]
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

    if (
      publicationStore.publicationStatus ===
      PublicationStatus.READY_FOR_PUBLICATION
    ) {
      window.setTimeout(() => {
        window.setInterval(() => {
          publicationService
            .getPublicationStatus(publicationStore.publicationId)
            .then((status) => {
              if (status.data === PublicationStatus.PUBLISHED) {
                window.location.reload();
              }
            });
        }, 3000);
      }, 1000);
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
                  <PdfButtonWrap
                    variant="outlined"
                    size={'medium'}
                    onClick={async () => {
                      if (validateSections()) {
                        await publicationPageStore.downloadPdf();
                      }
                    }}>
                    Preview PDF
                  </PdfButtonWrap>
                  <ButtonWrap
                    marginright="0px"
                    variant="outlined"
                    size={'medium'}
                    onClick={handleClick}>
                    More
                    <ExpandMore
                      sx={{
                        width: 20,
                        height: 20,
                        marginLeft: '8px'
                      }}
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
                    publicationPageStore={publicationPageStore}
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
        publicationPageStore={publicationPageStore}
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
            setContentLicensingDialogOpen(true);
            handleClose();
          }}>
          Content licensing
        </StyledMenuItem>
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
      <ContentLicensingDialog
        publicationStore={publicationStore}
        licenseType={publicationStore.licenseType}
        isOpen={contentLicensingDialogOpen}
        onClose={() => setContentLicensingDialogOpen(false)}
      />
    </>
  );
});

const PublicationBody = observer(
  (props: {
    publicationId: string;
    publicationStore: PublicationStore;
    publicationPageStore: PublicationPageStore;
    openDownloadersDialog: () => void;
    fs: FileSystemFA;
    sfs: FileSystemFA;
  }): ReactElement => {
    const { fs, sfs, publicationStore, publicationPageStore } = props;

    const {
      openExperimentGoals,
      openMethod,
      openObjectOfStudy,
      openSoftware,
      openFiles,
      openSampleFilesModal,
      closeSampleFilesModal,
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
      sampleFilesModalOpen,
      authorsEnabled,
      grantingOrganizationsEnabled,
      relatedArticlesEnabled,
      tagsEnabled
    } = publicationPageStore;

    const isChonkyDragRef = useRef(false);

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
          <ActionBar
            publicationStore={publicationStore}
            publicationPageStore={publicationPageStore}
          />
        )}

        <SummaryEditor publicationStore={publicationStore} />

        {/* Experiment goals */}
        {!experimentGoalsEnabled && !publicationStore.isReadonly && (
          <ExperimentGoalsPlaceholder onClick={openExperimentGoals} />
        )}
        {experimentGoalsEnabled && (
          <ExperimentGoalsEditor publicationStore={publicationStore} />
        )}

        {/* Method */}
        {!methodEnabled && !publicationStore.isReadonly && (
          <MethodPlaceholder onClick={openMethod} />
        )}
        {methodEnabled && <MethodEditor publicationStore={publicationStore} />}

        {/* Object of study */}
        {!objectOfStudyEnabled && !publicationStore.isReadonly && (
          <ObjectOfStudyPlaceholder onClick={openObjectOfStudy} />
        )}
        {objectOfStudyEnabled && (
          <ObjectOfStudyEditor publicationStore={publicationStore} />
        )}

        {/* Software */}
        {!softwareEnabled && !publicationStore.isReadonly && (
          <SoftwarePlaceholder onClick={openSoftware} />
        )}
        {softwareEnabled && (
          <SoftwareEditor publicationStore={publicationStore} />
        )}

        {/* Files */}
        {!filesEnabled && !publicationStore.isReadonly && (
          <FilesPlaceholder onClick={openFiles} />
        )}
        {filesEnabled && (
          <FilesWrap>
            <FileUploader
              instanceId={'main'}
              rootFolderName={'Files'}
              fileDownloadUrlPrefix={'/api/files/download'}
              fs={fs}
              isReadonly={publicationStore.isReadonly}
              onArchiveDownload={() => {
                if (authStore.token) {
                  publicationPageStore.downloadFiles();
                  publicationPageStore.isPasscodeDialogOpen = true;
                } else {
                  routerStore.navigatePage(Page.SIGN_UP);
                }
              }}
              onPreviewFilesModalOpen={() => {
                publicationPageStore.openSampleFilesModal();
              }}
              isPreview={publicationStore.isPreview}
            />
          </FilesWrap>
        )}

        {/* Sample files */}
        {!sampleFilesEnabled &&
          !publicationStore.isReadonly &&
          !sampleFilesHidden && (
            <SampleFilesPlaceholder onClick={openSampleFilesModal} />
          )}
        {sampleFilesEnabled && !publicationStore.isReadonly && (
          <SampleFilesPreviewWrap>
            <FileBrowserFA
              instanceId={'sample'}
              rootFolderName={'Sample files'}
              fileDownloadUrlPrefix={'/api/sample-files/download'}
              fs={sfs}
              isReadonly={true}
              isChonkyDragRef={isChonkyDragRef}
              onEditFilesModalOpen={() => {
                publicationPageStore.openSampleFilesModal();
              }}
            />
          </SampleFilesPreviewWrap>
        )}
        <Dialog
          maxWidth={'xl'}
          open={sampleFilesModalOpen}
          onClose={closeSampleFilesModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContentWrap>
            <TitleRowWrap>
              <DialogTitle style={{ padding: 0 }}></DialogTitle>
              <Close
                style={{ cursor: 'pointer' }}
                htmlColor={'gray'}
                onClick={closeSampleFilesModal}
              />
            </TitleRowWrap>
            <SampleFilesWrap>
              <FileUploader
                instanceId={'sample'}
                rootFolderName={'Sample files'}
                fileDownloadUrlPrefix={'/api/sample-files/download'}
                onArchiveDownload={(files) => {
                  props.publicationPageStore.downloadSampleMultiFiles(files);
                }}
                fs={sfs}
                isReadonly={publicationStore.isReadonly}
                isPreview={publicationStore.isPreview}
              />
            </SampleFilesWrap>
          </DialogContentWrap>
        </Dialog>

        {/* Authors */}
        {!authorsEnabled && !publicationStore.isReadonly && (
          <AuthorsPlaceholder onClick={openAuthors} />
        )}
        {authorsEnabled && (
          <AuthorsEditor publicationStore={publicationStore} />
        )}

        {/* Granting organizations */}
        {!grantingOrganizationsEnabled && !publicationStore.isReadonly && (
          <GrantingOrganisationsPlaceholder
            onClick={openGrantingOrganizations}
          />
        )}
        {grantingOrganizationsEnabled && (
          <GrantingOrganizationsEditor publicationStore={publicationStore} />
        )}

        {/* Related articles */}
        {!relatedArticlesEnabled && !publicationStore.isReadonly && (
          <RelatedArticlesPlaceholder onClick={openRelatedArticles} />
        )}
        {relatedArticlesEnabled && (
          <RelatedArticlesEditor publicationStore={publicationStore} />
        )}

        {/* Tags */}
        {!tagsEnabled && (
          <TagsWrap>
            <TagsPlaceholder onClick={openTags} />
          </TagsWrap>
        )}
        {tagsEnabled && <TagsEditor publicationStore={publicationStore} />}

        {publicationStore.isPreview && <DraftText />}
        <Space />
      </>
    );
  }
);

const FilesWrap = styled.div`
  height: 450px;

  margin-top: 48px;
  margin-bottom: 40px;
`;

const SampleFilesPreviewWrap = styled.div`
  height: 192px;

  margin-top: 48px;
  margin-bottom: 40px;

  overflow: hidden;
`;

const SampleFilesWrap = styled.div`
  height: 450px;

  margin-top: 16px;
`;

const DialogContentWrap = styled(DialogContent)`
  min-width: 728px;
`;

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

const PdfButtonWrap = styled(Button)`
  margin-right: 24px;
  width: 120px;
  height: 36px;
`;

const Space = styled.div`
  margin-bottom: 120px;
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
