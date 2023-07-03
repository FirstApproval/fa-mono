import React, { type FunctionComponent, useState } from 'react';
import { getAllFileEntries } from 'src/util/fileUtil';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from '@emotion/styled';
import { FileBrowser } from '../fire-browser/FileBrowser';
import { FileSystem } from './../fire-browser/FileSystem';
import { fileService } from '../core/service';

interface FileUploaderProps {
  publicationId: string;
}

export const FileUploader: FunctionComponent<FileUploaderProps> = (
  props: FileUploaderProps
) => {
  const [fs] = useState(() => new FileSystem());

  const onDrop = async (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
    dataTransfer: { items: DataTransferItemList };
  }): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    const result = await getAllFileEntries(e.dataTransfer.items);
    result.forEach((e) => {
      if (e.isFile) {
        (e as FileSystemFileEntry).file((file) => {
          void fileService.uploadFile(
            props.publicationId,
            e.fullPath,
            false,
            file
          );
        });
      } else {
        void fileService.uploadFile(props.publicationId, e.fullPath, true);
      }
    });
    fs.addFiles(result);
  };

  const onDragOver = (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <DropZone
          style={{ height: 120 }}
          onDrop={onDrop}
          onDragOver={onDragOver}>
          Drag files here for upload
        </DropZone>
      </DndProvider>
      <FileBrowser fs={fs} />
    </>
  );
};

const DropZone = styled('div')`
  border: 1px #040036 dashed;
  border-radius: 4px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
