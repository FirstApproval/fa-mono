import { makeAutoObservable } from 'mobx';
import { publicationService, userService } from '../../core/service';
import {
  type Publication,
  PublicationStatus,
  type UserInfo
} from '../../apis/first-approval-api';
import { userStore } from '../../core/user';
import { routerStore } from '../../core/router';
import { Page } from '../../core/RouterStore';

export class ProfilePageStore {
  isLoadingPublications = false;
  publicationsLastPage = new Map<PublicationStatus, boolean>();
  publicationsPageNum = new Map<PublicationStatus, number>();
  publications = new Map<PublicationStatus, Publication[]>();
  user?: UserInfo;

  constructor(username: string | null) {
    makeAutoObservable(this);
    void this.loadUser(username);
    this.isLoadingPublications = true;
    try {
      const statuses = username
        ? [PublicationStatus.PUBLISHED]
        : [PublicationStatus.PUBLISHED, PublicationStatus.PENDING];
      for (const status of statuses) {
        this.publicationsLastPage.set(status, false);
        this.publicationsPageNum.set(status, 0);
        void this.load(username, status);
      }
    } finally {
      this.isLoadingPublications = false;
    }
  }

  public async load(
    username: string | null,
    status: PublicationStatus
  ): Promise<void> {
    const publicationsResponse = username
      ? await publicationService.getUserPublications(
          username,
          status,
          this.publicationsPageNum.get(status)!,
          20
        )
      : await publicationService.getMyPublications(
          status,
          this.publicationsPageNum.get(status)!,
          20
        );
    const publicationsData = publicationsResponse.data;
    const newPublicationArray = [
      ...(this.publications.get(status) ?? []),
      ...(publicationsData.publications ?? [])
    ];
    this.publications.set(status, newPublicationArray);
    this.publicationsLastPage.set(status, publicationsData.isLastPage);
    this.publicationsPageNum.set(
      status,
      this.publicationsPageNum.get(status)! + 1
    );
  }

  private async loadUser(username: string | null): Promise<void> {
    if (username) {
      const userInfoResponse = await userService.getUserInfoByUsername(
        username
      );
      this.user = userInfoResponse.data;
    } else {
      this.user = userStore.user;
    }
  }

  createPublication = async (): Promise<void> => {
    const response = await publicationService.createPublication();
    const pub: string = response.data.id;
    routerStore.navigatePage(Page.PUBLICATION, `/publication/${pub}`);
  };

  deletePublication = async (publicationId: string): Promise<void> => {
    const response = await publicationService._delete(publicationId);
    if (response.status === 200) {
      const newValue = this.publications
        .get(PublicationStatus.PENDING)!
        .filter((p) => p.id !== publicationId);
      this.publications.set(PublicationStatus.PENDING, newValue);
    }
  };
}
