import { makeAutoObservable } from 'mobx';

export class PublicationEditorStore {
  predictedGoalsEnabled = false;
  methodEnabled = false;
  objectOfStudyEnabled = false;
  softwareEnabled = false;
  filesEnabled = false;
  authorsEnabled = false;
  grantingOrganizationsEnabled = false;
  relatedArticlesEnabled = false;
  tagsEnabled = false;

  constructor() {
    makeAutoObservable(this);
  }
}
