import { CollaborationChatInterface } from "../../../publication/store/CollaborationChatStore"
import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"

function everythingIsCorrectAction(collaborationChatStore: CollaborationChatInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST,
    isAssistant: false,
    text: "Everything is correct. Sign and send request."
  });

  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.FIRST_STEP_IS_COMPLETED,
    isAssistant: true,
    text: "Great! 1st step is completed 🎉\n" +
      "We will inform you about the data author(s)' decision(s) here and by email. \n" +
      "\n" +
      "You are required to notify the author of the date two weeks before sending the final version of the article. \n" +
      "\n" +
      "This is necessary to give them time to prepare."
  }, CollaborationMessageType.FIRST_STEP_IS_COMPLETED)
}

export const everythingIsCorrect: UserAction = {
  text: 'Everything is correct. Sign and send request',
  action: (collaborationChatStore: CollaborationChatInterface) => everythingIsCorrectAction(collaborationChatStore)
}
