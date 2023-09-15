import { publicationService } from '../../../core/service';
import { makeAutoObservable, reaction } from 'mobx';
import { PublicationStore } from './PublicationStore';
import { FileSystemFA } from '../../../fire-browser/FileSystemFA';
import { FileData } from '@first-approval/chonky/dist/types/file.types';

export class PublicationPageStore {
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
        confirmedAuthors: this.publicationStore.confirmedAuthors,
        unconfirmedAuthors: this.publicationStore.unconfirmedAuthors
      }),
      (value) => {
        if (
          value.confirmedAuthors.length + value.unconfirmedAuthors.length >
          1
        ) {
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
    void this.doDownloadFiles();
  }

  doDownloadFiles = async (): Promise<void> => {
    const response = await publicationService.getDownloadLink(
      this.publicationStore.publicationId
    );
    this.passcode = response.data.passcode;
    const downloadLink = document.createElement('a');
    downloadLink.href = response.data.link;
    downloadLink.download = this.publicationStore.title + '_files.zip';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
    const downloadLink = document.createElement('a');
    downloadLink.href = `/api/publication/${this.publicationStore.publicationId}/files/sample/download`;
    downloadLink.download = this.publicationStore.title + '_files.zip';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
