import React, { type FunctionComponent, useMemo } from 'react';
import { getAllFileEntries } from 'src/util/fileUtil';
import styled from '@emotion/styled';
import { FileBrowser } from '../fire-browser/FileBrowser';
import { FileSystem } from './../fire-browser/FileSystem';

interface FileUploaderProps {
  isDropZoneVisible: boolean;
  setIsDropZoneVisible: (value: boolean) => void;
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
    props.setIsDropZoneVisible(false);
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
      <>
        {props.isDropZoneVisible && (
          <DropZone
            style={{ height: 120 }}
            onDrop={onDrop}
            onDragOver={onDragOver}>
            Drag files here for upload
          </DropZone>
        )}
        <FileBrowser fs={fs} />
      </>
    </>
  );
};

const DropZone = styled('div')`
  border-radius: 4px;
  border: 2px dashed var(--divider, #d2d2d6);
  background: var(--primary-states-selected, rgba(59, 78, 255, 0.08));
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 424px;

  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
  letter-spacing: 0.15px;
`;
