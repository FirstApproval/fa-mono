import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"
import { DownloadedPublicationCollaborationChatStore } from "../../../publication/store/DownloadedPublicationCollaborationChatStore"

function action (collaborationChatStore: DownloadedPublicationCollaborationChatStore): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.NOTIFY_CO_AUTHOR,
    isAssistant: true,
    text: "Notify Co-Author"

  }, CollaborationMessageType.NOTIFY_CO_AUTHOR).then()
}

export const notifyCoAuthor: UserAction = {
  text: "Notify Co-Author",
  action
}
