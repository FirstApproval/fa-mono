import { CollaborationChatStoreInterface } from "../../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType } from "../../../../../apis/first-approval-api"
import { userStore } from "../../../../../core/user"
import { getFullName } from "../../../../../util/userUtil"
import { UserAction } from "../UserAction"

export function emailDataUserAction (
  collaborationChatStore: CollaborationChatStoreInterface,
  text: string,
  messageType: CollaborationMessageType
): void {
  const message = {
    type: messageType,
    isAssistant: false,
    userInfo: userStore.user,
    text
  }

  collaborationChatStore.messages!!.push(message)

  const collaborationRequestCreator = collaborationChatStore.collaborationRequestCreator!!;
  const mappedDataUser = `• ${getFullName(collaborationRequestCreator)} - ${collaborationRequestCreator.email ?? "no email"}`;
  collaborationChatStore.messages!!.push({
      type: CollaborationMessageType.EMAIL_DATA_USER,
      isAssistant: true,
      userInfo: userStore.user,
      text: "While we are working on the FA chat feature, you can contact the data user by email: \n" + mappedDataUser
    }
  );
}

export const emailDataUser: UserAction = {
  text: 'Email data user',
  action: (collaborationChatStore: CollaborationChatStoreInterface) =>
    emailDataUserAction(collaborationChatStore, 'Email data user', CollaborationMessageType.EMAIL_DATA_USER)
};
