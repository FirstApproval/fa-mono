import { observer } from "mobx-react-lite"
import { CollaborationDataUserPayload, CollaborationRequestMessage } from "../../../apis/first-approval-api"
import React, { ReactElement } from "react"
import { getFullName } from "../../../util/userUtil"

export const FinalDraftAttachedByDataUser  = observer((
  props: { message: CollaborationRequestMessage }
): ReactElement => {
  debugger;
  const { message } = props;
  const payload = message.payload as CollaborationDataUserPayload;
  const dataUserFullName = getFullName(payload.dataUser!!);
  return (
    <div>
      <span>
        UPD: {dataUserFullName} attached a preview of the manuscript of their publication:
      </span>
      <span>
        You will have 2 weeks to read the article and decide whether to accept or decline co-authorship.
        You can ask questions or provide your suggestions to the author via private messages.
        We recommend starting this process well in advance.
        If you do not approve the request within 2 weeks, you will lose the opportunity for co-authorship in this article.
        If you decline, the data user will simply cite your dataset.
      </span>
    </div>
  )}
)
