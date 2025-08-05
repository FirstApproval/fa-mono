import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"
import { UserAction } from "./UserAction"

export function showAuthorsEmailsAction (
  collaborationChatStore: CollaborationChatStoreInterface,
  text: string,
  messageType: CollaborationMessageType
): void {
  collaborationChatStore.messages!!.push(
    {
      type: messageType,
      isAssistant: false,
      userInfo: collaborationChatStore.collaborationRequestCreator,
    },
    {
      type: CollaborationMessageType.SHOW_AUTHORS_EMAILS_RESPONSE,
      isAssistant: true
    }
  )
}

export const showAuthorsEmails: UserAction = {
  text: 'Show author(s) emails',
  action: (collaborationChatStore: CollaborationChatStoreInterface) =>
    showAuthorsEmailsAction(collaborationChatStore, 'Show author(s) emails', CollaborationMessageType.SHOW_AUTHORS_EMAILS)
};

export const askDataAuthor: UserAction = {
  text: 'Ask data author',
  action: (collaborationChatStore: CollaborationChatStoreInterface) =>
    showAuthorsEmailsAction(collaborationChatStore, 'Ask data author', CollaborationMessageType.ASK_DATA_AUTHOR)
};

export const reachOutToAuthors: UserAction = {
  text: 'I want to reach out to the author(s)',
  action: (collaborationChatStore: CollaborationChatStoreInterface) =>
    showAuthorsEmailsAction(collaborationChatStore, 'I want to reach out to the author(s)', CollaborationMessageType.REACH_OUT_AUTHORS)
};
