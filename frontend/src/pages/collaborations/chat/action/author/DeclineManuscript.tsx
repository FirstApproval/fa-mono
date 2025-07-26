import { CollaborationChatStoreInterface } from "../../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType } from "../../../../../apis/first-approval-api"
import { UserAction } from "../UserAction"

function declineManuscriptAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.DECLINE_COLLABORATION,
    isAssistant: false,
    text: 'Decline manuscript',
  }).then();
}

export const approveDecline: UserAction = {
  text: 'Decline manuscript',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => declineManuscriptAction(collaborationChatStore)
}
