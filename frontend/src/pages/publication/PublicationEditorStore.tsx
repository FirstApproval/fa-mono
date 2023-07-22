import { makeAutoObservable, reaction } from 'mobx';
import { publicationService } from '../../core/service';
import _ from 'lodash';
import {
  type Paragraph,
  type PublicationEditRequest
} from '../../apis/first-approval-api';
import { type ChonkyFileSystem } from '../../fire-browser/ChonkyFileSystem';
import { v4 as uuidv4 } from 'uuid';

const EDIT_THROTTLE_MS = 5000;

export type ParagraphWithId = Paragraph & { id: string };

export class PublicationEditorStore {
  isLoading = false;

  predictedGoalsEnabled = false;
  methodEnabled = false;
  objectOfStudyEnabled = false;
  softwareEnabled = false;
  filesEnabled = false;
  authorsEnabled = false;
  grantingOrganizationsEnabled = false;
  relatedArticlesEnabled = false;
  tagsEnabled = false;

  predictedGoals: ParagraphWithId[] = [];
  method: ParagraphWithId[] = [];
  objectOfStudy = '';
  software: ParagraphWithId[] = [];
  authors = '';
  grantingOrganizations: ParagraphWithId[] = [];
  relatedArticles = '';
  tags = '';

  constructor(readonly publicationId: string, readonly fs: ChonkyFileSystem) {
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
    const request = getRequestStub();
    return await publicationService.editPublication(this.publicationId, {
      ...request,
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
    const request = getRequestStub();
    return await publicationService.editPublication(this.publicationId, {
      ...request,
      methodDescription: { values: method, edited: true }
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
    const request = getRequestStub();
    return await publicationService.editPublication(this.publicationId, {
      ...request,
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
    const request = getRequestStub();
    return await publicationService.editPublication(this.publicationId, {
      ...request,
      grantOrganizations: { values: grantingOrganizations, edited: true }
    });
  }, EDIT_THROTTLE_MS);

  private loadInitialState(): void {
    this.isLoading = true;
    void publicationService
      .getPublication(this.publicationId)
      .then((response) => {
        const publication = response.data;
        if (publication.predictedGoals?.length) {
          this.predictedGoals = publication.predictedGoals.map((p) => ({
            text: p.text,
            id: uuidv4()
          }));
          this.predictedGoalsEnabled = true;
        }
        if (publication.methodDescription?.length) {
          this.method = publication.methodDescription.map((p) => ({
            text: p.text,
            id: uuidv4()
          }));
          this.methodEnabled = true;
        }
        if (publication.software?.length) {
          this.software = publication.software.map((p) => ({
            text: p.text,
            id: uuidv4()
          }));
          this.softwareEnabled = true;
        }
        if (publication.grantOrganizations?.length) {
          this.grantingOrganizations = publication.grantOrganizations.map(
            (p) => ({
              text: p.text,
              id: uuidv4()
            })
          );
          this.grantingOrganizationsEnabled = true;
        }
        if (this.fs.files.length > 0) {
          this.filesEnabled = true;
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}

const getRequestStub = (): PublicationEditRequest => {
  return {
    confirmedAuthors: {
      edited: false,
      values: undefined
    },
    description: {
      edited: false,
      value: ''
    },
    grantOrganizations: {
      edited: false,
      values: undefined
    },
    methodDescription: {
      edited: false,
      values: []
    },
    methodTitle: {
      edited: false,
      value: ''
    },
    objectOfStudyDescription: {
      edited: false,
      values: []
    },
    objectOfStudyTitle: {
      edited: false,
      value: ''
    },
    predictedGoals: {
      edited: false,
      values: []
    },
    relatedArticles: {
      edited: false,
      values: undefined
    },
    software: {
      edited: false,
      values: []
    },
    tags: {
      edited: false,
      values: undefined
    },
    title: {
      edited: false,
      value: ''
    },
    unconfirmedAuthors: {
      edited: false,
      values: undefined
    }
  };
};
