import { UserAction } from "./UserAction"
import { DownloadedPublicationCollaborationChatStore } from "../../../publication/store/DownloadedPublicationCollaborationChatStore"

export function action(collaborationChatStore: DownloadedPublicationCollaborationChatStore) {
  const subject = encodeURIComponent('I need help with FA collaboration');
  const body = encodeURIComponent('Hi! I need help with...');
  window.location.href = `mailto:info@firstapproval.io?subject=${subject}&body=${body}`;
}

export const needHelp: UserAction = { text: 'I need help', action };

