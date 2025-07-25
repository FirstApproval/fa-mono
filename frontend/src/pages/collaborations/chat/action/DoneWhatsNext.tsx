import {
  CollaborationMessageType,
  CollaborationRequestMessage
} from "../../../../apis/first-approval-api"
import { UserAction } from "./UserAction"
import { DownloadedPublicationCollaborationChatStore } from "../../../publication/store/DownloadedPublicationCollaborationChatStore"
import { getFullName } from "../../../../util/userUtil"
import React from "react"

function doneWhatsNextAction(collaborationChatStore: DownloadedPublicationCollaborationChatStore): void {
  const doneWhatsNextMessage = {
    type: CollaborationMessageType.DONE_WHATS_NEXT,
    isAssistant: false,
    payload: {
      potentialPublicationTitle: collaborationChatStore.potentialPublicationName!!,
      typeOfWork: collaborationChatStore.typeOfWork!!,
      intendedJournalForPublication: collaborationChatStore.intendedJournalForPublication,
      detailsOfResearch: collaborationChatStore.detailsOfResearch,
      type: CollaborationMessageType.DONE_WHATS_NEXT,
    },
    text: "Done. What’s next?"
  }

  const prefilledCollaborationAgreementMessage = createPrefilledAgreementMessage(collaborationChatStore);
  collaborationChatStore.sendMessages([doneWhatsNextMessage, prefilledCollaborationAgreementMessage]).then();
}

export const doneWhatsNext: UserAction = {
  text: 'Done. What’s next?',
  action: (collaborationChatStore: DownloadedPublicationCollaborationChatStore) => doneWhatsNextAction(collaborationChatStore)
}

function createPrefilledAgreementMessage(
  collaborationChatStore: DownloadedPublicationCollaborationChatStore
): CollaborationRequestMessage {
    const creator = collaborationChatStore.publication!!.creator!!;
    const otherAuthors = collaborationChatStore.publication!!.authors!!
      .filter(author => author.user && author.user!!.id !== creator.id)

    return {
      type: CollaborationMessageType.PREFILLED_COLLABORATION_AGREEMENT,
      isAssistant: true,
      payload: { "authors": otherAuthors, type: CollaborationMessageType.PREFILLED_COLLABORATION_AGREEMENT }
    };
}
