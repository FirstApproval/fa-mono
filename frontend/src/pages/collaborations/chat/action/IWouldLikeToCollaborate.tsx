import { CollaborationMessageType, MessageSenderType } from "../../../../apis/first-approval-api"
import { CollaborationChatStoreInterface, MyPublicationCollaborationChatStore } from "../../../publication/store/MyPublicationCollaborationChatStore"
import { UserAction } from "./UserAction"

const iWouldLikeToCollaborateMessage = {
  type: CollaborationMessageType.I_WOULD_LIKE_TO_COLLABORATE,
  senderType: MessageSenderType.DATA_USER,
  text: 'I`d like to collaborate! Tell me more...'
}

const ifYouAreInterestedMessage = {
  type: CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET,
  senderType: MessageSenderType.ASSISTANT
}

const nextMessageType = CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET;

function iWouldLikeToCollaborateAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.sendMessages(
    [
      iWouldLikeToCollaborateMessage,
      ifYouAreInterestedMessage
    ], nextMessageType
  ).then()
}

export const iWouldLikeToCollaborate: UserAction = {
  text: 'I`d like to collaborate! Tell me more...',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => iWouldLikeToCollaborateAction(collaborationChatStore)
};
