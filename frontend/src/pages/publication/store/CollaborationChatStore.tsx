import { action, makeAutoObservable } from 'mobx';
import { collaborationRequestService } from '../../../core/service';
import {
  CollaborationRequestInfo,
  CollaborationRequestMessage,
  CollaborationRequestStatus,
  CollaborationRequestTypeOfWork,
  PublicationShortInfo
} from "../../../apis/first-approval-api"

export class CollaborationChatStore {
  collaborationRequestId: string;
  collaborationRequest: CollaborationRequestInfo;
  publicationInfo: PublicationShortInfo;
  messages: CollaborationRequestMessage [];

  constructor(collaborationRequestId: string) {
    makeAutoObservable(this);
  }

  private loadInitialState(collaborationRequestId: string): void {
    this.collaborationRequestId = collaborationRequestId;
  }
}
