import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"
import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"

function action (collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.YOUR_COLLABORATION_IS_ESTABLISHED,
    isAssistant: true,
    text: "" +
      "✅ Great news! Your collaboration is established. Peter Lidsky has signed the Collaboration Agreement. " +
      "You can find the signed agreement here:\n\n" +
      "You can also contact the Data Author by email: Author Authorov - email@email.com"

  }, CollaborationMessageType.YOUR_COLLABORATION_IS_ESTABLISHED).then()
}

export const yourCollaborationIsEstablished: UserAction = {
  text: "" +
    "✅ Great news! Your collaboration is established. Peter Lidsky has signed the Collaboration Agreement. " +
    "You can find the signed agreement here:\n\n" +
    "You can also contact the Data Author by email: Author Authorov - email@email.com",
  action
}
