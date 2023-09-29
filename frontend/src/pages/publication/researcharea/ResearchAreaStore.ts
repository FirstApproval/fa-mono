import { makeAutoObservable } from 'mobx';

export class ResearchAreaStore {
  private researchAreasDialogOpen = false;

  get isResearchAreasDialogOpen(): boolean {
    return this.researchAreasDialogOpen;
  }

  constructor() {
    makeAutoObservable(this);
  }

  openResearchAreasModal = (): void => {
    this.researchAreasDialogOpen = true;
  };

  closeResearchAreasModal = (): void => {
    this.researchAreasDialogOpen = false;
  };
}
