import { UserAction } from "./UserAction"
import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"

export function action(collaborationChatStore: CollaborationChatStoreInterface) {
  const subject = encodeURIComponent('I need help with FA collaboration');
  const body = encodeURIComponent('Hi! I need help with...');
  window.location.href = `mailto:info@firstapproval.io?subject=${subject}&body=${body}`;
}

export const needHelp: UserAction = { text: 'I need help', action };

