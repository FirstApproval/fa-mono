import styled from "@emotion/styled"
import React, { ReactElement, useEffect, useRef, useState } from "react"
import { SelfAvatar } from "../elements/AvatarNameBox"
import { HeightElement } from "../../common.styled"
import { css, Global } from "@emotion/react"
import highfiveImage from "../../../assets/fa-highfive.svg"
import { getFullName, getInitials, renderProfileImage } from "../../../util/userUtil"
import { CollaborationMessageType } from "src/apis/first-approval-api"
import { observer } from "mobx-react-lite"
import { CollaborationRequirementsModal, CommentsModal, Step1Modal, Step2Modal, Step3Modal, StyledApproveButton } from "./Modal"
import { Message } from "./ChatMessage"
import { UserActionsRegistry } from "./UserActionsRegistry"
import { DownloadedPublicationCollaborationChatStore } from "../../publication/store/DownloadedPublicationCollaborationChatStore"
import { UploadFinalDraftDialog } from "../elements/UploadFinalDraftDialog"
import { DescriptionOutlined } from "@mui/icons-material"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"
import { ConfirmationDialog } from "../../../components/ConfirmationDialog"
import { MessageContent } from "../elements/MessageContent"

const HIGH_FIVE_MESSAGE_TYPES = [
  CollaborationMessageType.AUTHOR_APPROVED,
  CollaborationMessageType.ALL_AUTHORS_CONFIRMED,
  CollaborationMessageType.ASSISTANT_MANUSCRIPT_APPROVED
]

type ChatProps = {
  collaborationChatStore: CollaborationChatStoreInterface;
};

const Chat: React.FC<ChatProps> = observer((props: { collaborationChatStore: CollaborationChatStoreInterface }): ReactElement => {
  const { collaborationChatStore } = props
  const userActionsRegistry = new UserActionsRegistry()
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [showCollabModal, setShowCollabModal] = useState(false)
  const [showCollabHelpStep1Modal, setShowCollabHelpStep1Modal] =
    useState(false)
  const [showCollabHelpStep2Modal, setShowCollabHelpStep2Modal] =
    useState(false)
  const [showCollabHelpStep3Modal, setShowCollabHelpStep3Modal] =
    useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 30)
  }, [collaborationChatStore.messages?.length])

  useEffect(() => {
    const faCollabHelp = (event: MouseEvent): void => {
      const target = (event.target as HTMLElement).closest<HTMLElement>(
        "#fa-collab-helper-step1, #fa-collab-helper-step2, #fa-collab-helper-step3"
      )

      if (target) {
        const step = target.id.split("-")[3]
        switch (step) {
          case "step1":
            setShowCollabHelpStep1Modal(true)
            break
          case "step2":
            setShowCollabHelpStep2Modal(true)
            break
          case "step3":
            setShowCollabHelpStep3Modal(true)
            break
          default:
            break
        }
      }
    }

    window.addEventListener("click", faCollabHelp)

    return () => {
      window.removeEventListener("click", faCollabHelp)
    }
  }, [])

  return (
    <>
      <Global
        styles={css`
          #fa-collab-helper-box {
            & div:hover {
              background: #f7f8ff;
              cursor: pointer;
            }
          }
        `}
      />
      <div>
        {collaborationChatStore.messages && collaborationChatStore.messages.map((message) => {
          const userInfo = message.userInfo!!
          const fullName = message.isAssistant ? "Assistant" : getFullName(userInfo)
          const avatar = message.isAssistant ? "FA" :
            (userInfo.profileImage ? renderProfileImage(userInfo.profileImage) : getInitials(userInfo.firstName, userInfo.lastName))
          const mappedFiles = message.files?.map(file =>
            <FileElement onClick={() => collaborationChatStore.getCollaborationFile(file)}>
              <DescriptionOutlined style={{ marginRight: "12px" }} />
              <span>{file.name}</span>
            </FileElement>
          )

          return (
            <React.Fragment key={message.id}>
              <Message name={fullName} avatar={avatar}>
                {HIGH_FIVE_MESSAGE_TYPES.includes(message.type) && (
                  <img src={highfiveImage} alt="High five" />
                )}
                <MessageContent message={message} chatStore={collaborationChatStore} />
                <div />
                {mappedFiles}
              </Message>
              <HeightElement value="32px" />
            </React.Fragment>
          )
        })}
        {
          collaborationChatStore.messageType && <UserActions
            messageType={collaborationChatStore.messageType}
            userActionsRegistry={userActionsRegistry}
            collaborationChatStore={collaborationChatStore}
            key={collaborationChatStore.messageType}
          />
        }
        {<HeightElement value={"32px"} />}
        <div ref={bottomRef} />
        <CommentsModal
          open={collaborationChatStore.isApproveManuscriptDialogOpen ?? false}
          handleClose={() => collaborationChatStore.setIsApproveManuscriptDialogOpen!!(false)}
          handleAction={async (comment: string) =>
            await collaborationChatStore.sendMessage({
                type: CollaborationMessageType.APPROVE_MANUSCRIPT,
                isAssistant: false,
                payload: {
                  comment,
                  type: CollaborationMessageType.APPROVE_MANUSCRIPT
                }
              }, CollaborationMessageType.APPROVE_MANUSCRIPT
            )
          }
        />
        <CollaborationRequirementsModal
          open={showCollabModal}
          handleClose={() => setShowCollabModal(false)}
          handleAction={() => {
          }}
        />
        <Step1Modal
          open={showCollabHelpStep1Modal}
          handleClose={() => setShowCollabHelpStep1Modal(false)}
        />
        <Step2Modal
          open={showCollabHelpStep2Modal}
          handleClose={() => setShowCollabHelpStep2Modal(false)}
        />
        <Step3Modal
          open={showCollabHelpStep3Modal}
          handleClose={() => setShowCollabHelpStep3Modal(false)}
        />
        <UploadFinalDraftDialog isOpen={collaborationChatStore.isUploadDraftDialogOpen!!}
                                collaborationChatStore={collaborationChatStore as DownloadedPublicationCollaborationChatStore} />
        <ConfirmationDialog
          isOpen={collaborationChatStore.isDeclineCollaborationDialogOpen!!}
          onClose={() => collaborationChatStore.setIsDeclineCollaborationDialogOpen!!(false)}
          onConfirm={async () => await collaborationChatStore.sendMessage({
            type: CollaborationMessageType.DECLINE_COLLABORATION,
            isAssistant: false,
          }, CollaborationMessageType.DECLINE_COLLABORATION)
          }
          title={"Decline, citation is enough"}
          text={
            "Are you sure you want to decline the request? \n" +
            "By declining a collaboration, you oblige data user to simply quote your dataset, " +
            "without specifying you as a co-author.\n" +
            "Everything will be deleted and you won’t be able to undo this action."
          }
          yesText={"Decline"}
          noText={"Cancel"}
        />
        <ConfirmationDialog
          isOpen={collaborationChatStore.isApproveCollaborationDialogOpen!!}
          onClose={() => collaborationChatStore.setIsApproveCollaborationDialogOpen!!(false)}
          onConfirm={async () => await collaborationChatStore.sendMessage({
            type: CollaborationMessageType.APPROVE_COLLABORATION,
            isAssistant: false,
          }, CollaborationMessageType.NOTIFY_CO_AUTHOR)
          }
          title={"Approve collaboration"}
          text={
            "Are you sure you want to approve the request?\n" +
            "By approving the collaboration, you allow the data user to include you as a co-author, " +
            "ensuring full credit for your contribution."
          }
          yesText={"Approve"}
          noText={"Cancel"}
          yesButtonColor={"primary"}
        />
      </div>
    </>
  )
})

interface MessageType {
  id: number;
  name: string;
  avatar: string; // or url
  text: string | string[] | React.ReactNode | React.ReactNode[];
}

const UserActions = (props: {
  messageType: CollaborationMessageType,
  userActionsRegistry: UserActionsRegistry,
  collaborationChatStore: CollaborationChatStoreInterface
}): React.ReactElement => {
  const {
    messageType,
    userActionsRegistry
  } = props
  const actions = userActionsRegistry.getActions(messageType)
  return actions.length ? (
    <React.Fragment key={messageType}>
      <ButtonsWrapper>
        <SelfAvatar />
        {
          userActionsRegistry.getActions(messageType).map(action =>
            <StyledApproveButton
              isDecline={action.isDecline}
              variant="outlined"
              onClick={() => action.action(props.collaborationChatStore)}>
              {action.text}
            </StyledApproveButton>
          )}
      </ButtonsWrapper>
    </React.Fragment>
  ) : <></>
}

export const ButtonsWrapper = styled.div`
  display: block;

  & button {
    font-size: 18px;
  }
`

export default Chat

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
`
