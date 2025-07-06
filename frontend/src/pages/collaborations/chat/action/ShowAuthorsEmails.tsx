import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { CollaborationChatInterface, CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"
import { UserAction } from "./UserAction"

const message = {
  type: CollaborationMessageType.SHOW_AUTHORS_EMAILS,
  isAssistant: false,
  text: 'Email to author(s)'
};

const nextMessageType = CollaborationMessageType.NONE

export function showAuthorsEmailsAction(collaborationChatStore: CollaborationChatInterface): void {
    collaborationChatStore.sendMessage(message)

    const mappedAuthors = collaborationChatStore.publication!!.authors!!
      .map(author => `• ${author.firstName} ${author.lastName} - ` + (author.email ?? 'no email'))

    collaborationChatStore.sendMessage({
      type: CollaborationMessageType.SHOW_AUTHORS_EMAILS_RESPONSE,
      isAssistant: true,
      text: 'While we are working on the FA chat feature, you can contact the authors using their emails: \n' + mappedAuthors
    }, nextMessageType)
}

export const showAuthorsEmails: UserAction = {
  text: 'Show author(s) emails',
  action: (collaborationChatStore: CollaborationChatInterface) => showAuthorsEmailsAction(collaborationChatStore)
};
