import { CollaborationRequestMessage } from "../../../apis/first-approval-api"
import { DescriptionOutlined } from "@mui/icons-material"
import { getFullName } from "../../../util/userUtil"
import React from "react"
import styled from "@emotion/styled"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"

export function getPublicationCreatorCollaborationAgreementLink (
  message: CollaborationRequestMessage,
  chatStore: CollaborationChatStoreInterface
) {
  const creator = chatStore.publicationCreator
  return <FileElement>
    <DescriptionOutlined style={{ marginRight: "12px" }} />
    <span
      onClick={async () => {
        try {
          const fileName =
            `${getFullName(chatStore.publicationCreator!!)} - FA Collaboration Agreement ${chatStore.publication?.id}.pdf`
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
    {getFullName(chatStore.publicationCreator!!)} - FA Collaboration Agreement {chatStore.publication?.id}.pdf
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
  cursor: pointer;
`;
