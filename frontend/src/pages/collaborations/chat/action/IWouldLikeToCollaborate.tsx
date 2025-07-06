import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { CollaborationChatInterface, CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"
import { UserAction } from "./UserAction"

const message = {
  type: CollaborationMessageType.I_WOULD_LIKE_TO_COLLABORATE,
  isAssistant: false,
  text: 'I`d like to collaborate! Tell me more...'
}

const nextMessageType = CollaborationMessageType.ONLY_CITATION;

function reachOutToAuthorsAction(collaborationChatStore: CollaborationChatInterface): void {
  collaborationChatStore.sendMessage(message)

  const mappedAuthors = collaborationChatStore.publication!!.authors!!
    .map(author => `• ${author.firstName} ${author.lastName} - ` + (author.email ?? 'no email'))

  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET,
    isAssistant: true,
    text: 'While we are working on the FA chat feature, you can contact the authors using their emails: \n' + mappedAuthors
  }, nextMessageType)

}

export const iWouldLikeToCollaborate: UserAction = {
  text: 'I`d like to collaborate! Tell me more...',
  action: (collaborationChatStore: CollaborationChatInterface) => reachOutToAuthorsAction(collaborationChatStore)
};
