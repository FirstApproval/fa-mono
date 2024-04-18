import { action, makeAutoObservable } from 'mobx';
import { collaborationRequestService } from '../../../core/service';
import { CollaborationRequestInfo } from '../../../apis/first-approval-api';

export class CollaborationStore {
  open = false;
  publicationId: string = '';
  collaboratorsCount: number = 0;
  collaborationRequests: CollaborationRequestInfo[] = [];
  collaborationRequestsIsLastPage = false;

  loadCollaborationRequestsLocked = false;

  constructor() {
    makeAutoObservable(this);
  }

  public loadCollaborationRequests(page: number): void {
    if (!this.loadCollaborationRequestsLocked) {
      this.loadCollaborationRequestsLocked = true;
      void collaborationRequestService
        .getCollaborationRequests(this.publicationId, page, 15)
        .then(
          action((response) => {
            this.collaborationRequests = [
              ...this.collaborationRequests,
              ...(response.data.collaborationRequests ?? [])
            ];
            this.collaborationRequestsIsLastPage = response.data.isLastPage;
            this.loadCollaborationRequestsLocked = false;
          })
        );
    }
  }

  public clearAndOpen(
    publicationId: string,
    collaboratorsCount: number | null | undefined
  ): void {
    this.publicationId = '';
    this.collaboratorsCount = 0;
    this.collaborationRequests = [];
    this.collaborationRequestsIsLastPage = false;

    this.publicationId = publicationId;
    this.collaboratorsCount = collaboratorsCount ?? 0;
    this.open = true;
  }
}
