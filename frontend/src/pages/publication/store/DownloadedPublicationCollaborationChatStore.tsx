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

  constructor(publicationId: string) {
    makeAutoObservable(this);

    this.collaborationRequestCreator = userStore.user;
    publicationService.getPublication(publicationId).then(async (response) => {
      this.publication = response.data;
      this.publicationCreator = response.data.creator;

      switch (this.publication.useType) {
        case (UseType.CO_AUTHORSHIP): {
          await this.loadInitialState(publicationId)
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
      // if (collaborationRequestService.getCollaborationRequest())
    });
  }

  private async loadInitialState(publicationId: string): Promise<void> {
    const response = await collaborationRequestChatService.getCollaborationChatByPublicationId(publicationId);
    const data = response.data;
    this.collaborationRequestId = data.collaborationRequestId;
    this.publicationCreator = data.publicationCreator;
    this.collaborationRequestCreator = data.collaborationRequestCreator;
    this.messages = data.messages;
    debugger;
  }
}
