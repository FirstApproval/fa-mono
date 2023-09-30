import { makeAutoObservable } from 'mobx';
import {
  EDIT_THROTTLE_MS,
  PublicationStore,
  SavingStatusState
} from '../store/PublicationStore';
import { Paragraph } from '../../../apis/first-approval-api';
import _ from 'lodash';

export class ResearchAreaStore {
  private dialogOpened = false;

  get researchAreas(): Paragraph[] {
    return this.publicationStore.researchAreas;
  }

  get isDialogOpened(): boolean {
    return this.dialogOpened;
  }

  get isInitialized(): boolean {
    return this.publicationStore.researchAreas.length > 0;
  }

  constructor(readonly publicationStore: PublicationStore) {
    makeAutoObservable(this);
  }

  openDialog = (): void => {
    this.dialogOpened = true;
  };

  closeDialog = (): void => {
    this.dialogOpened = false;
  };

  update(newResearchAreas: any[]): void {
    this.publicationStore.researchAreas = newResearchAreas.map((ra) => {
      return {
        text: ra.subcategory
      };
    });
    this.publicationStore.savingStatus = SavingStatusState.SAVING;
    void this.updateRequest();
  }

  private readonly updateRequest = _.throttle(async () => {
    await this.publicationStore.editPublication({
      researchAreas: {
        edited: true,
        values: this.researchAreas
      }
    });
    this.publicationStore.savingStatus = SavingStatusState.SAVED;
  }, EDIT_THROTTLE_MS);
}
