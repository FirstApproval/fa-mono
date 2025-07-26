import { CollaborationChatStoreInterface } from "../../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType } from "../../../../../apis/first-approval-api"
import { UserAction } from "../UserAction"

function declineCollaborationAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.DECLINE_COLLABORATION,
    isAssistant: false,
    text: 'Decline collaboration',
  }).then();
}

export const declineCollaboration: UserAction = {
  isDecline: true,
  text: 'Decline collaboration',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => declineCollaborationAction(collaborationChatStore)
}
