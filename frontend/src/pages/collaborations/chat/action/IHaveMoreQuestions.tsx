import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType, MessageSenderType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"

function iHaveMoreQuestionsAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.MORE_QUESTIONS_ABOUT_COLLABORATION,
    senderType: MessageSenderType.DATA_USER,
    // text: "I have more questions about the collaboration."
  }).then();
}

export const iHaveMoreQuestions: UserAction = {
  text: 'I have more questions about the collaboration',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => iHaveMoreQuestionsAction(collaborationChatStore)
}
