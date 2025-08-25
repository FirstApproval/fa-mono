import { observer } from "mobx-react-lite"
import {
  AssistantCreatePayload,
  CollaborationDataUserPayload,
  CollaborationMessageAuthorsPayload,
  CollaborationRequestMessage
} from "../../../apis/first-approval-api"
import React, { ReactElement } from "react"
import { getCurrentWorkplacesString, getFullName } from "../../../util/userUtil"
import { DescriptionOutlined } from "@mui/icons-material"
import styled from "@emotion/styled"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"
import { FlexWrapColumn, HeightElement } from "../../common.styled"
import { userStore } from "../../../core/user"
import chat from "../chat/Chat"
import _ from "lodash"

export const FormalizedAgreementPayload = observer((
  props: { message: CollaborationRequestMessage, chatStore: CollaborationChatStoreInterface }
): ReactElement => {
  const {
    message,
    chatStore
  } = props
  const collaborationAgreementFile = getPublicationAuthorCollaborationAgreementFile(message, chatStore)
  const payload = message.payload as AssistantCreatePayload;
  const dataUserFullName = `${payload.firstName} ${payload.lastName}`
  const affiliations = getCurrentWorkplacesString(payload.workplaces)

  return (
    <FlexWrapColumn>
      <span>{dataUserFullName} plans to use your dataset in his research and would like to include you as a co-author in an upcoming publication.
        Below are the details of the proposed collaboration:</span>
      <br />
      <FlexWrapColumn>
        <span><b>📄 Data User Information</b></span>
        <span><b>Name: </b>{dataUserFullName}</span>
        <span><b>Affiliation: </b>{affiliations}</span>
        <span><b>Email: </b>{chatStore.collaborationRequestCreator!!.email}</span>
      </FlexWrapColumn>
      <br />
      <FlexWrapColumn>
        <span><b>📝 Publication Plans</b></span>
        <span><b>Tentative Title: </b>{payload.potentialPublicationTitle}</span>
        <span><b>Type of Publication: </b>{_.capitalize(payload.typeOfWork.toLowerCase().replace('_', ' '))}</span>
        <span><b>Comments: </b>{payload.detailsOfResearch}</span>
        <span><b>Target Journal: </b>{payload.intendedJournalForPublication}</span>
        <br />
        <span>
          <i>
            Please note: the target journal is not included in
            the agreement and may change depending on the final scope and results of the study.
          </i>
        </span>
      </FlexWrapColumn>
      <br />

      <span><b>🤝 Collaboration Summary</b></span>
      <span>By approving this collaboration:</span>
      <ul>
        <li>
          You will be formally included as a co-author on the resulting publication.
          The Data User will be required to send you the final draft at least 30 days before submission, to allow you to review and approve how your dataset is used.
        </li>
        <li>
          You may receive follow-up questions, suggestions for interpretation, or requests for clarification — please be open to sharing your expertise and advising on the analysis, where possible.
        </li>
      </ul>
      <HeightElement value="10px"/>
      <span>By declining the collaboration:</span>
      <ul>
        <li>
          You authorize the Data User to reuse the dataset under the standard license, but without including you as a co-author.
        </li>
        <li>
          Instead, your dataset will be referenced using the <b>Standard Citation</b>.
        </li>
      </ul>
      <span>
        <b>📎 Attached: </b> First Approval Collaboration Agreement (pre-filled by {dataUserFullName})
      </span>
      {collaborationAgreementFile}
    </FlexWrapColumn>
  )
})

function getPublicationAuthorCollaborationAgreementFile (
  message: CollaborationRequestMessage,
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

const CustomUL = styled.ul`
  list-style: none;
  padding-left: 1.2em;

  li {
    position: relative;
    padding-left: 1em;
    color: black;
  }

  li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: black;
  }
`;
