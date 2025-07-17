import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"
import { DownloadedPublicationCollaborationChatStore } from "../../../publication/store/DownloadedPublicationCollaborationChatStore"

function action (collaborationChatStore: DownloadedPublicationCollaborationChatStore): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.NOTIFY_CO_AUTHOR,
    isAssistant: true,
    text: "Notify Co-Author."
  }, CollaborationMessageType.NOTIFY_CO_AUTHOR).then(response => {
    collaborationChatStore.sendMessage({
      type: CollaborationMessageType.IN_TWO_WEEKS_YOU_ARE_PLAN_TO_SHARE_FINAL_DRAFT,
      isAssistant: true,
      text: "In two weeks you are plan to share the final draft for Data Author."
    }, CollaborationMessageType.IN_TWO_WEEKS_YOU_ARE_PLAN_TO_SHARE_FINAL_DRAFT).then();
  })
}

export const notifyCoAuthor: UserAction = {
  text: "Notify Co-Author",
  action
}
