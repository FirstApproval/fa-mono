import { makeAutoObservable } from 'mobx';
import { collaborationRequestChatService } from '../../../core/service';
import {
  CollaborationMessageType,
  CollaborationRequestMessage,
  CollaborationRequestMessageFile, CollaborationRequestTypeOfWork,
  Publication,
  UserInfo,
  Workplace
} from "../../../apis/first-approval-api"
import { userStore } from "../../../core/user"

export class MyPublicationCollaborationChatStore implements CollaborationChatStoreInterface {
  collaborationRequestId: string = '';
  collaborationRequestCreator: UserInfo | undefined = undefined;
  publicationCreator: UserInfo | undefined = undefined;
  messages: CollaborationRequestMessage[] = [];
  publication?: Publication;
  detailsOfResearch: string | undefined;
  firstName: string | undefined;
  intendedJournalForPublication: string | undefined;
  lastName: string | undefined;
  potentialPublicationName: string | undefined;
  typeOfWork: CollaborationRequestTypeOfWork | undefined;
  workplaces: Workplace[] = [];
  messageType: CollaborationMessageType | undefined = undefined;
  isUploadDraftDialogOpen = false;

  constructor(publicationId: string, stage?: CollaborationMessageType, publication?: Publication) {
    makeAutoObservable(this);
    this.loadInitialState(publicationId);

    // if (stage === CollaborationMessageType.CITATION_IS_ENOUGH) {
    //   this.publication = publication;
    //   this.publicationCreator = publication?.creator;
    //   this.collaborationRequestCreator = userStore.user;
    //   this.messages = [
    //     {
    //       id: '',
    //       type: CollaborationMessageType.CITATION_IS_ENOUGH,
    //       isAssistant: true,
    //       text: `The dataset "${publication?.title}" was downloaded.\n\n` +
    //         'This dataset was published in open access by the author(s).\n' +
    //         'If you reuse it in your work, it is enough for you to cite this dataset.'
    //     }
    //   ]
    // }
  }

  setStage (stage: CollaborationMessageType): void {
    this.messageType = stage;
  }

  sendMessage(message: CollaborationRequestMessage, next?: (CollaborationMessageType | undefined)): Promise<string> {
    return Promise.resolve('');
  }

  existsByType (type: CollaborationMessageType): boolean {
    return this.messages!!.map(message => message.type).includes(type);
  }

  getCollaborationFile (file: CollaborationRequestMessageFile): Promise<void> {
    return Promise.resolve(undefined)
  }

  sendMessages (messages: CollaborationRequestMessage[], nextStage?: CollaborationMessageType | undefined): Promise<CollaborationRequestMessage[]> {
    return Promise.resolve([])
  }

  setIsUploadDraftDialogOpen (open: boolean): void {
    this.isUploadDraftDialogOpen = open;
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

export interface CollaborationChatStoreInterface {
  messageType: CollaborationMessageType | undefined;
  setStage: (stage: CollaborationMessageType) => void;
  sendMessage: (message: CollaborationRequestMessage, next?: (CollaborationMessageType | undefined)) => Promise<string>;
  collaborationRequestId: string;
  collaborationRequestCreator: UserInfo | undefined;
  publicationCreator: UserInfo | undefined;
  messages: CollaborationRequestMessage[] | undefined;
  publication?: Publication;
  firstName?: string;
  lastName?: string;
  workplaces?: Workplace[];
  potentialPublicationName?: string;
  typeOfWork?: CollaborationRequestTypeOfWork;
  intendedJournalForPublication?: string;
  detailsOfResearch?: string;
  isUploadDraftDialogOpen: boolean;
  setIsUploadDraftDialogOpen: (open: boolean) => void;
  sendMessages(
    messages: CollaborationRequestMessage[], nextStage?: CollaborationMessageType | undefined
  ): Promise<CollaborationRequestMessage[]>
  existsByType (type: CollaborationMessageType): boolean;
  getCollaborationFile(file: CollaborationRequestMessageFile): Promise<void>;}
