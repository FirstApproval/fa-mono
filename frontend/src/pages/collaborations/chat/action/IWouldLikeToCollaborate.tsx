import { CollaborationMessageType } from "../../../../apis/first-approval-api"
import { CollaborationChatStoreInterface, MyPublicationCollaborationChatStore } from "../../../publication/store/MyPublicationCollaborationChatStore"
import { UserAction } from "./UserAction"

const message = {
  type: CollaborationMessageType.I_WOULD_LIKE_TO_COLLABORATE,
  isAssistant: false,
  text: 'I`d like to collaborate! Tell me more...'
}

const nextMessageType = CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET;

function iWouldLikeToCollaborateAction(collaborationChatStore: CollaborationChatStoreInterface): void {
  collaborationChatStore.sendMessage(message).then(() => {
    collaborationChatStore.sendMessage({
      type: CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET,
      isAssistant: true,
      text: 'If you’re interested in this Dataset and considering publishing your future work together with the Data Author(s), ' +
        'First Approval will make the collaboration process easier. ' +
        'Let me guide you through it before you agree to work on the publication together. ' +
        'The FA collaboration process has 3 steps.'
    }, nextMessageType).then();
  })
}

export const iWouldLikeToCollaborate: UserAction = {
  text: 'I`d like to collaborate! Tell me more...',
  action: (collaborationChatStore: CollaborationChatStoreInterface) => iWouldLikeToCollaborateAction(collaborationChatStore)
};
