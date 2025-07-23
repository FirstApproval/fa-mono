import { observer } from "mobx-react-lite"
import {
  CollaborationRequestMessage,
  PrefilledCollaborationAgreementPayload
} from "../../../apis/first-approval-api"
import React, { ReactElement } from "react"
import { getFullName } from "../../../util/userUtil"
import { DownloadedPublicationCollaborationChatStore } from "../../publication/store/DownloadedPublicationCollaborationChatStore"
import { DescriptionOutlined } from "@mui/icons-material"
import styled from "@emotion/styled"
import { HeightElement } from "../../common.styled"

export const PrefilledAgreementPayload = observer((
  props: { message: CollaborationRequestMessage, chatStore: DownloadedPublicationCollaborationChatStore }
): ReactElement => {
  const { message, chatStore, } = props
  const payload = message.payload!! as PrefilledCollaborationAgreementPayload;
  const authors = payload.authors ?? [];

  const collaborationAgreementTemplate = getPublicationCreatorCollaborationAgreementLink(message, chatStore);

  const mappedAuthorsAgreements = authors?.map(
    (author, index) =>
      <li key={author.username ?? index.toString()}
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationColor: 'black',
            textDecorationThickness: '1.5px',
            textUnderlineOffset: '2px'
          }}
          onClick={async () => {
            try {
              debugger;
              await chatStore.getCollaborationAgreementFile(author.id!!);
            } catch (err) {
              console.error('Error downloading collaboration agreement:', err);
              alert('Error downloading collaboration agreement')
            }
          }
          }>
        {getFullName(author)} - FA Collaboration Agreement.pdf
      </li>
  );

  return (
    <div>
      <span>Good job! Here is a pre-filled (unsigned) collaboration agreement with the corresponding author:</span>
      {collaborationAgreementTemplate}
      <span>And the rest of agreements (they differ only in information about the data authors):</span>
      {mappedAuthorsAgreements}
      <HeightElement value={'20px'} />
      <span>
        Please review the agreement(s), and if all information is correct, sign and send it them by clicking the button below.
      </span>
    </div>
  )
})

function getPublicationCreatorCollaborationAgreementLink (
  message: CollaborationRequestMessage,
  chatStore: DownloadedPublicationCollaborationChatStore
) {
  const creator = chatStore.publicationCreator
  return <FileElement>
    <DescriptionOutlined style={{ marginRight: "12px" }} />
    <span
      onClick={async () => {
        try {
          await chatStore.getCollaborationAgreementFile(chatStore.publicationCreatorAuthor!!.id!!);
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
    {getFullName(chatStore.publicationCreator!!)} FA Collaboration Agreement {chatStore.publication?.id}.pdf
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

