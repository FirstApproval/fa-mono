import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import {
  AuthorShortInfo,
  CollaborationMessageAuthorsPayload,
  CollaborationRequestMessage
} from "../../../apis/first-approval-api"
import { Link } from "@mui/material"
import { profilePath } from "../../../core/router/constants"
import { getAuthorFullName } from "../../../util/userUtil"

export const AuthorApprovedPayload = observer((
  props: { message: CollaborationRequestMessage }
): ReactElement => {
  const { message, } = props
  const authorsPayload = message.payload!! as CollaborationMessageAuthorsPayload

  const lines = formatObjectInfo(authorsPayload.expectedApprovingAuthors ?? []);

  return (
    <ul style={{marginTop: 4}}>
      {lines}
    </ul>
  )
})

function formatObjectInfo(authors: AuthorShortInfo[]): ReactElement[] {
  return authors
    .map(author =>
        <li>
          {author.username ?
            <Link href={`${profilePath}/${author.username}`}
                  target="_blank"
                  sx={{
                    textDecoration: 'underline',
                    textDecorationColor: 'black',
                    textDecorationThickness: '1.5px',
                    textUnderlineOffset: '2px',
                    color: 'black'
                  }}
            >
              {getAuthorFullName(author)}
            </Link> :
            <span>{getAuthorFullName(author)}</span>
          }
        </li>
    )
}
