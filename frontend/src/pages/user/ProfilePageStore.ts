import { makeAutoObservable, observable } from 'mobx';
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
    makeAutoObservable(this, {
      publicationsLastPage: observable,
      publicationsPageNum: observable,
      publications: observable,
      user: observable
    });
    void this.loadUser(username);
    this.isLoadingPublications = true;
    try {
      for (const status of [
        PublicationStatus.PENDING,
        PublicationStatus.PUBLISHED
      ]) {
        this.publicationsLastPage.set(status, false);
        this.publicationsPageNum.set(status, 0);
        void this.load(status);
      }
    } finally {
      this.isLoadingPublications = false;
    }
  }

  public async load(status: PublicationStatus): Promise<void> {
    const publicationsResponse = await publicationService.getMyPublications(
      status,
      this.publicationsPageNum.get(status)!,
      25
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
}
