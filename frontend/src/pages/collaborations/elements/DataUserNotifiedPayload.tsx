import { observer } from "mobx-react-lite"
import { CollaborationDataUserPayload, CollaborationRequestMessage } from "../../../apis/first-approval-api"
import React, { ReactElement } from "react"
import { getFullName } from "../../../util/userUtil"

export const DataUserNotifiedPayload  = observer((
  props: { message: CollaborationRequestMessage }
): ReactElement => {
  debugger;
  const { message } = props;
  const payload = message.payload as CollaborationDataUserPayload;
  const dataUserFullName = getFullName(payload.dataUser!!);
  return (
    <span>
      UPD: {dataUserFullName} notified you that he plans
      to send you the final version of the article in two weeks.
    </span>
  )}
)
