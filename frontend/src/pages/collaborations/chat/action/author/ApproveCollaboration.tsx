import { CollaborationChatStoreInterface } from "../../../../publication/store/MyPublicationCollaborationChatStore"
import { UserAction } from "../UserAction"

function approveCollaborationAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.setIsApproveCollaborationDialogOpen!!(true);
}

export const approveCollaboration: UserAction = {
  text: 'Approve collaboration',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => approveCollaborationAction(collaborationChatStore)
}
