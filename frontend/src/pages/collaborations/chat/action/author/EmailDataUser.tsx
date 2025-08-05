import { CollaborationChatStoreInterface } from "../../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType } from "../../../../../apis/first-approval-api"
import { userStore } from "../../../../../core/user"
import { UserAction } from "../UserAction"

export function emailDataUserAction (
  collaborationChatStore: CollaborationChatStoreInterface,
): void {
  collaborationChatStore.messages!!.push({
      type: CollaborationMessageType.EMAIL_DATA_USER,
      isAssistant: true,
      userInfo: userStore.user,
    }
  );
}

export const emailDataUser: UserAction = {
  text: 'Email data user',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => emailDataUserAction(collaborationChatStore)
};
