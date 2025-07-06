import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"
import { showAuthorsEmails, showAuthorsEmailsAction } from "./ShowAuthorsEmails"
import { UserAction } from "./UserAction"

function reachOutToAuthorsAction(collaborationChatStore: CollaborationChatStore): void {
  showAuthorsEmails.action(collaborationChatStore);
  collaborationChatStore.setStage(CollaborationMessageType.ONLY_CITATION);
}

export const reachOutToAuthors: UserAction = {
  text: 'I want to reach out to the author(s)',
  action: (collaborationChatStore: CollaborationChatStore) => reachOutToAuthorsAction(collaborationChatStore)
};
