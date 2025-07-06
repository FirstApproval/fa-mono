import { CollaborationMessageType } from "../../../apis/first-approval-api"
import { citation } from "./action/Citation"
import { UserAction } from "./action/UserAction"
import { CollaborationChatInterface } from "../../publication/store/CollaborationChatStore"
import { letsMakeCollaboration } from "./action/LetsMakeCollaboration"
import { needHelp } from "./action/NeedHelp"
import { reachOutToAuthors } from "./action/ReachOutToAuthors"
import { iWouldLikeToCollaborate } from "./action/IWouldLikeToCollaborate"

export class UserActionsRegistry {
  private userActionsByMessageType = new Map<CollaborationMessageType, UserAction[]>()

  constructor (readonly collaborationChatStore: CollaborationChatInterface) {
    // CREATE_REQUEST создаётся на бэке
    // this.registerAction(CollaborationMessageType.CREATE_REQUEST, [citation, reachOutToAuthors, emailToAuthors]);
    // ниже два события для UseType.CITATION
    this.registerAction(CollaborationMessageType.CITATION_IS_ENOUGH)
    this.registerAction(CollaborationMessageType.ONLY_CITATION)
    this.registerAction(CollaborationMessageType.REACH_OUT_AUTHORS_RESPONSE, [citation])

    // Ниже для UseType.CO_AUTHORSHIP
    this.registerAction(CollaborationMessageType.DATASET_WAS_DOWNLOADED, [letsMakeCollaboration])
    this.registerAction(CollaborationMessageType.LETS_MAKE_COLLABORATION)
    this.registerAction(CollaborationMessageType.LETS_MAKE_COLLABORATION)
    this.registerAction(CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET, [iWouldLikeToCollaborate])
    this.registerAction(CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET, [iWouldLikeToCollaborate])
    this.registerAction(CollaborationMessageType.I_WOULD_LIKE_TO_COLLABORATE, [letsMakeCollaboration])
    this.registerAction(CollaborationMessageType.REACH_OUT_AUTHORS, [letsMakeCollaboration])
  }

  private registerAction (messageType: CollaborationMessageType, actions: UserAction[] = []): void {
    this.userActionsByMessageType.set(messageType, actions)
  }

  getActions(messageType: CollaborationMessageType): UserAction[] {
    return this.userActionsByMessageType.get(messageType) ?? [];
  }
}
