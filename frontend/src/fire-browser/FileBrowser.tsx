import {
  ChonkyActions,
  type FileActionHandler,
  FileBrowser as ChonkyFileBrowser,
  setChonkyDefaults,
  FileNavbar,
  FileList,
  FileContextMenu,
  type FileArray
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

setChonkyDefaults({
  iconComponent: ChonkyIconFA,
  defaultFileViewActionId: ChonkyActions.EnableListView.id
});

export const FileBrowser = observer(
  (props: { fs: FileSystem }): ReactElement => {
    const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
    const [newFolderName, setNewFolderName] = useState('');

    const handleCloseNewFolderDialog = (): void => {
      setNewFolderDialogOpen(false);
      setNewFolderName('');
    };

    const handleCloseDeleteDialog = (): void => {
      setDeleteDialogOpen(false);
      setFilesToDelete([]);
    };

    const { currentPath: currPath, setCurrentPath: setCurrPath } = props.fs;
    const folderChain = [
      {
        id: '/',
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
        const fullPath: string = data.payload.targetFile?.fullPath ?? '';
        const newPath = `${fullPath}/`;
        setCurrPath(newPath);
      } else if (data.id === ChonkyActions.CreateFolder.id) {
        setNewFolderDialogOpen(true);
      } else if (data.id === ChonkyActions.DeleteFiles.id) {
        setDeleteDialogOpen(true);
        setFilesToDelete(data.state.selectedFiles.map((f) => f.id));
      }
    };

    const myFileActions = [
      ChonkyActions.EnableListView,
      ChonkyActions.EnableGridView,
      ChonkyActions.ToggleShowFoldersFirst,
      ChonkyActions.CreateFolder,
      ChonkyActions.SortFilesByName,
      ChonkyActions.UploadFiles,
      ChonkyActions.DeleteFiles
    ];

    const [files, setFiles] = useState<FileArray>([]);

    useEffect(() => {
      setFiles(
        props.fs.files.map((f) => ({
          id: f.id ?? f.fullPath,
          fullPath: f.fullPath,
          name: f.name,
          isDir: f.isDirectory,
          isLoading: f.isUploading
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

const MaxWidthWrap = styled.div`
  max-width: 336px;
`;

const ContentWrap = styled.div`
  padding-top: 8px;
`;

function calculatePathChain(currentPath: string): string[] {
  const pathSegments = currentPath.split('/').filter(Boolean);
  let pathChain = '';
  const pathChainList = [];

  for (const segment of pathSegments) {
    pathChain += `/${segment}`;
    pathChainList.push(pathChain);
  }

  return [...pathChainList];
}
