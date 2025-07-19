import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import {
  AuthorShortInfo,
  CollaborationMessageAuthorsPayload,
  CollaborationRequestMessage
} from "../../../apis/first-approval-api"
import { getAuthorFullName } from "../../../util/userUtil"
import { mapAuthorWithLink } from "../utils"
import { FlexWrapColumn } from "../../common.styled"

export const AuthorApprovedPayload = observer((
  props: { message: CollaborationRequestMessage }
): ReactElement => {
  const { message, } = props
  const authorsPayload = message.payload!! as CollaborationMessageAuthorsPayload

  const lines: ReactElement[] = [];
  const mappedAuthor = mapAuthorWithLink(authorsPayload.decisionAuthor!!);

  if (authorsPayload.expectedApprovingAuthors?.length) {
    const mappedExpectedApprovingAuthors = formatObjectInfo(authorsPayload.expectedApprovingAuthors ?? []);
    lines.push(...mappedExpectedApprovingAuthors)
  }

  return (
    <FlexWrapColumn>
      <span>Congratulations!</span>
      {authorsPayload.decisionAuthorComment ?
        <>
          <span>{mappedAuthor} has confirmed the text of the drafted manuscript with following comments:</span>
          <ul style={{marginTop: 4}}>
            <li style={{fontStyle: 'italic'}}>“{authorsPayload.decisionAuthorComment}“</li>
          </ul>
        </>
        :
        <span>{mappedAuthor} has confirmed the text of the drafted manuscript.</span>
      }
      {lines.length &&
        <>
          <span>We are still waiting for confirmation from:</span>
          <ul style={{marginTop: 4}}>
            {lines}
          </ul>
        </>
      }
    </FlexWrapColumn>
  )
})

function formatObjectInfo(authors: AuthorShortInfo[]): ReactElement[] {
  return authors
    .map((author, index) =>
        <li key={index}>
          {mapAuthorWithLink(author)}
        </li>
    )
}
