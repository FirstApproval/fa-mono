import {
  ChonkyActions,
  type FileActionHandler,
  type FileArray,
  FileBrowser as ChonkySampleFileBrowser,
  FileContextMenu,
  type FileData,
  FileList,
  FileNavbar,
  setChonkyDefaults
} from '@first-approval/chonky';
import React, {
  type MutableRefObject,
  type ReactElement,
  useEffect,
  useState
} from 'react';
import { ChonkyIconFA } from '@first-approval/chonky-icon-fontawesome';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import {
  CircularProgress,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { type ChonkySampleFileSystem } from './ChonkySampleFileSystem';
import { UploadType } from '../../apis/first-approval-api';
import { calculatePathChain } from '../utils';
import { DuplicateCheckResult } from './ChonkySampleFileSystem';
import { SampleFileToolbar } from './SampleFileToolbar';

setChonkyDefaults({
  iconComponent: ChonkyIconFA,
  defaultFileViewActionId: ChonkyActions.EnableListView.id
});

interface SampleFilePayload {
  file?: FileData;
}

interface SampleFileBrowserProps {
  sfs: ChonkySampleFileSystem;
  isChonkyDragRef: MutableRefObject<boolean>;
}

export const SampleFileBrowser = observer(
  (props: SampleFileBrowserProps): ReactElement => {
    const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
    const [fileToNote, setFileToNote] = useState<FileData>();
    const [newFolderName, setNewFolderName] = useState('');
    const [note, setNote] = useState('');
    const [dialogRadioButtonValue, setDialogRadioButtonValue] = useState(
      UploadType.REPLACE
    );
    const [createNewFolderError, setCreateNewFolderError] = useState(false);

    const handleCloseNewFolderDialog = (): void => {
      setNewFolderDialogOpen(false);
      setNewFolderName('');
    };

    const handleCloseNoteDialog = (): void => {
      setNoteDialogOpen(false);
      setNote('');
    };

    const handleCloseDeleteDialog = (): void => {
      setDeleteDialogOpen(false);
      setFilesToDelete([]);
    };

    const { currentPath: currPath, setCurrentPath: setCurrPath } = props.sfs;
    const folderChain = [
      {
        id: '/',
        fullPath: '',
        name: 'Sample Files',
        isDir: true
      },
      ...calculatePathChain(currPath).map((f) => ({
        id: f,
        fullPath: f,
        name: f.substring(f.lastIndexOf('/') + 1),
        isDir: true
      }))
    ];

    const handleAction: FileActionHandler = (data) => {
      if (data.id === ChonkyActions.OpenFiles.id) {
        const targetFile = data.payload.targetFile;
        if (!targetFile) return;
        if (!targetFile.isDir) return;
        const fullPath: string = targetFile.fullPath ?? '';
        const newPath = `${fullPath}/`;
        setCurrPath(newPath);
      } else if (data.id === ChonkyActions.DeleteFiles.id) {
        setFilesToDelete(data.state.selectedFiles.map((f) => f.id));
        setDeleteDialogOpen(true);
      } else if (data.id === ChonkyActions.AddNote.id) {
        const payload = data.payload as SampleFilePayload | undefined;
        let file: FileData | null = null;
        if (payload?.file) {
          file = payload.file;
        } else if (data.state.selectedFiles[0]) {
          file = data.state.selectedFiles[0];
        }
        if (file) {
          setFileToNote(file);
          setNote(file.note ?? '');
          setNoteDialogOpen(true);
        }
      } else if (data.id === ChonkyActions.UploadFiles.id) {
        const sampleFileInput = document.getElementById('sample-file-input');

        if (!sampleFileInput) return;

        const handleFileSelect = async (event: any): Promise<void> => {
          const files = event.target.files;
          const filesArray: File[] = [];

          for (let i = 0; i < files.length; i++) {
            filesArray.push(files[i]);
          }

          void props.sfs
            .hasDuplicatesInCurrentFolder(
              filesArray.map((f) => f.name),
              false
            )
            .then((result) => {
              if (result === DuplicateCheckResult.ROOT_NAME_ALREADY_EXISTS) {
                props.sfs.addDirectoryImpossibleDialogOpen = true;
              } else if (
                result === DuplicateCheckResult.ONE_OR_MORE_FILE_ALREADY_EXISTS
              ) {
                props.sfs.renameOrReplaceDialogOpen = true;
                props.sfs.renameOrReplaceDialogCallback = (
                  uploadType: UploadType
                ) => {
                  props.sfs.addFilesInput(filesArray, uploadType);
                  sampleFileInput.removeEventListener(
                    'change',
                    handleFileSelect
                  );
                  event.target.value = null;
                  props.sfs.renameOrReplaceDialogOpen = false;
                };
              } else {
                props.sfs.addFilesInput(filesArray, UploadType.REPLACE);
                sampleFileInput.removeEventListener('change', handleFileSelect);
                event.target.value = null;
              }
            });
        };

        sampleFileInput.addEventListener('change', handleFileSelect, false);

        sampleFileInput.click();
      } else if (data.id === ChonkyActions.DownloadFiles.id) {
        const files = data.state.selectedFiles.filter((f) => !f.isDir);
        for (const file of files) {
          const downloadLink = document.createElement('a');
          downloadLink.href = `/api/sample-files/download/${file.id}`;
          downloadLink.download = file.name;
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      } else if (data.id === ChonkyActions.StartDragNDrop.id) {
        props.isChonkyDragRef.current = true;
      } else if (data.id === ChonkyActions.EndDragNDrop.id) {
        props.isChonkyDragRef.current = false;
      }
    };

    const myFileActions = [
      ChonkyActions.EnableListView,
      ChonkyActions.EnableGridView,
      ChonkyActions.ToggleShowFoldersFirst,
      ChonkyActions.SortFilesByName,
      ChonkyActions.UploadFiles,
      ChonkyActions.DeleteFiles,
      ChonkyActions.DownloadFiles,
      ChonkyActions.AddNote
    ];

    const [files, setFiles] = useState<FileArray>([]);

    useEffect(() => {
      setFiles(
        props.sfs.files.map((f) => ({
          id: f.id,
          fullPath: f.fullPath,
          name: f.name,
          isDir: f.isDirectory,
          isLoading: f.isUploading,
          note: f.note
        }))
      );
    }, [props.sfs.files]);

    return (
      <>
        <Wrap>
          <ChonkySampleFileBrowser
            disableDragAndDropProvider={true}
            files={files}
            folderChain={folderChain}
            onFileAction={handleAction}
            fileActions={myFileActions}
            disableDefaultFileActions={true}>
            <FileNavbar />
            <SampleFileToolbar />
            {!props.sfs.isLoading && (
              <>
                <FileList />
                <FileContextMenu />
              </>
            )}
            {props.sfs.isLoading && <CircularProgress />}
          </ChonkySampleFileBrowser>
        </Wrap>
        <Dialog
          open={newFolderDialogOpen}
          onClose={handleCloseNewFolderDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">New folder</DialogTitle>
          <DialogContent>
            <ContentWrap>
              <FullWidthTextField
                autoFocus
                value={newFolderName}
                error={createNewFolderError}
                onChange={(e) => {
                  setCreateNewFolderError(false);
                  setNewFolderName(e.currentTarget.value);
                }}
                label="Folder name"
                variant="outlined"
              />
              {createNewFolderError && (
                <FormHelperText error={true}>
                  Folder with this name already exists
                </FormHelperText>
              )}
            </ContentWrap>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewFolderDialog}>Cancel</Button>
            <Button
              onClick={() => {
                void props.sfs
                  .hasDuplicatesInCurrentFolder([newFolderName], true)
                  .then((result) => {
                    if (
                      result === DuplicateCheckResult.ROOT_NAME_ALREADY_EXISTS
                    ) {
                      setCreateNewFolderError(true);
                    } else {
                      handleCloseNewFolderDialog();
                      props.sfs.createFolder(newFolderName);
                    }
                  });
              }}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={props.sfs.renameOrReplaceDialogOpen}
          onClose={props.sfs.closeReplaceOrRenameDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContentWrap>
            <DialogTitle id="alert-dialog-title">Upload options</DialogTitle>
            <DialogContent>
              <ContentWrap>
                <TextWrap>
                  One or more items already exists in this location. Do you want
                  to replace the existing items with a new version or keep both
                  items?
                </TextWrap>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={dialogRadioButtonValue}
                  onChange={(e) => {
                    setDialogRadioButtonValue(e.target.value as UploadType);
                  }}
                  name="radio-buttons-group">
                  <FormControlLabel
                    value={UploadType.REPLACE}
                    control={<Radio />}
                    label="Replace existing file"
                  />
                  <FormControlLabel
                    value={UploadType.RENAME}
                    control={<Radio />}
                    label="Keep all items"
                  />
                </RadioGroup>
              </ContentWrap>
            </DialogContent>
            <DialogActions>
              <Button onClick={props.sfs.closeReplaceOrRenameDialog}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  props.sfs.renameOrReplaceDialogCallback(
                    dialogRadioButtonValue
                  );
                }}>
                Upload
              </Button>
            </DialogActions>
          </DialogContentWrap>
        </Dialog>
        <Dialog
          open={props.sfs.addDirectoryImpossibleDialogOpen}
          onClose={props.sfs.closeAddDirectoryImpossibleDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContentWrap>
            <DialogTitle id="alert-dialog-title">Upload options</DialogTitle>
            <DialogContent>
              <ContentWrap>
                <TextWrap>
                  The name of the folder you are trying to add is already in
                  use. use. Rename and try again.
                </TextWrap>
              </ContentWrap>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => {
                  props.sfs.closeAddDirectoryImpossibleDialog();
                }}>
                Ok
              </Button>
            </DialogActions>
          </DialogContentWrap>
        </Dialog>
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">Delete?</DialogTitle>
          <DialogContent>
            <MaxWidthWrap>
              All selected items will be deleted from Files and you won’t be
              able to undo this action.
            </MaxWidthWrap>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button
              onClick={() => {
                handleCloseDeleteDialog();
                props.sfs.deleteFile(filesToDelete);
              }}
              variant="contained"
              color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={noteDialogOpen}
          onClose={handleCloseNoteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{fileToNote?.name}</DialogTitle>
          <DialogContent>
            <ContentWrap>
              <FullWidthTextarea
                multiline={true}
                minRows={4}
                maxRows={4}
                autoFocus
                value={note}
                placeholder={
                  'Describe the file to help others understand its purpose and relevance...'
                }
                onChange={(e) => {
                  setNote(e.currentTarget.value);
                }}
                label="Note"
                variant="outlined"
              />
            </ContentWrap>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNoteDialog}>Cancel</Button>
            <Button
              onClick={() => {
                handleCloseNoteDialog();
                if (!fileToNote) return;
                props.sfs.updateFile(fileToNote.id, fileToNote.name, note);
              }}>
              Add note
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

const Wrap = styled.div`
  border-radius: 4px;
  border: 1px solid var(--divider, #d2d2d6);
  height: 450px;
`;

const FullWidthTextField = styled(TextField)`
  min-width: 336px;
`;

const FullWidthTextarea = styled(TextField)`
  min-width: 536px;
`;

const MaxWidthWrap = styled.div`
  max-width: 336px;
`;

const ContentWrap = styled.div`
  padding-top: 8px;
`;

const TextWrap = styled.div`
  margin-bottom: 16px;
  font-size: 16px;
`;

const DialogContentWrap = styled.div`
  padding: 16px 32px 32px 16px !important;
`;