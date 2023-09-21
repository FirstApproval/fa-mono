import { action, makeAutoObservable, reaction } from 'mobx';
import { publicationService } from '../../../core/service';
import _, { some } from 'lodash';
import {
  type ConfirmedAuthor,
  LicenseType,
  type Paragraph,
  PublicationStatus,
  type UnconfirmedAuthor,
  type UserInfo
} from '../../../apis/first-approval-api';
import { type FileSystemFA } from '../../../fire-browser/FileSystemFA';
import { v4 as uuidv4 } from 'uuid';
import { type AuthorEditorStore } from './AuthorEditorStore';
import { routerStore } from '../../../core/router';
import { authStore } from '../../../core/auth';
import { Page, shortPublicationPath } from '../../../core/router/constants';

const EDIT_THROTTLE_MS = 1000;

export type ParagraphWithId = Paragraph & { id: string };
export type Section =
  | 'title'
  | 'summary'
  | 'goals'
  | 'method'
  | 'object_of_study'
  | 'files'
  | 'sample_files'
  | 'tags';

export enum ViewMode {
  EDIT = 'Edit',
  PREVIEW = 'Preview',
  VIEW = 'View'
}

export class PublicationStore {
  viewMode: ViewMode = ViewMode.VIEW;

  isLoading = true;

  title = '';
  researchAreas: Paragraph[] = [];

  creator: UserInfo | undefined;

  summary: ParagraphWithId[] = [];
  savingStatus: SavingStatusState = SavingStatusState.PREVIEW;

  experimentGoals: ParagraphWithId[] = [];
  methodTitle: string = '';
  method: ParagraphWithId[] = [];
  objectOfStudyTitle: string = '';
  objectOfStudy: ParagraphWithId[] = [];
  software: ParagraphWithId[] = [];
  confirmedAuthors: ConfirmedAuthor[] = [];
  unconfirmedAuthors: UnconfirmedAuthor[] = [];
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
  publicationStatus: PublicationStatus | null = null;

  archiveSize: number | null = null;
  sampleArchiveSize: number | null = null;

  viewCounterUpdated: boolean = false;

  constructor(
    readonly publicationId: string,
    private readonly fs: FileSystemFA
  ) {
    makeAutoObservable(this);
    this.addSummaryParagraph(0);
    reaction(
      () => this.fs.initialized,
      (initialized) => {
        if (initialized) {
          this.loadInitialState();
        }
      },
      { fireImmediately: true }
    );
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

  addSummaryParagraph(idx: number): void {
    const newValue = [...this.summary];
    newValue.splice(idx + 1, 0, {
      text: '',
      id: uuidv4()
    });
    this.summary = newValue;
  }

  addExperimentGoalsParagraph(idx: number): void {
    const newValue = [...this.experimentGoals];
    newValue.splice(idx + 1, 0, {
      text: '',
      id: uuidv4()
    });
    this.experimentGoals = newValue;
  }

  addMethodParagraph(idx: number): void {
    const newValue = [...this.method];
    newValue.splice(idx + 1, 0, {
      text: '',
      id: uuidv4()
    });
    this.method = newValue;
  }

  addObjectOfStudyParagraph(idx: number): void {
    const newValue = [...this.objectOfStudy];
    newValue.splice(idx + 1, 0, {
      text: '',
      id: uuidv4()
    });
    this.objectOfStudy = newValue;
  }

  addSoftwareParagraph(idx: number): void {
    const newValue = [...this.software];
    newValue.splice(idx + 1, 0, {
      text: '',
      id: uuidv4()
    });
    this.software = newValue;
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
      if (store.isConfirmed) {
        const confirmedAuthor = this.confirmedAuthors[store.index];
        if (confirmedAuthor.id !== store.id) {
          throw Error('Tried to delete wrong unconfirmed author');
        }
        this.confirmedAuthors.splice(store.index, 1);
        this.savingStatus = SavingStatusState.SAVING;
        void this.updateConfirmedAuthors();
      } else {
        const unconfirmedAuthor = this.unconfirmedAuthors[store.index];
        if (unconfirmedAuthor.id !== store.id) {
          throw Error('Tried to delete wrong unconfirmed author');
        }
        this.unconfirmedAuthors.splice(store.index, 1);
        this.savingStatus = SavingStatusState.SAVING;
        void this.updateUnconfirmedAuthors();
      }
    }
  }

  addConfirmedAuthor(author: UserInfo): void {
    const newValue = [...this.confirmedAuthors];
    newValue.push({
      user: author
    });
    this.confirmedAuthors = newValue;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateConfirmedAuthors();
  }

  editConfirmedAuthor(store: AuthorEditorStore): void {
    if (typeof store.index !== 'undefined') {
      const confirmedAuthor = this.confirmedAuthors[store.index];
      if (confirmedAuthor.id !== store.id) {
        throw Error('Confirmed author found by index have different id');
      }
    }
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateConfirmedAuthors();
  }

  updateConfirmedAuthors = _.throttle(async () => {
    await publicationService.editPublication(this.publicationId, {
      confirmedAuthors: {
        values: this.confirmedAuthors
          .filter((it) => it.user.id && it.user.id.length > 0)
          .map((t) => {
            return {
              id: t.id,
              userId: t.user.id
            };
          }),
        edited: true
      }
    });
    this.setAuthorNames();
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  addOrEditUnconfirmedAuthor(store: AuthorEditorStore): void {
    if (typeof store.index !== 'undefined' && store.index !== null) {
      const unconfirmedAuthor = this.unconfirmedAuthors[store.index];
      if (unconfirmedAuthor.id !== store.id) {
        throw Error('Unconfirmed author found by index have different id');
      }
      unconfirmedAuthor.email = store.email;
      unconfirmedAuthor.firstName = store.firstName;
      unconfirmedAuthor.lastName = store.lastName;
      unconfirmedAuthor.workplaces = store.workplaces;
    } else {
      const newValue = [...this.unconfirmedAuthors];
      newValue.push({
        email: store.email,
        firstName: store.firstName,
        middleName: '',
        lastName: store.lastName,
        workplaces: store.workplaces
      });
      this.unconfirmedAuthors = newValue;
    }
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateUnconfirmedAuthors();
  }

  updateUnconfirmedAuthors = _.throttle(async () => {
    await publicationService.editPublication(this.publicationId, {
      unconfirmedAuthors: {
        values: this.unconfirmedAuthors,
        edited: true
      }
    });
    this.setAuthorNames();
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateTags = _.throttle(async () => {
    await publicationService.editPublication(this.publicationId, {
      tags: {
        values: Array.from(this.tags).map((t) => ({ text: t })),
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  editLicenseType(): void {
    this.savingStatus = SavingStatusState.SAVING;
    void publicationService.editPublication(this.publicationId, {
      licenseType: {
        value: this.licenseType ?? undefined,
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
    await publicationService.editPublication(this.publicationId, {
      title: {
        value: title,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateResearchArea(newResearchAreas: any[]): void {
    this.researchAreas = newResearchAreas.map((ra) => {
      return {
        text: ra.subcategory
      };
    });
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateResearchAreaRequest();
  }

  updateResearchAreaRequest = _.throttle(async () => {
    const researchAreas = this.researchAreas;
    await publicationService.editPublication(this.publicationId, {
      researchAreas: {
        edited: true,
        values: researchAreas
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

  updateSummaryParagraph(idx: number, value: string): void {
    const newValue = [...this.summary];
    newValue[idx] = {
      text: value,
      id: newValue[idx].id
    };
    this.summary = newValue;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateSummary();
  }

  updateSummary = _.throttle(async () => {
    const summary: Paragraph[] = this.summary.filter((p) => p.text.length > 0);

    await publicationService.editPublication(this.publicationId, {
      description: {
        values: summary,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateExperimentGoalsParagraph(idx: number, value: string): void {
    const newValue = [...this.experimentGoals];
    newValue[idx] = {
      text: value,
      id: newValue[idx].id
    };
    this.experimentGoals = newValue;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateExperimentGoals();
  }

  updateExperimentGoals = _.throttle(async () => {
    const predictedGoals: Paragraph[] = this.experimentGoals.filter(
      (p) => p.text.length > 0
    );

    await publicationService.editPublication(this.publicationId, {
      predictedGoals: {
        values: predictedGoals,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateMethodParagraph(idx: number, value: string): void {
    const newValue = [...this.method];
    newValue[idx] = {
      text: value,
      id: newValue[idx].id
    };
    this.method = newValue;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateMethod();
  }

  updateMethod = _.throttle(async () => {
    const method: Paragraph[] = this.method.filter((p) => p.text.length > 0);

    await publicationService.editPublication(this.publicationId, {
      methodDescription: {
        values: method,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateMethodTitle(value: string): void {
    this.methodTitle = value;
    this.savingStatus = SavingStatusState.SAVING;
    void this.doUpdateMethodTitle();
  }

  doUpdateMethodTitle = _.throttle(async () => {
    await publicationService.editPublication(this.publicationId, {
      methodTitle: {
        value: this.methodTitle,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateObjectOfStudyTitle(value: string): void {
    this.objectOfStudyTitle = value;
    this.savingStatus = SavingStatusState.SAVING;
    void this.doUpdateObjectOfStudyTitle();
  }

  doUpdateObjectOfStudyTitle = _.throttle(async () => {
    await publicationService.editPublication(this.publicationId, {
      objectOfStudyTitle: {
        value: this.objectOfStudyTitle,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateObjectOfStudyParagraph(idx: number, value: string): void {
    const newValue = [...this.objectOfStudy];
    newValue[idx] = {
      text: value,
      id: newValue[idx].id
    };
    this.objectOfStudy = newValue;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateObjectOfStudy();
  }

  updateObjectOfStudy = _.throttle(async () => {
    const objectOfStudy: Paragraph[] = this.objectOfStudy.filter(
      (p) => p.text.length > 0
    );

    await publicationService.editPublication(this.publicationId, {
      objectOfStudyDescription: {
        values: objectOfStudy,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  updateSoftwareParagraph(idx: number, value: string): void {
    const newValue = [...this.software];
    newValue[idx] = {
      text: value,
      id: newValue[idx].id
    };
    this.software = newValue;
    this.savingStatus = SavingStatusState.SAVING;
    void this.updateSoftware();
  }

  updateSoftware = _.throttle(async () => {
    const software: Paragraph[] = this.software.filter(
      (p) => p.text.length > 0
    );

    await publicationService.editPublication(this.publicationId, {
      software: {
        values: software,
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

    await publicationService.editPublication(this.publicationId, {
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

    await publicationService.editPublication(this.publicationId, {
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

    await publicationService.editPublication(this.publicationId, {
      relatedArticles: {
        values: relatedArticles,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  doUpdateIsNegativeData = _.throttle(async () => {
    await publicationService.editPublication(this.publicationId, {
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
    await publicationService.editPublication(this.publicationId, {
      negativeData: {
        value: this.negativeData,
        edited: true
      }
    });
    this.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);

  mergeSummaryParagraph = (idx: number): void => {
    if (idx <= 0) return;
    const newValue = [...this.summary];
    newValue[idx - 1] = {
      text: newValue[idx - 1].text + newValue[idx].text,
      id: newValue[idx - 1].id
    };
    newValue.splice(idx, 1);
    this.summary = newValue;
    void this.updateSummary();
  };

  splitSummaryParagraph = (idx: number, splitIndex: number): void => {
    if (idx < 0) return;
    const newValue = [...this.summary];
    const newElement = {
      text: newValue[idx].text.substring(splitIndex),
      id: uuidv4()
    };
    newValue.splice(idx + 1, 0, newElement);
    newValue[idx] = {
      text: newValue[idx].text.substring(0, splitIndex),
      id: newValue[idx].id
    };
    this.summary = newValue;
    void this.updateSummary();
  };

  mergeExperimentGoalsParagraph = (idx: number): void => {
    if (idx <= 0) return;
    const newValue = [...this.experimentGoals];
    newValue[idx - 1] = {
      text: newValue[idx - 1].text + newValue[idx].text,
      id: newValue[idx - 1].id
    };
    newValue.splice(idx, 1);
    this.experimentGoals = newValue;
    void this.updateExperimentGoals();
  };

  splitExperimentGoalsParagraph = (idx: number, splitIndex: number): void => {
    if (idx < 0) return;
    const newValue = [...this.experimentGoals];
    const newElement = {
      text: newValue[idx].text.substring(splitIndex),
      id: uuidv4()
    };
    newValue.splice(idx + 1, 0, newElement);
    newValue[idx] = {
      text: newValue[idx].text.substring(0, splitIndex),
      id: newValue[idx].id
    };
    this.experimentGoals = newValue;
    void this.updateExperimentGoals();
  };

  mergeMethodParagraph = (idx: number): void => {
    if (idx <= 0) return;
    const newValue = [...this.method];
    newValue[idx - 1] = {
      text: newValue[idx - 1].text + newValue[idx].text,
      id: newValue[idx - 1].id
    };
    newValue.splice(idx, 1);
    this.method = newValue;
    void this.updateMethod();
  };

  splitMethodParagraph = (idx: number, splitIndex: number): void => {
    if (idx < 0) return;
    const newValue = [...this.method];
    const newElement = {
      text: newValue[idx].text.substring(splitIndex),
      id: uuidv4()
    };
    newValue.splice(idx + 1, 0, newElement);
    newValue[idx] = {
      text: newValue[idx].text.substring(0, splitIndex),
      id: newValue[idx].id
    };
    this.method = newValue;
    void this.updateMethod();
  };

  mergeObjectOfStudyParagraph = (idx: number): void => {
    if (idx <= 0) return;
    const newValue = [...this.objectOfStudy];
    newValue[idx - 1] = {
      text: newValue[idx - 1].text + newValue[idx].text,
      id: newValue[idx - 1].id
    };
    newValue.splice(idx, 1);
    this.objectOfStudy = newValue;
    void this.updateObjectOfStudy();
  };

  splitObjectOfStudyParagraph = (idx: number, splitIndex: number): void => {
    if (idx < 0) return;
    const newValue = [...this.objectOfStudy];
    const newElement = {
      text: newValue[idx].text.substring(splitIndex),
      id: uuidv4()
    };
    newValue.splice(idx + 1, 0, newElement);
    newValue[idx] = {
      text: newValue[idx].text.substring(0, splitIndex),
      id: newValue[idx].id
    };
    this.objectOfStudy = newValue;
    void this.updateObjectOfStudy();
  };

  mergeSoftwareParagraph = (idx: number): void => {
    if (idx <= 0) return;
    const newValue = [...this.software];
    newValue[idx - 1] = {
      text: newValue[idx - 1].text + newValue[idx].text,
      id: newValue[idx - 1].id
    };
    newValue.splice(idx, 1);
    this.software = newValue;
    void this.updateSoftware();
  };

  splitSoftwareParagraph = (idx: number, splitIndex: number): void => {
    if (idx < 0) return;
    const newValue = [...this.software];
    const newElement = {
      text: newValue[idx].text.substring(splitIndex),
      id: uuidv4()
    };
    newValue.splice(idx + 1, 0, newElement);
    newValue[idx] = {
      text: newValue[idx].text.substring(0, splitIndex),
      id: newValue[idx].id
    };
    this.software = newValue;
    void this.updateSoftware();
  };

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

    const hasContent = (paragraphs: Paragraph[]): boolean => {
      return some(paragraphs, (p) => p.text.length > 0);
    };

    if (this.title.length === 0) {
      result.push('title');
    }
    if (!hasContent(this.summary)) {
      result.push('summary');
    }
    if (!hasContent(this.experimentGoals)) {
      result.push('goals');
    }
    if (this.methodTitle.length === 0) {
      result.push('method');
    }
    if (!hasContent(this.method)) {
      result.push('method');
    }
    if (this.objectOfStudyTitle.length === 0) {
      result.push('object_of_study');
    }
    if (!hasContent(this.objectOfStudy)) {
      result.push('object_of_study');
    }
    if (this.fs.rootPathFiles === 0) {
      result.push('files');
    }

    return result;
  };

  setAuthorNames = (): void => {
    const confirmedAuthorNames =
      this.confirmedAuthors.map<PublicationAuthorName>((author) => ({
        username: author.user.username,
        firstName: author.user.firstName,
        lastName: author.user.lastName
      }));
    const unconfirmedAuthorNames =
      this.unconfirmedAuthors.map<PublicationAuthorName>((author) => ({
        firstName: author.firstName,
        lastName: author.lastName
      }));
    this.authorNames = [...confirmedAuthorNames, ...unconfirmedAuthorNames];
  };

  deletePublication = async (publicationId: string): Promise<void> => {
    const response = await publicationService._delete(publicationId);
    if (response.status === 200) {
      routerStore.navigatePage(Page.PROFILE, '/profile/drafts');
    }
  };

  private loadInitialState(): void {
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
            this.summary = publication.description.map(mapParagraph);
          }
          if (publication.predictedGoals?.length) {
            this.experimentGoals = publication.predictedGoals.map(mapParagraph);
          }
          if (publication.methodTitle?.length) {
            this.methodTitle = publication.methodTitle;
            if (!publication.methodDescription?.length) {
              this.addMethodParagraph(0);
            }
          }
          if (publication.methodDescription?.length) {
            this.method = publication.methodDescription.map(mapParagraph);
          }
          if (publication.software?.length) {
            this.software = publication.software.map(mapParagraph);
          }
          if (publication.grantOrganizations?.length) {
            this.grantingOrganizations =
              publication.grantOrganizations.map(mapParagraph);
          }
          if (publication.objectOfStudyTitle?.length) {
            this.objectOfStudyTitle = publication.objectOfStudyTitle;
            if (!publication.objectOfStudyDescription?.length) {
              this.addObjectOfStudyParagraph(0);
            }
          }
          if (publication.objectOfStudyDescription?.length) {
            this.objectOfStudy =
              publication.objectOfStudyDescription.map(mapParagraph);
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
          if (publication.confirmedAuthors?.length) {
            this.confirmedAuthors = publication.confirmedAuthors || [];
          }
          if (publication.unconfirmedAuthors?.length) {
            this.unconfirmedAuthors = publication.unconfirmedAuthors || [];
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
}
