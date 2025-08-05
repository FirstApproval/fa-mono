import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import { FlexWrapColumn } from "../../common.styled"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"
import { mapAuthorWithLink } from "../utils"

export const ShowAuthorsEmails = observer((
  props: { chatStore: CollaborationChatStoreInterface }
): ReactElement => {
  const { chatStore } = props

  return (
    <FlexWrapColumn>
      <span>
        "While we are working on the FA chat feature, you can contact the authors using their emails:
      </span>
      <ul>
        {chatStore.publication!!.authors!!.map(author =>
          <li>
            {mapAuthorWithLink(author.user!!)}{' - '}
            <a style={{ cursor: "pointer" }} href={`mailto:${author.email}`}>
              {author.email}
            </a>
          </li>
        )}
      </ul>
    </FlexWrapColumn>
  )
})
