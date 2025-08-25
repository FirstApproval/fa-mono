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
import { AssistantManuscriptApproved } from "./AssistantManuscriptApproved"
import { AllAuthorsConfirmed } from "./AllAuthorsConfirmed"
import { PotentialPublicationDataForm } from "./PotentialPublicationDataForm"
import { PersonalDataForm } from "./PersonalDataForm"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"
import { IWouldLikeToIncludeYouAsCoAuthor } from "./IWouldLikeToIncludeYouAsCoAuthor"
import { DatasetWasDownloaded } from "./DatasetWasDownloaded"
import { AgreeToTheTermsOfCollaboration } from "./AgreeToTheTermsOfCollaboration"
import { GreatFirstStepIsCompleted } from "./GreatFirstStepIsCompleted"
import { DataUserPayload } from "./DataUserPayload"
import { ShowAuthorsEmails } from "./ShowAuthorsEmails"
import { AllDataAuthorsRespondedToCollaborationRequest } from "./AllDataAuthorsRespondedToCollaborationRequest"
import { HeightElement } from "../../common.styled"

export function createMessageRenderers(collaborationChatStore: CollaborationChatStoreInterface) {
  return {
    [CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL]: (message) => <PersonalData message={message} />,
    [CollaborationMessageType.DONE_WHATS_NEXT]: (message) => <PotentialPublicationData message={message} />,
    [CollaborationMessageType.UPLOAD_FINAL_DRAFT]: (message) => (
      <UploadedFinalDraftPayload message={message} />
    ),
    [CollaborationMessageType.ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER]: (message) => <FinalDraftAttachedByDataUser message={message} />,
    [CollaborationMessageType.FORMALIZED_AGREEMENT]: () =>
    <div>
      <span>
        The collaboration request (1 step) is a formalized agreement. I'll help you fill it out.
        The agreement is sent to each author individually.
        It will contain your details and preliminary information about the work you are doing. Here is how the template looks:
      </span>
      <HeightElement value="12px" />
      <CollaborationMessageFile link="/docs/FA_Collaboration_Agreement_template.pdf" fileName="FA Collaboration Agreement template.pdf"/>
    </div>,
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
      !collaborationChatStore.existsByType(CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL) ? (
        <PersonalDataForm
          message={message}
          action={confirmThatProvidedInfoIsReal}
          store={collaborationChatStore as DownloadedPublicationCollaborationChatStore}
        />
      ) : <p>I confirm that provided info is real</p>,
    [CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE]: (message) =>
      !collaborationChatStore.existsByType(CollaborationMessageType.DONE_WHATS_NEXT) ? (
        <PotentialPublicationDataForm
          store={collaborationChatStore as DownloadedPublicationCollaborationChatStore}
          action={doneWhatsNext}
        />
      ) :
        <p>
          Thank you! Now, propose a potential name and type of publication,
          and specify the details of the research in which you would like to use
          the dataset to ensure that Dataset Authors are
          well-informed about ideas for future collaborative publications, please.
        </p>,
    [CollaborationMessageType.AUTHOR_HAS_14_DAYS_TO_MAKE_REVISIONS_AND_APPROVE]: () => <AuthorHas14DaysToMakeRevisionsAndApprove />,
    [CollaborationMessageType.I_WOULD_LIKE_TO_INCLUDE_YOU]: (message) => <PotentialPublicationData message={message} />,
    [CollaborationMessageType.ASSISTANT_COLLABORATION_DECLINED]: () => <AssistantCollaborationDeclined />,
    [CollaborationMessageType.ASSISTANT_MANUSCRIPT_DECLINED]: () => <AssistantCollaborationDeclined />,
    [CollaborationMessageType.ASSISTANT_CREATE]: (message) => (
      <FormalizedAgreementPayload message={message} chatStore={collaborationChatStore} />
    ),
    [CollaborationMessageType.YOUR_COLLABORATION_IS_ESTABLISHED]: (message) => (
      <YourCollaborationIsEstablished message={message} chatStore={collaborationChatStore} />
    ),
    [CollaborationMessageType.YOUR_COLLABORATION_IS_DECLINED]: (message) => (
      <AuthorDeclinedPayload message={message} />
    ),
    // [CollaborationMessageType.ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER]: () => <AssistantFinalDraftAttachedByDataUser />,
    [CollaborationMessageType.ASSISTANT_MANUSCRIPT_APPROVED]: () => <AssistantManuscriptApproved />,
    [CollaborationMessageType.ALL_AUTHORS_CONFIRMED]: () => <AllAuthorsConfirmed />,
    [CollaborationMessageType.I_WOULD_LIKE_TO_INCLUDE_YOU]: () => <IWouldLikeToIncludeYouAsCoAuthor />,
    [CollaborationMessageType.DATASET_WAS_DOWNLOADED]: () => <DatasetWasDownloaded publication={collaborationChatStore.publication!!}/>,
    [CollaborationMessageType.AGREE_TO_THE_TERMS_OF_COLLABORATION]: () => <AgreeToTheTermsOfCollaboration />,
    [CollaborationMessageType.APPROVE_MANUSCRIPT]: () => <span>Approve manuscript</span>,
    [CollaborationMessageType.APPROVE_COLLABORATION]: () => <span>Approve collaboration</span>,
    [CollaborationMessageType.DECLINE_COLLABORATION]: () => <span>Decline collaboration</span>,
    [CollaborationMessageType.DECLINE_MANUSCRIPT]: () => <span>Decline collaboration</span>,
    [CollaborationMessageType.FIRST_STEP_IS_COMPLETED]: () => <GreatFirstStepIsCompleted />,
    [CollaborationMessageType.EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST]: () => <span>Everything is correct. Sign and send request.</span>,
    [CollaborationMessageType.GOT_IT_READY_TO_START]: () => <span>Got it. I am ready to start.</span>,
    [CollaborationMessageType.LETS_MAKE_COLLABORATION_REQUEST]: () => <span>Great, Let’s make the Collaboration request</span>,
    [CollaborationMessageType.I_WOULD_LIKE_TO_COLLABORATE]: () => <span>I`d like to collaborate! Tell me more...</span>,
    [CollaborationMessageType.ALL_DATA_AUTHORS_RESPONDED_TO_COLLABORATION_REQUEST]: () => <AllDataAuthorsRespondedToCollaborationRequest />,
    [CollaborationMessageType.ALL_DATA_AUTHORS_DECLINED_COLLABORATION_REQUEST]: () =>
      <p>
        Unfortunately, all data authors have declined your request for collaboration.
        As no collaboration agreement has been signed, you may still use the dataset
        in your work under the terms of its license, applying the Standard Citation.
      </p>,
    [CollaborationMessageType.EMAIL_DATA_USER]: () => <DataUserPayload chatStore={collaborationChatStore} />,
    [CollaborationMessageType.ASK_DATA_AUTHOR]: () => <span>Ask data author</span>,
    [CollaborationMessageType.ASK_DATA_USER]: () => <span>Ask data user</span>,
    [CollaborationMessageType.SHOW_AUTHORS_EMAILS]: () => <span>Show author(s) emails</span>,
    [CollaborationMessageType.SHOW_AUTHORS_EMAILS_RESPONSE]: () => <ShowAuthorsEmails chatStore={collaborationChatStore}/>,
  } satisfies Partial<Record<CollaborationMessageType, (message: CollaborationRequestMessage) => React.ReactNode>>;
}
