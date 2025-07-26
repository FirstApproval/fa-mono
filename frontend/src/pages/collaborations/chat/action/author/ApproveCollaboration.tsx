import { CollaborationChatStoreInterface } from "../../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType } from "../../../../../apis/first-approval-api"
import { UserAction } from "../UserAction"

function approveCollaborationAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.APPROVE_COLLABORATION,
    isAssistant: false,
    text: 'Approve collaboration',
  }).then();
}

export const approveCollaboration: UserAction = {
  text: 'Approve collaboration',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => approveCollaborationAction(collaborationChatStore)
}
