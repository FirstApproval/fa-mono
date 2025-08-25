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
        UPD: {dataUserFullName} has uploaded a final draft of the manuscript draft for your review:
      </span>
      <span>
        You now have <b>30 days</b> to read the manuscript and decide whether to approve or decline co-authorship.
        During this period, you are encouraged to ask questions, request clarifications, or suggest edits —
        feel free to communicate directly with the author via private messages.
      </span>
      <p>
        We recommend starting the review process as early as possible to allow time for thoughtful feedback and any potential revisions.
      </p>
      <p>
        ⚠️ If you do not approve the manuscript within 30 days, your co-authorship will not be confirmed for this article.
        In that case, the Data User will be allowed to publish the work with
        a <b>Standard Citation</b> of your dataset (without listing you as a co-author).
      </p>
    </div>
  )}
)
