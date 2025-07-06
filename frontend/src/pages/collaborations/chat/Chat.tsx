import styled from '@emotion/styled';
import React, { ReactElement, useEffect, useState } from 'react';
import { SelfAvatar } from '../elements/AvatarNameBox';
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import { HeightElement } from '../../common.styled';
import { css, Global } from '@emotion/react';
import sendImage from '../../../assets/fa-send.svg';
import fileIcon from '../../../assets/file-icon.svg';
import timetableImage from '../../../assets/fa-timetable.svg';
import highfiveImage from '../../../assets/fa-highfive.svg';
import { CollaborationChatInterface } from '../../publication/store/CollaborationChatStore';
import {
  getFullName,
  getInitials,
  renderProfileImage
} from '../../../util/userUtil';
import {
  CollaborationMessageType,
  DataCollectionType
} from 'src/apis/first-approval-api';
import { DATA_COLLECTION_TYPES } from '../../publication/ChooseDataCollection';
import { observer } from 'mobx-react-lite';
import {
  CollaborationRequirementsModal,
  CommentsModal,
  DeclineModal,
  Step1Modal,
  Step2Modal,
  Step3Modal,
  StyledApproveButton,
  StyledButton,
  StyledDeclineButton
} from './Modal';
import { Message } from './ChatMessage';

type ChatProps = {
  collaborationChatStore: CollaborationChatInterface;
};

const Chat: React.FC<ChatProps> = observer((props: { collaborationChatStore: CollaborationChatInterface }): ReactElement => {
  const { collaborationChatStore } = props;
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showCollabHelpStep1Modal, setShowCollabHelpStep1Modal] =
    useState(false);
  const [showCollabHelpStep2Modal, setShowCollabHelpStep2Modal] =
    useState(false);
  const [showCollabHelpStep3Modal, setShowCollabHelpStep3Modal] =
    useState(false);

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

  const handleNeedHelp: () => void = () => alert('Help is Needed');
  const handleEmailDataUser: () => void = () => alert('Email data user');
  const handleShowCollabModal: () => void = () => setShowCollabModal(true);
  const handleCitation: () => void = () => {
    // список всех авторов в формате [Фамилия Инициалы], дальше идет точка, за которой с большой буквы - [Название датасета].
    // Год. First Approval [если специализированная коллекция - ее название] (например First Approval - Aging Data Collection)

    const publication = collaborationChatStore.publication!!

    const mappedAuthors = publication.authors!!
      .map(author => `${author.lastName} ${author.firstName.charAt(0)}`)
      .join(', ')

    const year = publication.creationTime.substring(0, 4)

    const dataCollectionTypeTitle = publication.dataCollectionType === DataCollectionType.GENERAL ? '' :
      (' - ' + DATA_COLLECTION_TYPES
        .find(dataCollectionType => dataCollectionType.type === publication.dataCollectionType)!!
          .title
      )

    console.log(<p>
      {mappedAuthors}. {publication.title}. {year}.{' '}
      First Approval{dataCollectionTypeTitle}.
    </p>)

    const message = `${mappedAuthors}. ${publication.title}. ${year}. First Approval${dataCollectionTypeTitle}.`

    // collaborationChatStore.messages?.push({
    //   id: '',
    //   isAssistant: true,
    //   type: CollaborationMessageType.NONE,
    //   text: message
    // });
    //
    // collaborationChatStore.setStage(CollaborationMessageType.NONE);

    collaborationChatStore.sendMessage({
      isAssistant: true,
      type: CollaborationMessageType.NONE,
      text: message
    }, CollaborationMessageType.NONE)
  };

  const showAuthorsEmails: () => void = () => {
    const mappedAuthors = collaborationChatStore.publication!!.authors!!
      .map(author => `• ${author.firstName} ${author.lastName} - ` + (author.email ?? 'no email'))

    // collaborationChatStore.messages?.push({
    //   id: '',
    //   type: CollaborationMessageType.REACH_OUT_AUTHORS,
    //   isAssistant: true,
    //   text: 'While we are working on the FA chat feature, you can contact the authors using their emails: \n' + mappedAuthors
    // });

    collaborationChatStore.sendMessage({
      id: '',
      type: CollaborationMessageType.REACH_OUT_AUTHORS,
      isAssistant: true,
      text: 'While we are working on the FA chat feature, you can contact the authors using their emails: \n' + mappedAuthors
    })
  }

  const handleReachOutToAuthor: () => void = () => {
    showAuthorsEmails();
    collaborationChatStore.setStage(CollaborationMessageType.ONLY_CITATION);
  };

  const handleAskDataUser: () => void = () => {
    // Messages.push({
    //   id: 404,
    //   name: 'Me Myself',
    //   avatar: 'MM',
    //   text: 'You will have 2 weeks to read the article and decide whether to accept or decline co-authorship. You can ask questions or provide your suggestions to the author via private messages. We recommend starting this process well in advance. If you do not approve the request within 2 weeks, you will lose the opportunity for co-authorship in this article. If you decline, the data user will simply cite your dataset.'
    // });
    // collaborationChatStore.setStage(CollaborationMessageType.DATA_USER_ASKED);

    collaborationChatStore.sendMessage({
      id: '',
      type: CollaborationMessageType.DATA_USER_ASKED,
      isAssistant: true,
      text: 'You will have 2 weeks to read the article and decide whether to accept or decline co-authorship. ' +
        'You can ask questions or provide your suggestions to the author via private messages. ' +
        'We recommend starting this process well in advance. ' +
        'If you do not approve the request within 2 weeks, you will lose the opportunity for co-authorship in this article. ' +
        'If you decline, the data user will simply cite your dataset.'
    }, CollaborationMessageType.DATA_USER_ASKED)
  };

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

  const handleDecline: () => void = () => setShowDeclineModal(true);
  const handleCloseDeclineModal: () => void = () => setShowDeclineModal(false);
  const handleDownloadAction: () => void = () => {
    alert('Download');
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

  const handleIWouldLikeToCollaborate: () => void = () => {
    debugger;
    // collaborationChatStore.messages?.push({
    //   id: '',
    //   isAssistant: false,
    //   userInfo: collaborationChatStore.collaborationRequestCreator,
    //   type: CollaborationMessageType.I_WOULD_LIKE_TO_COLLABORATE,
    //   text: 'I’d like to collaborate! Tell me more...'
    // });

    collaborationChatStore.sendMessage({
      type: CollaborationMessageType.I_WOULD_LIKE_TO_COLLABORATE,
      isAssistant: false,
      text: 'I’d like to collaborate! Tell me more...'
    })
    collaborationChatStore.sendMessage({
      isAssistant: true,
      type: CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET,
      text:
          "If you’re interested in this Dataset and considering publishing your \n" +
          "future work together with the Data Author(s), First Approval will make \n" +
          "the collaboration process easier. Let me guide you through it before \n" +
          "you agree to work on the publication together. The FA collaboration \n" +
          "process has 3 steps."
    }, CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET);
  };

  const handleLetsMakeTheCollaboration: () => void = () => {
    collaborationChatStore.sendMessage({
      isAssistant: true,
      type: CollaborationMessageType.MANUSCRIPT_APPROVED,
      text:
        "The collaboration request (1 step) is a formalized agreement. I'll help you fill it out. \n" +
        "The agreement is sent to each author individually.  \n" +
        "It will contain your details and preliminary information about the work you are doing. Here is how the template looks:"
    }, CollaborationMessageType.MANUSCRIPT_APPROVED);
  };

  const handlePublicationFormMsg: () => void = () => {
    Messages.push({
      id: 1009,
      name: 'Assistant',
      avatar: 'FA',
      text: (
        <>
          <Typography>
            Thank you! Now, propose a potential name and type of publication,
            and specify the details of the research in which you would like to
            use the dataset to ensure that Dataset Authors are well-informed
            about ideas for future collaborative publications, please.
          </Typography>
          <Box
            component="form"
            sx={{
              maxWidth: '600px',
              mx: 'auto',
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
            <TextField
              fullWidth
              label="Potential title of your publication in collaboration"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Type of your publication in collaboration"
              variant="outlined"
              defaultValue="Journal Article"
            />
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Details of the research"
              variant="outlined"
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="outlined">Done. What's next?</Button>
              <Button variant="text">Back</Button>
            </Box>
          </Box>
        </>
      )
    });
    collaborationChatStore.setStage(CollaborationMessageType.PUBLICATION_INFO_RECEIVED);
  };

  const handleAuthorInfoFormMsg: () => void = () => {
    Messages.push({
      id: 123123,
      name: 'Assistant',
      avatar: 'FA',
      text: (
        <>
          Awesome! Please verify the spelling of your name and affiliation, as
          this information will be used in the agreement.
          <HeightElement value={'2rem'} />
          <Box
            component="form"
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid #dedede',
              maxWidth: '600px',
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth label="First name" variant="outlined" />
              <TextField fullWidth label="Last name" variant="outlined" />
            </Box>

            <TextField fullWidth label="Organization name" variant="outlined" />

            <TextField fullWidth label="Department (opt.)" variant="outlined" />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Address (opt.)"
                variant="outlined"
                sx={{ flex: 7 }} // 80%
              />
              <TextField
                label="Postal code (opt.)"
                variant="outlined"
                sx={{ flex: 3 }} // 20%
              />
            </Box>

            <Link href="#" underline="hover" variant="body2">
              + Add affiliation
            </Link>

            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button onClick={handlePublicationFormMsg} variant="outlined">
                I confirm that provided info is real
              </Button>
              <Typography component={Link} href="#" variant="body2">
                Back
              </Typography>
            </Box>
          </Box>
        </>
      )
    });
    collaborationChatStore.setStage(CollaborationMessageType.AUTHOR_INFO_RECEIVED);
  };

  const handleApproveCollaboration: () => void = () => {
    Messages.push({
      id: 333,
      name: 'Me Myself',
      avatar: 'MM',
      text: 'Approve collaboration.'
    });
    Messages.push({
      id: 334,
      name: 'Assistant',
      avatar: 'FA',
      text: 'UPD: Peter Lidsky notified you that he plans to send you the final version of the article in two weeks.'
    });
    Messages.push({
      id: 335,
      name: 'Assistant',
      avatar: 'FA',
      text: (
        <>
          UPD: Peter Lidsky attached a preview of the manuscript of their
          publication:
          <p
            style={{
              borderRadius: '0.5rem',
              backgroundColor: 'rgb(243, 242, 245)',
              padding: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              width: '100%',
              gap: '8px',
              maxWidth: '100%'
            }}>
            <img src={fileIcon} /> My manuscript.pdf
          </p>
          You will have 2 weeks to read the article and decide whether to accept
          or decline co-authorship. You can ask questions or provide your
          suggestions to the author via private messages. We recommend starting
          this process well in advance. If you do not approve the request within
          2 weeks, you will lose the opportunity for co-authorship in this
          article. If you decline, the data user will simply cite your dataset.
        </>
      )
    });
    collaborationChatStore.setStage(CollaborationMessageType.COLLABORATION_APPROVED);
  };
  debugger;
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
          debugger;
          return (
            <React.Fragment key={message.id}>
              <Message name={fullName} avatar={avatar}>
                {message.text}
              </Message>
              <HeightElement value={'32px'} />
            </React.Fragment>
          );
        })}
        {collaborationChatStore.stage === CollaborationMessageType.CREATE_REQUEST && (
          <UserOptions
            stage={collaborationChatStore.stage}
            onNeedHelp={handleShowCollabModal}
            citation={handleCitation}
            reachOutToTheAuthor={handleReachOutToAuthor}
          />
        )}
        {collaborationChatStore.stage === CollaborationMessageType.AGREE_TO_THE_TERMS_OF_COLLABORATION && (
          <UserOptions
            stage={collaborationChatStore.stage}
          />
        )}
        {collaborationChatStore.stage === CollaborationMessageType.DATASET_WAS_DOWNLOADED && (
          <UserOptions
            stage={collaborationChatStore.stage}
            onIWouldLikeToCollaborate={handleIWouldLikeToCollaborate}
            emailToAuthors={showAuthorsEmails}
          />
        )}
        {collaborationChatStore.stage === CollaborationMessageType.IF_YOU_ARE_INTERESTED_IN_THIS_DATASET && (
          <>
            <div
              id="fa-collab-helper-box"
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                marginBottom: '32px'
              }}>
              <div
                id="fa-collab-helper-step1"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #dedede',
                  borderRadius: '8px'
                }}>
                <img src={sendImage} />
                <div style={{ padding: '8px 16px 0' }}>
                <span
                  style={{
                    background: '#dedede',
                    padding: '5px',
                    borderRadius: '3px',
                    fontSize: '11px'
                  }}>
                  Step 1
                </span>
                  <p>Send collaboration request to all dataset authors</p>
                </div>
              </div>
              <div
                id="fa-collab-helper-step2"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #dedede',
                  borderRadius: '8px'
                }}>
                <img src={timetableImage} />
                <div style={{ padding: '8px 16px 0' }}>
                <span
                  style={{
                    background: '#dedede',
                    padding: '5px',
                    borderRadius: '3px',
                    fontSize: '11px'
                  }}>
                  Step 2
                </span>
                  <p>
                    Dataset author(s) confirm the collaboration (maximum 30 days)
                  </p>
                </div>
              </div>
              <div
                id="fa-collab-helper-step3"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #dedede',
                  borderRadius: '8px'
                }}>
                <img src={highfiveImage} />
                <div style={{ padding: '8px 16px 0' }}>
                <span
                  style={{
                    background: '#dedede',
                    padding: '5px',
                    borderRadius: '3px',
                    fontSize: '11px'
                  }}>
                  Step 3
                </span>
                  <p>
                    Discuss and confirm with author(s) the details of your
                    publication before submission
                  </p>
                </div>
              </div>
            </div>
            <UserOptions
              stage={collaborationChatStore.stage}
              onLetsMakeTheCollaboration={handleLetsMakeTheCollaboration}
              onNeedHelp={handleShowCollabModal}
            />
          </>
        )}
        {collaborationChatStore.stage === CollaborationMessageType.COLLABORATION_APPROVED && (
          <UserOptions
            stage={collaborationChatStore.stage}
            onNeedHelp={handleNeedHelp}
            onFormMsg={handleAuthorInfoFormMsg}
            onAskDataUser={handleAskDataUser}
            onDecline={handleDecline}
          />
        )}
        {collaborationChatStore.stage === CollaborationMessageType.DATA_USER_ASKED && (
          <UserOptions
            stage={collaborationChatStore.stage}
            onNeedHelp={handleNeedHelp}
            onApproveManuscript={handleApproveManuscript}
            onApproveManuscriptWithComments={
              handleApproveManuscriptWithComments
            }
            onAskDataUser={handleEmailDataUser}
            onDecline={handleDecline}
          />
        )}
        {/* {stage === CollaborationMessageType.REACH_OUT_AUTHORS && ( */}
        {/*   <UserOptions */}
        {/*     stage={stage} */}
        {/*   /> */}
        {/* )} */}
        {collaborationChatStore.stage === CollaborationMessageType.ONLY_CITATION && (
          <UserOptions
            stage={collaborationChatStore.stage}
            citation={handleCitation}
          />
        )}
        {collaborationChatStore.stage === CollaborationMessageType.MANUSCRIPT_APPROVED && (
          <UserOptions
            stage={collaborationChatStore.stage}
            onNeedHelp={handleNeedHelp}
            onAskDataUser={handleEmailDataUser}
          />
        )}
        {collaborationChatStore.stage === CollaborationMessageType.DECLINED && (
          <UserOptions stage={collaborationChatStore.stage} onNeedHelp={handleNeedHelp} />
        )}
        <DeclineModal
          open={showDeclineModal}
          handleClose={handleCloseDeclineModal}
          handleAction={handleDeclineAction}
        />
        <CommentsModal
          open={showCommentModal}
          handleClose={handleCloseDeclineModal}
          handleAction={handleComment}
        />
        <CollaborationRequirementsModal
          open={showCollabModal}
          handleClose={() => setShowCollabModal(false)}
          handleAction={handleDownloadAction}
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

interface UserOptionsProps {
  stage: CollaborationMessageType;
  onNeedHelp?: () => void;
  citation?: () => void;
  reachOutToTheAuthor?: () => void;
  onApproveCollaboration?: () => void;
  onApproveManuscript?: () => void;
  onApproveManuscriptWithComments?: () => void;
  onAskDataUser?: () => void;
  onEmailDataUser?: () => void;
  onDecline?: () => void;
  onIWouldLikeToCollaborate?: () => void;
  emailToAuthors?: () => void;
  onLetsMakeTheCollaboration?: () => void;
  onFormMsg?: () => void;
}

const UserOptions = ({
  stage,
  onNeedHelp,
  citation,
  reachOutToTheAuthor,
  onApproveCollaboration,
  onApproveManuscript,
  onApproveManuscriptWithComments,
  onAskDataUser,
  onEmailDataUser,
  onDecline,
  onIWouldLikeToCollaborate,
  emailToAuthors,
  onLetsMakeTheCollaboration,
  onFormMsg
}: UserOptionsProps): React.ReactElement => {
  return (
    <div>
      <ButtonsWrapper>
        <SelfAvatar />
        {onApproveCollaboration && (
          <StyledApproveButton
            variant="outlined"
            onClick={onApproveCollaboration}>
            Approve collaboration
          </StyledApproveButton>
        )}
        {onApproveManuscript && (
          <StyledApproveButton variant="outlined" onClick={onApproveManuscript}>
            Approve manuscript
          </StyledApproveButton>
        )}
        {onApproveManuscriptWithComments && (
          <StyledApproveButton
            variant="outlined"
            onClick={onApproveManuscriptWithComments}>
            Approve with comments
          </StyledApproveButton>
        )}
        {onDecline && (
          <StyledDeclineButton variant="outlined" onClick={onDecline}>
            Decline, citation is enough
          </StyledDeclineButton>
        )}
        {onAskDataUser && (
          <StyledButton variant="outlined" onClick={onAskDataUser}>
            Ask data user
          </StyledButton>
        )}
        {onEmailDataUser && (
          <StyledButton variant="outlined" onClick={onEmailDataUser}>
            Email data user
          </StyledButton>
        )}
        {onFormMsg && (
          <StyledButton variant="outlined" onClick={onFormMsg}>
            Ask First Approval
          </StyledButton>
        )}
        {onIWouldLikeToCollaborate && (
          <StyledApproveButton variant="outlined" onClick={onIWouldLikeToCollaborate}>
            I’d like to collaborate! Tell me more...
          </StyledApproveButton>
        )}
        {emailToAuthors && (
          <StyledApproveButton variant="outlined" onClick={emailToAuthors}>
            Email to author(s)
          </StyledApproveButton>
        )}
        {onLetsMakeTheCollaboration && (
          <StyledApproveButton variant="outlined" onClick={onIWouldLikeToCollaborate}>
            Great, let’s make the Collaboration Request
          </StyledApproveButton>
        )}
        {citation && (
          <StyledApproveButton variant="outlined" onClick={citation}>
          Citation
          </StyledApproveButton>
        )}
        {reachOutToTheAuthor && (
          <StyledApproveButton variant="outlined" onClick={reachOutToTheAuthor}>
          I want to reach out to the author(s)
          </StyledApproveButton>
        )}
        {/* {onNeedHelp && ( */}
        {/*   <StyledApproveButton variant="outlined" onClick={onNeedHelp}> */}
        {/*   I need help */}
        {/*   </StyledApproveButton> */}
        {/* )} */}
      </ButtonsWrapper>
    </div>
  );
};

export const ButtonsWrapper = styled.div`
  display: block;

  & button {
    font-size: 18px;
  }
`

export default Chat;
