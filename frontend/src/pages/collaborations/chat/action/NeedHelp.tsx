import { UserAction } from "./UserAction"
import { DownloadedPublicationCollaborationChatStore } from "../../../publication/store/DownloadedPublicationCollaborationChatStore"

export function action(collaborationChatStore: DownloadedPublicationCollaborationChatStore) {
  () => alert('Help is Needed');
}

export const needHelp: UserAction = {
  text: 'I need help',
  action: action
};

