import { UserAction } from "./UserAction"
import { CollaborationChatStoreInterface, MyPublicationCollaborationChatStore } from "../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType, MessageSenderType } from "../../../../apis/first-approval-api"

const message = {
  text: 'Great, Let’s make the Collaboration request',
  type: CollaborationMessageType.LETS_MAKE_COLLABORATION_REQUEST,
  senderType: MessageSenderType.DATA_USER,

};

const nextMessageType = CollaborationMessageType.FORMALIZED_AGREEMENT;

function letsMakeCollaborationAction (
  collaborationChatStore: CollaborationChatStoreInterface,
): void {
    collaborationChatStore.sendMessage(message, nextMessageType).then(response =>
      collaborationChatStore.sendMessage({
        senderType: MessageSenderType.ASSISTANT,
        type: CollaborationMessageType.FORMALIZED_AGREEMENT,
        // text:
        //   "The collaboration request (1 step) is a formalized agreement. I'll help you fill it out. \n" +
        //   "The agreement is sent to each author individually. \n" +
        //   "It will contain your details and preliminary information about the work you are doing. Here is how the template looks:"
      }, nextMessageType).then()
    );
}

export const letsMakeCollaboration: UserAction = {
  text: 'Great, let`s make collaboration!',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => letsMakeCollaborationAction(collaborationChatStore)
};

