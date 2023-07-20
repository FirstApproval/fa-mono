import { makeAutoObservable } from 'mobx';
import { publicationService } from '../../core/service';
import _ from 'lodash';
import {
  type Paragraph,
  type PublicationEditRequest
} from '../../apis/first-approval-api';

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
  software = '';
  authors = '';
  grantingOrganizations = '';
  relatedArticles = '';
  tags = '';

  constructor(readonly publicationId: string) {
    makeAutoObservable(this);
    this.loadInitialState();
  }

  addPredictedGoal(): void {
    const newValue = [...this.predictedGoals];
    newValue.push({ text: '' });
    this.predictedGoals = newValue;
  }

  addMethod(): void {
    const newValue = [...this.method];
    newValue.push({ text: '' });
    this.method = newValue;
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

  private loadInitialState(): void {
    this.isLoading = true;
    void publicationService
      .getPublication(this.publicationId)
      .then((response) => {
        const publication = response.data;
        if (publication.predictedGoals) {
          this.predictedGoals = publication.predictedGoals;
          this.predictedGoalsEnabled = true;
        }
        if (publication.methodDescription) {
          this.method = publication.methodDescription;
          this.methodEnabled = true;
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
