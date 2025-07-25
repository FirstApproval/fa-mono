import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"

export interface UserAction {
  text: string;
  action: (collaborationChatStore: CollaborationChatStoreInterface) => void;
}
