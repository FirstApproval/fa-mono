import { makeAutoObservable } from 'mobx';
import {
  CollaborationMessageType,
  CollaborationRequestMessage,
  Publication,
  UserInfo
} from '../../../apis/first-approval-api';
import { userStore } from '../../../core/user';
import { publicationService } from "../../../core/service"

export class DownloadedPublicationCollaborationChatStore {
  collaborationRequestId: string = '';
  collaborationRequestCreator: UserInfo | undefined = undefined;
  messages: CollaborationRequestMessage[] = [];
  publication?: Publication;

  constructor(publicationId: string) {
    makeAutoObservable(this);

    publicationService.getPublication(publicationId).then(response => {
      this.publication = response.data;
    });
    this.collaborationRequestCreator = userStore.user;
    this.messages = [
      {
        id: '',
        type: CollaborationMessageType.CREATE,
        isAssistant: true,
        text:
          `The dataset "${this.publication?.title}" was downloaded.\n\n` +
          'This dataset was published in open access by the author(s).\n' +
          'If you reuse it in your work, it is enough for you to cite this dataset.'
      }
    ];
  }
}
