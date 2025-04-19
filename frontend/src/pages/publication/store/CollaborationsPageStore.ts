import { publicationService } from '../../../core/service';
import { forkJoin, from } from 'rxjs';
import {
  PublicationShortInfo,
  PublicationStatus
} from "../../../apis/first-approval-api"
import { action, makeAutoObservable } from "mobx"

export class CollaborationsPageStore {
  isLoading = false;
  myPublications?: PublicationShortInfo[];
  isLastPageMyPublications = false;
  downloadedPublications?: PublicationShortInfo[];
  isLastPageMyDownloadedPublications = false;

  constructor() {
    makeAutoObservable(this);
    this.loadInitialState();
  }

  private loadInitialState(): void {
    forkJoin(
      publicationService.getMyPublicationsShortInfo(0, 100, [PublicationStatus.PUBLISHED]),
      publicationService.getMyDownloadedPublications(0, 100)
    ).subscribe(([myPublicationsResponse, myDownloadedPublicationsResponse]) => {
      this.myPublications = myPublicationsResponse.data.publications;
      this.isLastPageMyPublications = myPublicationsResponse.data.isLastPage;
      this.downloadedPublications = myDownloadedPublicationsResponse.data.publications;
      this.isLastPageMyDownloadedPublications = myDownloadedPublicationsResponse.data.isLastPage;
      debugger;
      this.isLoading = false;
    })
  }
}
