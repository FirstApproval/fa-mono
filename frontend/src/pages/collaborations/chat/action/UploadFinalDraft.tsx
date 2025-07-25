import { UserAction } from "./UserAction"
import { DownloadedPublicationCollaborationChatStore } from "../../../publication/store/DownloadedPublicationCollaborationChatStore"
import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"

function action (collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.setIsUploadDraftDialogOpen(true)
}

export const uploadFinalDraft: UserAction = {
  text: "Upload Final Draft",
  action
}
