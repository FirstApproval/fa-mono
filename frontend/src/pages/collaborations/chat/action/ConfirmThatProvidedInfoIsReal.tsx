import { CollaborationMessageType, CollaboratorPersonalData } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"
import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"

const proposePotentialPublicationNameAndTypeMessage = {
      type: CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE,
      isAssistant: true
}

function confirmThatProvidedInfoIsRealAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  // collaborationChatStore.sendMessage({
  //   type: CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL,
  //   payload: collaboratorPersonalData,
  //   isAssistant: true,
  //   text: "I confirm that provided info is real."
  // }).then(response => {
  //   collaborationChatStore.sendMessage({
  //     type: CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE,
  //     isAssistant: true,
  //     text: "Thank you! Now, propose a potential name and type of publication, and specify the details of the research in which you would " +
  //       "like to use the dataset to ensure that Dataset Authors are well-informed about ideas for future collaborative publications, please.",
  //   }, CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE).then()
  // });

  const collaboratorPersonalData: CollaboratorPersonalData = {
    type: CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL,
    firstName: collaborationChatStore.firstName!!,
    lastName: collaborationChatStore.lastName!!,
    workplaces: collaborationChatStore.workplaces ?? []
  };

  const iConfirmThatProvidedInfoIsRealMessage = {
    type: CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL,
    payload: collaboratorPersonalData,
    isAssistant: true,
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
