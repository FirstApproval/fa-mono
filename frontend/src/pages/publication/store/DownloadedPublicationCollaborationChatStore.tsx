import { makeAutoObservable } from 'mobx';
import {
  CollaborationMessageType,
  CollaborationRequestMessage,
  Publication,
  UserInfo
} from '../../../apis/first-approval-api';
import { userStore } from '../../../core/user';
import { publicationService } from "../../../core/service"
import { CollaborationChatInterface } from "./CollaborationChatStore"

export class DownloadedPublicationCollaborationChatStore implements CollaborationChatInterface {
  collaborationRequestId: string = '';
  collaborationRequestCreator: UserInfo | undefined = undefined;
  messages: CollaborationRequestMessage[] = [];
  publication?: Publication;
  publicationCreator: UserInfo | undefined = undefined;

  constructor(publicationId: string) {
    makeAutoObservable(this);

    this.collaborationRequestCreator = userStore.user;
    publicationService.getPublication(publicationId).then(response => {
      this.publication = response.data;
      this.publicationCreator = response.data.creator;

      this.messages = [
        {
          type: CollaborationMessageType.CREATE_REQUEST,
          isAssistant: true,
          text:
            `The dataset "${this.publication?.title}" was downloaded.\n\n` +
            'This dataset was published in open access by the author(s).\n' +
            'If you reuse it in your work, it is enough for you to cite this dataset.'
        }
      ]
    });
  }
}
