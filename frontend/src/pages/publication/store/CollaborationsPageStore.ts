import { publicationService } from '../../../core/service';
import { forkJoin, from } from 'rxjs';
import {
  PublicationShortInfo,
  PublicationStatus
} from "../../../apis/first-approval-api"
import { makeAutoObservable } from "mobx"
import { routerStore } from "../../../core/router"
import { newCollaborationChatPath, Page } from "../../../core/router/constants"
import { collaborationsPageStore } from "./downloadsStore"

export class CollaborationsPageStore {
  isLoading = false;
  myPublications?: PublicationShortInfo[];
  isLastPageMyPublications = false;
  downloadedPublications?: PublicationShortInfo[];
  isLastPageMyDownloadedPublications = false;
  selectedPublication?: PublicationShortInfo;
  selectedPublicationType?: PublicationType;

  constructor() {
    makeAutoObservable(this);
    this.loadInitialState();
  }

  goToChat(publicationId: string) {
    routerStore.navigatePage(
      Page.NEW_COLLABORATIONS_CHAT,
      `${newCollaborationChatPath}/${publicationId}`,
      true
    );
  }

  selectMyPublication(publicationInfo: PublicationShortInfo): void {
    this.selectedPublication = publicationInfo;
    this.selectedPublicationType = PublicationType.MY;
  }

  selectDownloadedPublication(publicationInfo: PublicationShortInfo): void {
    // this.selectedPublication = publicationInfo;
    // this.selectedPublicationType = PublicationType.DOWNLOADED;
    collaborationsPageStore.goToChat(publicationInfo.id!!);
  }

  private loadInitialState(): void {
    forkJoin(
      publicationService.getMyPublicationsShortInfo(0, 100, [
        PublicationStatus.PUBLISHED
      ]),
      publicationService.getMyDownloadedPublications(0, 100)
    ).subscribe(
      ([myPublicationsResponse, myDownloadedPublicationsResponse]) => {
        this.myPublications = myPublicationsResponse.data.publications;
        this.isLastPageMyPublications = myPublicationsResponse.data.isLastPage;
        this.downloadedPublications =
          myDownloadedPublicationsResponse.data.publications;
        this.isLastPageMyDownloadedPublications =
          myDownloadedPublicationsResponse.data.isLastPage;
        debugger;
        this.isLoading = false;
      }
    );
  }
}

export enum PublicationType {
  MY = "MY",
  DOWNLOADED = "DOWNLOADED",
}
