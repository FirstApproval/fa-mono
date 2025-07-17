import { CollaborationChatInterface } from "../../../publication/store/CollaborationChatStore"
import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"

function askDataUserAction(collaborationChatStore: CollaborationChatInterface): void {
  collaborationChatStore.sendMessage({
    id: "",
    type: CollaborationMessageType.DATA_USER_ASKED,
    isAssistant: true,
    text: "You will have 2 weeks to read the article and decide whether to accept or decline co-authorship. " +
      "You can ask questions or provide your suggestions to the author via private messages. " +
      "We recommend starting this process well in advance. " +
      "If you do not approve the request within 2 weeks, you will lose the opportunity for co-authorship in this article. " +
      "If you decline, the data user will simply cite your dataset."
  }, CollaborationMessageType.DATA_USER_ASKED).then()
}

export const askDataUser: UserAction = {
  text: 'Ask data user',
  action: (collaborationChatStore: CollaborationChatInterface) => askDataUserAction(collaborationChatStore)
};

// Messages.push({
//   id: 404,
//   name: 'Me Myself',
//   avatar: 'MM',
//   text: 'You will have 2 weeks to read the article and decide whether to accept or decline co-authorship. You can ask questions
//   or provide your suggestions to the author via private messages. We recommend starting this process well in advance.
//   If you do not approve the request within 2 weeks, you will lose the opportunity for co-authorship in this article.
//   If you decline, the data user will simply cite your dataset.'
// });
// collaborationChatStore.setStage(CollaborationMessageType.DATA_USER_ASKED);
