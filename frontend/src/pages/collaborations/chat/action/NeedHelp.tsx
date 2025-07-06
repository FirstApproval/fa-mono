import { UserAction } from "./UserAction"
import { CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"

export function needHelpAction() {
  () => alert('Help is Needed');
}

export const citation: UserAction = {
  text: 'I need help',
  action: (collaborationChatStore: CollaborationChatStore) => needHelpAction(),
};

