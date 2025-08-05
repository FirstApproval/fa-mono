import { CollaborationMessageType } from "../../../apis/first-approval-api"
import { citation } from "./action/Citation"
import { UserAction } from "./action/UserAction"
import { letsMakeCollaboration } from "./action/LetsMakeCollaboration"
import { iWouldLikeToCollaborate } from "./action/IWouldLikeToCollaborate"
import { gotItReadyToStart } from "./action/GotItReadyToStart"
import { askDataAuthor, showAuthorsEmails } from "./action/ShowAuthorsEmails"
import { everythingIsCorrect } from "./action/EverythingIsCorrect"
import { changeMyPersonalInfo } from "./action/ChangeMyPersonalInfo"
import { iHaveMoreQuestions } from "./action/IHaveMoreQuestions"
import { uploadFinalDraft } from "./action/UploadFinalDraft"
import { needHelp } from "./action/NeedHelp"
import { emailDataUser } from "./action/author/EmailDataUser"
import { approveCollaboration } from "./action/author/ApproveCollaboration"
import { declineCollaboration } from "./action/author/DeclineCollaboration"
import { approveManuscript } from "./action/author/ApproveManuscript"

export class UserActionsRegistry {
  private userActionsByMessageType = new Map<CollaborationMessageType, UserAction[]>()

  constructor () {
    //for data user
    // CREATE_REQUEST создаётся на бэке
    // this.registerAction(CollaborationMessageType.CREATE_REQUEST, [citation, reachOutToAuthors, emailToAuthors]);
    // ниже два события для UseType.CITATION
    this.registerAction(CollaborationMessageType.CITATION_IS_ENOUGH);
    this.registerAction(CollaborationMessageType.ONLY_CITATION);
    this.registerAction(CollaborationMessageType.REACH_OUT_AUTHORS, [letsMakeCollaboration]);
    this.registerAction(CollaborationMessageType.REACH_OUT_AUTHORS_RESPONSE, [citation]);

    // Ниже для UseType.CO_AUTHORSHIP
    this.registerAction(CollaborationMessageType.AGREE_TO_THE_TERMS_OF_COLLABORATION);
    this.registerAction(CollaborationMessageType.DATASET_WAS_DOWNLOADED, [showAuthorsEmails, iWouldLikeToCollaborate]);
    this.registerAction(CollaborationMessageType.I_WOULD_LIKE_TO_COLLABORATE);
    this.registerAction(CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET, [letsMakeCollaboration]);
    this.registerAction(CollaborationMessageType.LETS_MAKE_COLLABORATION_REQUEST);
    this.registerAction(CollaborationMessageType.FORMALIZED_AGREEMENT, [gotItReadyToStart]);
    this.registerAction(CollaborationMessageType.VERIFY_YOUR_NAME_AND_AFFILIATION, []);
    this.registerAction(CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL);
    this.registerAction(CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE, []);
    this.registerAction(CollaborationMessageType.DONE_WHATS_NEXT);
    this.registerAction(CollaborationMessageType.PREFILLED_COLLABORATION_AGREEMENT,
      [everythingIsCorrect, changeMyPersonalInfo, iHaveMoreQuestions]);
    this.registerAction(CollaborationMessageType.EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST);
    this.registerAction(CollaborationMessageType.CHANGE_MY_PERSONAL_INFO);
    this.registerAction(CollaborationMessageType.CHANGE_INFO_ABOUT_MY_PUBLICATION);
    this.registerAction(CollaborationMessageType.FIRST_STEP_IS_COMPLETED);
    this.registerAction(CollaborationMessageType.YOUR_COLLABORATION_IS_ESTABLISHED,
      [askDataAuthor, needHelp]);
    this.registerAction(CollaborationMessageType.YOUR_COLLABORATION_IS_DECLINED,
      [askDataAuthor, needHelp]);
    this.registerAction(CollaborationMessageType.ALL_DATA_AUTHORS_RESPONDED_TO_COLLABORATION_REQUEST,
      [uploadFinalDraft, askDataAuthor, needHelp]);
    this.registerAction(CollaborationMessageType.ALL_DATA_AUTHORS_DECLINED_COLLABORATION_REQUEST,
      [askDataAuthor, needHelp]);
    this.registerAction(CollaborationMessageType.AUTHOR_HAS_14_DAYS_TO_MAKE_REVISIONS_AND_APPROVE, [askDataAuthor, needHelp]);
    this.registerAction(CollaborationMessageType.AUTHOR_APPROVED, [askDataAuthor, needHelp]);
    this.registerAction(CollaborationMessageType.AUTHOR_DECLINED, [askDataAuthor, needHelp]);
    this.registerAction(CollaborationMessageType.ALL_AUTHORS_CONFIRMED, [askDataAuthor, needHelp]);

    this.registerAction(CollaborationMessageType.ASSISTANT_COLLABORATION_DECLINED, [needHelp]);

    //for data author
    this.registerAction(CollaborationMessageType.ASSISTANT_CREATE, [approveCollaboration, declineCollaboration, emailDataUser, needHelp]);
    this.registerAction(CollaborationMessageType.DECLINE_COLLABORATION, [needHelp]);
    this.registerAction(CollaborationMessageType.APPROVE_COLLABORATION, [needHelp]);
    this.registerAction(CollaborationMessageType.ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER,
      [approveManuscript, declineCollaboration, askDataAuthor, needHelp]);
    this.registerAction(CollaborationMessageType.ASSISTANT_MANUSCRIPT_APPROVED, [emailDataUser, needHelp]);

  }

  private registerAction (messageType: CollaborationMessageType, actions: UserAction[] = []): void {
    this.userActionsByMessageType.set(messageType, actions)
  }

  getActions(messageType: CollaborationMessageType): UserAction[] {
    return this.userActionsByMessageType.get(messageType) ?? [];
  }
}
