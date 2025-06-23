import { makeAutoObservable } from 'mobx';
import {
  CollaborationMessageType,
  CollaborationRequestMessage,
  Publication,
  UserInfo
} from '../../../apis/first-approval-api';
import { userStore } from '../../../core/user';

export class NewCollaborationChatStore {
  collaborationRequestId: string = '';
  collaborationRequestCreator: UserInfo | undefined = undefined;
  publicationCreator: UserInfo | undefined = undefined;
  messages: CollaborationRequestMessage[] = [];
  publication?: Publication;

  constructor(collaborationRequestId: string, publication: Publication) {
    makeAutoObservable(this);

    this.publication = publication;
    this.publicationCreator = publication?.creator;
    this.collaborationRequestCreator = userStore.user;
    this.messages = [
      {
        id: '',
        type: CollaborationMessageType.CREATE,
        isAssistant: true,
        text:
          `The dataset "${publication?.title}" was downloaded.\n\n` +
          'This dataset was published in open access by the author(s).\n' +
          'If you reuse it in your work, it is enough for you to cite this dataset.'
      }
    ];
  }
}
