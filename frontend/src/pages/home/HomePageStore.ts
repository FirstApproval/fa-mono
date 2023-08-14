import { makeAutoObservable } from 'mobx';
import { publicationService } from '../../core/service';
import {
  type Publication,
  PublicationStatus
} from '../../apis/first-approval-api';

export class HomePageStore {
  isLoading = false;
  publications: Publication[] = [];
  constructor() {
    makeAutoObservable(this);
    void this.loadPublications();
  }

  private async loadPublications(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await publicationService.getMyPublications(
        PublicationStatus.PENDING,
        0,
        100
      );
      this.publications = response.data.publications ?? [];
    } finally {
      this.isLoading = false;
    }
  }
}
