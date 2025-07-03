import { makeAutoObservable } from 'mobx';
import {
  CollaborationMessageType,
  CollaborationRequestMessage,
  Publication,
  UserInfo,
  UseType
} from "../../../apis/first-approval-api"
import { userStore } from '../../../core/user';
import {
  collaborationRequestChatService,
  publicationService
} from '../../../core/service';
import { CollaborationChatInterface } from './CollaborationChatStore';

export class DownloadedPublicationCollaborationChatStore
  implements CollaborationChatInterface
{
  collaborationRequestId: string = '';
  collaborationRequestCreator: UserInfo | undefined = undefined;
  messages: CollaborationRequestMessage[] | undefined = undefined;
  publication?: Publication;
  publicationCreator: UserInfo | undefined = undefined;
  stage: CollaborationMessageType | undefined = undefined;

  constructor(publicationId: string) {
    makeAutoObservable(this);

    this.collaborationRequestCreator = userStore.user;
    publicationService.getPublication(publicationId).then(response => {
      this.publication = response.data;
      this.publicationCreator = response.data.creator;

      switch (this.publication.useType) {
        case (UseType.CO_AUTHORSHIP): {
          collaborationRequestChatService
            .getCollaborationChatByPublicationId(publicationId)
            .then((response) => {
              const data = response.data;
              this.collaborationRequestId = data.collaborationRequestId;
              this.publicationCreator = data.publicationCreator;
              this.collaborationRequestCreator = data.collaborationRequestCreator;
              this.messages = data.messages;

              debugger;
              this.stage = data.messages.reduce((max, item) =>
                item.sequenceIndex!! > max.sequenceIndex!! ? item : max
              ).type;
              debugger;
            });
          break;
        }
        case (UseType.CITATION): {
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
          break;
        }
      }
    });
  }

  sendMessage(collaborationRequestMessage: CollaborationRequestMessage, nextStage: CollaborationMessageType | undefined = undefined): void {
    collaborationRequestChatService.createCollaborationRequestMessage(
      this.publication!!.id,
      collaborationRequestMessage
    ).then(response => {
      this.messages!!.push(response.data)
      nextStage && this.setStage(nextStage);
    });
  }

  setStage (stage: CollaborationMessageType): void {
    this.stage = stage;
  }
}
