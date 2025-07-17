import { CollaborationMessageType, CollaborationPotentialPublicationData } from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"
import { DownloadedPublicationCollaborationChatStore } from "../../../publication/store/DownloadedPublicationCollaborationChatStore"
import { getFullName } from "../../../../util/userUtil"
import React from "react"

function doneWhatsNextAction(collaborationChatStore: DownloadedPublicationCollaborationChatStore): void {
  const payload: CollaborationPotentialPublicationData = {
    potentialPublicationTitle: collaborationChatStore.potentialPublicationName!!,
    typeOfWork: collaborationChatStore.typeOfWork!!,
    expectedPublicationDate: collaborationChatStore.expectedPublicationDate!!,
    intendedJournalForPublication: collaborationChatStore.intendedJournalForPublication,
    detailsOfResearch: collaborationChatStore.detailsOfResearch,
    type: CollaborationMessageType.DONE_WHATS_NEXT,
  }
  debugger;
  collaborationChatStore.sendMessage({
    type: CollaborationMessageType.DONE_WHATS_NEXT,
    isAssistant: false,
    payload,
    text: "Done. What’s next?"
  }).then(response => {
    const creator = collaborationChatStore.publication!!.creator!!;
    const otherAuthors = collaborationChatStore.publication!!.authors!!
      .filter(author => author.user!!.id !== creator.id)

    const mappedAuthors = otherAuthors.map(
      author => {`• ${author!!.firstName} ${author!!.lastName} FA Collaboration Agreement.pdf`}
    ).join('\n');
    collaborationChatStore.sendMessage({
      type: CollaborationMessageType.PREFILLED_COLLABORATION_AGREEMENT,
      isAssistant: true,
      text: (
        "Good job! Here is a pre-filled (unsigned) collaboration agreement with the corresponding author: \n" +
        `${getFullName(creator)} - FA Collaboration Agreement.pdf` +
        "And the rest of agreements (they differ only in information about the data authors): \n" +
        `${mappedAuthors}\n` +
        "Please review the agreement(s), and if all information is correct, sign and send it them by clicking the button below."
      )
    }, CollaborationMessageType.PREFILLED_COLLABORATION_AGREEMENT).then();
  }).then();
}

export const doneWhatsNext: UserAction = {
  text: 'Done. What’s next?',
  action: (collaborationChatStore: DownloadedPublicationCollaborationChatStore) => doneWhatsNextAction(collaborationChatStore)
}
