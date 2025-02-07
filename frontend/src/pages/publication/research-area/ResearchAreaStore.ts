import { makeAutoObservable } from 'mobx';
import {
  EDIT_THROTTLE_MS,
  PublicationStore,
  SavingStatusState
} from '../store/PublicationStore';
import { Paragraph } from '../../../apis/first-approval-api';
import _ from 'lodash';
import {
  ResearchAreaElement,
  researchAreaElementsWithParent
} from './ResearchAreas';

export class ResearchAreaStore {
  private dialogOpened = false;

  get researchAreas(): Paragraph[] {
    return this.publicationStore.researchAreas;
  }

  get isStudentDataCollection(): boolean {
    return this.publicationStore.isStudentDataCollection;
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

  isElementSelected(element: ResearchAreaElement): boolean {
    return this.publicationStore.researchAreas.some(
      (ra) => ra.text === element.text
    );
  }

  check(element: ResearchAreaElement): void {
    this.publicationStore.savingStatus = SavingStatusState.SAVING;
    this.isElementSelected(element)
      ? this.unselectElement(element)
      : this.selectElement(element);
    void this.updateRequest();
  }

  private selectElement(element: ResearchAreaElement): void {
    this.publicationStore.researchAreas.push({ text: element.text });
  }

  private unselectElement(element: ResearchAreaElement): void {
    researchAreaElementsWithParent(element.text, this.isStudentDataCollection).forEach((child) => {
      this.unselectElement(child);
    });
    this.publicationStore.researchAreas =
      this.publicationStore.researchAreas.filter(
        (ra) => ra.text !== element.text
      );
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
