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

  constructor(collaborationRequestId: string, stage?: CollaborationMessageType, publication?: Publication) {
    makeAutoObservable(this);

    if (stage === CollaborationMessageType.CREATE_REQUEST) {
      this.publication = publication;
      this.publicationCreator = publication?.creator;
      this.collaborationRequestCreator = userStore.user;
      this.messages = [
        {
          id: '',
          type: CollaborationMessageType.CREATE_REQUEST,
          isAssistant: true,
          text: `The dataset "${publication?.title}" was downloaded.\n\n` +
            'This dataset was published in open access by the author(s).\n' +
            'If you reuse it in your work, it is enough for you to cite this dataset.'
        }
      ]
    } else {
      this.loadInitialState(collaborationRequestId);
    }
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

export interface CollaborationChatInterface {
  collaborationRequestId: string;
  collaborationRequestCreator: UserInfo | undefined;
  publicationCreator: UserInfo | undefined;
  messages: CollaborationRequestMessage[];
  publication?: Publication;
}
