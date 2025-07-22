import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { CollaborationChatInterface } from "../../../publication/store/CollaborationChatStore"
import { UserAction } from "./UserAction"

const nextMessageType = CollaborationMessageType.NONE

export function showAuthorsEmailsAction (
  collaborationChatStore: CollaborationChatInterface,
  text: string,
  messageType: CollaborationMessageType
): void {
  const message = {
    type: messageType,
    isAssistant: false,
    text
  }

  collaborationChatStore.sendMessage(message).then(response => {
    const mappedAuthors = collaborationChatStore.publication!!.authors!!
      .map(author => `• ${author.firstName} ${author.lastName} - ` + (author.email ?? "no email"))

    collaborationChatStore.sendMessage({
      type: CollaborationMessageType.SHOW_AUTHORS_EMAILS_RESPONSE,
      isAssistant: true,
      text: "While we are working on the FA chat feature, you can contact the authors using their emails: \n" + mappedAuthors
    }, nextMessageType).then()
  })
}

export const showAuthorsEmails: UserAction = {
  text: 'Show author(s) emails',
  action: (collaborationChatStore: CollaborationChatInterface) =>
    showAuthorsEmailsAction(collaborationChatStore, 'Show author(s) emails', CollaborationMessageType.SHOW_AUTHORS_EMAILS)
};

export const askDataAuthor: UserAction = {
  text: 'Ask data author',
  action: (collaborationChatStore: CollaborationChatInterface) =>
    showAuthorsEmailsAction(collaborationChatStore, 'Ask data author', CollaborationMessageType.ASK_DATA_USER)
};

export const reachOutToAuthors: UserAction = {
  text: 'I want to reach out to the author(s)',
  action: (collaborationChatStore: CollaborationChatInterface) =>
    showAuthorsEmailsAction(collaborationChatStore, 'I want to reach out to the author(s)', CollaborationMessageType.REACH_OUT_AUTHORS)
};
