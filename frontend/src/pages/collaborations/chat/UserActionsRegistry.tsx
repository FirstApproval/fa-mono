import { CollaborationMessageType } from "../../../apis/first-approval-api"
import { citation } from "./action/Citation"
import { UserAction } from "./action/UserAction"
import { CollaborationChatInterface, CollaborationChatStore } from "../../publication/store/CollaborationChatStore"

export class UserActionsRegistry {
  private userActionsByMessageType = new Map<CollaborationMessageType, UserAction[]>()

  constructor (readonly collaborationChatStore: CollaborationChatInterface) {
    this.registerAction(CollaborationMessageType.ONLY_CITATION, [citation])
    // this.userActionsByMessageType.set(CollaborationMessageType.CREATE_REQUEST, [citation]);
  }

  private registerAction (messageType: CollaborationMessageType, actions: [UserAction]): void {
    this.userActionsByMessageType.set(messageType, actions)
  }

  getActions(messageType: CollaborationMessageType): UserAction[] {
    return this.userActionsByMessageType.get(messageType) ?? [];
  }
}
