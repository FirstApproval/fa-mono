import { action, makeAutoObservable } from 'mobx';
import { publicationService } from '../../../core/service';
import { UserInfo } from '../../../apis/first-approval-api';

export class DownloadersStore {
  open = false;
  publicationId: string = '';
  downloadsCount: number = 0;
  downloaders: UserInfo[] = [];
  downloadersIsLastPage = false;

  loadDownloadersLocked = false;

  constructor() {
    makeAutoObservable(this);
  }

  public loadDownloaders(page: number): void {
    if (!this.loadDownloadersLocked) {
      this.loadDownloadersLocked = true;
      void publicationService
        .getPublicationDownloaders(this.publicationId, page, 15)
        .then(
          action((response) => {
            this.downloaders = [
              ...this.downloaders,
              ...response.data.downloaders
            ];
            this.downloadersIsLastPage = response.data.isLastPage;
            this.loadDownloadersLocked = false;
          })
        );
    }
  }

  public clearAndOpen(
    publicationId: string,
    downloadsCount: number | null | undefined
  ): void {
    this.publicationId = '';
    this.downloadsCount = 0;
    this.downloaders = [];
    this.downloadersIsLastPage = false;

    this.publicationId = publicationId;
    this.downloadsCount = downloadsCount ?? 0;
    this.open = true;
  }
}
