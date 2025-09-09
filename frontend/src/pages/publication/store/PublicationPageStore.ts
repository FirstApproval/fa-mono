import { publicationService } from '../../../core/service';
import { makeAutoObservable, reaction } from 'mobx';
import { PublicationStore } from './PublicationStore';
import { FileSystemFA } from '../../../fire-browser/FileSystemFA';
import { FileData } from '@first-approval/chonky/dist/types/file.types';
import { PublicationContentStatus } from "../../../apis/first-approval-api"
import { authStore } from '../../../core/auth';

export class PublicationPageStore {
  summaryEnabled = false;

  academicLevelEnabled = false;

  experimentGoalsEnabled = false;

  methodEnabled = false;

  dataDescriptionEnabled = false;

  preliminaryResultsEnabled = false;

  softwareEnabled = false;

  filesEnabled = false;

  sampleFilesEnabled = false;
  sampleFilesModalOpen = false;

  get sampleFilesHidden(): boolean {
    return this.fs.rootPathFiles === 0;
  }

  authorsEnabled = false;
  academicSupervisorLettersEnabled = false;
  addAcademicSupervisorLettersDialogOpen = false;
  deleteAcademicSupervisorLetterDialogOpen = false;

  get grantingOrganizationsEnabled(): boolean {
    return this.publicationStore.grantingOrganizations.length > 0;
  }

  get relatedArticlesEnabled(): boolean {
    return this.publicationStore.relatedArticles.length > 0;
  }

  tagsEnabled = false;

  passcode = '';
  contentStatus: PublicationContentStatus | null = null;
  isDataPreparingDialogOpen = false;
  isPasscodeDialogOpen = false;
  isCitateDialogOpen = false;

  constructor(
    private readonly publicationStore: PublicationStore,
    readonly fs: FileSystemFA,
    readonly sfs: FileSystemFA
  ) {
    makeAutoObservable(this);

    reaction(
      () => publicationStore.summary,
      (summary) => {
        if (summary.length > 0) {
          this.openSummary();
        }
      },
      { fireImmediately: true }
    );

    reaction(
      () => publicationStore.academicLevel,
      (academicLevel) => {
        if (academicLevel) {
          this.openAcademicLevel();
        }
      },
      { fireImmediately: true }
    );


    reaction(
      () => publicationStore.method,
      (method) => {
        if (method.length > 0) {
          this.openMethod();
        }
      },
      { fireImmediately: true }
    );

    reaction(
      () => publicationStore.experimentGoals,
      (experimentGoals) => {
        if (experimentGoals.length > 0) {
          this.openExperimentGoals();
        }
      },
      { fireImmediately: true }
    );

    reaction(
      () => publicationStore.dataDescription,
      (dataDescription) => {
        if (dataDescription.length > 0) {
          this.openDataDescription();
        }
      },
      { fireImmediately: true }
    );

    reaction(
      () => publicationStore.preliminaryResults,
      (preliminaryResults) => {
        if (preliminaryResults.length > 0) {
          this.openPreliminaryResults();
        }
      },
      { fireImmediately: true }
    );

    reaction(
      () => publicationStore.software,
      (software) => {
        if (software.length > 0) {
          this.openSoftware();
        }
      },
      { fireImmediately: true }
    );

    reaction(
      () => fs.rootPathFiles,
      (rootPathFiles) => {
        if (rootPathFiles > 0) {
          this.openFiles();
        }
      },
      { fireImmediately: true }
    );

    reaction(
      () => sfs.rootPathFiles,
      (rootPathFiles) => {
        if (rootPathFiles > 0) {
          this.openSampleFiles();
        }
      },
      { fireImmediately: true }
    );

    reaction(
      () => ({
        authors: this.publicationStore.authors
      }),
      (value) => {
        if (value.authors.length > 1) {
          this.openAuthors();
        }
      },
      { fireImmediately: true }
    );

    reaction(
      () => publicationStore.tags,
      (tags) => {
        if (tags.size > 0) {
          this.openTags();
        }
      },
      { fireImmediately: true }
    );
  }

  downloadFiles(): void {
    if (this.contentStatus !== PublicationContentStatus.PREPARING) {
      void this.doDownloadFiles();
    }
  }

  doDownloadFiles = async (): Promise<void> => {
    const response = await publicationService.getDownloadLink(
      this.publicationStore.publicationId
    );
    const downloadData = response.data;
    switch (downloadData.contentStatus) {
      case PublicationContentStatus.PREPARING:
        this.contentStatus = PublicationContentStatus.PREPARING;
        this.isDataPreparingDialogOpen = true;
        return;
      case PublicationContentStatus.AVAILABLE:
        this.isPasscodeDialogOpen = true;
        break;
      default:
        throw Error(`Unexpected content status: ${downloadData.contentStatus}`);
    }
    this.passcode = response.data.passcode;
    const downloadLink = document.createElement('a');
    downloadLink.href = response.data.link;
    downloadLink.download = this.publicationStore.title + '_files.zip';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  downloadPdf = async (): Promise<void> => {
    if (this.publicationStore.isPublished) {
      const downloadLink = document.createElement('a');
      downloadLink.href = `${window.origin}/api/publication/${this.publicationStore.publicationId}/pdf/download`;
      downloadLink.download = this.publicationStore.title + '.pdf';
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      const downloadLink = `${window.origin}/api/pending-publication/${this.publicationStore.publicationId}/pdf/download`;
      fetch(downloadLink, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
        .then(async (response) => {
          if (response.ok) {
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = this.publicationStore.title + '.pdf';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(downloadLink);
          } else {
            console.error(
              'Failed to download the file. Status: ',
              response.status
            );
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  downloadSampleFiles(): void {
    void this.doDownloadSampleFiles();
  }

  downloadSampleMultiFiles(files: FileData[]): void {
    if (files.length === 0) {
      void this.doDownloadSampleFiles();
    } else {
      files.forEach((fileData) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = `/api/sample-files/download/${fileData.id}`;
        downloadLink.download = fileData.name;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    }
  }

  doDownloadSampleFiles = async (): Promise<void> => {
    const res = await publicationService.getPublicationSampleFilesDownloadLink(
      this.publicationStore.publicationId
    );
    const downloadLink = document.createElement('a');
    downloadLink.href = res.data.link;
    downloadLink.download = this.publicationStore.title + '_files.zip';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  openSummary = (): void => {
    this.summaryEnabled = true;
  };

  openAcademicLevel = (): void => {
    this.academicLevelEnabled = true;
  };

  openExperimentGoals = (): void => {
    this.experimentGoalsEnabled = true;
  };

  openMethod = (): void => {
    this.methodEnabled = true;
  };

  openDataDescription = (): void => {
    this.dataDescriptionEnabled = true;
  };

  openPreliminaryResults = (): void => {
    this.preliminaryResultsEnabled = true;
  };

  openSoftware = (): void => {
    this.softwareEnabled = true;
  };

  openFiles = (): void => {
    this.filesEnabled = true;
  };

  openSampleFiles = (): void => {
    this.sampleFilesEnabled = true;
  };

  openSampleFilesModal = (): void => {
    this.sampleFilesModalOpen = true;
  };

  closeSampleFilesModal = (): void => {
    this.sampleFilesModalOpen = false;
  };

  openAuthors = (): void => {
    this.authorsEnabled = true;
  };

  enableAcademicSupervisorLetters = (): void => {
    this.academicSupervisorLettersEnabled = true;
  };

  openAddAcademicLevelDialog = (): void => {
    this.addAcademicSupervisorLettersDialogOpen = true;
  };

  closeAddAcademicLevelDialog = (): void => {
    this.addAcademicSupervisorLettersDialogOpen = false;
  };

  openDeleteAcademicSupervisorLetterDialog = (): void => {
    this.deleteAcademicSupervisorLetterDialogOpen = true;
  };

  closeDeleteAcademicSupervisorLetterDialog = (): void => {
    this.deleteAcademicSupervisorLetterDialogOpen = false;
  };

  openGrantingOrganizations = (): void => {
    if (!this.grantingOrganizationsEnabled) {
      this.publicationStore.addGrantingOrganization(0);
    }
  };

  openRelatedArticles = (): void => {
    if (!this.relatedArticlesEnabled) {
      this.publicationStore.addRelatedArticle(0);
    }
  };

  openTags = (): void => {
    this.tagsEnabled = true;
  };
}
