import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import {
  CollaborationPotentialPublicationData,
  CollaborationRequestMessage
} from "../../../apis/first-approval-api"
import _ from "lodash"

export const UploadedFinalDraftPayload = observer((
  props: { message: CollaborationRequestMessage }
): ReactElement => {
  const { message, } = props
  const potentialPublicationData: CollaborationPotentialPublicationData = message.payload!! as CollaborationPotentialPublicationData

  const lines = formatObjectInfo(potentialPublicationData);

  return (
    <ul>
      {lines.map(line => <li>{line}</li>)}
    </ul>
  )
})

function formatObjectInfo(object: Record<string, any>): string[] {
  return Object.entries(object)
    .filter(([key, value]) => key !== 'type')
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => {
      const formattedKey = _.startCase(key)
      return `${formattedKey}: ${value}`
    })
}
