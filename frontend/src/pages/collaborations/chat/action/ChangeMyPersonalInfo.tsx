import { CollaborationChatStoreInterface } from "../../../publication/store/MyPublicationCollaborationChatStore"
import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"

function changeMyPersonalInfoAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.CHANGE_MY_PERSONAL_INFO,
    isAssistant: false,
    // text: 'Change my personal or info about publication'
  }, CollaborationMessageType.CHANGE_MY_PERSONAL_INFO).then()
}

export const changeMyPersonalInfo: UserAction = {
  text: 'Change my personal info or info about publication',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => changeMyPersonalInfoAction(collaborationChatStore)
};
