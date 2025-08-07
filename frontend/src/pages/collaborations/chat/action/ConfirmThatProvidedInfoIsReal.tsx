import { CollaborationMessageType, CollaboratorPersonalData, MessageSenderType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"
import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"

const proposePotentialPublicationNameAndTypeMessage = {
      type: CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE,
      senderType: MessageSenderType.ASSISTANT
}

function confirmThatProvidedInfoIsRealAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  const collaboratorPersonalData: CollaboratorPersonalData = {
    type: CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL,
    firstName: collaborationChatStore.firstName!!,
    lastName: collaborationChatStore.lastName!!,
    workplaces: collaborationChatStore.workplaces ?? []
  };

  const iConfirmThatProvidedInfoIsRealMessage = {
    type: CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL,
    payload: collaboratorPersonalData,
    senderType: MessageSenderType.ASSISTANT,
  }

  collaborationChatStore.sendMessages(
    [iConfirmThatProvidedInfoIsRealMessage, proposePotentialPublicationNameAndTypeMessage],
    CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE
  ).then();
}

export const confirmThatProvidedInfoIsReal: UserAction = {
  text: 'I confirm that provided info is real',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => confirmThatProvidedInfoIsRealAction(collaborationChatStore)
};
