import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import {
  CollaborationPotentialPublicationData,
  CollaborationRequestMessage,
} from "../../../apis/first-approval-api"
import _ from "lodash"

export const PotentialPublicationData = observer((
  props: { message: CollaborationRequestMessage }
): ReactElement => {
  const { message, } = props
  const potentialPublicationData: CollaborationPotentialPublicationData = message.payload!! as CollaborationPotentialPublicationData
  const lines: string[] = []
  debugger;

  if (potentialPublicationData.potentialPublicationTitle)
    lines.push(`Potential publication title: ${potentialPublicationData.potentialPublicationTitle}`)
  if (potentialPublicationData.type)
    lines.push(`Type: ${_.capitalize(potentialPublicationData.typeOfWork.toLowerCase().replace('_', ' '))}`);
  if (potentialPublicationData.expectedPublicationDate)
    lines.push(`Expected publication date: ${potentialPublicationData.expectedPublicationDate}`);
  if (potentialPublicationData.intendedJournalForPublication)
    lines.push(`Intended journal for publication: ${potentialPublicationData.intendedJournalForPublication}`);
  if (potentialPublicationData.detailsOfResearch)
    lines.push(`Intended journal for publication: ${potentialPublicationData.detailsOfResearch}`);

  return (
    <ul>
      {lines.map(line => <li>{line}</li>)}
    </ul>
  )
})
