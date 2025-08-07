import { CollaborationChatStoreInterface } from "../../../../publication/store/MyPublicationCollaborationChatStore"
import { UserAction } from "../UserAction"

function approveManuscriptAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.setIsApproveManuscriptDialogOpen!!(true);
}

export const approveManuscript: UserAction = {
  text: 'Approve manuscript',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => approveManuscriptAction(collaborationChatStore)
}
