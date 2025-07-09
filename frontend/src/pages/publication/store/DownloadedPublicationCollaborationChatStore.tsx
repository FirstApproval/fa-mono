import { makeAutoObservable } from 'mobx';
import {
  CollaborationMessageType,
  CollaborationRequestMessage, CollaborationRequestTypeOfWork,
  Publication,
  UserInfo,
  UseType,
  Workplace
} from "../../../apis/first-approval-api"
import { userStore } from '../../../core/user';
import {
  collaborationRequestChatService,
  publicationService
} from '../../../core/service';
import { CollaborationChatInterface } from './CollaborationChatStore';
import { cloneDeep } from "lodash"
import { IWorkplaceStore, WorkplaceProps, WorkplaceValidationState } from "../../../core/WorkplaceProps"

export class DownloadedPublicationCollaborationChatStore implements CollaborationChatInterface, IWorkplaceStore {
  collaborationRequestId: string = '';
  collaborationRequestCreator: UserInfo | undefined = undefined;
  messages: CollaborationRequestMessage[] | undefined = undefined;
  existingMessageTypes: CollaborationMessageType[] | undefined = undefined;
  publication?: Publication;
  publicationCreator: UserInfo | undefined = undefined;
  messageType: CollaborationMessageType | undefined = undefined;

  workplaces: Workplace[] = [];
  workplacesProps: WorkplaceProps[] = [];
  workplacesValidation: WorkplaceValidationState[] = [];
  firstName: string | undefined;
  lastName: string | undefined;

  potentialPublicationName: string | undefined;
  typeOfWork: CollaborationRequestTypeOfWork | undefined;
  expectedPublicationDate: string | undefined;
  intendedJournalForPublication: string | undefined;
  detailsOfResearch: string | undefined;

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

              this.workplaces = cloneDeep(this.collaborationRequestCreator.workplaces)
              this.workplaces?.forEach((w) => {
                this.workplacesProps.push({
                  orgQuery: w.organization?.name ?? '',
                  organizationOptions: []
                });
                this.workplacesValidation.push({
                  isValidOrganization: !!w.organization
                });
              });
              this.firstName = this.collaborationRequestCreator.firstName;
              this.lastName = this.collaborationRequestCreator.lastName;

              data.messages.sort(this.sortMessages)
              this.messages = data.messages;

              this.messageType = data.messages.reduce((max, item) =>
                item.sequenceIndex!! > max.sequenceIndex!! ? item : max
              ).type;
            });
          break;
        }
        case (UseType.CITATION): {
          this.messages = [
            {
              type: CollaborationMessageType.CITATION_IS_ENOUGH,
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

  sendMessage(message: CollaborationRequestMessage, nextStage: CollaborationMessageType | undefined = undefined): Promise<void> {
    return collaborationRequestChatService.createCollaborationRequestMessage(
      this.publication!!.id,
      message
    ).then(response => {
      this.messages!!.push(response.data);
      this.messages!!.sort(this.sortMessages);
      nextStage && this.setStage(nextStage);
    });
  }

  sortMessages = (message1: CollaborationRequestMessage, message2: CollaborationRequestMessage) =>
    message1.sequenceIndex!! - message2.sequenceIndex!!

  setStage (stage: CollaborationMessageType): void {
    this.messageType = stage;
  }

  setFirstName (firstName: string): void {
    this.firstName = firstName;
  }

  setLastName (lastName: string): void {
    this.lastName = lastName;
  }

  existsByType (type: CollaborationMessageType): boolean {
    return this.messages!!.map(message => message.type).includes(type);
  }
}
