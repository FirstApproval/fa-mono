import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"
import { UserAction } from "./UserAction"
import { userStore } from "../../../../core/user"
import { getFullName } from "../../../../util/userUtil"

const nextMessageType = CollaborationMessageType.NONE

export function showAuthorsEmailsAction (
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

    const mappedAuthors = collaborationChatStore.publication!!.authors!!
      .filter(author => author.user !== null)
      .map(author => `• ${getFullName(author)} - ${author.email ?? "no email"}`)
    collaborationChatStore.messages!!.push({
        type: CollaborationMessageType.SHOW_AUTHORS_EMAILS_RESPONSE,
        isAssistant: true,
        userInfo: userStore.user,
        text: "While we are working on the FA chat feature, you can contact the authors using their emails: \n" + mappedAuthors
      }
    );
}

export const showAuthorsEmails: UserAction = {
  text: 'Show author(s) emails',
  action: (collaborationChatStore: CollaborationChatStoreInterface) =>
    showAuthorsEmailsAction(collaborationChatStore, 'Show author(s) emails', CollaborationMessageType.SHOW_AUTHORS_EMAILS)
};

export const askDataAuthor: UserAction = {
  text: 'Ask data author',
  action: (collaborationChatStore: CollaborationChatStoreInterface) =>
    showAuthorsEmailsAction(collaborationChatStore, 'Ask data author', CollaborationMessageType.ASK_DATA_USER)
};

export const reachOutToAuthors: UserAction = {
  text: 'I want to reach out to the author(s)',
  action: (collaborationChatStore: CollaborationChatStoreInterface) =>
    showAuthorsEmailsAction(collaborationChatStore, 'I want to reach out to the author(s)', CollaborationMessageType.REACH_OUT_AUTHORS)
};
