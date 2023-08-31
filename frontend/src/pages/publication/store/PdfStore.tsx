import { type Publication } from '../../../apis/first-approval-api';
import { makeAutoObservable } from 'mobx';
import { publicationService } from '../../../core/service';

export class PdfStore {
  publication: Publication | undefined;
  constructor(readonly publicationId: string) {
    makeAutoObservable(this);
    void this.loadPublication();
  }

  getAuthors = (): string => {
    const confirmed: string[] | undefined =
      this.publication?.confirmedAuthors?.map((author) => {
        return author.user.firstName + ' ' + author.user.lastName;
      });
    const unconfirmed: string[] | undefined =
      this.publication?.unconfirmedAuthors?.map((author) => {
        return author.firstName + ' ' + author.lastName;
      });
    const allAuthors: string[] = (confirmed ?? []).concat(unconfirmed ?? []);
    return allAuthors.join(', ');
  };

  getPublishDate = (): string | undefined => {
    if (!this.publication?.publicationTime) return;
    return `Published online: ${this.publication?.publicationTime}`;
  };

  private async loadPublication(): Promise<void> {
    try {
      const response = await publicationService.getPublication(
        this.publicationId
      );
      this.publication = response.data ?? null;
    } finally {
      console.log();
    }
  }
}
