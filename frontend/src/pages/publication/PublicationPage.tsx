import React, {
  type FunctionComponent,
  MutableRefObject,
  type ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Button,
  DialogContent,
  LinearProgress,
  Tooltip,
  Typography
} from '@mui/material';
import {
  FlexBodyCenter,
  FlexHeader,
  HeightElement,
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
  RelatedArticlesPlaceholder,
  SampleFilesPlaceholder,
  SoftwarePlaceholder,
  SummaryPlaceholder,
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
  RelatedArticlesEditor,
  SoftwareEditor,
  SummaryEditor
} from './editors/ParagraphEditor';
import { FileSystemFA } from '../../fire-browser/FileSystemFA';
import { TagsEditor } from './editors/TagsEditor';
import { AuthorsEditor } from './editors/AuthorsEditor';
import { TitleEditor } from './editors/TitleEditor';
import logo from '../../assets/logo-black-short.svg';
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
import { PublicationStatus } from '../../apis/first-approval-api';
import { downloadersStore } from './store/downloadsStore';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Menu from '@mui/material/Menu';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { ContentLicensingDialog } from '../../components/ContentLicensingDialog';
import { PublicationPageStore } from './store/PublicationPageStore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Close, Edit } from '@mui/icons-material';
import { FileBrowserFA } from '../../fire-browser/FileBrowserFA';
import { Page } from '../../core/router/constants';
import { Helmet } from 'react-helmet';
import { useIsHorizontalOverflow } from '../../util/overflowUtil';
import { ResearchAreaStore } from './research-area/ResearchAreaStore';
import { ResearchArea } from './research-area/ResearchArea';
import { UploadStatusWindow } from './UploadStatusWindow';

export const PublicationPage: FunctionComponent = observer(() => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);

  const [fs] = useState(() => new FileSystemFA(publicationId, fileService));
  const [sfs] = useState(
    () => new FileSystemFA(publicationId, sampleFileService)
  );
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentLicensingDialogOpen, setContentLicensingDialogOpen] =
    useState(false);
  const [validationErrors, setValidationErrors] = useState<Section[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  const [researchAreaStore] = useState(
    () => new ResearchAreaStore(publicationStore)
  );

  const publicationPageStore = useMemo(
    () => new PublicationPageStore(publicationStore, fs, sfs),
    [publicationStore, fs, sfs]
  );

  const { isLoading, validate } = publicationStore;

  const validateSections = (): boolean => {
    const result = validate();
    const isValid = result.length === 0;
    setValidationDialogOpen(!isValid);
    setValidationErrors(result);
    return isValid;
  };
  const nameRef: MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const isOverflow = useIsHorizontalOverflow(nameRef, () => {});

  useEffect(() => {
    if (!publicationStore.publicationId) {
      publicationStore.createPublication().then();
    }

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

  const nextViewMode =
    publicationStore.viewMode === ViewMode.PREVIEW
      ? ViewMode.EDIT
      : ViewMode.PREVIEW;

  return (
    <>
      <Helmet>
        <meta name="description" content={publicationStore.title} />
      </Helmet>
      <Parent>
        <FlexHeader>
          <ToolbarContainer>
            <div style={{ display: 'flex' }}>
              <Logo onClick={routerStore.goHome}>
                <img src={logo} />
              </Logo>
              <BetaDialogWithButton />
              {!publicationStore.isView && (
                <>
                  <Tooltip
                    title={
                      isOverflow
                        ? `${publicationStore.creator?.firstName} ${publicationStore.creator?.lastName}`
                        : undefined
                    }>
                    <DraftedBy variant={'body1'} ref={nameRef}>
                      Draft by
                      {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                      {` ${publicationStore.creator?.firstName} ${publicationStore.creator?.lastName}`}
                    </DraftedBy>
                  </Tooltip>
                  {publicationStore.savingStatus ===
                    SavingStatusState.SAVING && (
                    <SavingStatus variant={'body1'}>Saving...</SavingStatus>
                  )}
                  {publicationStore.savingStatus ===
                    SavingStatusState.SAVED && (
                    <SavingStatus variant={'body1'}>Saved</SavingStatus>
                  )}
                </>
              )}
            </div>
            <FlexDiv>
              {!publicationStore.isView && (
                <>
                  {publicationStore.viewMode === ViewMode.PREVIEW && (
                    <ButtonWrap
                      disabled={fs.activeUploads > 0 || sfs.activeUploads > 0}
                      variant="contained"
                      size={'medium'}
                      onClick={() => {
                        const isValid = validateSections();
                        if (isValid) {
                          routerStore.navigatePage(
                            Page.SHARING_OPTIONS,
                            routerStore.path,
                            true,
                            {
                              publicationTitle: publicationStore.title,
                              publicationSummary:
                                publicationStore.summary[0].text.substring(
                                  0,
                                  200
                                ),
                              licenseType: publicationStore.licenseType
                            }
                          );
                        }
                      }}>
                      Publish
                    </ButtonWrap>
                  )}
                  <ButtonWrap
                    variant={
                      publicationStore.viewMode === ViewMode.PREVIEW
                        ? 'outlined'
                        : 'contained'
                    }
                    size={'medium'}
                    onClick={() => {
                      if (
                        nextViewMode !== ViewMode.PREVIEW ||
                        validateSections()
                      ) {
                        publicationStore.viewMode = nextViewMode;
                      }
                    }}>
                    {nextViewMode === ViewMode.EDIT ? (
                      <Edit
                        sx={{
                          width: '20px',
                          height: '20px'
                        }}
                        style={{ marginRight: '8px' }}
                      />
                    ) : (
                      ''
                    )}
                    {nextViewMode}
                  </ButtonWrap>
                  <ButtonWrap
                    marginright="0px"
                    variant="outlined"
                    size={'medium'}
                    onClick={handleClick}>
                    <span style={{ marginLeft: 8 }}>More</span>
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
              <PublicationBody
                publicationId={publicationId}
                publicationStore={publicationStore}
                researchAreaStore={researchAreaStore}
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
          onClick={async () => {
            if (validateSections()) {
              await publicationPageStore.downloadPdf();
            }
            handleClose();
          }}>
          Preview PDF
        </StyledMenuItem>
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
      {publicationStore.licenseType && (
        <ContentLicensingDialog
          licenseType={publicationStore.licenseType}
          isOpen={contentLicensingDialogOpen}
          onConfirm={(licenseType) =>
            publicationStore.editLicenseType(licenseType)
          }
          onClose={() => setContentLicensingDialogOpen(false)}
        />
      )}
    </>
  );
});

const PublicationBody = observer(
  (props: {
    publicationId: string;
    publicationStore: PublicationStore;
    researchAreaStore: ResearchAreaStore;
    publicationPageStore: PublicationPageStore;
    openDownloadersDialog: () => void;
    fs: FileSystemFA;
    sfs: FileSystemFA;
  }): ReactElement => {
    const {
      fs,
      sfs,
      publicationStore,
      researchAreaStore,
      publicationPageStore
    } = props;

    const {
      openSummary,
      openExperimentGoals,
      openMethod,
      openSoftware,
      openFiles,
      openSampleFilesModal,
      closeSampleFilesModal,
      openAuthors,
      openGrantingOrganizations,
      openRelatedArticles,
      openTags,
      summaryEnabled,
      experimentGoalsEnabled,
      methodEnabled,
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
            displayLicense={false}
          />
        )}
        <HeightElement value={'24px'} />
        <TitleEditor publicationStore={publicationStore} />

        {publicationStore.isReadonly && (
          <Authors publicationStore={publicationStore} />
        )}

        <ResearchArea researchAreaStore={researchAreaStore} />

        {publicationStore.isView && (
          <ActionBar
            publicationStore={publicationStore}
            publicationPageStore={publicationPageStore}
            displayDivider={true}
          />
        )}

        {!summaryEnabled &&
          researchAreaStore.isInitialized &&
          !publicationStore.isReadonly && <HeightElement value={'24px'} />}

        {/* Summary */}
        {!summaryEnabled && !publicationStore.isReadonly && (
          <SummaryPlaceholder onClick={openSummary} />
        )}
        {summaryEnabled && (
          <SummaryEditor publicationStore={publicationStore} />
        )}

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
        {!tagsEnabled && !publicationStore.isReadonly && (
          <TagsWrap>
            <TagsPlaceholder onClick={openTags} />
          </TagsWrap>
        )}
        {tagsEnabled && <TagsEditor publicationStore={publicationStore} />}
        {publicationStore.isView && (
          <>
            <HeightElement value={'4px'} />
            <ActionBar
              publicationStore={publicationStore}
              publicationPageStore={publicationPageStore}
              displayDivider={false}
            />
            <HeightElement value={'40px'} />
            <DateViewsDownloads
              openDownloadersDialog={() => {
                downloadersStore.clearAndOpen(
                  props.publicationId,
                  publicationStore.downloadsCount
                );
              }}
              publicationStore={publicationStore}
              displayLicense={true}
            />
          </>
        )}
        {publicationStore.isPreview && <DraftText />}
        <Space />

        <UploadStatusWindow fs={fs} />
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

const Space = styled.div`
  margin-bottom: 120px;
`;

const ToolbarContainer = styled.div`
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: 988px;
  display: flex;
`;

const DraftedBy = styled(Typography)`
  margin: 0 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
`;

const SavingStatus = styled(Typography)`
  color: var(--text-secondary, #68676e);
`;

const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
