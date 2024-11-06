import { makeAutoObservable } from 'mobx';
import { publicationService, userService } from '../../core/service';
import {
  type Publication,
  PublicationsResponse,
  type UserInfo
} from '../../apis/first-approval-api';
import { authStore } from '../../core/auth';

export class ProfilePageStore {
  isLoadingPublications = false;
  publicationsLastPage = new Map<Tab, boolean>();
  publicationsPageNum = new Map<Tab, number>();
  publications = new Map<Tab, Publication[]>();
  user?: UserInfo;

  constructor(username: string | null) {
    makeAutoObservable(this);

    for (const tab of [Tab.PUBLISHED, Tab.DRAFTS, Tab.DOWNLOADED]) {
      this.publicationsLastPage.set(tab as Tab, false);
      this.publicationsPageNum.set(tab as Tab, 0);
    }

    void this.loadUser(username);
    if (authStore.token) {
      void this.load(Tab.DRAFTS);
      void this.load(Tab.DOWNLOADED);
    }
  }

  public async load(tab: Tab, username?: string): Promise<void> {
    let publicationsData: PublicationsResponse;
    if (tab === Tab.PUBLISHED) {
      publicationsData = (
        await publicationService.getUserPublications(
          username!,
          this.publicationsPageNum.get(tab)!,
          20
        )
      ).data;
    } else if (tab === Tab.DRAFTS) {
      publicationsData = (
        await publicationService.getMyDraftPublications(
          this.publicationsPageNum.get(tab)!,
          20
        )
      ).data;
    } else if (tab === Tab.DOWNLOADED) {
      publicationsData = (
        await publicationService.getMyDownloadedPublications(
          this.publicationsPageNum.get(tab)!,
          20
        )
      ).data;
    } else {
      throw Error('Unexpected tab');
    }

    const newPublicationArray = [
      ...(this.publications.get(tab) ?? []),
      ...(publicationsData.publications ?? [])
    ];
    this.publications.set(tab, newPublicationArray);
    this.publicationsLastPage.set(tab, publicationsData.isLastPage);
    this.publicationsPageNum.set(tab, this.publicationsPageNum.get(tab)! + 1);
  }

  private async loadUser(username: string | null): Promise<void> {
    if (username) {
      const userInfoResponse = await userService.getUserInfoByUsername(
        username
      );
      this.user = userInfoResponse.data;
    }
  }

  deletePublication = async (publicationId: string): Promise<void> => {
    const response = await publicationService._delete(publicationId);
    if (response.status === 200) {
      const newValue = this.publications
        .get(Tab.DRAFTS)!
        .filter((p) => p.id !== publicationId);
      this.publications.set(Tab.DRAFTS, newValue);
    }
  };
}

export enum Tab {
  PUBLISHED = 'PUBLISHED',
  DRAFTS = 'DRAFTS',
  DOWNLOADED = 'DOWNLOADED'
}
