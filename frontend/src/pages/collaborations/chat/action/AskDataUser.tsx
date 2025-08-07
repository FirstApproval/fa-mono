import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType, MessageSenderType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"
import { userStore } from "../../../../core/user"

function askDataUserAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.messages!!.push({
    type: CollaborationMessageType.ASK_DATA_USER,
    senderType: MessageSenderType.ASSISTANT,
    userInfo: userStore.user
  });
}

export const askDataUser: UserAction = {
  text: 'Ask data user',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => askDataUserAction(collaborationChatStore)
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
