import React, { type FunctionComponent, useMemo } from 'react';
import { getAllFileEntries } from 'src/util/fileUtil';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from '@emotion/styled';
import { FileBrowser } from '../fire-browser/FileBrowser';
import { FileSystem } from './../fire-browser/FileSystem';

interface FileUploaderProps {
  publicationId: string;
}

export const FileUploader: FunctionComponent<FileUploaderProps> = (
  props: FileUploaderProps
) => {
  const fs = useMemo(
    () => new FileSystem(props.publicationId),
    [props.publicationId]
  );

  const onDrop = async (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
    dataTransfer: { items: DataTransferItemList };
  }): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    const result = await getAllFileEntries(e.dataTransfer.items);
    fs.addFilesDnd(result);
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
  border-radius: 4px;
  border: 2px dashed var(--divider, #d2d2d6);
  background: var(--grey-50, #f8f7fa);
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
