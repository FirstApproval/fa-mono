import { makeAutoObservable, reaction } from 'mobx';
import { publicationService } from '../../core/service';
import _ from 'lodash';
import {
  type Paragraph,
  type PublicationEditRequest
} from '../../apis/first-approval-api';
import { type ChonkyFileSystem } from '../../fire-browser/ChonkyFileSystem';

const EDIT_THROTTLE_MS = 5000;

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

  predictedGoals: Paragraph[] = [];
  method: Paragraph[] = [];
  objectOfStudy = '';
  software: Paragraph[] = [];
  authors = '';
  grantingOrganizations: Paragraph[] = [];
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

  addPredictedGoalsParagraph(): void {
    const newValue = [...this.predictedGoals];
    newValue.push({ text: '' });
    this.predictedGoals = newValue;
  }

  addMethodParagraph(): void {
    const newValue = [...this.method];
    newValue.push({ text: '' });
    this.method = newValue;
  }

  addSoftwareParagraph(): void {
    const newValue = [...this.software];
    newValue.push({ text: '' });
    this.software = newValue;
  }

  addGrantingOrganization(): void {
    const newValue = [...this.grantingOrganizations];
    newValue.push({ text: '' });
    this.grantingOrganizations = newValue;
  }

  updatePredictedGoalsParagraph(idx: number, value: string): void {
    const newValue = [...this.predictedGoals];
    newValue[idx] = { text: value };
    this.predictedGoals = newValue;
    void this.updatePredictedGoals();
  }

  updatePredictedGoals = _.throttle(async () => {
    const predictedGoals: Paragraph[] = this.predictedGoals;
    const request = getRequestStub();
    return await publicationService.editPublication(this.publicationId, {
      ...request,
      predictedGoals: { values: predictedGoals, edited: true }
    });
  }, EDIT_THROTTLE_MS);

  updateMethodParagraph(idx: number, value: string): void {
    const newValue = [...this.method];
    newValue[idx] = { text: value };
    this.method = newValue;
    void this.updateMethod();
  }

  updateMethod = _.throttle(async () => {
    const method: Paragraph[] = this.method;
    const request = getRequestStub();
    return await publicationService.editPublication(this.publicationId, {
      ...request,
      methodDescription: { values: method, edited: true }
    });
  }, EDIT_THROTTLE_MS);

  updateSoftwareParagraph(idx: number, value: string): void {
    const newValue = [...this.software];
    newValue[idx] = { text: value };
    this.software = newValue;
    void this.updateSoftware();
  }

  updateSoftware = _.throttle(async () => {
    const software: Paragraph[] = this.software;
    const request = getRequestStub();
    return await publicationService.editPublication(this.publicationId, {
      ...request,
      software: { values: software, edited: true }
    });
  }, EDIT_THROTTLE_MS);

  updateGrantingOrganization(idx: number, value: string): void {
    const newValue = [...this.grantingOrganizations];
    newValue[idx] = { text: value };
    this.grantingOrganizations = newValue;
    void this.updateGrantingOrganizations();
  }

  updateGrantingOrganizations = _.throttle(async () => {
    const grantingOrganizations: Paragraph[] = this.grantingOrganizations;
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
          this.predictedGoals = publication.predictedGoals;
          this.predictedGoalsEnabled = true;
        }
        if (publication.methodDescription?.length) {
          this.method = publication.methodDescription;
          this.methodEnabled = true;
        }
        if (publication.software?.length) {
          this.software = publication.software;
          this.softwareEnabled = true;
        }
        if (publication.grantOrganizations?.length) {
          this.grantingOrganizations = publication.grantOrganizations;
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
