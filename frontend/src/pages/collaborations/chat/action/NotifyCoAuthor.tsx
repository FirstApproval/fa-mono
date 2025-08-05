import { UserAction } from "./UserAction"
import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType } from "../../../../apis/first-approval-api"

const notifyCoAuthorMessage = {
  type: CollaborationMessageType.NOTIFY_CO_AUTHOR,
  isAssistant: true
}

const inTwoSeeksYouArePlanToShareFinalDraftMessage = {
  type: CollaborationMessageType.IN_TWO_WEEKS_YOU_ARE_PLAN_TO_SHARE_FINAL_DRAFT,
  isAssistant: true
}

function action (collaborationChatStore: CollaborationChatStoreInterface): void {
  // collaborationChatStore.sendMessage({
  //   type: CollaborationMessageType.NOTIFY_CO_AUTHOR,
  //   isAssistant: true,
  //   text: "Notify Co-Author."
  // }, CollaborationMessageType.NOTIFY_CO_AUTHOR).then(response => {
  //   collaborationChatStore.sendMessage({
  //     type: CollaborationMessageType.IN_TWO_WEEKS_YOU_ARE_PLAN_TO_SHARE_FINAL_DRAFT,
  //     isAssistant: true,
  //     text: "In two weeks you are plan to share the final draft for Data Author."
  //   }, CollaborationMessageType.IN_TWO_WEEKS_YOU_ARE_PLAN_TO_SHARE_FINAL_DRAFT).then();
  // })

  collaborationChatStore.sendMessages(
    [notifyCoAuthorMessage, inTwoSeeksYouArePlanToShareFinalDraftMessage],
    CollaborationMessageType.IN_TWO_WEEKS_YOU_ARE_PLAN_TO_SHARE_FINAL_DRAFT).then()
}

export const notifyCoAuthor: UserAction = {
  text: "Notify Co-Author",
  action
}
