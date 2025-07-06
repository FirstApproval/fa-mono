import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"
import { UserAction } from "./UserAction"

export function showAuthorsEmailsAction(collaborationChatStore: CollaborationChatStore): void {
    const mappedAuthors = collaborationChatStore.publication!!.authors!!
      .map(author => `• ${author.firstName} ${author.lastName} - ` + (author.email ?? 'no email'))

    collaborationChatStore.sendMessage({
      id: '',
      type: CollaborationMessageType.REACH_OUT_AUTHORS,
      isAssistant: true,
      text: 'While we are working on the FA chat feature, you can contact the authors using their emails: \n' + mappedAuthors
    })
}

export const showAuthorsEmails: UserAction = {
  text: 'Show authors emails',
  action: (collaborationChatStore: CollaborationChatStore) => showAuthorsEmailsAction(collaborationChatStore)
};


// collaborationChatStore.messages?.push({
//   id: '',
//   type: CollaborationMessageType.REACH_OUT_AUTHORS,
//   isAssistant: true,
//   text: 'While we are working on the FA chat feature, you can contact the authors using their emails: \n' + mappedAuthors
// });
