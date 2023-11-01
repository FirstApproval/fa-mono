import styled from '@emotion/styled';
import { DialogContent } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { PublicationStore } from './store/PublicationStore';
import { ResearchAreaStore } from './research-area/ResearchAreaStore';
import { PublicationPageStore } from './store/PublicationPageStore';
import { FileSystemFA } from '../../fire-browser/FileSystemFA';
import React, { ReactElement, useRef } from 'react';
import { DraftText } from './DraftText';
import { DateViewsDownloads } from './DateViewsDownloads';
import { downloadersStore } from './store/downloadsStore';
import { HeightElement, TitleRowWrap } from '../common.styled';
import { TitleEditor } from './editors/TitleEditor';
import { Authors } from './Authors';
import { ResearchArea } from './research-area/ResearchArea';
import { ActionBar } from './ActionBar';
import {
  AuthorsPlaceholder,
  ExperimentGoalsPlaceholder,
  FilesPlaceholder,
  GrantingOrganisationsPlaceholder,
  MethodPlaceholder,
  DataDescriptionPlaceholder,
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

export const PublicationBody = observer(
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
      openDataDescription,
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

        {/* Data description */}
        {!dataDescriptionEnabled && !publicationStore.isReadonly && (
          <DataDescriptionPlaceholder onClick={openDataDescription} />
        )}
        {dataDescriptionEnabled && (
          <DataDescriptionEditor publicationStore={publicationStore} />
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
        <DatasetIsPreparingDialog
          isOpen={publicationPageStore.isDataPreparingDialogOpen}
          onClose={() =>
            (publicationPageStore.isDataPreparingDialogOpen = false)
          }
        />
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
