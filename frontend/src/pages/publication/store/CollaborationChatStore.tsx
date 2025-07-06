import { makeAutoObservable } from 'mobx';
import { collaborationRequestChatService } from '../../../core/service';
import {
  CollaborationMessageType,
  CollaborationRequestMessage, Publication,
  UserInfo
} from "../../../apis/first-approval-api"
import { userStore } from "../../../core/user"

export class CollaborationChatStore implements CollaborationChatInterface {
  collaborationRequestId: string = '';
  collaborationRequestCreator: UserInfo | undefined = undefined;
  publicationCreator: UserInfo | undefined = undefined;
  messages: CollaborationRequestMessage[] = [];
  publication?: Publication;
  messageType: CollaborationMessageType | undefined = undefined;

  constructor(publicationId: string, stage?: CollaborationMessageType, publication?: Publication) {
    makeAutoObservable(this);
    // this.loadInitialState(publicationId);

    if (stage === CollaborationMessageType.CITATION_IS_ENOUGH) {
      this.publication = publication;
      this.publicationCreator = publication?.creator;
      this.collaborationRequestCreator = userStore.user;
      this.messages = [
        {
          id: '',
          type: CollaborationMessageType.CITATION_IS_ENOUGH,
          isAssistant: true,
          text: `The dataset "${publication?.title}" was downloaded.\n\n` +
            'This dataset was published in open access by the author(s).\n' +
            'If you reuse it in your work, it is enough for you to cite this dataset.'
        }
      ]
    }
  }

  setStage (stage: CollaborationMessageType): void {
    this.messageType = stage;
  }

  sendMessage(message: CollaborationRequestMessage, next?: (CollaborationMessageType | undefined)): void {
  }

  private loadInitialState(publicationId: string): void {
    collaborationRequestChatService
      .getCollaborationChatByPublicationId(publicationId)
      .then((response) => {
        const data = response.data;
        this.collaborationRequestId = data.collaborationRequestId;
        this.publicationCreator = data.publicationCreator;
        this.collaborationRequestCreator = data.collaborationRequestCreator;
        this.messages = data.messages;
      });
  }
}

export interface CollaborationChatInterface {
  messageType: CollaborationMessageType | undefined;
  setStage: (stage: CollaborationMessageType) => void;
  sendMessage: (message: CollaborationRequestMessage, next?: (CollaborationMessageType | undefined)) => void;
  collaborationRequestId: string;
  collaborationRequestCreator: UserInfo | undefined;
  publicationCreator: UserInfo | undefined;
  messages: CollaborationRequestMessage[] | undefined;
  publication?: Publication;
  // userActionsRegistry: UserActionsRegistry;
}
