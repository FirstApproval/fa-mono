import {
  ChonkyActions,
  FileAction,
  type FileActionHandler,
  FileBrowser,
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
import {
  DuplicateCheckResult,
  FileEntry,
  type FileSystemFA
} from './FileSystemFA';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import {
  CircularProgress,
  Divider,
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
import { calculatePathChain } from './utils';
import { UploadType } from '../apis/first-approval-api';

setChonkyDefaults({
  iconComponent: ChonkyIconFA,
  defaultFileViewActionId: ChonkyActions.EnableListView.id
});

interface FilePayload {
  file?: FileData;
}

interface FileBrowserProps {
  instanceId: string;
  rootFolderName: string;
  fileDownloadUrlPrefix: string;
  isReadonly: boolean;
  onArchiveDownload?: (files: FileData[]) => void;
  onEditFilesModalOpen?: () => void;
  onPreviewFilesModalOpen?: () => void;
  fs: FileSystemFA;
  isChonkyDragRef: MutableRefObject<boolean>;
  toolbarComponent?: ReactElement;
}

export const FileBrowserFA = observer(
  (props: FileBrowserProps): ReactElement => {
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

    useEffect(() => {
      const fileInput = document.getElementById(
        `${props.instanceId}-file-input`
      );

      if (!fileInput) return;

      const handleFileSelect = async (event: any): Promise<void> => {
        const files = event.target.files;
        const filesArray: File[] = [];

        for (let i = 0; i < files.length; i++) {
          filesArray.push(files[i]);
        }

        void props.fs
          .hasDuplicatesInCurrentFolder(
            filesArray.map((f) => f.name),
            false
          )
          .then((result) => {
            if (result === DuplicateCheckResult.ROOT_NAME_ALREADY_EXISTS) {
              props.fs.addDirectoryImpossibleDialogOpen = true;
            } else if (
              result === DuplicateCheckResult.ONE_OR_MORE_FILE_ALREADY_EXISTS
            ) {
              props.fs.renameOrReplaceDialogOpen = true;
              props.fs.renameOrReplaceDialogCallback = (
                uploadType: UploadType
              ) => {
                props.fs.addFilesInput(filesArray, uploadType);
                props.fs.renameOrReplaceDialogOpen = false;
              };
            } else {
              props.fs.addFilesInput(filesArray, UploadType.REPLACE);
            }
          })
          .finally(() => {
            event.target.value = null;
          });
      };

      fileInput.addEventListener('change', handleFileSelect, false);
    }, []);

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

    const { currentPath: currPath, setCurrentPath: setCurrPath } = props.fs;
    const folderChain = [
      {
        id: '/',
        fullPath: '',
        name: props.rootFolderName,
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
      } else if (data.id === ChonkyActions.CreateFolder.id) {
        setNewFolderDialogOpen(true);
      } else if (data.id === ChonkyActions.DeleteFiles.id) {
        setFilesToDelete(data.state.selectedFiles.map((f) => f.fullPath));
        setDeleteDialogOpen(true);
      } else if (data.id === ChonkyActions.MoveFiles.id) {
        const fullPath: string = data.payload.destination.fullPath;
        void props.fs.moveFiles(data.payload.files, fullPath + '/');
      } else if (data.id === ChonkyActions.AddNote.id) {
        const payload = data.payload as FilePayload | undefined;
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
        const fileInput = document.getElementById(
          `${props.instanceId}-file-input`
        );

        if (!fileInput) return;

        fileInput.click();
      } else if (data.id === ChonkyActions.DownloadFiles.id) {
        const files = data.state.selectedFiles.filter((f) => !f.isDir);
        for (const file of files) {
          void props.fs.fileService
            .getDownloadLinkForPublicationFile(file.id)
            .then((response) => {
              const downloadLink = document.createElement('a');
              downloadLink.href = response.data;
              downloadLink.download = file.name;
              downloadLink.style.display = 'none';
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            });
        }
      } else if (data.id === ChonkyActions.DownloadFilesArchive.id) {
        props.onArchiveDownload?.(data.state.selectedFiles);
      } else if (data.id === ChonkyActions.StartDragNDrop.id) {
        props.isChonkyDragRef.current = true;
      } else if (data.id === ChonkyActions.EndDragNDrop.id) {
        props.isChonkyDragRef.current = false;
      } else if (data.id === ChonkyActions.EditFilesModal.id) {
        props.onEditFilesModalOpen?.();
      } else if (data.id === ChonkyActions.PreviewFilesModal.id) {
        props.onPreviewFilesModalOpen?.();
      }
    };

    const myFileActions: FileAction[] = [
      ChonkyActions.EnableListView,
      ChonkyActions.EnableGridView,
      ChonkyActions.ToggleShowFoldersFirst,
      ChonkyActions.SortFilesByName
    ];

    if (!props.isReadonly) {
      myFileActions.push(
        ChonkyActions.CreateFolder,
        ChonkyActions.UploadFiles,
        ChonkyActions.DeleteFiles,
        ChonkyActions.DownloadFiles,
        ChonkyActions.AddNote
      );
    }

    if (props.isReadonly && props.onArchiveDownload) {
      myFileActions.push(ChonkyActions.DownloadFilesArchive);
    }

    if (props.isReadonly && props.onEditFilesModalOpen) {
      myFileActions.push(ChonkyActions.EditFilesModal);
    }

    if (props.isReadonly && props.onPreviewFilesModalOpen) {
      myFileActions.push(ChonkyActions.PreviewFilesModal);
    }

    const inCurrentDirectory = (file: FileEntry): boolean => {
      if (!file.fullPath) return false;
      return (
        file.fullPath.substring(0, file.fullPath.lastIndexOf('/') + 1) ===
        props.fs.currentPath
      );
    };

    const files = [...props.fs.files.values()]
      .filter((f) => inCurrentDirectory(f))
      .map((f) => ({
        id: f.fullPath,
        fullPath: f.fullPath,
        name: f.name,
        isDir: f.isDirectory,
        note: f.note
      }));

    return (
      <>
        <Wrap>
          <FileBrowser
            disableDragAndDrop={props.isReadonly}
            disableDragAndDropProvider={true}
            files={files}
            folderChain={folderChain}
            onFileAction={handleAction}
            fileActions={myFileActions}
            disableDefaultFileActions={true}>
            <FileNavbar />
            {props.toolbarComponent && props.toolbarComponent}
            <DividerWrap />
            {!props.fs.isLoading && (
              <>
                <FileList />
                <FileContextMenu />
              </>
            )}
            {props.fs.isLoading && <CircularProgress />}
          </FileBrowser>
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
                void props.fs
                  .hasDuplicatesInCurrentFolder([newFolderName], true)
                  .then((result) => {
                    if (
                      result === DuplicateCheckResult.ROOT_NAME_ALREADY_EXISTS
                    ) {
                      setCreateNewFolderError(true);
                    } else {
                      handleCloseNewFolderDialog();
                      props.fs.createFolder(newFolderName);
                    }
                  });
              }}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={props.fs.renameOrReplaceDialogOpen}
          onClose={props.fs.closeReplaceOrRenameDialog}
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
              <Button onClick={props.fs.closeReplaceOrRenameDialog}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  props.fs.renameOrReplaceDialogCallback(
                    dialogRadioButtonValue
                  );
                }}>
                Upload
              </Button>
            </DialogActions>
          </DialogContentWrap>
        </Dialog>
        <Dialog
          open={props.fs.addDirectoryImpossibleDialogOpen}
          onClose={props.fs.closeAddDirectoryImpossibleDialog}
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
                  props.fs.closeAddDirectoryImpossibleDialog();
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
          <DeleteTitleWrap id="alert-dialog-title">Delete?</DeleteTitleWrap>
          <DeleteContentWrap>
            <MaxWidthWrap>
              All selected items will be deleted from Files and you won’t be
              able to undo this action.
            </MaxWidthWrap>
          </DeleteContentWrap>
          <DeleteActionsWrap>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button
              onClick={() => {
                handleCloseDeleteDialog();
                props.fs.deleteFile(filesToDelete);
              }}
              variant="contained"
              color="error">
              Delete
            </Button>
          </DeleteActionsWrap>
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
                props.fs.updateFile(fileToNote.id, fileToNote.name, note);
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
  height: 100%;
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

const DividerWrap = styled(Divider)`
  margin-left: -8px;
  margin-right: -8px;
`;

const DeleteTitleWrap = styled(DialogTitle)`
  padding: 32px;
`;

const DeleteContentWrap = styled(DialogContent)`
  padding: 0 32px 32px;
`;

const DeleteActionsWrap = styled(DialogActions)`
  padding: 0 32px 32px;
`;
