import { CollaborationChatStoreInterface } from "../../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType } from "../../../../../apis/first-approval-api"
import { UserAction } from "../UserAction"

function approveManuscriptAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.setIsApproveManuscriptDialogOpen!!(true);
  // collaborationChatStore.sendMessage({
  //   type: CollaborationMessageType.APPROVE_COLLABORATION,
  //   isAssistant: false,
  //   text: 'Approve manuscript',
  // }).then();
}

export const approveManuscript: UserAction = {
  text: 'Approve manuscript',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => approveManuscriptAction(collaborationChatStore)
}
