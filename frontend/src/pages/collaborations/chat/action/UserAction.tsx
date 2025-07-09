import { CollaborationChatInterface, CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"
import { CollaborationMessageType, CollaborationRequestMessage } from "../../../../apis/first-approval-api"
import { DownloadedPublicationCollaborationChatStore } from "../../../publication/store/DownloadedPublicationCollaborationChatStore"

export interface UserAction {
  // message: CollaborationRequestMessage | undefined | null;
  // nextMessageType: CollaborationMessageType;
  text: string;
  action: (collaborationChatStore: DownloadedPublicationCollaborationChatStore) => void;
}
