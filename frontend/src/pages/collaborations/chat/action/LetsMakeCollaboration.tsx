import { UserAction } from "./UserAction"
import { CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"
import { CollaborationMessageType, CollaborationRequestMessage } from "../../../../apis/first-approval-api"

function letsMakeCollaborationAction (
  collaborationChatStore: CollaborationChatStore,
  message: CollaborationRequestMessage,
  nextMessageType: CollaborationMessageType
): void {
    collaborationChatStore.sendMessage(message, nextMessageType);

    collaborationChatStore.sendMessage({
      isAssistant: true,
      type: CollaborationMessageType.STEP_1_FORMALIZED_AGREEMENT,
      text:
        "The collaboration request (1 step) is a formalized agreement. I'll help you fill it out. \n" +
        "The agreement is sent to each author individually.  \n" +
        "It will contain your details and preliminary information about the work you are doing. Here is how the template looks:"
    }, CollaborationMessageType.MANUSCRIPT_APPROVED);
}

const message = {
  text: 'Great, Let’s make the Collaboration request',
  type: CollaborationMessageType.LETS_MAKE_COLLABORATION,
  isAssistant: false
};

const nextMessageType = CollaborationMessageType.STEP_1_FORMALIZED_AGREEMENT;

export const letsMakeCollaboration: UserAction = {
  message,
  nextMessageType,
  action: (collaborationChatStore: CollaborationChatStore) => letsMakeCollaborationAction(collaborationChatStore, message, nextMessageType)
};

