import { CollaborationMessageType, CollaborationRequestMessage } from "../../../apis/first-approval-api"
import { PersonalData } from "./PersonalData"
import { PotentialPublicationData } from "./PotentialPublicationData"
import { FinalDraftAttachedByDataUser } from "./FinalDraftAttachedByDataUser"
import { UploadedFinalDraftPayload } from "./UploadedFinalDraftPayload"
import { CollaborationMessageFile } from "./FileElement"
import { AuthorApprovedPayload } from "./AuthorApprovedPayload"
import { AuthorDeclinedPayload } from "./AuthorDeclinedPayload"
import { PrefilledAgreementPayload } from "./PrefilledAgreementPayload"
import { DownloadedPublicationCollaborationChatStore } from "../../publication/store/DownloadedPublicationCollaborationChatStore"
import { showStepsInfo } from "./StepsInfo"
import { confirmThatProvidedInfoIsReal } from "../chat/action/ConfirmThatProvidedInfoIsReal"
import { doneWhatsNext } from "../chat/action/DoneWhatsNext"
import { AuthorHas14DaysToMakeRevisionsAndApprove } from "./AuthorHas14DaysToMakeRevisionsAndApprove"
import { AssistantCollaborationDeclined } from "./AssistantCollaborationDeclined"
import { FormalizedAgreementPayload } from "./FormalizedAgreementPayload"
import { YourCollaborationIsEstablished } from "./YourCollaborationIsEstablished"
import { AssistantFinalDraftAttachedByDataUser } from "./AssistantFinalDraftAttachedByDataUser"
import { AssistantManuscriptApproved } from "./AssistantManuscriptApproved"
import { AllAuthorsConfirmed } from "./AllAuthorsConfirmed"
import { PotentialPublicationDataForm } from "./PotentialPublicationDataForm"
import { PersonalDataForm } from "./PersonalDataForm"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"

export function createMessageRenderers(collaborationChatStore: CollaborationChatStoreInterface) {
  return {
    [CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL]: (message) => <PersonalData message={message} />,
    [CollaborationMessageType.DONE_WHATS_NEXT]: (message) => <PotentialPublicationData message={message} />,
    [CollaborationMessageType.UPLOAD_FINAL_DRAFT]: (message) => (
      <UploadedFinalDraftPayload message={message} />
    ),
    [CollaborationMessageType.ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER]: (message) => <FinalDraftAttachedByDataUser message={message} />,
    [CollaborationMessageType.FORMALIZED_AGREEMENT]: () => <CollaborationMessageFile
      link="/docs/FA_Collaboration_Agreement_template.pdf" />,
    [CollaborationMessageType.AUTHOR_APPROVED]: (message) => <AuthorApprovedPayload message={message} />,
    [CollaborationMessageType.AUTHOR_DECLINED]: (message) => <AuthorDeclinedPayload message={message} />,
    [CollaborationMessageType.PREFILLED_COLLABORATION_AGREEMENT]: (message) => (
      <PrefilledAgreementPayload
        message={message}
        chatStore={collaborationChatStore as DownloadedPublicationCollaborationChatStore}
      />
    ),
    [CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET]: () => showStepsInfo(),
    [CollaborationMessageType.VERIFY_YOUR_NAME_AND_AFFILIATION]: (message) =>
      !collaborationChatStore.existsByType(CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL) && (
        <PersonalDataForm
          message={message}
          action={confirmThatProvidedInfoIsReal}
          store={collaborationChatStore as DownloadedPublicationCollaborationChatStore}
        />
      ),
    [CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE]: (message) =>
      !collaborationChatStore.existsByType(CollaborationMessageType.DONE_WHATS_NEXT) && (
        <PotentialPublicationDataForm
          store={collaborationChatStore as DownloadedPublicationCollaborationChatStore}
          action={doneWhatsNext}
        />
      ),
    [CollaborationMessageType.AUTHOR_HAS_14_DAYS_TO_MAKE_REVISIONS_AND_APPROVE]: () => <AuthorHas14DaysToMakeRevisionsAndApprove />,
    [CollaborationMessageType.I_WOULD_LIKE_TO_INCLUDE_YOU]: (message) => <PotentialPublicationData message={message} />,
    [CollaborationMessageType.ASSISTANT_COLLABORATION_DECLINED]: () => <AssistantCollaborationDeclined />,
    [CollaborationMessageType.ASSISTANT_CREATE]: (message) => (
      <FormalizedAgreementPayload message={message} chatStore={collaborationChatStore} />
    ),
    [CollaborationMessageType.YOUR_COLLABORATION_IS_ESTABLISHED]: (message) => (
      <YourCollaborationIsEstablished message={message} chatStore={collaborationChatStore} />
    ),
    [CollaborationMessageType.ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER]: () => <AssistantFinalDraftAttachedByDataUser />,
    [CollaborationMessageType.ASSISTANT_MANUSCRIPT_APPROVED]: () => <AssistantManuscriptApproved />,
    [CollaborationMessageType.ALL_AUTHORS_CONFIRMED]: () => <AllAuthorsConfirmed />
  } satisfies Partial<Record<CollaborationMessageType, (message: CollaborationRequestMessage) => React.ReactNode>>;
}
