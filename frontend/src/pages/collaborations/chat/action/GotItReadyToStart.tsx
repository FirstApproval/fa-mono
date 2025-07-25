import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"

function gotItReadyToStartAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.GOT_IT_READY_TO_START,
    isAssistant: false,
    text: "Got it. I am ready to start."
  }).then(response => {
    collaborationChatStore.sendMessage({
      type: CollaborationMessageType.VERIFY_YOUR_NAME_AND_AFFILIATION,
      isAssistant: true,
      text: "Awesome! Please verify the spelling of your name and affiliation, as this information will be used in the agreement."
    }, CollaborationMessageType.VERIFY_YOUR_NAME_AND_AFFILIATION).then()
  });
}

export const gotItReadyToStart: UserAction = {
  text: 'Got it. I am ready to start',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => gotItReadyToStartAction(collaborationChatStore)
}
