import React, { type FunctionComponent, useState } from 'react';
import { Button } from '@mui/material';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  Logo,
  Parent
} from './common.styled';
import { getAllFileEntries } from 'src/util/fileUtil';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from '@emotion/styled';
import { FileBrowser } from '../fire-browser/FileBrowser';
import { FileSystem } from './../fire-browser/FileSystem';
import { fileService } from '../core/service';

export const HomePage: FunctionComponent = () => {
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
          fileService.uploadFile(file);
        });
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
    <Parent>
      <FlexHeader>
        <Logo>First Approval</Logo>
        <FlexHeaderRight>
          <Button variant="outlined" size={'large'}>
            Sign out
          </Button>
        </FlexHeaderRight>
      </FlexHeader>
      <FlexBodyCenter>
        <FlexBody>
          <DndProvider backend={HTML5Backend}>
            <DropZone
              style={{ height: 120 }}
              onDrop={onDrop}
              onDragOver={onDragOver}>
              Drag files here for ulpload
            </DropZone>
          </DndProvider>
          <FileBrowser fs={fs} />
        </FlexBody>
      </FlexBodyCenter>
    </Parent>
  );
};

const DropZone = styled('div')`
  border: 1px #040036 dashed;
  border-radius: 4px;
  margin-bottom: 40px;
`;
