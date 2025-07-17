import React, { ReactElement, useCallback, useState } from "react"
import DialogTitle from '@mui/material/DialogTitle';
import { Close } from '@mui/icons-material';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { Button, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import { FlexWrapRow, TitleRowWrap, WidthElement } from "src/pages/common.styled"
import { DownloadedPublicationCollaborationChatStore } from "../../publication/store/DownloadedPublicationCollaborationChatStore"
import { useDropzone } from "react-dropzone"

export const UploadFinalDraftDialog = observer(
  (props: {
    isOpen: boolean;
    collaborationChatStore: DownloadedPublicationCollaborationChatStore
  }): ReactElement => {
    // const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { isOpen, collaborationChatStore } = props;

    const [estimatedSubmissionDate, setEstimatedSubmissionDate] = useState<string | null>(null);
    const [comment, setComment] = useState<string | null>(null);

    const [touched, setTouched] = useState(false);

    const [loading, setLoading] = useState(false);

    const [isDropZoneVisible, setIsDropZoneVisible] = useState(true);

    const onClose = (): void => {
      debugger;
      collaborationChatStore.setIsUploadDraftDialogOpen(false);
    };

    const submit = async (): Promise<void> => {
      setTouched(true);
      if (estimatedSubmissionDate && comment) {
        setLoading(true);
        // await reportService.createReport({
        //   email,
        //   description,
        //   publicationId,
        //   fileIds: []
        // });
        setLoading(false);
        onClose();
      }
    };

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
                display: 'flex',
                alignContent: 'center'
              }}
              id="upload-final-draft-dialog-title">
              Upload Final Draft
            </DialogTitle>
            <Close
              onClick={onClose}
              style={{
                cursor: 'pointer'
              }}
              htmlColor={'#68676E'}
            />
          </TitleRowWrap>
          <DialogContent
            style={{ width: '100%' }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 400
              }}>
              <TextField
                label="Estimated submission Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                error={touched && !estimatedSubmissionDate}
                style={{ width: '100%', cursor: 'pointer' }}
                sx={{ input: { cursor: 'pointer' } }}
                value={estimatedSubmissionDate}
                onChange={e => {
                  setEstimatedSubmissionDate(e.target.value);
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0],
                  style: {
                    cursor: 'pointer'
                  },
                }}
                onClick={e => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) input.showPicker?.();
                }}
              />
              <FullWidthTextField
                multiline
                rows={4}
                error={touched && !comment}
                variant="outlined"
                label={'Comments (optional):'}
                onChange={(e) => setComment(e.currentTarget.value)}
              />
              <Dropzone key={'uploaded-final-draft-dialog-dropzone'}/>
            </div>
            <ConfirmDialogActions style={{ marginTop: 32 }}>
              <FlexWrapRow>
                <CancelButton
                  color={'primary'}
                  variant="text"
                  size={'large'}
                  onClick={onClose}>
                  Cancel
                </CancelButton>
                <WidthElement value={'24px'} />
                <ConfirmButton
                  size={'large'}
                  disabled={loading}
                  variant={'contained'}
                  onClick={async () => await submit()}>
                  Submit
                </ConfirmButton>
              </FlexWrapRow>
            </ConfirmDialogActions>
          </DialogContent>
        </DialogContentWrap>
      </Dialog>
    );
  }
);

const DialogContentWrap = styled.div`
  padding: 32px !important;
  width: 600px;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-top: 32px;
`;

const ConfirmDialogActions = styled(DialogActions)`
  padding: 0;
  display: flex;
  align-items: end;
`;

const CancelButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 11px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ConfirmButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--error-contrast, #fff);
`;


const Dropzone = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Accepted files:', acceptedFiles);
    // можно сразу отправить файлы на сервер
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #aaa',
        marginTop: 32,
        padding: 40,
        textAlign: 'center',
        background: isDragActive ? '#e0f7fa' : '#fafafa',
        borderRadius: 10,
      }}
    >
      <input {...getInputProps()} />
      {
        isDragActive
          ? <p>Drop files here...</p>
          :
          <div>
            <p>Click to upload or drag and drop</p>
            <p style={{color: 'gray'}}>PDF or DOCX</p>
          </div>
      }
    </div>
  );
};

