import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import { CollaborationRequestMessage, CollaboratorPersonalData } from "../../../apis/first-approval-api"

export const PersonalData = observer((
  props: { message: CollaborationRequestMessage }
): ReactElement => {
  const { message, } = props
  const collaboratorPersonalInfo: CollaboratorPersonalData = message.payload!! as CollaboratorPersonalData
  const lines: string[] = []
  debugger;

  if (collaboratorPersonalInfo.firstName) {
    lines.push(`First name: ${collaboratorPersonalInfo.firstName}`)
  }
  if (collaboratorPersonalInfo.lastName) {
    lines.push(`Last name: ${collaboratorPersonalInfo.lastName}`)
  }

  debugger;
  const formattedWorkplaces = collaboratorPersonalInfo.workplaces.map(workplace => workplace.organization!!.name +
    `${workplace.department ? `, ${workplace.department}` : ""}` +
    `${workplace.address ? `, ${workplace.address}` : ""}`
  ).join("\n")
  debugger;
  lines.push(`Affiliations: ${formattedWorkplaces}`)

  return (
    <ul>
      {lines.map(line => <li>{line}</li>)}
    </ul>
  )
})
