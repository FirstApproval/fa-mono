import { CollaborationChatStoreInterface } from "../../../../publication/store/MyPublicationCollaborationChatStore"
import { UserAction } from "../UserAction"

function declineCollaborationAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.setIsDeclineCollaborationDialogOpen(true);
}

export const declineCollaboration: UserAction = {
  isDecline: true,
  text: 'Decline, citation is enough',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => declineCollaborationAction(collaborationChatStore)
}
