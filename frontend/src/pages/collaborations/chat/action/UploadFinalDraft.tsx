import { UserAction } from "./UserAction"
import { DownloadedPublicationCollaborationChatStore } from "../../../publication/store/DownloadedPublicationCollaborationChatStore"

function action (collaborationChatStore: DownloadedPublicationCollaborationChatStore): void {
  collaborationChatStore.setIsUploadDraftDialogOpen(true)
}

export const uploadFinalDraft: UserAction = {
  text: "Upload Final Draft",
  action
}
