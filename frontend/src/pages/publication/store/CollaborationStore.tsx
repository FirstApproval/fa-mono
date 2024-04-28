import { action, makeAutoObservable } from 'mobx';
import { collaborationRequestService } from '../../../core/service';
import {
  CollaborationRequestInfo,
  CollaborationRequestStatus
} from '../../../apis/first-approval-api';

export class CollaborationStore {
  collaboratorsDialogOpen = false;
  collaborationRequestDialogOpen = false;
  publicationId: string = '';
  approvedCollaborationRequestCount: number = 0;
  collaborationRequests: CollaborationRequestInfo[] = [];
  collaborationRequest: CollaborationRequestInfo | null = null;
  collaborationRequestsIsLastPage = false;
  authorResponse = '';

  loadCollaborationRequestsLocked = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadCollaborationRequests(page: number): void {
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

  closeCollaborationRequest(): void {
    this.collaborationRequestDialogOpen = false;
    this.collaborationRequest = null;
    this.authorResponse = '';
  }

  openCollaborationRequest(
    collaborationRequest: CollaborationRequestInfo
  ): void {
    this.collaborationRequestDialogOpen = true;
    this.collaborationRequest = collaborationRequest;
  }

  clearAndOpen(
    publicationId: string,
    collaboratorsCount: number | null | undefined
  ): void {
    this.publicationId = '';
    this.approvedCollaborationRequestCount = 0;
    this.collaborationRequests = [];
    this.collaborationRequestsIsLastPage = false;

    this.publicationId = publicationId;
    this.approvedCollaborationRequestCount = collaboratorsCount ?? 0;
    this.collaboratorsDialogOpen = true;
  }

  async acceptOrRejectCollaborationRequest(
    collaborationRequest: CollaborationRequestInfo,
    status: CollaborationRequestStatus
  ): Promise<any> {
    return collaborationRequestService
      .acceptOrRejectCollaborationRequest(
        collaborationRequest.id,
        this.authorResponse,
        status
      )
      .then(() => this.closeCollaborationRequest());
  }
}
