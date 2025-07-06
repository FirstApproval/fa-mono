import { CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"
import { CollaborationMessageType, CollaborationRequestMessage } from "../../../../apis/first-approval-api"

export interface UserAction {
  // message: CollaborationRequestMessage | undefined | null;
  // nextMessageType: CollaborationMessageType;
  text: string;
  action: (collaborationChatStore: CollaborationChatStore) => void;
}
