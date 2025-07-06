import { CollaborationMessageType } from "../../../apis/first-approval-api"
import { citation } from "./action/Citation"
import { UserAction } from "./action/UserAction"
import { CollaborationChatInterface } from "../../publication/store/CollaborationChatStore"
import { letsMakeCollaboration } from "./action/LetsMakeCollaboration"
import { needHelp } from "./action/NeedHelp"
import { reachOutToAuthors } from "./action/ReachOutToAuthors"
import { iWouldLikeToCollaborate } from "./action/IWouldLikeToCollaborate"
import { gotItReadyToStart } from "./action/GotItReadyToStart"
import { confirmThatProvidedInfoIsReal } from "./action/ConfirmThatProvidedInfoIsReal"
import { doneWhatsNext } from "./action/DoneWhatsNext"
import { showAuthorsEmails } from "./action/ShowAuthorsEmails"

export class UserActionsRegistry {
  private userActionsByMessageType = new Map<CollaborationMessageType, UserAction[]>()

  constructor (readonly collaborationChatStore: CollaborationChatInterface) {
    // CREATE_REQUEST создаётся на бэке
    // this.registerAction(CollaborationMessageType.CREATE_REQUEST, [citation, reachOutToAuthors, emailToAuthors]);
    // ниже два события для UseType.CITATION
    this.registerAction(CollaborationMessageType.CITATION_IS_ENOUGH)
    this.registerAction(CollaborationMessageType.ONLY_CITATION)
    this.registerAction(CollaborationMessageType.REACH_OUT_AUTHORS, [letsMakeCollaboration])
    this.registerAction(CollaborationMessageType.REACH_OUT_AUTHORS_RESPONSE, [citation])

    // Ниже для UseType.CO_AUTHORSHIP
    this.registerAction(CollaborationMessageType.AGREE_TO_THE_TERMS_OF_COLLABORATION)
    this.registerAction(CollaborationMessageType.DATASET_WAS_DOWNLOADED, [showAuthorsEmails, iWouldLikeToCollaborate])
    this.registerAction(CollaborationMessageType.I_WOULD_LIKE_TO_COLLABORATE)
    this.registerAction(CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET, [letsMakeCollaboration])
    this.registerAction(CollaborationMessageType.LETS_MAKE_COLLABORATION_REQUEST)
    this.registerAction(CollaborationMessageType.FORMALIZED_AGREEMENT, [gotItReadyToStart])
    this.registerAction(CollaborationMessageType.VERIFY_YOUR_NAME_AND_AFFILIATION, [confirmThatProvidedInfoIsReal])
    this.registerAction(CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL)
    this.registerAction(CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE, [doneWhatsNext])
    this.registerAction(CollaborationMessageType.DONE_WHATS_NEXT)
    this.registerAction(CollaborationMessageType.PREFILLED_COLLABORATION_AGREEMENT)
    this.registerAction(CollaborationMessageType.EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST)
    this.registerAction(CollaborationMessageType.CHANGE_MY_PERSONAL_INFO)
    this.registerAction(CollaborationMessageType.CHANGE_INFO_ABOUT_MY_PUBLICATION)
    this.registerAction(CollaborationMessageType.FIRST_STEP_IS_COMPLETED)
  }

  private registerAction (messageType: CollaborationMessageType, actions: UserAction[] = []): void {
    this.userActionsByMessageType.set(messageType, actions)
  }

  getActions(messageType: CollaborationMessageType): UserAction[] {
    return this.userActionsByMessageType.get(messageType) ?? [];
  }
}
