import { UserAction } from "./UserAction"
import { CollaborationChatInterface, CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"

export function needHelpAction() {
  () => alert('Help is Needed');
}

export const needHelp: UserAction = {
  text: 'I need help',
  action: (collaborationChatStore: CollaborationChatInterface) => needHelpAction(),
};

