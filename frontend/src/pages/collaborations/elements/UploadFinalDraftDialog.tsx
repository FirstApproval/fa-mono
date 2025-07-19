import React, { ReactElement, useCallback, useState } from "react"
import DialogTitle from '@mui/material/DialogTitle';
import { Close, InfoOutlined, UploadFileOutlined } from "@mui/icons-material"
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { Button, TextField, Typography } from "@mui/material"
import DialogActions from '@mui/material/DialogActions'
import { FlexWrapRow, HeightElement, SpaceBetweenColumn, TitleRowWrap, WidthElement } from 'src/pages/common.styled'
import { DownloadedPublicationCollaborationChatStore } from '../../publication/store/DownloadedPublicationCollaborationChatStore'
import { useDropzone } from "react-dropzone"
import {
  CollaborationMessageType,
  CollaborationMessageUploadFinalDraftPayload,
  CollaborationRequestMessage
} from 'src/apis/first-approval-api'
import { C0288D1, C3B4EFF } from '../../../ui-kit/colors'

export const UploadFinalDraftDialog = observer(
  (props: {
    isOpen: boolean;
    collaborationChatStore: DownloadedPublicationCollaborationChatStore
  }): ReactElement => {
    const [file, setFile] = useState<File | null>(null)
    const { isOpen, collaborationChatStore } = props

    const [estimatedSubmissionDate, setEstimatedSubmissionDate] = useState<string | null>(null)
    const [comment, setComment] = useState<string | undefined>(undefined)

    const [touched, setTouched] = useState(false)

    const [loading, setLoading] = useState(false)

    const onClose = (): void => collaborationChatStore.setIsUploadDraftDialogOpen(false)

    const submit = async (): Promise<void> => {
      setTouched(true)
      if (estimatedSubmissionDate && file) {
        setLoading(true)

        const payload: CollaborationMessageUploadFinalDraftPayload = {
          estimatedSubmissionDate,
          comment,
          type: CollaborationMessageType.UPLOAD_FINAL_DRAFT
        }

        const message: CollaborationRequestMessage = {
          type: CollaborationMessageType.UPLOAD_FINAL_DRAFT,
          text: "",
          isAssistant: false,
          payload
        }
        collaborationChatStore.sendMessage(message, CollaborationMessageType.UPLOAD_FINAL_DRAFT).then(messageId => {
            collaborationChatStore.uploadFile(messageId, file!!)
          }).finally(() => {
            setLoading(false);
            onClose();
        });
      }
    }

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="upload-final-draft-dialog-title"
        aria-describedby="upload-final-draft-dialog-description">
        <DialogContentWrap>
          <TitleRowWrap>
            <DialogTitle
              style={{
                paddingTop: 0,
                fontSize: 20,
                fontWeight: 500,
                display: "flex",
                alignContent: "center"
              }}
              id="upload-final-draft-dialog-title">
              Upload Final Draft
            </DialogTitle>
            <Close
              onClick={onClose}
              style={{
                cursor: "pointer"
              }}
              htmlColor={"#68676E"}
            />
          </TitleRowWrap>
          <DialogContent
            style={{ width: "100%" }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 400
              }}>
              <TextField
                label="Estimated submission Date"
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
                error={touched && !estimatedSubmissionDate}
                style={{
                  width: "100%",
                  cursor: "pointer"
                }}
                sx={{ input: { cursor: "pointer" } }}
                value={estimatedSubmissionDate}
                onChange={e => setEstimatedSubmissionDate(e.target.value)}
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                  style: {
                    cursor: "pointer"
                  }
                }}
                onClick={e => {
                  const input = e.currentTarget.querySelector("input")
                  if (input) input.showPicker?.()
                }}
              />
              <FullWidthTextField
                multiline
                rows={4}
                variant="outlined"
                label={"Comments (optional):"}
                onChange={(e) => setComment(e.currentTarget.value)}
              />
              <Dropzone key={"uploaded-final-draft-dialog-dropzone"} setFile={setFile} file={file} />
              <HeightElement value="32px" />
              <DontForgetToCreditDataAuthor style={{ backgroundColor: "#E5F6FD" }}>
                <InfoOutlined htmlColor={C0288D1} />
                <WidthElement value={"8px"} />
                <Typography variant={"body2"} color={"#014361"}>
                  Don’t forget to credit Data Author as co-author
                </Typography>
              </DontForgetToCreditDataAuthor>
            </div>
            <ConfirmDialogActions style={{ marginTop: 32 }}>
              <FlexWrapRow>
                <CancelButton
                  color={"primary"}
                  variant="text"
                  size={"large"}
                  onClick={onClose}>
                  Cancel
                </CancelButton>
                <WidthElement value={"24px"} />
                <ConfirmButton
                  size={"large"}
                  disabled={loading || !estimatedSubmissionDate || !file}
                  variant={"contained"}
                  onClick={async () => await submit()}>
                  Submit
                </ConfirmButton>
              </FlexWrapRow>
            </ConfirmDialogActions>
          </DialogContent>
        </DialogContentWrap>
      </Dialog>
    )
  }
)

const DialogContentWrap = styled.div`
  padding: 32px !important;
  width: 600px;
`

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-top: 32px;
`

const ConfirmDialogActions = styled(DialogActions)`
  padding: 0;
  display: flex;
  align-items: end;
`

const CancelButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 11px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ConfirmButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--error-contrast, #fff);
`

const DontForgetToCreditDataAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 14px 16px;
  border-radius: 4px;
`

const Dropzone: React.FC<{ setFile: (file: File) => void, file: File | null }> = ({
  setFile,
  file
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    console.log("Accepted files:", acceptedFiles)
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      style={{
        border: "1px dashed #D2D2D6",
        marginTop: 32,
        padding: "24px 16px",
        textAlign: "center",
        borderRadius: 10,
        height: 150,
        cursor: "pointer"
      }}
    >
      <input {...getInputProps()} />
      {
        file ? (
          // <SpaceBetweenColumn style={{justifyContent: 'space-between'}}>
          //   <Typography variant={'body1'}>Uploaded file: {file.name}</Typography>
          //   <Typography variant={'body1'}>
          //     <span style={{ color: C3B4EFF }}>To upload another file click</span> or drag and drop
          //   </Typography>
          //   <Typography variant={'body1'} style={{ color: 'gray', marginBottom: 0 }}>PDF or DOCX</Typography>
          // </SpaceBetweenColumn>
          <SpaceBetweenColumn>
            <Typography variant={"body1"}>Uploaded file: {file.name}</Typography>
            <Typography variant={"body1"}>
              <span style={{ color: C3B4EFF }}>To upload another file click</span> or drag and drop
            </Typography>
            <Typography variant={"body1"} style={{
              color: "gray",
              marginBottom: 0
            }}>PDF or DOCX</Typography>
          </SpaceBetweenColumn>
        ) : (
          isDragActive
            ? <p>Drop files here...</p>
            : <SpaceBetweenColumn>
              <UploadFileOutlined htmlColor={C3B4EFF} sx={{
                width: 40,
                height: 40
              }} />
              <Typography variant={"body1"}>
                <span style={{ color: C3B4EFF }}>Click to upload</span> or drag and drop
              </Typography>
              <Typography variant={"body1"} style={{
                color: "gray",
                marginBottom: 0
              }}>PDF or DOCX</Typography>
            </SpaceBetweenColumn>
        )
      }
    </div>
  )
}

