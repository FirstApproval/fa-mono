import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import {
  CollaborationMessageAuthorsPayload,
  CollaborationRequestMessage
} from "../../../apis/first-approval-api"
import { mapAuthorWithLink } from "../utils"
import { FlexWrapColumn } from "../../common.styled"

export const AuthorDeclinedPayload = observer((
  props: { message: CollaborationRequestMessage }
): ReactElement => {
  const { message, } = props
  const authorsPayload = message.payload!! as CollaborationMessageAuthorsPayload

  const mappedDecisionAuthor = mapAuthorWithLink(authorsPayload.decisionAuthor!!);

  const mappedExpectedApprovingAuthors = authorsPayload.expectedApprovingAuthors?.map(
    (author, index) =>
      <React.Fragment key={author.username ?? index}>
        {index > 0 && ", "}
        {mapAuthorWithLink(author)}
      </React.Fragment>
  )

  return (
    <FlexWrapColumn>
      <span>
        Unfortunately, {mappedDecisionAuthor} has decided not to continue the collaboration.
      </span>
      {
        mappedExpectedApprovingAuthors?.length &&
        <span>
          However, you are still collaborating with {mappedExpectedApprovingAuthors}.
        </span>
      }
      <span>
        According to the Collaboration Agreement, termination of the agreement
        means that {mappedDecisionAuthor} will not be included as a co-author in the publication.
      </span>
    </FlexWrapColumn>
  )
})
