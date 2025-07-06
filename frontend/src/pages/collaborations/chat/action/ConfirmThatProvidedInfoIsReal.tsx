import { CollaborationChatInterface, CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"
import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"

function confirmThatProvidedInfoIsRealAction(collaborationChatStore: CollaborationChatInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL,
    isAssistant: true,
    text: "I confirm that provided info is real."
  });

  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE,
    isAssistant: true,
    text: "Thank you! Now, propose a potential name and type of publication, and specify the details of the research in which you would " +
      "like to use the dataset to ensure that Dataset Authors are well-informed about ideas for future collaborative publications, please.",
  }, CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE);
}

export const confirmThatProvidedInfoIsReal: UserAction = {
  text: 'I confirm that provided info is real',
  action: (collaborationChatStore: CollaborationChatInterface) => confirmThatProvidedInfoIsRealAction(collaborationChatStore)
};
