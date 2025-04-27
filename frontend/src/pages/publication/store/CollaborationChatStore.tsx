import { makeAutoObservable } from 'mobx';
import { collaborationRequestChatService } from '../../../core/service';
import {
  CollaborationRequestMessage,
  UserInfo
} from '../../../apis/first-approval-api';

export class CollaborationChatStore {
  collaborationRequestId: string = '';
  collaborationRequestCreator: UserInfo | null = null;
  publicationCreator: UserInfo | null = null;
  messages: CollaborationRequestMessage[] = [];

  constructor(collaborationRequestId: string) {
    makeAutoObservable(this);
    this.loadInitialState(collaborationRequestId);
  }

  private loadInitialState(collaborationRequestId: string): void {
    this.collaborationRequestId = collaborationRequestId;
    collaborationRequestChatService
      .getCollaborationChat(collaborationRequestId)
      .then((response) => {
        const data = response.data;
        this.publicationCreator = data.publicationCreator;
        this.collaborationRequestCreator = data.collaborationRequestCreator;
        this.messages = data.messages;
      });
  }
}
