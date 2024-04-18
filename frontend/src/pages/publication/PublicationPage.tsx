import React, {
  type FunctionComponent,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  Button,
  Grid,
  LinearProgress,
  Snackbar,
  SnackbarContent
} from '@mui/material';
import { Parent } from '../common.styled';
import { routerStore } from '../../core/router';
import styled from '@emotion/styled';
import {
  MAX_CHARACTER_COUNT,
  PublicationStore,
  type Section
} from './store/PublicationStore';
import { observer } from 'mobx-react-lite';
import { FileSystemFA } from '../../fire-browser/FileSystemFA';
import { ValidationDialog } from './ValidationDialog';
import {
  fileService,
  publicationService,
  sampleFileService
} from '../../core/service';
import { DownloadersDialog } from './DownloadersDialog';
import { PublicationStatus } from '../../apis/first-approval-api';
import { collaborationStore, downloadersStore } from './store/downloadsStore';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { ContentLicensingDialog } from '../../components/ContentLicensingDialog';
import { PublicationPageStore } from './store/PublicationPageStore';
import { Helmet } from 'react-helmet';
import { ResearchAreaStore } from './research-area/ResearchAreaStore';
import { Footer } from '../home/Footer';
import { PublicationBody } from './PublicationBody';
import { PublicationPageHeader } from './PublicationPageHeader';
import { CollaboratorsDialog } from './CollaboratorsDialog';

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

  const [openLimitSnackbar, setOpenLimitSnackbar] = useState(false);

  const { isLoading } = publicationStore;

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
              if (status.data === PublicationStatus.MODERATION) {
                window.location.reload();
              }
            });
        }, 3000);
      }, 1000);
    }

    if (publicationStore.publicationStatus === PublicationStatus.MODERATION) {
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

  useEffect(() => {
    setOpenLimitSnackbar(publicationStore.displayLimitSnackbar);
  }, [publicationStore.displayLimitSnackbar]);

  const handleLimitSnackbarClose = (): void => {
    setOpenLimitSnackbar(false);
  };

  return (
    <>
      <Helmet>
        <meta name="description" content={publicationStore.title} />
      </Helmet>
      <Parent>
        <PublicationPageHeader
          publicationPageStore={publicationPageStore}
          publicationStore={publicationStore}
          fs={fs}
          sfs={sfs}
          setContentLicensingDialogOpen={setContentLicensingDialogOpen}
          setOpenLimitSnackbar={setOpenLimitSnackbar}
          setValidationDialogOpen={setValidationDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setValidationErrors={setValidationErrors}
        />
        <Grid container justifyContent={'center'}>
          <Grid item sm={12} md={8} lg={6} maxWidth={'712px'}>
            <PublicationBodyWrap>
              <Snackbar
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
                }}
                open={openLimitSnackbar}
                autoHideDuration={5000}
                onClose={handleLimitSnackbarClose}>
                <SnackbarContent
                  message={`You have exceeded the limit of ${MAX_CHARACTER_COUNT} characters. 
                Your article is ${publicationStore.characterCount}. Please shorten and try again.`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'var(--error-dark, #C62828)'
                  }}
                  action={
                    <Button
                      size="small"
                      sx={{
                        color: 'white',
                        backgroundColor: 'var(--error-dark, #C62828)'
                      }}
                      onClick={handleLimitSnackbarClose}>
                      OK
                    </Button>
                  }
                />
              </Snackbar>
              {isLoading && <LinearProgress />}
              {!isLoading && (
                <PublicationBody
                  publicationId={publicationId}
                  publicationStore={publicationStore}
                  researchAreaStore={researchAreaStore}
                  publicationPageStore={publicationPageStore}
                  fs={fs}
                  sfs={sfs}
                />
              )}
            </PublicationBodyWrap>
          </Grid>
        </Grid>
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
      <CollaboratorsDialog
        isOpen={collaborationStore.open}
        collaborators={collaborationStore.collaborationRequests}
      />
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
      {publicationStore.isView && <Footer />}
    </>
  );
});

const PublicationBodyWrap = styled('div')`
  max-width: 760px;
  padding-left: 24px;
  padding-right: 24px;
`;
