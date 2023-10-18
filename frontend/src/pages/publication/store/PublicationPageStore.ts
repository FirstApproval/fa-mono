import { publicationService } from '../../../core/service';
import { makeAutoObservable, reaction } from 'mobx';
import { PublicationStore } from './PublicationStore';
import { FileSystemFA } from '../../../fire-browser/FileSystemFA';
import { FileData } from '@first-approval/chonky/dist/types/file.types';
import { PublicationContentStatus } from '../../../apis/first-approval-api';
import { authStore } from '../../../core/auth';

export class PublicationPageStore {
  get summaryEnabled(): boolean {
    return this.publicationStore.summary.length > 0;
  }

  get experimentGoalsEnabled(): boolean {
    return this.publicationStore.experimentGoals.length > 0;
  }

  get methodEnabled(): boolean {
    return (
      this.publicationStore.methodTitle.length > 0 ||
      this.publicationStore.method.length > 0
    );
  }

  get objectOfStudyEnabled(): boolean {
    return (
      this.publicationStore.objectOfStudyTitle.length > 0 ||
      this.publicationStore.objectOfStudy.length > 0
    );
  }

  get softwareEnabled(): boolean {
    return this.publicationStore.software.length > 0;
  }

  filesEnabled = false;

  sampleFilesEnabled = false;
  sampleFilesModalOpen = false;

  get sampleFilesHidden(): boolean {
    return this.fs.rootPathFiles === 0;
  }

  authorsEnabled = false;

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
    const downloadLink = `${window.origin}/api/${
      this.publicationStore.isPublished ? '' : 'pending-'
    }publication/${this.publicationStore.publicationId}/pdf/download`;
    debugger;
    fetch(downloadLink, {
      method: 'GET',
      headers: this.publicationStore.isPublished
        ? {}
        : {
            Authorization: `Bearer ${authStore.token}`
          }
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
    if (!this.summaryEnabled) {
      this.publicationStore.addSummaryParagraph(0);
    }
  };

  openExperimentGoals = (): void => {
    if (!this.experimentGoalsEnabled) {
      this.publicationStore.addExperimentGoalsParagraph(0);
    }
  };

  openMethod = (): void => {
    if (!this.methodEnabled) {
      this.publicationStore.addMethodParagraph(0);
    }
  };

  openObjectOfStudy = (): void => {
    if (!this.objectOfStudyEnabled) {
      this.publicationStore.addObjectOfStudyParagraph(0);
    }
  };

  openSoftware = (): void => {
    if (!this.softwareEnabled) {
      this.publicationStore.addSoftwareParagraph(0);
    }
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
