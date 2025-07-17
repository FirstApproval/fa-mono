import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"
import { DownloadedPublicationCollaborationChatStore } from "../../../publication/store/DownloadedPublicationCollaborationChatStore"

function action (collaborationChatStore: DownloadedPublicationCollaborationChatStore): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.UPLOAD_FINAL_DRAFT,
    isAssistant: false,
    text: "Upload Final Draft"

  }, CollaborationMessageType.UPLOAD_FINAL_DRAFT).then()
}

export const uploadFinalDraft: UserAction = {
  text: "Upload Final Draft",
  action
}
