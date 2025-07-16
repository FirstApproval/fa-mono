import { publicationService } from '../../../core/service';
import { forkJoin, from } from 'rxjs';
import {
  PublicationShortInfo,
  PublicationStatus,
  UseType
} from "../../../apis/first-approval-api"
import { makeAutoObservable } from "mobx"
import { routerStore } from "../../../core/router"
import { downloadedPublicationCollaborationChatPath, Page } from "../../../core/router/constants"
import { collaborationsPageStore } from "./downloadsStore"
import { authStore } from "../../../core/auth"

export class CollaborationsPageStore {
  isLoading = false;
  myPublications?: PublicationShortInfo[];
  isLastPageMyPublications = false;
  downloadedPublications?: PublicationShortInfo[];
  openAccessDownloadedPublications: PublicationShortInfo[] = [];
  collaborationRequirementsDownloadedPublications: PublicationShortInfo[] = [];
  isLastPageMyDownloadedPublications = false;
  selectedPublication?: PublicationShortInfo;
  selectedPublicationType?: PublicationType;

  constructor() {
    makeAutoObservable(this);
    authStore.token && this.loadInitialState();
  }

  goToChat(publicationId: string) {
    routerStore.navigatePage(
      Page.DOWNLOADED_PUBLICATION_COLLABORATIONS_CHAT,
      `${downloadedPublicationCollaborationChatPath}/${publicationId}`,
      true
    );
  }

  selectMyPublication(publicationInfo: PublicationShortInfo): void {
    this.selectedPublication = publicationInfo;
    this.selectedPublicationType = PublicationType.MY;
  }

  selectDownloadedPublication(publicationInfo: PublicationShortInfo): void {
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

        this.openAccessDownloadedPublications =
          this.downloadedPublications!!.filter(p => p.useType === UseType.CITATION)
        this.collaborationRequirementsDownloadedPublications =
          this.downloadedPublications!!.filter(p => p.useType === UseType.CO_AUTHORSHIP)

        this.isLoading = false;
      }
    );
  }
}

export enum PublicationType {
  MY = "MY",
  DOWNLOADED = "DOWNLOADED",
}
