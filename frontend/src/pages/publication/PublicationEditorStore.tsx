import { makeAutoObservable } from 'mobx';
import { publicationService } from '../../core/service';
import _ from 'lodash';
import { type PublicationEditRequest } from '../../apis/first-approval-api';

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

  predictedGoals = '';
  method = '';
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

  updatePredictedGoals = _.throttle(async (predictedGoals: string) => {
    const request = getRequestStub();
    return publicationService.editPublication(this.publicationId, {
      ...request,
      predictedGoals: { value: predictedGoals, edited: true }
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
      value: ''
    },
    methodTitle: {
      edited: false,
      value: ''
    },
    objectOfStudyDescription: {
      edited: false,
      value: ''
    },
    objectOfStudyTitle: {
      edited: false,
      value: ''
    },
    predictedGoals: {
      edited: false,
      value: ''
    },
    relatedArticles: {
      edited: false,
      values: undefined
    },
    software: {
      edited: false,
      value: ''
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
