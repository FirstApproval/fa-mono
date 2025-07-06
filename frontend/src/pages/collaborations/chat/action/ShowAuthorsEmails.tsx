import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"
import { UserAction } from "./UserAction"

const message = {
  type: CollaborationMessageType.AUTHORS_EMAILS,
  isAssistant: false,
  text: 'Email to author(s)'
};

const nextMessageType = CollaborationMessageType.NONE

export function showAuthorsEmailsAction(collaborationChatStore: CollaborationChatStore): void {
    collaborationChatStore.sendMessage(message)

    const mappedAuthors = collaborationChatStore.publication!!.authors!!
      .map(author => `• ${author.firstName} ${author.lastName} - ` + (author.email ?? 'no email'))

    collaborationChatStore.sendMessage({
      type: CollaborationMessageType.AUTHORS_EMAILS_RESPONSE,
      isAssistant: true,
      text: 'While we are working on the FA chat feature, you can contact the authors using their emails: \n' + mappedAuthors
    }, nextMessageType)
}

export const showAuthorsEmails: UserAction = {
  action: (collaborationChatStore: CollaborationChatStore) => showAuthorsEmailsAction(collaborationChatStore)
};
