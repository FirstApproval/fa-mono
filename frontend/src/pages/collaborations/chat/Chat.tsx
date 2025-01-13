import React, { useState } from 'react';
import AvatarNameBox, { SelfAvatar } from '../elements/AvatarNameBox';
import { Box, Button, Typography, Modal } from '@mui/material';
import { HeightElement } from '../../common.styled';
import styled from '@emotion/styled';

import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify';

interface MessageType {
  id: number;
  name: string;
  avatar: string; // or url
  text: string | string[];
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
    text: [
      'Peter Lidsky plans to use your dataset in his research and wants to include you as a co-author of his article.',
      'This is First Approval collaboration agreement pre-filled by Peter Lidsky:',
      `<p style="border-radius: 0.5rem; background-color: #F3F2F5; padding: 10px">
          Tim Glinin - FA Collaboration agreement.pdf
      </p>`,
      `* **By approving** to the collaboration, you oblige data user to include you as a co-author.
  * The data user will also be required to provide a 14-day notice before sending you the final version of the article.`,
      '* **By declining** a collaboration, you oblige data user to simply quote your dataset, without specifying you as a co-author.'
    ]
  }
];

const Message = ({
  name,
  avatar,
  children
}: {
  name: string;
  avatar: string;
  children: string | string[];
}): React.ReactElement => {
  return (
    <div>
      <AvatarNameBox avatar={avatar} name={name} />
      <HeightElement value={'12px'} />
      <Typography variant={'body'}>
        {Array.isArray(children) ? (
          children.map((c, i) => (
            <Markdown rehypePlugins={[rehypeRaw]} key={i}>
              {DOMPurify.sanitize(c)}
            </Markdown>
          ))
        ) : (
          <Markdown rehypePlugins={[rehypeRaw]}>
            {DOMPurify.sanitize(children)}
          </Markdown>
        )}
      </Typography>
    </div>
  );
};

enum Stage {
  Default,
  CollaborationApproved,
  DataUserAsked,
  ManuscriptApproved,
  Declined
}
interface UserOptionsProps {
  stage: Stage;
  onNeedHelp: () => void;
  onApproveCollaboration?: () => void;
  onApproveManuscript?: () => void;
  onApproveManuscriptWithComments?: () => void;
  onAskDataUser?: () => void;
  onEmailDataUser?: () => void;
  onDecline?: () => void;
}

const UserOptions = ({
  stage,
  onNeedHelp,
  onApproveCollaboration,
  onApproveManuscript,
  onApproveManuscriptWithComments,
  onAskDataUser,
  onEmailDataUser,
  onDecline
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
        <StyledButton variant="outlined" onClick={onNeedHelp}>
          I need help
        </StyledButton>
      </ButtonsWrapper>
    </div>
  );
};

const DeclineModal = ({
  open,
  handleClose,
  handleAction
}: {
  open: boolean;
  handleClose: () => void;
  handleAction: () => void;
}): React.ReactElement => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <StyledBox>
        <Typography id="modal-modal-title" variant="h5" component="h5">
          Decline collaboration?
        </Typography>
        <HeightElement value={'2rem'} />
        <Typography id="modal-modal-description" sx={{ fontSize: '1.25rem' }}>
          Are you sure you want to decline the request? By declining a
          collaboration, you oblige data user to simply quote your dataset,
          without specifying you as a co-author.
        </Typography>
        <HeightElement value={'2rem'} />
        <ModalButtonsWrapper>
          <ModalButtonsCancel onClick={handleClose}>Cancel</ModalButtonsCancel>
          <ModalButtonsDecline onClick={handleAction}>
            Decline
          </ModalButtonsDecline>
        </ModalButtonsWrapper>
      </StyledBox>
    </Modal>
  );
};

const CommentsModal = ({
  open,
  handleClose,
  handleAction
}: {
  open: boolean;
  handleClose: () => void;
  handleAction: (e: any) => void;
}): React.ReactElement => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <StyledBox>
        <Typography id="modal-modal-title" variant="h5" component="h5">
          Approve with comments
        </Typography>
        <HeightElement value={'2rem'} />
        <form onSubmit={handleAction}>
          <textarea name="comment"></textarea>
          <HeightElement value={'2rem'} />
          <ModalButtonsWrapper>
            <ModalButtonsCancel onClick={handleClose}>
              Cancel
            </ModalButtonsCancel>
            <ModalButtonsApprove type="submit">
              Approve manuscript
            </ModalButtonsApprove>
          </ModalButtonsWrapper>
        </form>
      </StyledBox>
    </Modal>
  );
};

const Chat: React.FC = () => {
  const [stage, setStage] = useState(Stage.Default);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const handleNeedHelp: () => void = () => alert('Help is Needed');
  const handleEmailDataUser: () => void = () => alert('Email data user');
  const handleAskDataUser: () => void = () => {
    Messages.push({
      id: 404,
      name: 'Me Myself',
      avatar: 'MM',
      text: 'You will have 2 weeks to read the article and decide whether to accept or decline co-authorship. You can ask questions or provide your suggestions to the author via private messages. We recommend starting this process well in advance. If you do not approve the request within 2 weeks, you will lose the opportunity for co-authorship in this article. If you decline, the data user will simply cite your dataset.'
    });
    setStage(Stage.DataUserAsked);
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
      text: [
        'The manuscript was approved. You may use this log to continue discussions with data user according your collaboration.'
      ]
    });
    setStage(Stage.ManuscriptApproved);
    handleCloseCommentModal();
  };

  const handleDecline: () => void = () => setShowDeclineModal(true);
  const handleCloseDeclineModal: () => void = () => setShowDeclineModal(false);
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
        'Thank you for the reply. The data user will be required to cite your dataset, but will not specify you as a co-author.',
        'You can write us feedback to improve the platform 💬 '
      ]
    });
    setStage(Stage.Declined);
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
    setStage(Stage.ManuscriptApproved);
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
      text: [
        'UPD: Peter Lidsky attached a preview of the manuscript of their publication:',
        `<p style="border-radius: 0.5rem; background-color: #F3F2F5; padding: 10px">
          My manuscript.pdf
        </p>`,
        'You will have 2 weeks to read the article and decide whether to accept or decline co-authorship. You can ask questions or provide your suggestions to the author via private messages. We recommend starting this process well in advance. If you do not approve the request within 2 weeks, you will lose the opportunity for co-authorship in this article. If you decline, the data user will simply cite your dataset.'
      ]
    });
    setStage(Stage.CollaborationApproved);
  };

  return (
    <div>
      {Messages.map((message) => (
        <React.Fragment key={message.id}>
          <Message name={message.name} avatar={message.avatar}>
            {message.text}
          </Message>
          <HeightElement value={'32px'} />
        </React.Fragment>
      ))}
      {stage === Stage.Default && (
        <UserOptions
          stage={stage}
          onNeedHelp={handleNeedHelp}
          onApproveCollaboration={handleApproveCollaboration}
          onEmailDataUser={handleEmailDataUser}
          onDecline={handleDecline}
        />
      )}
      {stage === Stage.CollaborationApproved && (
        <UserOptions
          stage={stage}
          onNeedHelp={handleNeedHelp}
          onAskDataUser={handleAskDataUser}
          onDecline={handleDecline}
        />
      )}
      {stage === Stage.DataUserAsked && (
        <UserOptions
          stage={stage}
          onNeedHelp={handleNeedHelp}
          onApproveManuscript={handleApproveManuscript}
          onApproveManuscriptWithComments={handleApproveManuscriptWithComments}
          onAskDataUser={handleEmailDataUser}
          onDecline={handleDecline}
        />
      )}
      {stage === Stage.ManuscriptApproved && (
        <UserOptions
          stage={stage}
          onNeedHelp={handleNeedHelp}
          onAskDataUser={handleEmailDataUser}
        />
      )}
      {stage === Stage.Declined && (
        <UserOptions stage={stage} onNeedHelp={handleNeedHelp} />
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
    </div>
  );
};

export default Chat;

const ButtonsWrapper = styled.div`
  display: block;
  & button {
    font-size: 18px;
  }
`;

// Need to double check designs for clicked and hovered styles of buttons
const StyledButton = styled(Button)`
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
  &:hover {
    background: rgb(0 0 0 / 4%);
    border-color: #040036;
  }
`;

const StyledApproveButton = styled(Button)`
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
  color: #3b4eff;
  border-color: #3b4eff;
`;

const StyledDeclineButton = styled(Button)`
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
  color: #d32f2f;
  border-color: #d32f2f;
  &:hover {
    border-color: #d32f2f;
    background: rgb(255 78 255 / 4%);
  }
`;

const StyledBox = styled(Box)`
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0px 6px 28px 5px rgba(0, 0, 0, 0.12),
    0px 15px 22px 2px rgba(0, 0, 0, 0.14), 0px 8px 9px -5px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  max-width: 30rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ModalButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ModalButtonsCancel = styled(Button)`
  color: #3b4eff;
  padding: 0.5rem 1.375rem;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  margin-right: 1.5rem;
`;
const ModalButtonsDecline = styled(Button)`
  color: #fff;
  background: #d32f2f;
  padding: 0.5rem 1.375rem;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  &:hover {
    background: #ff0000;
  }
`;
const ModalButtonsApprove = styled(Button)`
  color: #fff;
  background: #3b4eff;
  padding: 0.5rem 1.375rem;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  &:hover {
    background: #3b4eff;
  }
`;
