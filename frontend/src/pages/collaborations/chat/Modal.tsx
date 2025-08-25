import styled from "@emotion/styled"
import { Box, Button, Link, Modal, Typography } from "@mui/material"
import React, { useState } from "react"
import collaborationRequirementsImage from "../../../assets/collaboration_requirements.svg"
import { HeightElement } from "../../common.styled"
import timetableImage from "../../../assets/fa-timetable.svg"
import sendImage from "../../../assets/fa-send.svg"
import highFiveImage from "../../../assets/fa-highfive.svg"
import { TextareaAutosize } from "@mui/base"
import { CollaborationMessageFile } from "../elements/FileElement"
import { Flex, FlexAlignItems, FlexJustifyContent } from "../../../ui-kit/flex"
import { Close } from "@mui/icons-material"
import { C68676E } from "../../../ui-kit/colors"
import { FlexWrapRowFullWidth } from "../../../components/WorkplacesEditor"

export const DeclineModal = ({
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
        <HeightElement value={"2rem"} />
        <Typography id="modal-modal-description" sx={{ fontSize: "1.25rem" }}>
          Are you sure you want to decline the request? By declining a
          collaboration, you oblige data user to simply quote your dataset,
          without specifying you as a co-author.
        </Typography>
        <HeightElement value={"2rem"} />
        <ModalButtonsWrapper>
          <ModalButtonsCancel onClick={handleClose}>Cancel</ModalButtonsCancel>
          <ModalButtonsDecline onClick={handleAction}>
            Decline
          </ModalButtonsDecline>
        </ModalButtonsWrapper>
      </StyledBox>
    </Modal>
  )
}
export const CollaborationRequirementsModal = ({
  open,
  handleClose,
  handleAction
}: {
  open: boolean;
  handleClose: () => void;
  handleAction: () => void;
}): React.ReactElement => {
  const [checked, setChecked] = React.useState(false)
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
        <HeightElement value={"2rem"} />
        <Typography id="modal-modal-description" sx={{ fontSize: "1.25rem" }}>
          By incorporating this Dataset into your work or using it as a part of
          your larger Dataset you undertake to send the Data Author(s) a
          Collaboration Request.
        </Typography>
        <br />
        <Typography id="modal-modal-description-2" sx={{ fontSize: "1.25rem" }}>
          This may result in including the Data Author(s) as co-author(s) to
          your work. <Link href="#">Read more about Collaboration... </Link>
        </Typography>
        <br />
        <Typography id="modal-modal-description-3" sx={{ fontSize: "1.25rem" }}>
          <input onClick={() => setChecked(!checked)} type="checkbox" /> I agree
          to the terms of the{" "}
          <Link href="#">First Approval Collaboration License</Link>, including
          sending a Collaboration Request to the Data Author(s).
        </Typography>
        <HeightElement value={"2rem"} />
        <ModalButtonsWrapper>
          <ModalButtonsCancel onClick={handleClose}>Cancel</ModalButtonsCancel>
          <ModalButtonsDownload disabled={!checked} onClick={handleAction}>
            Download (110 MB)
          </ModalButtonsDownload>
        </ModalButtonsWrapper>
      </StyledBox>
    </Modal>
  )
}
export const CommentsModal = ({
  open,
  handleClose,
  handleAction
}: {
  open: boolean;
  handleClose: () => void;
  handleAction: (e: string) => void;
}): React.ReactElement => {
  const [comment, setComment] = useState('');

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
        <HeightElement value={"2rem"} />
        <form onSubmit={e => {
          e.preventDefault()
          handleAction(comment)
          handleClose()
        }}>
          <Textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            aria-label="comment"
            name="comment"
            minRows={10}
            placeholder="Write comments"
          />
          <HeightElement value={"2rem"} />
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
  )
}
export const Step1Modal = ({
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
          <FlexWrapRowFullWidth style={{justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <img src={sendImage} style={{ marginLeft: "-14px" }} />
            <Flex
              justifyContent={FlexJustifyContent.flexEnd}
              alignItems={FlexAlignItems.center}>
              <Close
                onClick={() => handleClose()}
                sx={{
                  width: "35px",
                  height: "35px",
                  cursor: "pointer"
                }}
                htmlColor={C68676E}
              />
            </Flex>
          </FlexWrapRowFullWidth>
          <div>
            <span
              style={{
                background: "#dedede",
                padding: "5px",
                borderRadius: "3px",
                fontSize: "11px",
                margin: "10px 0 20px",
                display: "inline-block"
              }}>
              Step 1
            </span>
          </div>
        </div>
        <Typography id="modal-modal-title" variant="h5" component="h5">
          Send collaboration request to all dataset authors
        </Typography>
        <HeightElement value={"2rem"} />
        <Typography>
          The collaboration request is performed by signing a formalized
          agreement, which will be sent to each author individually. It will
          contain details about your ideas for future collaborative publication,
          including the potential name and type of your publication, and details
          of the research where you would like to use the Dataset. We will
          include this information in the Collaboration Agreement.
        </Typography>
        <HeightElement value={"2rem"} />
        <p
          onClick={handleAction}
          style={{
            borderRadius: "0.5rem",
            backgroundColor: "rgb(243, 242, 245)",
            padding: "10px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            width: "100%",
            maxWidth: "100%",
            cursor: "pointer"
          }}>
          <CollaborationMessageFile link="/docs/FA_Collaboration_Agreement_template.pdf" fileName="FA Collaboration Agreement template.pdf"/>
        </p>
      </StyledBox>
    </Modal>
  )
}
export const Step2Modal = ({
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
        <FlexWrapRowFullWidth style={{justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <img src={timetableImage} style={{ marginLeft: "-14px" }} />
          <Flex
            justifyContent={FlexJustifyContent.flexEnd}
            alignItems={FlexAlignItems.center}>
            <Close
              onClick={() => handleClose()}
              sx={{
                width: "35px",
                height: "35px",
                cursor: "pointer"
              }}
              htmlColor={C68676E}
            />
          </Flex>
        </FlexWrapRowFullWidth>
        <span
          style={{
            background: "#dedede",
            padding: "5px",
            borderRadius: "3px",
            fontSize: "11px",
            margin: "10px 0 20px",
            display: "inline-block"
          }}>
          Step 2
        </span>
        <Typography id="modal-modal-title" variant="h5" component="h5">
          Dataset author(s) confirm the collaboration (maximum 30 days)
        </Typography>
        <HeightElement value={"2rem"} />
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
        <HeightElement value={"2rem"} />
        <p
          onClick={handleAction}
          style={{
            borderRadius: "0.5rem",
            backgroundColor: "rgb(243, 242, 245)",
            padding: "10px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            width: "100%",
            maxWidth: "100%",
            cursor: "pointer"
          }}>
          <CollaborationMessageFile link="/docs/FA_Collaboration_Agreement_template.pdf" fileName="FA Collaboration Agreement template.pdf"/>
        </p>
      </StyledBox>
    </Modal>
  )
}
export const Step3Modal = ({
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
          <FlexWrapRowFullWidth style={{justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <img src={highFiveImage} style={{ marginLeft: "-14px" }} />
            <Flex
              justifyContent={FlexJustifyContent.flexEnd}
              alignItems={FlexAlignItems.center}>
              <Close
                onClick={() => handleClose()}
                sx={{
                  width: "35px",
                  height: "35px",
                  cursor: "pointer"
                }}
                htmlColor={C68676E}
              />
            </Flex>
          </FlexWrapRowFullWidth>
          <div>
            <span
              style={{
                background: "#dedede",
                padding: "5px",
                borderRadius: "3px",
                fontSize: "11px",
                margin: "10px 0 20px",
                display: "inline-block"
              }}>
              Step 3
            </span>
          </div>
        </div>
        <Typography id="modal-modal-title" variant="h5" component="h5">
          Discuss and confirm with author(s) the details of your publication
          before submission
        </Typography>
        <HeightElement value={"2rem"} />
        <Typography>
          How your collaboration will be organized depends on you. But the
          mandatory requirement of the collaboration is the validation by the
          Data Author of the analyses of the Dataset conducted in your
          publication and the confirmation of the draft of the final revision of
          the publication. This can enhance the quality of the future
          publication through additional expertise and make the Data Authors as
          true co-authors of your publication.
        </Typography>
        <HeightElement value={"2rem"} />
        <Typography>
          We recommend informing the Data Authors of the planned completion date
          for your publication as early as possible.
        </Typography>
        <HeightElement value={"2rem"} />
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
        <HeightElement value={"2rem"} />
        <p
          onClick={handleAction}
          style={{
            borderRadius: "0.5rem",
            backgroundColor: "rgb(243, 242, 245)",
            padding: "10px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            width: "100%",
            maxWidth: "100%",
            cursor: "pointer"
          }}>
          <CollaborationMessageFile link="/docs/FA_Collaboration_Agreement_template.pdf" fileName="FA Collaboration Agreement template.pdf"/>
        </p>
      </StyledBox>
    </Modal>
  )
}

export const StyledApproveButton = styled(Button)<{
  isDecline?: boolean;
}>`
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
  ${(props) =>
          props.isDecline ? 
                  'color: #d32f2f;' +
                  'border-color: #d32f2f;' +
                  '&:hover {border-color: #d32f2f; background: rgb(255 78 255 / 4%);}' 
                  :
                  'color: #3b4eff;' +
                  'border-color: #3b4eff;'}
  
`

export const StyledBox = styled(Box)`
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
`
const Textarea = styled(TextareaAutosize)`
  width: 100%;
  padding: 1rem;
  font: inherit;
`
export const ModalButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`
export const ModalButtonsCancel = styled(Button)`
  color: #3b4eff;
  padding: 0.5rem 1.375rem;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  margin-right: 1.5rem;
`
export const ModalButtonsDecline = styled(Button)`
  color: #fff;
  background: #d32f2f;
  padding: 0.5rem 1.375rem;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  &:hover {
    background: #ff0000;
  }
`
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
`
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
`
