import {
  ChonkyActions,
  type FileActionHandler,
  FileBrowser as ChonkyFileBrowser,
  setChonkyDefaults,
  FileNavbar,
  FileList,
  FileContextMenu
} from '@first-approval/chonky';
import React, { type ReactElement, useState } from 'react';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { type FileSystem } from './FileSystem';
import { observer } from 'mobx-react-lite';
import { FileToolbar } from './FileToolbar';

setChonkyDefaults({
  iconComponent: ChonkyIconFA,
  defaultFileViewActionId: ChonkyActions.EnableListView.id
});

export const FileBrowser = observer(
  (props: { fs: FileSystem }): ReactElement => {
    const [currPath, setCurrPath] = useState('/');

    const folderChain = [
      {
        id: '/',
        name: '/',
        isDir: true
      },
      ...calculatePathChain(currPath).map((f) => ({
        id: f,
        name: f.substring(f.lastIndexOf('/') + 1),
        isDir: true
      }))
    ];

    const handleAction: FileActionHandler = (data) => {
      if (data.id === ChonkyActions.OpenFiles.id) {
        const fullPath = data.payload.targetFile?.id ?? '';
        const newPath = fullPath.endsWith('/') ? fullPath : `${fullPath}/`;
        setCurrPath(newPath);
      } else if (data.id === ChonkyActions.DeleteFiles.id) {
        // Delete the files
      }
    };

    const myFileActions = [
      ChonkyActions.EnableListView,
      ChonkyActions.EnableGridView,
      ChonkyActions.ToggleShowFoldersFirst,
      ChonkyActions.SortFilesByName,
      ChonkyActions.UploadFiles,
      ChonkyActions.DeleteFiles
    ];

    const files = props.fs.listDirectory(currPath).map((f) => ({
      id: f.fullPath,
      name: f.name,
      isDir: f.isDirectory
    }));

    return (
      <div style={{ height: '500px', paddingBottom: '40px' }}>
        <ChonkyFileBrowser
          files={files}
          folderChain={folderChain}
          onFileAction={handleAction}
          fileActions={myFileActions}
          disableDefaultFileActions={true}>
          <FileNavbar />
          <FileToolbar />
          <FileList />
          <FileContextMenu />
        </ChonkyFileBrowser>
      </div>
    );
  }
);

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
