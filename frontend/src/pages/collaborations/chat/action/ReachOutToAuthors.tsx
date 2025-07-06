import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { CollaborationChatInterface, CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"
import { UserAction } from "./UserAction"

const message = {
  type: CollaborationMessageType.REACH_OUT_AUTHORS,
  isAssistant: false,
  text: 'I want to reach out to the author(s)'
};

const nextMessageType = CollaborationMessageType.ONLY_CITATION;

function reachOutToAuthorsAction(collaborationChatStore: CollaborationChatInterface): void {
  collaborationChatStore.sendMessage(message)

  const mappedAuthors = collaborationChatStore.publication!!.authors!!
    .map(author => `• ${author.firstName} ${author.lastName} - ` + (author.email ?? 'no email'))

  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.REACH_OUT_AUTHORS_RESPONSE,
    isAssistant: true,
    text: 'While we are working on the FA chat feature, you can contact the authors using their emails: \n' + mappedAuthors
  }, nextMessageType)

}

export const reachOutToAuthors: UserAction = {
  text: 'I want to reach out to the author(s)',
  action: (collaborationChatStore: CollaborationChatInterface) => reachOutToAuthorsAction(collaborationChatStore)
};
