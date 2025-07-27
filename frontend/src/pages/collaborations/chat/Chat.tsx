import styled from "@emotion/styled"
import React, { ReactElement, useEffect, useRef, useState } from "react"
import { SelfAvatar } from "../elements/AvatarNameBox"
import { HeightElement } from "../../common.styled"
import { css, Global } from "@emotion/react"
import fileIcon from "../../../assets/file-icon.svg"
import highfiveImage from "../../../assets/fa-highfive.svg"
import { getFullName, getInitials, renderProfileImage } from "../../../util/userUtil"
import { CollaborationMessageType } from "src/apis/first-approval-api"
import { observer } from "mobx-react-lite"
import {
  CollaborationRequirementsModal,
  CommentsModal,
  DeclineModal,
  Step1Modal,
  Step2Modal,
  Step3Modal,
  StyledApproveButton
} from "./Modal"
import { Message } from "./ChatMessage"
import { UserActionsRegistry } from "./UserActionsRegistry"
import { showStepsInfo } from "../elements/StepsInfo"
import { PersonalDataForm } from "../elements/PersonalDataForm"
import { PersonalData } from "../elements/PersonalData"
import { DownloadedPublicationCollaborationChatStore } from "../../publication/store/DownloadedPublicationCollaborationChatStore"
import { confirmThatProvidedInfoIsReal } from "./action/ConfirmThatProvidedInfoIsReal"
import { PotentialPublicationDataForm } from "../elements/PotentialPublicationDataForm"
import { doneWhatsNext } from "./action/DoneWhatsNext"
import { PotentialPublicationData } from "../elements/PotentialPublicationData"
import { UploadFinalDraftDialog } from "../elements/UploadFinalDraftDialog"
import { UploadedFinalDraftPayload } from "../elements/UploadedFinalDraftPayload"
import { DescriptionOutlined } from "@mui/icons-material"
import { AuthorApprovedPayload } from "../elements/AuthorApprovedPayload"
import { AuthorDeclinedPayload } from "../elements/AuthorDeclinedPayload"
import { PrefilledAgreementPayload } from "../elements/PrefilledAgreementPayload"
import { Link } from "@mui/material"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"
import { FormalizedAgreementPayload } from "../elements/FormalizedAgreementPayload"
import { ConfirmationDialog } from "../../../components/ConfirmationDialog"

const HIGH_FIVE_MESSAGE_TYPES = [
  CollaborationMessageType.AUTHOR_APPROVED, CollaborationMessageType.ALL_AUTHORS_CONFIRMED];

type ChatProps = {
  collaborationChatStore: CollaborationChatStoreInterface;
};

const Chat: React.FC<ChatProps> = observer((props: { collaborationChatStore: CollaborationChatStoreInterface }): ReactElement => {
  const { collaborationChatStore } = props;
  const userActionsRegistry = new UserActionsRegistry();
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showCollabHelpStep1Modal, setShowCollabHelpStep1Modal] =
    useState(false);
  const [showCollabHelpStep2Modal, setShowCollabHelpStep2Modal] =
    useState(false);
  const [showCollabHelpStep3Modal, setShowCollabHelpStep3Modal] =
    useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 30);
  }, [collaborationChatStore.messages?.length]);

  useEffect(() => {
    const faCollabHelp = (event: MouseEvent): void => {
      const target = (event.target as HTMLElement).closest<HTMLElement>(
        '#fa-collab-helper-step1, #fa-collab-helper-step2, #fa-collab-helper-step3'
      );

      if (target) {
        const step = target.id.split('-')[3];
        switch (step) {
          case 'step1':
            setShowCollabHelpStep1Modal(true);
            break;
          case 'step2':
            setShowCollabHelpStep2Modal(true);
            break;
          case 'step3':
            setShowCollabHelpStep3Modal(true);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('click', faCollabHelp);

    return () => {
      window.removeEventListener('click', faCollabHelp);
    };
  }, []);

  const handleShowCommentModal: () => void = () => setShowCommentModal(true);
  const handleCloseCommentModal: () => void = () => setShowCommentModal(false);
  const handleComment: (e: any) => void = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const comment = formData.get('comment');
    Messages.push({
      id: 1001,
      name: 'Me Myself',
      avatar: 'MM',
      text: comment as string
    });
    Messages.push({
      id: 1001,
      name: 'Assistant',
      avatar: 'FA',
      text: (
        <p>
          The manuscript was approved. You may use this log to continue
          discussions with data user according your collaboration.
        </p>
      )
    });
    collaborationChatStore.setStage(CollaborationMessageType.MANUSCRIPT_APPROVED);
    handleCloseCommentModal();
  };


  const handleDeclineAction: () => void = () => {
    Messages.push({
      id: 404,
      name: 'Me Myself',
      avatar: 'MM',
      text: 'Decline, citation is enough'
    });
    Messages.push({
      id: 405,
      name: 'Assistant',
      avatar: 'FA',
      text: [
        <>
          <p>
            Thank you for the reply. The data user will be required to cite your
            dataset, but will not specify you as a co-author.
          </p>
          <p>You can write us feedback to improve the platform 💬</p>
        </>
      ]
    });
    collaborationChatStore.setStage(CollaborationMessageType.DECLINED);
    setShowDeclineModal(false);
  };

  const handleApproveManuscriptWithComments: () => void = () => {
    handleShowCommentModal();
  };
  const handleApproveManuscript: () => void = () => {
    Messages.push({
      id: 444,
      name: 'Me Myself',
      avatar: 'MM',
      text: 'Approve manuscript.'
    });
    collaborationChatStore.setStage(CollaborationMessageType.MANUSCRIPT_APPROVED);
  };

  function getCollaborationAgreementTemplateLink () {
    return <FileElement>
      <Link
        href={"/docs/FA_Collaboration_Agreement_template.pdf"}
        target={"_blank"}
        underline={"none"}
        sx={{ color: "black" }}
        style={{ cursor: "pointer" }}
      >
        FA Collaboration Agreement template.pdf
      </Link>
    </FileElement>
  }

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
          const userInfo = message.userInfo!!;
          const fullName = message.isAssistant ? 'Assistant' : getFullName(userInfo);
          const avatar = message.isAssistant ? 'FA' :
            (userInfo.profileImage ? renderProfileImage(userInfo.profileImage) : getInitials(userInfo.firstName, userInfo.lastName));
          const mappedFiles = message.files?.map(file =>
              <FileElement onClick={() => collaborationChatStore.getCollaborationFile(file)}>
                <DescriptionOutlined style={{marginRight: '12px'}}/>
                <span>{file.name}</span>
              </FileElement>
          );
          const collaborationAgreementTemplate = getCollaborationAgreementTemplateLink()

          return (
            <React.Fragment key={message.id} >
              <Message name={fullName} avatar={avatar} key={message.id}>
                {/* For data user: */}
                {message.type === CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL && <PersonalData message={message} />}
                {message.type === CollaborationMessageType.DONE_WHATS_NEXT && <PotentialPublicationData message={message} />}
                {HIGH_FIVE_MESSAGE_TYPES.includes(message.type) && <img src={highfiveImage}  alt="High five"/>}
                <div />
                {message.text}
                {mappedFiles}
                {message.type === CollaborationMessageType.FORMALIZED_AGREEMENT && collaborationAgreementTemplate}
                {message.type === CollaborationMessageType.AUTHOR_APPROVED && <AuthorApprovedPayload message={message} />}
                {message.type === CollaborationMessageType.AUTHOR_DECLINED && <AuthorDeclinedPayload message={message} />}
                {message.type === CollaborationMessageType.UPLOAD_FINAL_DRAFT && <UploadedFinalDraftPayload message={message} />}
                {message.type === CollaborationMessageType.PREFILLED_COLLABORATION_AGREEMENT &&
                  <PrefilledAgreementPayload message={message}
                                             chatStore={collaborationChatStore as DownloadedPublicationCollaborationChatStore}
                  />
                }
                {message.type === CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET && showStepsInfo()}
                {message.type === CollaborationMessageType.VERIFY_YOUR_NAME_AND_AFFILIATION &&
                  !collaborationChatStore.existsByType(CollaborationMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL) &&
                  <PersonalDataForm
                    message={message}
                    action={confirmThatProvidedInfoIsReal}
                    store={collaborationChatStore as DownloadedPublicationCollaborationChatStore}
                  />
                }
                {message.type === CollaborationMessageType.PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE &&
                  !collaborationChatStore.existsByType(CollaborationMessageType.DONE_WHATS_NEXT) &&
                  <PotentialPublicationDataForm
                    store={collaborationChatStore as DownloadedPublicationCollaborationChatStore}
                    action={doneWhatsNext}
                  />
                }
                {/* For data author: */}
                {message.type === CollaborationMessageType.I_WOULD_LIKE_TO_INCLUDE_YOU && <PotentialPublicationData message={message} />}
                {message.type === CollaborationMessageType.ASSISTANT_CREATE &&
                  <FormalizedAgreementPayload message={message} chatStore={collaborationChatStore} />}
              </Message>
              <HeightElement value={'32px'} />
            </React.Fragment>
          );
        })}
        {
          collaborationChatStore.messageType && <UserActions
            messageType={collaborationChatStore.messageType}
            userActionsRegistry={userActionsRegistry}
            collaborationChatStore={collaborationChatStore}
            key={collaborationChatStore.messageType}
          />
        }
        {<HeightElement value={'32px'} />}
        <div ref={bottomRef} />
        <DeclineModal
          open={showDeclineModal}
          handleClose={() => {}}
          handleAction={handleDeclineAction}
        />
        <CommentsModal
          open={showCommentModal}
          handleClose={() => {}}
          handleAction={handleComment}
        />
        <CollaborationRequirementsModal
          open={showCollabModal}
          handleClose={() => setShowCollabModal(false)}
          handleAction={() => {}}
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
        <UploadFinalDraftDialog isOpen={collaborationChatStore.isUploadDraftDialogOpen}
                                collaborationChatStore={collaborationChatStore as DownloadedPublicationCollaborationChatStore} />
        <ConfirmationDialog
          isOpen={collaborationChatStore.isDeclineCollaborationDialogOpen}
          onClose={() => collaborationChatStore.setIsDeclineCollaborationDialogOpen(false)}
          onConfirm={async () => await collaborationChatStore.sendMessage({
              type: CollaborationMessageType.DECLINE_COLLABORATION,
              isAssistant: false,
              text: "Decline, citation is enough"
            })
          }
          title={'Decline, citation is enough'}
          text={
            'Are you sure you want to decline the request? \n' +
            'By declining a collaboration, you oblige data user to simply quote your dataset, ' +
            'without specifying you as a co-author.' +
            'Everything will be deleted and you won’t be able to undo this action.'
          }
          yesText={'Decline'}
          noText={'Cancel'}
        />
      </div>
    </>
  );
});

interface MessageType {
  id: number;
  name: string;
  avatar: string; // or url
  text: string | string[] | React.ReactNode | React.ReactNode[];
}

const Messages: MessageType[] = [
  {
    id: 1,
    name: 'Peter Lidsky',
    avatar: 'PL',
    text: `I would like to include you as a co-author of my work, as I plan to use the materials from your dataset. 

* Potential title of my publication in collaboration: Mice brain control/ex fertilization RNA-seq data
* Type of my publication in collaboration: Journal Article
* Details of the research: The aim is to investigate the main cortex genetical alterations in the result of mice prenatal influence.
* Intended journal for publication: Nature Communications 
* Expected publication date: 1 January 2025
`
  },
  {
    id: 0,
    name: 'Assistant',
    avatar: 'FA',
    text: (
      <>
        Peter Lidsky plans to use your dataset in his research and wants to
        include you as a co-author of his article.', 'This is First Approval
        collaboration agreement pre-filled by Peter Lidsky:
        <p
          style={{
            borderRadius: '0.5rem',
            backgroundColor: 'rgb(243, 242, 245)',
            padding: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '100%',
            gap: '6px'
          }}>
          <img src={fileIcon} /> Tim Glinin - FA Collaboration agreement.pdf
        </p>
        <ul>
          <li>
            <b>By approving</b> to the collaboration, you oblige data user to
            include you as a co-author.
            <ul>
              <li>
                The data user will also be required to provide a 14-day notice
                before sending you the final version of the article.
              </li>
            </ul>
          </li>
          <li>
            <b>By declining</b> a collaboration, you oblige data user to simply
            quote your dataset, without specifying you as a co-author.
          </li>
        </ul>
      </>
    )
  }
];

const UserActions = (props: {
  messageType: CollaborationMessageType,
  userActionsRegistry: UserActionsRegistry,
  collaborationChatStore: CollaborationChatStoreInterface
}): React.ReactElement => {
  const { messageType, userActionsRegistry } = props;
  const actions = userActionsRegistry.getActions(messageType);
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
  ) : <></>;
};

export const ButtonsWrapper = styled.div`
  display: block;

  & button {
    font-size: 18px;
  }
`

export default Chat;

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
