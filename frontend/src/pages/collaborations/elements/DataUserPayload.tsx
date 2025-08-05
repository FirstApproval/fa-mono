import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import { FlexWrapColumn } from "../../common.styled"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"
import { mapAuthorWithLink } from "../utils"

export const DataUserPayload = observer((
  props: { chatStore: CollaborationChatStoreInterface }
): ReactElement => {
  const { chatStore } = props
  const collaborationRequestCreator = chatStore.collaborationRequestCreator!!

  return (
    <FlexWrapColumn>
      <span>
        While we are working on the FA chat feature, you can contact the data user by email:
      </span>
      <ul>
        <li>
          {mapAuthorWithLink(collaborationRequestCreator)}{' - '}
          <a style={{ cursor: "pointer" }} href={`mailto:${collaborationRequestCreator.email}`}>
            {collaborationRequestCreator.email}
          </a>
        </li>
      </ul>
    </FlexWrapColumn>
  )
})
