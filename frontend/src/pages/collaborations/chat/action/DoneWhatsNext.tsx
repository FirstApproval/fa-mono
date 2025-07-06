import { CollaborationChatInterface } from "../../../publication/store/CollaborationChatStore"
import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"

function doneWhatsNextAction(collaborationChatStore: CollaborationChatInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.DONE_WHATS_NEXT,
    isAssistant: false,
    text: "Done. What’s next?"
  });

  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.PREFILLED_COLLABORATION_AGREEMENT,
    isAssistant: true,
    text: "Good job! Here is a pre-filled (unsigned) collaboration agreement with the corresponding author: \n" +
      "And the rest of agreements (they differ only in information about the data authors): \n" +
      "Please review the agreement(s), and if all information is correct, sign and send it/them by clicking the button below."
  }, CollaborationMessageType.PREFILLED_COLLABORATION_AGREEMENT)
}

export const doneWhatsNext: UserAction = {
  text: 'Done. What’s next?',
  action: (collaborationChatStore: CollaborationChatInterface) => doneWhatsNextAction(collaborationChatStore)
}
