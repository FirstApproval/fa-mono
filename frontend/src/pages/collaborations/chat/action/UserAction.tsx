import { CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"
import { CollaborationMessageType, CollaborationRequestMessage } from "../../../../apis/first-approval-api"

export interface UserAction {
  message: CollaborationRequestMessage;
  nextMessageType: CollaborationMessageType;
  action: (collaborationChatStore: CollaborationChatStore) => void;
}
