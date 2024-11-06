import styled from '@emotion/styled';
import { DialogContent, Tooltip } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { PublicationStore } from './store/PublicationStore';
import { ResearchAreaStore } from './research-area/ResearchAreaStore';
import { PublicationPageStore } from './store/PublicationPageStore';
import { FileSystemFA } from '../../fire-browser/FileSystemFA';
import React, { ReactElement, useRef } from 'react';
import { DraftText } from './DraftText';
import { DateViewsDownloadsCollaborators } from './DateViewsDownloadsCollaborators';
import { collaborationStore, downloadersStore } from './store/downloadsStore';
import { HeightElement, TitleRowWrap } from '../common.styled';
import { TitleEditor } from './editors/TitleEditor';
import { Authors } from './Authors';
import { ResearchArea } from './research-area/ResearchArea';
import {
  ActionBar,
  PUBLICATION_TRIED_TO_DOWNLOAD_SESSION_KEY
} from './ActionBar';
import {
  AuthorsPlaceholder,
  DataDescriptionPlaceholder,
  ExperimentGoalsPlaceholder,
  FilesPlaceholder,
  GrantingOrganisationsPlaceholder,
  MethodPlaceholder,
  PreliminaryResultsPlaceholder,
  RelatedPublicationsPlaceholder,
  SampleFilesPlaceholder,
  SoftwarePlaceholder,
  SummaryPlaceholder,
  TagsPlaceholder,
  TagsWrap
} from './ContentPlaceholder';
import { SummaryEditor } from './editors/SummaryEditor';
import { ExperimentGoalsEditor } from './editors/ExperimentGoalsEditor';
import { MethodEditor } from './editors/MethodEditor';
import { DataDescriptionEditor } from './editors/DataDescriptionEditor';
import { SoftwareEditor } from './editors/SoftwareEditor';
import { FileUploader } from '../../fire-browser/FileUploader';
import { authStore } from '../../core/auth';
import { routerStore } from '../../core/router';
import { Page } from '../../core/router/constants';
import { FileBrowserFA } from '../../fire-browser/FileBrowserFA';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Close } from '@mui/icons-material';
import { AuthorsEditor } from './editors/AuthorsEditor';
import { GrantingOrganizationsEditor } from './editors/GrantingOrganizationsEditor';
import { RelatedPublicationsEditor } from './editors/RelatedPublicationsEditor';
import { TagsEditor } from './editors/TagsEditor';
import { UploadStatusWindow } from './UploadStatusWindow';
import { DatasetIsPreparingDialog } from './dialogs/DatasetIsPreparingDialog';
import { PreliminaryResultsEditor } from './editors/PreliminaryResultsEditor';
import { copyTextToClipboard } from '../../fire-browser/utils';
import { CollaborationRequirementsDialog } from '../../components/CollaborationRequirementsDialog';
import { UseType } from '../../apis/first-approval-api';
import { CreateCollaborationRequestDialog } from '../../components/CreateCollaborationRequestDialog';

export const PublicationBody = observer(
  (props: {
    publicationId: string;
    publicationStore: PublicationStore;
    researchAreaStore: ResearchAreaStore;
    publicationPageStore: PublicationPageStore;
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
      openDataDescription,
      openPreliminaryResults,
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
      dataDescriptionEnabled,
      preliminaryResultsEnabled,
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
          <DateViewsDownloadsCollaborators
            openDownloadersDialog={() => {
              downloadersStore.clearAndOpen(
                props.publicationId,
                publicationStore.downloadsCount
              );
            }}
            openCollaborationRequestsDialog={() => {
              collaborationStore.clearAndOpen(
                props.publicationId,
                publicationStore.collaboratorsCount
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

        {publicationStore.isPublished && (
          <Tooltip
            placement="bottom"
            title={'Copy doi link'}
            arrow={true}
            onClick={() => {
              void copyTextToClipboard(publicationStore.doiLink).finally();
            }}>
            <a
              style={{
                cursor: 'pointer'
              }}>
              {publicationStore.doiLink}
            </a>
          </Tooltip>
        )}

        <HeightElement value={'24px'} />

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

        {/* Data description */}
        {!dataDescriptionEnabled && !publicationStore.isReadonly && (
          <DataDescriptionPlaceholder onClick={openDataDescription} />
        )}
        {dataDescriptionEnabled && (
          <DataDescriptionEditor publicationStore={publicationStore} />
        )}

        {/* Preliminary Results */}
        {!preliminaryResultsEnabled && !publicationStore.isReadonly && (
          <PreliminaryResultsPlaceholder onClick={openPreliminaryResults} />
        )}
        {preliminaryResultsEnabled && (
          <PreliminaryResultsEditor publicationStore={publicationStore} />
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
                  debugger;
                  if (publicationStore.useType === UseType.CO_AUTHORSHIP) {
                    publicationPageStore.collaborationRequirementDialogOpen =
                      true;
                  } else {
                    publicationPageStore.downloadFiles(false);
                  }
                } else {
                  sessionStorage.setItem(
                    PUBLICATION_TRIED_TO_DOWNLOAD_SESSION_KEY,
                    publicationStore.publicationId
                  );
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
        {(authorsEnabled || publicationStore.isReadonly) && (
          <AuthorsEditor
            key={`authorsEditor_${publicationStore.authors.length}`}
            publicationStore={publicationStore}
          />
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

        {/* Related publications */}
        {!relatedArticlesEnabled && !publicationStore.isReadonly && (
          <RelatedPublicationsPlaceholder onClick={openRelatedArticles} />
        )}
        {relatedArticlesEnabled && (
          <RelatedPublicationsEditor publicationStore={publicationStore} />
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
            <DateViewsDownloadsCollaborators
              openDownloadersDialog={() => {
                downloadersStore.clearAndOpen(
                  props.publicationId,
                  publicationStore.downloadsCount
                );
              }}
              openCollaborationRequestsDialog={() => {
                collaborationStore.clearAndOpen(
                  props.publicationId,
                  publicationStore.collaboratorsCount
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
        <DatasetIsPreparingDialog
          isOpen={publicationPageStore.isDataPreparingDialogOpen}
          onClose={() =>
            (publicationPageStore.isDataPreparingDialogOpen = false)
          }
        />
        <CollaborationRequirementsDialog
          isOpen={publicationPageStore.collaborationRequirementDialogOpen}
          onClose={() =>
            (publicationPageStore.collaborationRequirementDialogOpen = false)
          }
          onConfirm={(agreeToTheFirstApprovalLicense: boolean) => {
            publicationPageStore.downloadFiles(agreeToTheFirstApprovalLicense);
            publicationPageStore.collaborationRequirementDialogOpen = false;
            publicationPageStore.isPasscodeDialogOpen = true;
          }}
        />
        <CreateCollaborationRequestDialog
          publicationId={publicationStore.publicationId}
          onClose={() =>
            (collaborationStore.openCreateCollaborationRequestDialog = false)
          }></CreateCollaborationRequestDialog>
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

const Space = styled.div`
  margin-bottom: 120px;
`;
