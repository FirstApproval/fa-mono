import React, { useEffect, useState } from 'react';
import AvatarNameBox, { SelfAvatar } from '../elements/AvatarNameBox';
import { Box, Button, Typography, Modal, Link, TextField } from '@mui/material';
import { TextareaAutosize } from '@mui/base';
import { HeightElement } from '../../common.styled';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import collaborationRequirementsImage from '../../../assets/collaboration_requirements.svg';
import sendImage from '../../../assets/fa-send.svg';
import fileIcon from '../../../assets/file-icon.svg';
import timetableImage from '../../../assets/fa-timetable.svg';
import highfiveImage from '../../../assets/fa-highfive.svg';

import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify';

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

const Message = ({
  name,
  avatar,
  children
}: {
  name: string;
  avatar: string;
  children: React.ReactNode | React.ReactNode[];
}): React.ReactElement => {
  return (
    <div>
      <AvatarNameBox avatar={avatar} name={name} />
      <HeightElement value={'12px'} />
      <Typography variant={'body'}>
        {children}
        {/* {Array.isArray(children) ? (
          children.map((c, i) => (
            <Markdown rehypePlugins={[rehypeRaw]} key={i}>
              {DOMPurify.sanitize(c)}
            </Markdown>
          ))
        ) : (
          <Markdown rehypePlugins={[rehypeRaw]}>
            {DOMPurify.sanitize(children)}
          </Markdown>
        )} */}
      </Typography>
    </div>
  );
};

enum Stage {
  Default,
  CollaborationApproved,
  DataUserAsked,
  ManuscriptApproved,
  Declined,
  AuthorInfoReceived,
  PublicationInfoReceived
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
  onCollaborate?: () => void;
  onFormMsg?: () => void;
}

const UserOptions = ({
  stage,
  onNeedHelp,
  onApproveCollaboration,
  onApproveManuscript,
  onApproveManuscriptWithComments,
  onAskDataUser,
  onEmailDataUser,
  onDecline,
  onCollaborate,
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
        <StyledButton variant="outlined" onClick={onFormMsg}>
          Ask First Approval
        </StyledButton>
        <StyledApproveButton variant="outlined" onClick={onCollaborate}>
          I’d like to collaborate! Tell me more
        </StyledApproveButton>
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

const CollaborationRequirementsModal = ({
  open,
  handleClose,
  handleAction
}: {
  open: boolean;
  handleClose: () => void;
  handleAction: () => void;
}): React.ReactElement => {
  const [checked, setChecked] = React.useState(false);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <StyledBox>
        <img src={collaborationRequirementsImage} />;
        <Typography id="modal-modal-title" variant="h5" component="h5">
          Collaboration requirements
        </Typography>
        <HeightElement value={'2rem'} />
        <Typography id="modal-modal-description" sx={{ fontSize: '1.25rem' }}>
          By incorporating this Dataset into your work or using it as a part of
          your larger Dataset you undertake to send the Data Author(s) a
          Collaboration Request.
        </Typography>
        <br />
        <Typography id="modal-modal-description-2" sx={{ fontSize: '1.25rem' }}>
          This may result in including the Data Author(s) as co-author(s) to
          your work. <Link href="#">Read more about Collaboration... </Link>
        </Typography>
        <br />
        <Typography id="modal-modal-description-3" sx={{ fontSize: '1.25rem' }}>
          <input onClick={() => setChecked(!checked)} type="checkbox" /> I agree
          to the terms of the{' '}
          <Link href="#">First Approval Collaboration License</Link>, including
          sending a Collaboration Request to the Data Author(s).
        </Typography>
        <HeightElement value={'2rem'} />
        <ModalButtonsWrapper>
          <ModalButtonsCancel onClick={handleClose}>Cancel</ModalButtonsCancel>
          <ModalButtonsDownload disabled={!checked} onClick={handleAction}>
            Download (110 MB)
          </ModalButtonsDownload>
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
          <Textarea
            aria-label="comment"
            name="comment"
            minRows={10}
            placeholder="Write comments"
          />
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

const Step1Modal = ({
  open,
  handleClose,
  handleAction
}: {
  open: boolean;
  handleClose: () => void;
  handleAction?: (e: any) => void;
}): React.ReactElement => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <StyledBox>
        <div>
          <img src={sendImage} style={{ marginLeft: '-14px' }} />
          <div>
            <span
              style={{
                background: '#dedede',
                padding: '5px',
                borderRadius: '3px',
                fontSize: '11px',
                margin: '10px 0 20px',
                display: 'inline-block'
              }}>
              Step 1
            </span>
          </div>
        </div>
        <Typography id="modal-modal-title" variant="h5" component="h5">
          Send collaboration request to all dataset authors
        </Typography>
        <HeightElement value={'2rem'} />
        <Typography>
          The collaboration request is performed by signing a formalized
          agreement, which will be sent to each author individually. It will
          contain details about your ideas for future collaborative publication,
          including the potential name and type of your publication, and details
          of the research where you would like to use the Dataset. We will
          include this information in the Collaboration Agreement.
        </Typography>
        <HeightElement value={'2rem'} />
        <p
          onClick={handleAction}
          style={{
            borderRadius: '0.5rem',
            backgroundColor: 'rgb(243, 242, 245)',
            padding: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            maxWidth: '100%',
            cursor: 'pointer'
          }}>
          <img src={fileIcon} /> FA Collaboration agreement.pdf
        </p>
      </StyledBox>
    </Modal>
  );
};

const Step2Modal = ({
  open,
  handleClose,
  handleAction
}: {
  open: boolean;
  handleClose: () => void;
  handleAction?: (e: any) => void;
}): React.ReactElement => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <StyledBox>
        <div>
          <img src={timetableImage} style={{ marginLeft: '-14px' }} />
          <div>
            <span
              style={{
                background: '#dedede',
                padding: '5px',
                borderRadius: '3px',
                fontSize: '11px',
                margin: '10px 0 20px',
                display: 'inline-block'
              }}>
              Step 2
            </span>
          </div>
        </div>
        <Typography id="modal-modal-title" variant="h5" component="h5">
          Dataset author(s) confirm the collaboration (maximum 30 days)
        </Typography>
        <HeightElement value={'2rem'} />
        <Typography>
          Dataset Author(s) will review your request and have 30 days to confirm
          collaboration by signing the Collaboration Agreement. Each Dataset
          Author will act individually, and the response of one Author does not
          affect the response of another. Once a Dataset Author confirms the
          collaboration, it will be officially initiated, and the information
          about your collaboration will be available on the Dataset’s page. If
          all Dataset Authors reject the collaboration request, you may publish
          your analysis of the Dataset using standard citation. If an author
          does not sign the agreement within 30 days, they can still respond to
          the collaboration request later, but until then, you will have
          permission to submit the article with standard citation.
        </Typography>
        <HeightElement value={'2rem'} />
        <p
          onClick={handleAction}
          style={{
            borderRadius: '0.5rem',
            backgroundColor: 'rgb(243, 242, 245)',
            padding: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            maxWidth: '100%',
            cursor: 'pointer'
          }}>
          <img src={fileIcon} /> FA Collaboration agreement.pdf
        </p>
      </StyledBox>
    </Modal>
  );
};

const Step3Modal = ({
  open,
  handleClose,
  handleAction
}: {
  open: boolean;
  handleClose: () => void;
  handleAction?: (e: any) => void;
}): React.ReactElement => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <StyledBox>
        <div>
          <img src={sendImage} style={{ marginLeft: '-14px' }} />
          <div>
            <span
              style={{
                background: '#dedede',
                padding: '5px',
                borderRadius: '3px',
                fontSize: '11px',
                margin: '10px 0 20px',
                display: 'inline-block'
              }}>
              Step 1
            </span>
          </div>
        </div>
        <Typography id="modal-modal-title" variant="h5" component="h5">
          Discuss and confirm with author(s) the details of your publication
          before submission
        </Typography>
        <HeightElement value={'2rem'} />
        <Typography>
          How your collaboration will be organized depends on you. But the
          mandatory requirement of the collaboration is the validation by the
          Data Author of the analyses of the Dataset conducted in your
          publication and the confirmation of the draft of the final revision of
          the publication. This can enhance the quality of the future
          publication through additional expertise and make the Data Authors as
          true co-authors of your publication.
        </Typography>
        <HeightElement value={'2rem'} />
        <Typography>
          We recommend informing the Data Authors of the planned completion date
          for your publication as early as possible.
        </Typography>
        <HeightElement value={'2rem'} />
        <Typography>Regardless, you must:</Typography>
        <ul>
          <li>
            Notify the Data Author of the proposed date for the submission of
            the manuscript to the publisher (the “ Submission Date”) not later
            than 30 days prior to such Submission Date.
          </li>
          <li>
            Provide the Data Author with a draft of your work no later than 14
            days prior to the Submission Date.
          </li>
        </ul>
        <Typography>
          This allows the Data Author to plan ahead and have the opportunity to
          review the work, provide suggestions for improvement, or accept the
          text without comments.
        </Typography>
        <HeightElement value={'2rem'} />
        <p
          onClick={handleAction}
          style={{
            borderRadius: '0.5rem',
            backgroundColor: 'rgb(243, 242, 245)',
            padding: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            maxWidth: '100%',
            cursor: 'pointer'
          }}>
          <img src={fileIcon} /> FA Collaboration agreement.pdf
        </p>
      </StyledBox>
    </Modal>
  );
};

const Chat: React.FC = () => {
  const [stage, setStage] = useState(Stage.Default);
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
      text: (
        <p>
          The manuscript was approved. You may use this log to continue
          discussions with data user according your collaboration.
        </p>
      )
    });
    setStage(Stage.ManuscriptApproved);
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

  const handleCollaborate: () => void = () => {
    Messages.push({
      id: 123123,
      name: 'Assistant',
      avatar: 'FA',
      text: [
        <>
          If you’re interested in this Dataset and considering publishing your
          future work together with the Data Author(s), First Approval will make
          the collaboration process easier. Let me guide you through it before
          you agree to work on the publication together. The FA collaboration
          process has 3 steps.
          <div
            id="fa-collab-helper-box"
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '16px'
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
        </>
      ]
    });
    setStage(Stage.ManuscriptApproved);
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
    setStage(Stage.PublicationInfoReceived);
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
    setStage(Stage.AuthorInfoReceived);
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
    setStage(Stage.CollaborationApproved);
  };

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
            onNeedHelp={handleShowCollabModal}
            onApproveCollaboration={handleApproveCollaboration}
            onEmailDataUser={handleEmailDataUser}
            onDecline={handleDecline}
            onCollaborate={handleCollaborate}
          />
        )}
        {stage === Stage.CollaborationApproved && (
          <UserOptions
            stage={stage}
            onNeedHelp={handleNeedHelp}
            onFormMsg={handleAuthorInfoFormMsg}
            onAskDataUser={handleAskDataUser}
            onDecline={handleDecline}
          />
        )}
        {stage === Stage.DataUserAsked && (
          <UserOptions
            stage={stage}
            onNeedHelp={handleNeedHelp}
            onApproveManuscript={handleApproveManuscript}
            onApproveManuscriptWithComments={
              handleApproveManuscriptWithComments
            }
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
  min-width: 42rem;
  max-width: 30rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Textarea = styled(TextareaAutosize)`
  width: 100%;
  padding: 1rem;
  font: inherit;
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
const ModalButtonsDownload = styled(Button)`
  color: #fff;
  background: #3b4eff;
  padding: 0.5rem 1.375rem;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  &:hover {
    background: #3b4eff;
  }
  &:disabled {
    background:#8D8D94;
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
