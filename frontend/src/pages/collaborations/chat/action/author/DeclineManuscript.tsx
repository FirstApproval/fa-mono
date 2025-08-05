import { CollaborationChatStoreInterface } from "../../../../publication/store/MyPublicationCollaborationChatStore"
import { UserAction } from "../UserAction"

function declineManuscriptAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.setIsDeclineManuscriptDialogOpen!!(true);
}

export const declineManuscript: UserAction = {
  isDecline: true,
  text: 'Decline, citation is enough',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => declineManuscriptAction(collaborationChatStore)
}
