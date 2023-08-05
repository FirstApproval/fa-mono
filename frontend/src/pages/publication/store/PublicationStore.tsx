import { action, makeAutoObservable, reaction } from 'mobx';
import { publicationService } from '../../../core/service';
import _ from 'lodash';
import {
  type Author,
  type Paragraph,
  PublicationStatus
} from '../../../apis/first-approval-api';
import { type ChonkyFileSystem } from '../../../fire-browser/ChonkyFileSystem';
import { v4 as uuidv4 } from 'uuid';
import { type AddAuthorStore } from './AddAuthorStore';

const EDIT_THROTTLE_MS = 5000;

export type ParagraphWithId = Paragraph & { id: string };

export enum ViewMode {
  EDIT,
  PREVIEW,
  VIEW
}

export class PublicationStore {
  viewMode: ViewMode = ViewMode.VIEW;

  isLoading = true;

  title = '';
  researchArea = '';

  predictedGoalsEnabled = false;
  methodEnabled = false;
  objectOfStudyEnabled = false;
  softwareEnabled = false;
  filesEnabled = false;
  authorsEnabled = false;
  grantingOrganizationsEnabled = false;
  relatedArticlesEnabled = false;
  tagsEnabled = false;

  description: ParagraphWithId[] = [];
  predictedGoals: ParagraphWithId[] = [];
  method: ParagraphWithId[] = [];
  objectOfStudy: ParagraphWithId[] = [];
  software: ParagraphWithId[] = [];
  confirmedAuthors: Author[] = [];
  unconfirmedAuthors: Author[] = [];
  grantingOrganizations: ParagraphWithId[] = [];
  relatedArticles: ParagraphWithId[] = [];
  tags = new Set<string>();

  constructor(readonly publicationId: string, readonly fs: ChonkyFileSystem) {
    makeAutoObservable(this);
    this.addDescriptionParagraph(0);
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

  get authors(): Author[] {
    return [...this.confirmedAuthors, ...this.unconfirmedAuthors];
  }

  addDescriptionParagraph(idx: number): void {
    const newValue = [...this.description];
    newValue.splice(idx + 1, 0, { text: '', id: uuidv4() });
    this.description = newValue;
  }

  addPredictedGoalsParagraph(idx: number): void {
    const newValue = [...this.predictedGoals];
    newValue.splice(idx + 1, 0, { text: '', id: uuidv4() });
    this.predictedGoals = newValue;
  }

  addMethodParagraph(idx: number): void {
    const newValue = [...this.method];
    newValue.splice(idx + 1, 0, { text: '', id: uuidv4() });
    this.method = newValue;
  }

  addObjectOfStudyParagraph(idx: number): void {
    const newValue = [...this.objectOfStudy];
    newValue.splice(idx + 1, 0, { text: '', id: uuidv4() });
    this.objectOfStudy = newValue;
  }

  addSoftwareParagraph(idx: number): void {
    const newValue = [...this.software];
    newValue.splice(idx + 1, 0, { text: '', id: uuidv4() });
    this.software = newValue;
  }

  addGrantingOrganization(idx: number): void {
    const newValue = [...this.grantingOrganizations];
    newValue.splice(idx + 1, 0, { text: '', id: uuidv4() });
    this.grantingOrganizations = newValue;
  }

  addTag(tag: string): void {
    this.tags.add(tag);
    void this.updateTags();
  }

  deleteTag(tag: string): void {
    this.tags.delete(tag);
    void this.updateTags();
  }

  addConfirmedAuthor(author: Author): void {
    const newValue = [...this.confirmedAuthors];
    newValue.push(author);
    this.confirmedAuthors = newValue;
    void this.updateConfirmedAuthors();
  }

  updateConfirmedAuthors = _.throttle(async () => {
    return await publicationService.editPublication(this.publicationId, {
      confirmedAuthors: {
        values: this.confirmedAuthors
          .map((t) => t.id ?? '')
          .filter((id) => id.length > 0),
        edited: true
      }
    });
  }, EDIT_THROTTLE_MS);

  addUnconfirmedAuthor(store: AddAuthorStore): void {
    const newValue = [...this.unconfirmedAuthors];
    newValue.push({
      email: store.email,
      firstName: store.fistName,
      middleName: '',
      lastName: store.lastName,
      shortBio: store.shortBio
    });
    this.unconfirmedAuthors = newValue;
    void this.updateUnconfirmedAuthors();
  }

  updateUnconfirmedAuthors = _.throttle(async () => {
    return await publicationService.editPublication(this.publicationId, {
      unconfirmedAuthors: {
        values: this.unconfirmedAuthors,
        edited: true
      }
    });
  }, EDIT_THROTTLE_MS);

  updateTags = _.throttle(async () => {
    return await publicationService.editPublication(this.publicationId, {
      tags: {
        values: Array.from(this.tags).map((t) => ({ text: t })),
        edited: true
      }
    });
  }, EDIT_THROTTLE_MS);

  updateTitle(title: string): void {
    this.title = title;
    void this.updateTitleRequest();
  }

  updateTitleRequest = _.throttle(async () => {
    const title = this.title;
    return await publicationService.editPublication(this.publicationId, {
      title: {
        value: title,
        edited: true
      }
    });
  }, EDIT_THROTTLE_MS);

  updateResearchArea(researchArea: string): void {
    this.researchArea = researchArea;
    void this.updateResearchAreaRequest();
  }

  updateResearchAreaRequest = _.throttle(async () => {
    const researchArea = this.researchArea;
    return await publicationService.editPublication(this.publicationId, {
      researchArea: {
        value: researchArea,
        edited: true
      }
    });
  }, EDIT_THROTTLE_MS);

  addRelatedArticle(idx: number): void {
    const newValue = [...this.relatedArticles];
    newValue.splice(idx + 1, 0, { text: '', id: uuidv4() });
    this.relatedArticles = newValue;
  }

  updateDescriptionParagraph(idx: number, value: string): void {
    const newValue = [...this.description];
    newValue[idx] = { text: value, id: newValue[idx].id };
    this.description = newValue;
    void this.updateDescription();
  }

  updateDescription = _.throttle(async () => {
    const description: Paragraph[] = this.description.filter(
      (p) => p.text.length > 0
    );

    return await publicationService.editPublication(this.publicationId, {
      description: { values: description, edited: true }
    });
  }, EDIT_THROTTLE_MS);

  updatePredictedGoalsParagraph(idx: number, value: string): void {
    const newValue = [...this.predictedGoals];
    newValue[idx] = { text: value, id: newValue[idx].id };
    this.predictedGoals = newValue;
    void this.updatePredictedGoals();
  }

  updatePredictedGoals = _.throttle(async () => {
    const predictedGoals: Paragraph[] = this.predictedGoals.filter(
      (p) => p.text.length > 0
    );

    return await publicationService.editPublication(this.publicationId, {
      predictedGoals: { values: predictedGoals, edited: true }
    });
  }, EDIT_THROTTLE_MS);

  updateMethodParagraph(idx: number, value: string): void {
    const newValue = [...this.method];
    newValue[idx] = { text: value, id: newValue[idx].id };
    this.method = newValue;
    void this.updateMethod();
  }

  updateMethod = _.throttle(async () => {
    const method: Paragraph[] = this.method.filter((p) => p.text.length > 0);

    return await publicationService.editPublication(this.publicationId, {
      methodDescription: { values: method, edited: true }
    });
  }, EDIT_THROTTLE_MS);

  updateObjectOfStudyParagraph(idx: number, value: string): void {
    const newValue = [...this.objectOfStudy];
    newValue[idx] = { text: value, id: newValue[idx].id };
    this.objectOfStudy = newValue;
    void this.updateObjectOfStudy();
  }

  updateObjectOfStudy = _.throttle(async () => {
    const objectOfStudy: Paragraph[] = this.objectOfStudy.filter(
      (p) => p.text.length > 0
    );

    return await publicationService.editPublication(this.publicationId, {
      objectOfStudyDescription: { values: objectOfStudy, edited: true }
    });
  }, EDIT_THROTTLE_MS);

  updateSoftwareParagraph(idx: number, value: string): void {
    const newValue = [...this.software];
    newValue[idx] = { text: value, id: newValue[idx].id };
    this.software = newValue;
    void this.updateSoftware();
  }

  updateSoftware = _.throttle(async () => {
    const software: Paragraph[] = this.software.filter(
      (p) => p.text.length > 0
    );

    return await publicationService.editPublication(this.publicationId, {
      software: { values: software, edited: true }
    });
  }, EDIT_THROTTLE_MS);

  updateGrantingOrganization(idx: number, value: string): void {
    const newValue = [...this.grantingOrganizations];
    newValue[idx] = { text: value, id: newValue[idx].id };
    this.grantingOrganizations = newValue;
    void this.updateGrantingOrganizations();
  }

  updateGrantingOrganizations = _.throttle(async () => {
    const grantingOrganizations: Paragraph[] =
      this.grantingOrganizations.filter((p) => p.text.length > 0);

    return await publicationService.editPublication(this.publicationId, {
      grantOrganizations: { values: grantingOrganizations, edited: true }
    });
  }, EDIT_THROTTLE_MS);

  updateRelatedArticle(idx: number, value: string): void {
    const newValue = [...this.relatedArticles];
    newValue[idx] = { text: value, id: newValue[idx].id };
    this.relatedArticles = newValue;
    void this.updateRelatedArticles();
  }

  updateRelatedArticles = _.throttle(async () => {
    const relatedArticles: Paragraph[] = this.relatedArticles.filter(
      (p) => p.text.length > 0
    );

    return await publicationService.editPublication(this.publicationId, {
      relatedArticles: { values: relatedArticles, edited: true }
    });
  }, EDIT_THROTTLE_MS);

  private loadInitialState(): void {
    void publicationService
      .getPublication(this.publicationId)
      .then(
        action((response) => {
          const publication = response.data;
          const mapParagraph = (p: Paragraph): ParagraphWithId => ({
            text: p.text,
            id: uuidv4()
          });
          if (publication.title) {
            this.title = publication.title;
          }
          if (publication.researchArea) {
            this.researchArea = publication.researchArea;
          }
          if (publication.description) {
            this.description = publication.description.map(mapParagraph);
          }
          if (publication.predictedGoals?.length) {
            this.predictedGoals = publication.predictedGoals.map(mapParagraph);
            this.predictedGoalsEnabled = true;
          }
          if (publication.methodDescription?.length) {
            this.method = publication.methodDescription.map(mapParagraph);
            this.methodEnabled = true;
          }
          if (publication.software?.length) {
            this.software = publication.software.map(mapParagraph);
            this.softwareEnabled = true;
          }
          if (publication.grantOrganizations?.length) {
            this.grantingOrganizations =
              publication.grantOrganizations.map(mapParagraph);
            this.grantingOrganizationsEnabled = true;
          }
          if (publication.objectOfStudyDescription?.length) {
            this.objectOfStudy =
              publication.objectOfStudyDescription.map(mapParagraph);
            this.objectOfStudyEnabled = true;
          }
          if (publication.relatedArticles?.length) {
            this.relatedArticles =
              publication.relatedArticles.map(mapParagraph);
            this.relatedArticlesEnabled = true;
          }
          if (publication.tags?.length) {
            this.tags = new Set(publication.tags.map((p) => p.text));
            this.tagsEnabled = true;
          }
          if (publication.authors?.length) {
            this.confirmedAuthors = publication.authors.filter((a) => a.id);
            this.unconfirmedAuthors = publication.authors.filter((a) => !a.id);
            this.authorsEnabled = this.confirmedAuthors.length > 1;
          }
          if (this.fs.files.length > 0) {
            this.filesEnabled = true;
          }
          if (publication.status !== PublicationStatus.PUBLISHED) {
            this.viewMode = ViewMode.EDIT;
          }
        })
      )
      .finally(
        action(() => {
          this.isLoading = false;
        })
      );
  }
}
