import { observer } from "mobx-react-lite"
import { CollaborationRequestMessage, YourCollaborationIsEstablishedPayload } from "../../../apis/first-approval-api"
import React, { ReactElement } from "react"
import { getFullName } from "../../../util/userUtil"
import { FlexWrapColumn, HeightElement } from "../../common.styled"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"
import { getPublicationCreatorCollaborationAgreementLink } from "./CollaborationAgreementLink"
import { mapAuthorWithLink } from "../utils"

export const YourCollaborationIsEstablished = observer((
    props: { message: CollaborationRequestMessage, chatStore: CollaborationChatStoreInterface }): ReactElement => {
    const { message, chatStore } = props
    const { author } = message.payload as YourCollaborationIsEstablishedPayload
    const authorFullName = getFullName(author!!)
    const mappedAuthorLink = mapAuthorWithLink(author!!);
    const collaborationAgreementTemplate = getPublicationCreatorCollaborationAgreementLink(message, chatStore);
    return (
      <FlexWrapColumn>
        <span>
          ✅ Great news! Your collaboration is established. {authorFullName} has signed the Collaboration Agreement.
          You can find the signed agreement here:
        </span>
        <div style={{marginBottom: '12px'}}>
          {collaborationAgreementTemplate}
        </div>
        {author!!.email &&
          <span>
            {'You can also contact the Data Author by email: '}
            {mappedAuthorLink} - <a style={{ cursor: "pointer" }} href={`mailto:${author!!.email}`}>{author!!.email}</a>
          </span>
        }
      </FlexWrapColumn>
    )
  }
)
