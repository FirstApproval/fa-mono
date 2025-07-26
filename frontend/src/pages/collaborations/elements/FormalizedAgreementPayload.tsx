import { observer } from "mobx-react-lite"
import {
  CollaborationRequestMessage,
} from "../../../apis/first-approval-api"
import React, { ReactElement } from "react"
import { getFullName } from "../../../util/userUtil"
import { DescriptionOutlined } from "@mui/icons-material"
import styled from "@emotion/styled"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"
import { FlexWrapColumn } from "../../common.styled"

export const FormalizedAgreementPayload = observer((
  props: { message: CollaborationRequestMessage, chatStore: CollaborationChatStoreInterface }
): ReactElement => {
  const { message, chatStore, } = props
  const collaborationAgreementFile = getPublicationCreatorCollaborationAgreementFile(message, chatStore);
  const dataUserFullName = getFullName(chatStore.collaborationRequestCreator!!);

  return (
    <FlexWrapColumn>
      <span>{dataUserFullName} plans to use your dataset in his research and wants to include you as a co-author of his article.</span>
      <span>This is First Approval collaboration agreement pre-filled by {dataUserFullName}:</span>
      {collaborationAgreementFile}
      <ul>
        <li>
          By approving to the collaboration, you oblige data user to include you as a co-author.
          <ul>
            <li style={{color: 'black'}}>The data user will also be required to provide a 14-day notice before sending you the final version of the article.</li>
          </ul>
        </li>
        <li>
          By declining a collaboration, you oblige data user to simply quote your dataset, without specifying you as a co-author.
        </li>
      </ul>
    </FlexWrapColumn>
  )
})

function getPublicationCreatorCollaborationAgreementFile (
  message: CollaborationRequestMessage,
  chatStore: CollaborationChatStoreInterface
) {
  const fileName =
    `${getFullName(chatStore.publicationCreator!!)} - FA Collaboration Agreement ${chatStore.publication?.id}.pdf`
  debugger;
  return <FileElement>
    <DescriptionOutlined style={{ marginRight: "12px" }} />
    <span
      onClick={async () => {
        try {
          await chatStore.getCollaborationAgreementFile(chatStore.publicationCreatorAuthor!!.id!!, fileName);
        } catch (err) {
          console.error('Error downloading collaboration agreement:', err);
          alert('Error downloading collaboration agreement')
        }
      }}
      style={{
        cursor: 'pointer',
        color: 'black',
        textDecoration: 'none',
        display: 'inline-block'
      }}
    >
    {fileName}
  </span>
  </FileElement>
}

const FileElement = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: 48px;
  border-radius: 4px;
  background-color: #F3F2F5;
  padding: 8px 12px;
  margin-top: 12px;
  margin-bottom: 12px;
  cursor: pointer;
`;

