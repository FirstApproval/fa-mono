import React, { ReactElement, useCallback, useEffect, useState } from "react"
import DialogTitle from '@mui/material/DialogTitle';
import { Close, Download, InfoOutlined, UploadFileOutlined } from "@mui/icons-material"
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { Button, Link, TextField, Typography } from "@mui/material"
import DialogActions from '@mui/material/DialogActions'
import {
  FlexBodyAlignItemsCenter,
  FlexWrapRow,
  HeightElement,
  SpaceBetweenColumn,
  TitleRowWrap,
  WidthElement
} from "src/pages/common.styled"
import { useDropzone } from "react-dropzone"
import { C0288D1, C3B4EFF } from '../../../ui-kit/colors'

export const UploadAcademicSupervisorSignedLettersDialog = observer(
  (props: {
    isOpen: boolean;
    close: () => void;
    uploadLetter: (academicSupervisorName: string, file: File) => Promise<void>;
  }): ReactElement => {
    const { isOpen, close, uploadLetter } = props

    useEffect(() => {
      if (!isOpen) {
        setFile(null)
        setAcademicSupervisorName(undefined)
        setTouched(false)
        setLoading(false)
      }
    }, [isOpen])

    const [file, setFile] = useState<File | null>(null)
    const [academicSupervisorName, setAcademicSupervisorName] = useState<string | undefined>(undefined)

    const [touched, setTouched] = useState(false)

    const [loading, setLoading] = useState(false)

    const submit = async (): Promise<void> => {
      setTouched(true)
      if (academicSupervisorName && file) {
        setLoading(true)

        uploadLetter(academicSupervisorName, file)
          .then()
          .finally(() => {
              setLoading(false);
              close();
        })
      }
    }

    return (
      <Dialog
        open={isOpen}
        onClose={close}
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
              id="upload-signed-letters-from-academics-supervisors-title">
              Upload Signed Letters From Academics Supervisors
            </DialogTitle>
            <Close
              onClick={close}
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
                label="Academic supervisor name"
                type="text"
                InputLabelProps={{
                  shrink: true
                }}
                error={touched && !academicSupervisorName}
                style={{
                  width: "100%",
                  cursor: "pointer"
                }}
                sx={{ input: { cursor: "pointer" } }}
                value={academicSupervisorName}
                onChange={e => setAcademicSupervisorName(e.target.value)}
                inputProps={{
                  style: {
                    cursor: "pointer"
                  }
                }}
              />
              <Dropzone key={"uploaded-final-draft-dialog-dropzone"} setFile={setFile} file={file} />
              <HeightElement value="32px" />
              <Link
                color="primary"
                href={'/docs/PI_Endorsement_Letter_Template.docx'}
                underline={'hover'}
                target={'_blank'}
              >
                <FlexBodyAlignItemsCenter>
                  <span>Download letter template</span>
                  <Download sx={{width: '20px', height: '20px', marginTop: '2px'}} />
                </FlexBodyAlignItemsCenter>
              </Link>
              <HeightElement value="5px" />
              <AcademicSupervisorInfoSection style={{ backgroundColor: "#E5F6FD" }}>
                <InfoOutlined htmlColor={C0288D1} />
                <WidthElement value={"8px"} />
                <Typography variant={"body2"} color={"#014361"}>
                  Your academic supervisor may be your thesis advisor,
                  laboratory head, or another authorized university representative
                  who can confirm your right to submit this dataset.
                </Typography>
              </AcademicSupervisorInfoSection>
            </div>
            <ConfirmDialogActions style={{ marginTop: 32 }}>
              <FlexWrapRow>
                <CancelButton
                  color={"primary"}
                  variant="text"
                  size={"large"}
                  onClick={close}>
                  Cancel
                </CancelButton>
                <WidthElement value={"24px"} />
                <ConfirmButton
                  size={"large"}
                  disabled={loading || !academicSupervisorName || !file}
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

const AcademicSupervisorInfoSection = styled.div`
  display: flex;
  align-items: start;
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
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    }
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
              }}>PDF, JPEG or PNG</Typography>
            </SpaceBetweenColumn>
        )
      }
    </div>
  )
}

