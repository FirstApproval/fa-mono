import { action, makeAutoObservable, reaction } from 'mobx';
import { publicationService } from '../../../core/service';
import _ from 'lodash';
import {
  Author,
  DataCollectionType,
  LicenseType,
  type Paragraph,
  PublicationEditRequest,
  PublicationStatus,
  type UserInfo
} from '../../../apis/first-approval-api';
import { type FileSystemFA } from '../../../fire-browser/FileSystemFA';
import { v4 as uuidv4 } from 'uuid';
import { type AuthorEditorStore } from './AuthorEditorStore';
import { routerStore } from '../../../core/router';
import { authStore } from '../../../core/auth';
import {
  Page,
  shortPublicationPath
} from '../../../core/router/constants';

export const EDIT_THROTTLE_MS = 1000;
export const MAX_CHARACTER_COUNT = 60000;

export type ParagraphWithId = Paragraph & { id: string };
export type Section =
  | 'title'
  | 'summary'
  | 'goals'
  | 'method'
  | 'data_description'
  | 'files'
  | 'sample_files'
  | 'tags';

export enum ViewMode {
  EDIT = 'Edit',
  PREVIEW = 'Preview',
  VIEW = 'View'
}

export class PublicationStore {
  prevMode: ViewMode | null = null;
  viewMode: ViewMode = ViewMode.VIEW;

  publicationId: string;
  isLoading = true;

  title = '';
  doiLink = '';
  researchAreas: Paragraph[] = [];

  creator: UserInfo | undefined;

  summary: string = '';
  savingStatus: SavingStatusState = SavingStatusState.PREVIEW;

  experimentGoals: string = '';
  method: string = '';
  dataDescription: string = '';
  preliminaryResults: string = '';
  software: string = '';
  authors: Author[] = [];
  authorNames: PublicationAuthorName[] = [];
  grantingOrganizations: ParagraphWithId[] = [];
  relatedArticles: ParagraphWithId[] = [];
  primaryArticles: Paragraph[] = [];
  tags = new Set<string>();
  isNegative = false;
  negativeData = '';

  publicationTime: Date = new Date();
  viewsCount: number = 0;
  downloadsCount: number = 0;

  licenseType: LicenseType | null = null;
  dataCollectionType: DataCollectionType | null = null;
  publicationStatus: PublicationStatus | null = null;

  archiveSize: number | null = null;
  sampleArchiveSize: number | null = null;

  viewCounterUpdated: boolean = false;
  characterCount: number = 0;
  isExceededLimit: boolean = false;
  displayLimitSnackbar: boolean = false;

  constructor(
    publicationId: string,
    private readonly fs: FileSystemFA,
    private readonly sfs: FileSystemFA
  ) {
    this.publicationId = publicationId;
    makeAutoObservable(this);
    reaction(
      () => this.fs.initialized,
      (initialized) => {
        if (initialized) {
          this.loadInitialState();
        }
      },
      { fireImmediately: true }
    );
    reaction(
      () => this.viewMode,
      (viewMode, prev) => {
        this.prevMode = prev;
      }
    );
  }

  get disableAutofocus(): boolean {
    return this.prevMode === ViewMode.PREVIEW;
  }

  get isReadonly(): boolean {
    return (
      this.viewMode === ViewMode.PREVIEW || this.viewMode === ViewMode.VIEW
    );
  }

  get isPreview(): boolean {
    return this.viewMode === ViewMode.PREVIEW;
  }

  get isView(): boolean {
    return this.viewMode === ViewMode.VIEW;
  }

  get isPublished(): boolean {
    return this.publicationStatus === PublicationStatus.PUBLISHED;
  }

  get isPublishing(): boolean {
    return this.publicationStatus === PublicationStatus.READY_FOR_PUBLICATION;
  }

  addGrantingOrganization(idx: number): void {
    const newValue = [...this.grantingOrganizations];
    newValue.splice(idx + 1, 0, {
      text: '',
      id: uuidv4()
    });
    this.grantingOrganizations = newValue;
  }

  addTag(tag: string): void {
    if (tag) {
      this.tags.add(tag);
      this.savingStatus = SavingStatusState.SAVING;
      void this.updateTags();
    }
  }

  deleteTag(tag: string): void {
    this.tags.delete(tag);
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateTags();
  }

  deleteAuthor(store: AuthorEditorStore): void {
    if (typeof store.index !== 'undefined') {
      const author = this.authors[store.index];
      if (author.id !== store.id) {
        throw Error('Tried to delete wrong author');
      }
      this.authors.splice(store.index, 1);
      this.savingStatus = SavingStatusState.SAVING;
      void this.updateAuthors();
    }
  }

  addOrEditAuthor(store: AuthorEditorStore): void {
    if (typeof store.index !== 'undefined' && store.index !== null) {
      const author = this.authors[store.index];
      if (author.id !== store.id) {
        throw Error('Unconfirmed author found by index have different id');
      }
      author.email = store.email;
      author.firstName = store.firstName;
      author.lastName = store.lastName;
      author.workplaces = [...store.workplaces];
    } else {
      const newValue = [...this.authors];
      newValue.push({
        email: store.email,
        firstName: store.firstName,
        lastName: store.lastName,
        ordinal: this.authors.length,
        workplaces: store.workplaces,
        isConfirmed: store.isConfirmed,
        user: store.user
      });
      this.authors = newValue;
    }
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateAuthors();
  }

  updateAuthors = _.throttle(async () => {
    await this.editPublication({
      authors: {
        values: this.authors,
        edited: true
      }
    });
    this.setAuthorNames();
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateTags = _.throttle(async () => {
    await this.editPublication({
      tags: {
        values: Array.from(this.tags).map((t) => ({ text: t })),
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  editLicenseType(licenseType: LicenseType): void {
    this.savingStatus = SavingStatusState.SAVING;
    void publicationService.editPublication(this.publicationId, {
      licenseType: {
        value: licenseType ?? undefined,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }

  updateTitle(title: string): void {
    this.title = title;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateTitleRequest();
  }

  updateTitleRequest = _.throttle(async () => {
    const title = this.title;
    await this.editPublication({
      title: {
        value: title,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  addRelatedArticle(idx: number): void {
    const newValue = [...this.relatedArticles];
    newValue.splice(idx + 1, 0, {
      text: '',
      id: uuidv4()
    });
    this.relatedArticles = newValue;
  }

  updateSummaryParagraph(value: string): void {
    this.summary = value;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateSummary();
  }

  updateSummary = _.throttle(async () => {
    await this.editPublication({
      description: {
        value: this.summary,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateExperimentGoalsParagraph(value: string): void {
    this.experimentGoals = value;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateExperimentGoals();
  }

  updateExperimentGoals = _.throttle(async () => {
    await this.editPublication({
      predictedGoals: {
        value: this.experimentGoals,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateMethodParagraph(value: string): void {
    this.method = value;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateMethod();
  }

  updateMethod = _.throttle(async () => {
    await this.editPublication({
      methodDescription: {
        value: this.method,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateDataDescriptionParagraph(value: string): void {
    this.dataDescription = value;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateDataDescription();
  }

  updateDataDescription = _.throttle(async () => {
    await this.editPublication({
      dataDescription: {
        value: this.dataDescription,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updatePreliminaryResultsParagraph(value: string): void {
    this.preliminaryResults = value;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updatePreliminaryResults();
  }

  updatePreliminaryResults = _.throttle(async () => {
    await this.editPublication({
      preliminaryResults: {
        value: this.preliminaryResults,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateSoftwareParagraph(value: string): void {
    this.software = value;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateSoftware();
  }

  updateSoftware = _.throttle(async () => {
    await this.editPublication({
      software: {
        value: this.software,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateGrantingOrganization(idx: number, value: string): void {
    const newValue = [...this.grantingOrganizations];
    newValue[idx] = {
      text: value,
      id: newValue[idx].id
    };
    this.grantingOrganizations = newValue;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateGrantingOrganizations();
  }

  updateGrantingOrganizations = _.throttle(async () => {
    const grantingOrganizations: Paragraph[] =
      this.grantingOrganizations.filter((p) => p.text.length > 0);

    await this.editPublication({
      grantOrganizations: {
        values: grantingOrganizations,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updatePrimaryArticle(list: Paragraph[]): void {
    this.primaryArticles = [...list];
    this.savingStatus = SavingStatusState.SAVING;
    void this.updatePrimaryArticles();
  }

  updatePrimaryArticles = _.throttle(async () => {
    const primaryArticles: Paragraph[] = this.primaryArticles.filter(
      (p) => p.text.length > 0
    );

    await this.editPublication({
      primaryArticles: {
        values: primaryArticles,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateRelatedArticle(idx: number, value: string): void {
    const newValue = [...this.relatedArticles];
    newValue[idx] = {
      text: value,
      id: newValue[idx].id
    };
    this.relatedArticles = newValue;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateRelatedArticles();
  }

  updateRelatedArticles = _.throttle(async () => {
    const relatedArticles: Paragraph[] = this.relatedArticles.filter(
      (p) => p.text.length > 0
    );

    await this.editPublication({
      relatedArticles: {
        values: relatedArticles,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  doUpdateIsNegativeData = _.throttle(async () => {
    await this.editPublication({
      isNegative: this.isNegative
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateNegativeData(newValue: string): void {
    this.negativeData = newValue;
    this.savingStatus = SavingStatusState.SAVING;
    void this.doUpdateNegativeData();
  }

  copyPublicationLinkToClipboard = async (): Promise<void> => {
    const text =
      window.location.host + shortPublicationPath + this.publicationId;
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand('copy', true, text);
    }
  };

  doUpdateNegativeData = _.throttle(async () => {
    await this.editPublication({
      negativeData: {
        value: this.negativeData,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  mergeGrantingOrganizationsParagraph = (idx: number): void => {
    if (idx <= 0) return;
    const newValue = [...this.grantingOrganizations];
    newValue[idx - 1] = {
      text: newValue[idx - 1].text + newValue[idx].text,
      id: newValue[idx - 1].id
    };
    newValue.splice(idx, 1);
    this.grantingOrganizations = newValue;
    void this.updateGrantingOrganizations();
  };

  splitGrantingOrganizationsParagraph = (
    idx: number,
    splitIndex: number
  ): void => {
    if (idx < 0) return;
    const newValue = [...this.grantingOrganizations];
    const newElement = {
      text: newValue[idx].text.substring(splitIndex),
      id: uuidv4()
    };
    newValue.splice(idx + 1, 0, newElement);
    newValue[idx] = {
      text: newValue[idx].text.substring(0, splitIndex),
      id: newValue[idx].id
    };
    this.grantingOrganizations = newValue;
    void this.updateGrantingOrganizations();
  };

  mergeRelatedArticlesParagraph = (idx: number): void => {
    if (idx <= 0) return;
    const newValue = [...this.relatedArticles];
    newValue[idx - 1] = {
      text: newValue[idx - 1].text + newValue[idx].text,
      id: newValue[idx - 1].id
    };
    newValue.splice(idx, 1);
    this.relatedArticles = newValue;
    void this.updateRelatedArticles();
  };

  splitRelatedArticlesParagraph = (idx: number, splitIndex: number): void => {
    if (idx < 0) return;
    const newValue = [...this.relatedArticles];
    const newElement = {
      text: newValue[idx].text.substring(splitIndex),
      id: uuidv4()
    };
    newValue.splice(idx + 1, 0, newElement);
    newValue[idx] = {
      text: newValue[idx].text.substring(0, splitIndex),
      id: newValue[idx].id
    };
    this.relatedArticles = newValue;
    void this.updateRelatedArticles();
  };

  invertNegativeData = (): void => {
    this.isNegative = !this.isNegative;
    this.savingStatus = SavingStatusState.SAVING;
    void this.doUpdateIsNegativeData();
  };

  validate = (): Section[] => {
    const result: Section[] = [];

    if (this.title.length === 0) {
      result.push('title');
    }
    if (this.summary.length === 0) {
      result.push('summary');
    }
    if (this.experimentGoals.length === 0) {
      result.push('goals');
    }
    if (this.method.length === 0) {
      result.push('method');
    }
    if (this.dataDescription.length === 0) {
      result.push('data_description');
    }
    if (this.fs.rootPathFiles === 0) {
      result.push('files');
    }

    return result;
  };

  setAuthorNames = (): void => {
    const confirmedAuthorNames = this.authors.map<PublicationAuthorName>(
      (author) => ({
        username: author.user?.username,
        firstName: author.firstName,
        lastName: author.lastName,
        ordinal: author.ordinal!
      })
    );
    this.authorNames = confirmedAuthorNames.sort(
      (author1, author2) => author1.ordinal! - author2.ordinal!
    );
  };

  deletePublication = async (publicationId: string): Promise<void> => {
    const response = await publicationService._delete(publicationId);
    if (response.status === 200) {
      routerStore.navigatePage(Page.PROFILE, '/profile/drafts');
    }
  };

  async editPublication(
    publicationEditRequest: PublicationEditRequest
  ): Promise<void> {
    this.characterCount = this.countCharacter();
    publicationEditRequest.characterCount = this.characterCount;
    this.isExceededLimit = this.characterCount > MAX_CHARACTER_COUNT;
    if (this.isExceededLimit && !this.displayLimitSnackbar) {
      this.displayLimitSnackbar = true;
    } else if (!this.isExceededLimit) {
      this.displayLimitSnackbar = false;
    }
    await publicationService.editPublication(
      this.publicationId,
      publicationEditRequest
    );
  }

  private countCharacter(): number {
    let count = 0;
    count += this.title.length;
    count += this.summary.length;
    count += this.experimentGoals.length;
    count += this.negativeData.length;
    count += this.method.length;
    count += this.dataDescription.length;
    count += this.preliminaryResults.length;
    count += this.software.length;
    this.grantingOrganizations.forEach((it) => (count += it.text.length));
    this.relatedArticles.forEach((it) => (count += it.text.length));
    this.primaryArticles.forEach((it) => (count += it.text.length));
    this.tags.forEach((it) => (count += it.length));
    return count;
  }

  private loadInitialState(): void {
    if (!this.publicationId) {
      this.isLoading = false;
      return;
    }

    let method;
    if (authStore.token) {
      method = publicationService.getPublication(this.publicationId);
    } else {
      method = publicationService.getPublicationPublic(this.publicationId);
    }

    method
      .then(
        action((response) => {
          const publication = response.data;
          const mapParagraph = (p: Paragraph): ParagraphWithId => ({
            text: p.text,
            id: uuidv4()
          });
          if (publication.archiveSize) {
            this.archiveSize = publication.archiveSize;
          }
          if (publication.sampleArchiveSize) {
            this.sampleArchiveSize = publication.sampleArchiveSize;
          }
          if (publication.title) {
            this.title = publication.title;
          }
          if (publication.researchAreas) {
            this.researchAreas = publication.researchAreas;
          }
          if (publication.description?.length) {
            this.summary = publication.description;
          }
          if (publication.doiLink?.length) {
            this.doiLink = publication.doiLink;
          }
          if (publication.predictedGoals?.length) {
            this.experimentGoals = publication.predictedGoals;
          }
          if (publication.methodDescription?.length) {
            this.method = publication.methodDescription;
          }
          if (publication.software?.length) {
            this.software = publication.software;
          }
          if (publication.grantOrganizations?.length) {
            this.grantingOrganizations =
              publication.grantOrganizations.map(mapParagraph);
          }
          if (publication.dataDescription?.length) {
            this.dataDescription = publication.dataDescription;
          }
          if (publication.preliminaryResults?.length) {
            this.preliminaryResults = publication.preliminaryResults;
          }
          if (publication.relatedArticles?.length) {
            this.relatedArticles =
              publication.relatedArticles.map(mapParagraph);
          }
          if (publication.primaryArticles?.length) {
            this.primaryArticles =
              publication.primaryArticles.map(mapParagraph);
            if (
              publication.relatedArticles == null ||
              publication.relatedArticles?.length === 0
            ) {
              this.addRelatedArticle(0);
            }
          }
          if (publication.tags?.length) {
            this.tags = new Set(publication.tags.map((p) => p.text));
          }
          if (publication.authors?.length) {
            this.authors = publication.authors || [];
          }
          if (publication.publicationTime) {
            this.publicationTime = new Date(publication.publicationTime);
          }
          if (publication.viewsCount) {
            this.viewsCount = publication.viewsCount;
          }
          if (publication.downloadsCount) {
            this.downloadsCount = publication.downloadsCount;
          }
          if (publication.status) {
            this.publicationStatus = publication.status;
          }
          if (publication.licenseType) {
            this.licenseType = publication.licenseType;
          }
          if (publication.dataCollectionType) {
            this.dataCollectionType = publication.dataCollectionType;
          }
          this.setAuthorNames();

          if (publication.negativeData?.length) {
            this.negativeData = publication.negativeData ?? '';
          }
          this.isNegative = publication.isNegative;
          if (publication.status === PublicationStatus.PENDING) {
            this.viewMode = ViewMode.EDIT;
            this.savingStatus = SavingStatusState.SAVED;
          }
          this.creator = publication.creator;
          this.characterCount = this.countCharacter();
        })
      )
      .finally(
        action(() => {
          this.isLoading = false;
        })
      );
  }
}

export enum SavingStatusState {
  SAVED,
  SAVING,
  PREVIEW
}

export interface PublicationAuthorName {
  username?: string;
  firstName: string;
  lastName: string;
  ordinal: number;
}
