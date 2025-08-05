import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import { FlexWrapColumn } from "../../common.styled"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"
import { getFullName } from "../../../util/userUtil"

export const DataUserPayload = observer((
  props: { chatStore: CollaborationChatStoreInterface }
): ReactElement => {
  const { chatStore } = props
  const collaborationRequestCreator = chatStore.collaborationRequestCreator!!

  const mappedDataUser = `• ${getFullName(collaborationRequestCreator)} - ${collaborationRequestCreator.email ?? "no email"}`
  return (
    <FlexWrapColumn>
      <span>
        While we are working on the FA chat feature, you can contact the data user by email: {mappedDataUser}
      </span>
    </FlexWrapColumn>
  );
})
