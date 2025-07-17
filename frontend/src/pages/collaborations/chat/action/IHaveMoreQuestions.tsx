import { CollaborationChatInterface } from "../../../publication/store/CollaborationChatStore"
import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"

function iHaveMoreQuestionsAction(collaborationChatStore: CollaborationChatInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.MORE_QUESTIONS_ABOUT_COLLABORATION,
    isAssistant: false,
    text: "I have more questions about the collaboration."
  }).then();
}

export const iHaveMoreQuestions: UserAction = {
  text: 'I have more questions about the collaboration',
  action: (collaborationChatStore: CollaborationChatInterface) => iHaveMoreQuestionsAction(collaborationChatStore)
}
