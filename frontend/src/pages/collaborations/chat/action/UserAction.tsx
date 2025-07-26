import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"

export abstract class UserAction {
  text: string | undefined = undefined;
  isDecline?: boolean = false;
  action: (collaborationChatStore: CollaborationChatStoreInterface) => void = () => {};
}
