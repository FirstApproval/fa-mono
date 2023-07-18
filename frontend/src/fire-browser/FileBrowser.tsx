import {
  ChonkyActions,
  type FileActionHandler,
  type FileArray,
  FileBrowser as ChonkyFileBrowser,
  FileContextMenu,
  type FileData,
  FileList,
  FileNavbar,
  setChonkyDefaults
} from '@first-approval/chonky';
import React, { type ReactElement, useEffect, useState } from 'react';
import { ChonkyIconFA } from '@first-approval/chonky-icon-fontawesome';
import { type FileSystem } from './FileSystem';
import { observer } from 'mobx-react-lite';
import { FileToolbar } from './FileToolbar';
import styled from '@emotion/styled';
import { CircularProgress, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { fileService } from '../core/service';
import {
  calculatePathChain,
  extractFilenameFromContentDisposition
} from './utils';

setChonkyDefaults({
  iconComponent: ChonkyIconFA,
  defaultFileViewActionId: ChonkyActions.EnableListView.id
});

interface FilePayload {
  file?: FileData;
}

export const FileBrowser = observer(
  (props: { fs: FileSystem }): ReactElement => {
    const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
    const [fileToNote, setFileToNote] = useState<FileData>();
    const [newFolderName, setNewFolderName] = useState('');
    const [note, setNote] = useState('');

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
        name: 'Files',
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
        setFilesToDelete(data.state.selectedFiles.map((f) => f.id));
        setDeleteDialogOpen(true);
      } else if (data.id === ChonkyActions.MoveFiles.id) {
        const fullPath: string = data.payload.destination.fullPath;
        props.fs.moveFiles(
          data.payload.files.map((f) => f.id),
          fullPath + '/'
        );
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
        const fileInput = document.getElementById('file-input');

        if (!fileInput) return;

        const handleFileSelect = async (event: any): Promise<void> => {
          const files = event.target.files;
          const filesArray = [];

          for (let i = 0; i < files.length; i++) {
            filesArray.push(files[i]);
          }

          props.fs.addFilesInput(filesArray);

          fileInput.removeEventListener('change', handleFileSelect);
          event.target.value = null;
        };

        fileInput.addEventListener('change', handleFileSelect, false);

        fileInput.click();
      } else if (data.id === ChonkyActions.DownloadFiles.id) {
        const files = data.state.selectedFiles.filter((f) => !f.isDir);
        for (const file of files) {
          void fileService
            .downloadPublicationFile(file.id, { responseType: 'blob' })
            .then((result) => {
              const filename = extractFilenameFromContentDisposition(
                String(result.headers['content-disposition'])
              );
              const dataType = String(result.headers['content-type']) || '';
              const binaryData = [];
              binaryData.push(result.data);
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData, { type: dataType })
              );
              if (filename) {
                downloadLink.setAttribute('download', filename);
              }
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            });
        }
      }
    };

    const myFileActions = [
      ChonkyActions.EnableListView,
      ChonkyActions.EnableGridView,
      ChonkyActions.ToggleShowFoldersFirst,
      ChonkyActions.CreateFolder,
      ChonkyActions.SortFilesByName,
      ChonkyActions.UploadFiles,
      ChonkyActions.DeleteFiles,
      ChonkyActions.DownloadFiles,
      ChonkyActions.AddNote
    ];

    const [files, setFiles] = useState<FileArray>([]);

    useEffect(() => {
      setFiles(
        props.fs.files.map((f) => ({
          id: f.id,
          fullPath: f.fullPath,
          name: f.name,
          isDir: f.isDirectory,
          isLoading: f.isUploading,
          note: f.note
        }))
      );
    }, [props.fs.files]);

    return (
      <>
        <Wrap>
          <ChonkyFileBrowser
            files={files}
            folderChain={folderChain}
            onFileAction={handleAction}
            fileActions={myFileActions}
            disableDefaultFileActions={true}>
            <FileNavbar />
            <FileToolbar />
            {!props.fs.isLoading && (
              <>
                <FileList />
                <FileContextMenu />
              </>
            )}
            {props.fs.isLoading && <CircularProgress />}
          </ChonkyFileBrowser>
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
                onChange={(e) => {
                  setNewFolderName(e.currentTarget.value);
                }}
                label="Folder name"
                variant="outlined"
              />
            </ContentWrap>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewFolderDialog}>Cancel</Button>
            <Button
              onClick={() => {
                handleCloseNewFolderDialog();
                props.fs.createFolder(newFolderName);
              }}>
              Create
            </Button>
          </DialogActions>
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
                props.fs.deleteFile(filesToDelete);
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
