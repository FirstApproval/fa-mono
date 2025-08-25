import { observer } from "mobx-react-lite"
import { CollaborationRequestMessage } from "../../../apis/first-approval-api"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"
import React, { ReactElement } from "react"
import { getFullName } from "../../../util/userUtil"
import { userStore } from "../../../core/user"
import { DescriptionOutlined } from "@mui/icons-material"
import styled from "@emotion/styled"

export const AssistantCollaborationRequestApproved = observer((
  props: { chatStore: CollaborationChatStoreInterface }
): ReactElement => {
  const { chatStore } = props
  const collaborationAgreementFile = getPublicationAuthorCollaborationAgreementFile(chatStore)

  return (
    <div style={{marginTop: '20px'}}>
      <span><b>Thank you — the collaboration has been approved ✅</b></span>
      <p>
        You are now officially a <b>collaborator</b> with the Data User.
        They plan to use your dataset in their research and have already begun shaping how it will be used in an upcoming publication.
      </p>
        <p>
          📚 Preparing a scientific article is a complex and time-consuming process.
          The Data User may reach out to you by email — to ask questions, request clarification, or simply keep you informed about progress.
          We encourage you to stay open to communication and offer support when possible.
        </p>
      <p>
        📝 Under the terms of the agreement, your main responsibility as a
        Data Author is to <b>review the final draft</b> of the manuscript to ensure the correctness of the data analysis and the text as a whole.
        ⏳ You will have <b>30 days</b> to do this, starting from the date the final draft is submitted to you.
        However, you are welcome to coordinate with the Data User and agree on a shorter review period or a more convenient format if needed.
      </p>

      <span>📎 <b>Attached</b> you will find the Collaboration Agreement, signed by both parties.</span>
      {collaborationAgreementFile}
    </div>
  );
})

function getPublicationAuthorCollaborationAgreementFile (
  chatStore: CollaborationChatStoreInterface
) {
  const fileName =
    `${getFullName(userStore.user!!)} - FA Collaboration Agreement ${chatStore.publication?.id}.pdf`
  debugger;
  return <FileElement>
    <DescriptionOutlined style={{ marginRight: "12px" }} />
    <span
      onClick={async () => {
        try {
          await chatStore.getCollaborationAgreementFile(chatStore.publicationCreatorAuthor!!.id!!, fileName);
        } catch (err) {
          console.error('Error downloading collaboration agreement:', err);
          alert('Error downloading collaboration agreement');
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
