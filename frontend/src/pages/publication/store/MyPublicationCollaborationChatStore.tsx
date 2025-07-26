import { makeAutoObservable } from 'mobx';
import { collaborationRequestChatService, publicationService } from "../../../core/service"
import {
  Author,
  CollaborationMessageType,
  CollaborationRequestMessage,
  CollaborationRequestMessageFile, CollaborationRequestTypeOfWork,
  Publication,
  UserInfo,
  Workplace
} from "../../../apis/first-approval-api"

export class MyPublicationCollaborationChatStore implements CollaborationChatStoreInterface {
  collaborationRequestId: string = '';
  collaborationRequestCreator: UserInfo | undefined = undefined;
  publicationCreator: UserInfo | undefined = undefined;
  messages: CollaborationRequestMessage[] = [];
  publication?: Publication;
  publicationCreatorAuthor?: Author;
  detailsOfResearch: string | undefined;
  firstName: string | undefined;
  intendedJournalForPublication: string | undefined;
  lastName: string | undefined;
  potentialPublicationName: string | undefined;
  typeOfWork: CollaborationRequestTypeOfWork | undefined;
  workplaces: Workplace[] = [];
  messageType: CollaborationMessageType | undefined = undefined;
  isUploadDraftDialogOpen = false;

  constructor(collaborationRequestId: string, stage?: CollaborationMessageType) {
    makeAutoObservable(this);
    this.loadInitialState(collaborationRequestId);

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

  getCollaborationAgreementFile(authorId: string): Promise<void> {
    return collaborationRequestChatService.getCollaborationRequestAgreement(
      this.publication!!.id,
      this.collaborationRequestId,
      authorId,
      { responseType: 'blob' }
    ).then(response => {
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FA_Collaboration_Agreement_${this.publication!!.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  private loadInitialState(collaborationId: string): void {
    collaborationRequestChatService.getCollaborationChatById(collaborationId)
      .then((response) => {
        const data = response.data;
        this.collaborationRequestId = data.collaborationRequestId;
        this.publicationCreator = data.publicationCreator;
        this.collaborationRequestCreator = data.collaborationRequestCreator;
        data.messages.sort(this.sortMessages)
        this.messages = data.messages;
        this.messages = data.messages;
        this.messageType = data.messages.reduce((max, item) =>
          item.sequenceIndex!! > max.sequenceIndex!! ? item : max
        ).type;
        publicationService.getPublication(data.publicationId!!).then(response => {
          this.publication = response.data;
          this.publicationCreatorAuthor = response.data.authors
            ?.find(author => author.user!!.id === this.publicationCreator!!.id)
        });
      });
  }

  sortMessages = (message1: CollaborationRequestMessage, message2: CollaborationRequestMessage) =>
    message1.sequenceIndex!! - message2.sequenceIndex!!
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
  publicationCreatorAuthor?: Author;
  intendedJournalForPublication?: string;
  detailsOfResearch?: string;
  isUploadDraftDialogOpen: boolean;
  setIsUploadDraftDialogOpen: (open: boolean) => void;
  sendMessages(
    messages: CollaborationRequestMessage[], nextStage?: CollaborationMessageType | undefined
  ): Promise<CollaborationRequestMessage[]>
  existsByType (type: CollaborationMessageType): boolean;
  getCollaborationFile(file: CollaborationRequestMessageFile): Promise<void>;
  getCollaborationAgreementFile(authorId: string, fileName: string): Promise<void>;
}
