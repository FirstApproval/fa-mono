import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType, MessageSenderType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"

function everythingIsCorrectAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST,
    senderType: MessageSenderType.DATA_USER,
    // text: "Everything is correct. Sign and send request."
  }).then(response => {
    collaborationChatStore.sendMessage({
      type: CollaborationMessageType.FIRST_STEP_IS_COMPLETED,
      senderType: MessageSenderType.ASSISTANT,
      // text: "Great! 1st step is completed 🎉\n" +
      //   "We will inform you about the data author(s)' decision(s) here and by email. \n" +
      //   "\n" +
      //   "You are required to notify the author of the date two weeks before sending the final version of the article. \n" +
      //   "\n" +
      //   "This is necessary to give them time to prepare."
    }, CollaborationMessageType.FIRST_STEP_IS_COMPLETED).then()
  });
}

export const everythingIsCorrect: UserAction = {
  text: 'Everything is correct. Sign and send request ➤',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => everythingIsCorrectAction(collaborationChatStore)
}
