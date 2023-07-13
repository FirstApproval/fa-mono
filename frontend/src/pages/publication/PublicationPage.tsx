import React, { type FunctionComponent, useState } from 'react';
import { Button } from '@mui/material';
import {
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  Logo,
  Parent
} from './../common.styled';
import { FileUploader } from '../../fire-browser/FileUploader';
import { routerStore } from '../../core/router';
import { authStore } from '../../core/auth';
import styled from '@emotion/styled';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export const PublicationPage: FunctionComponent = () => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);
  const [isDropZoneVisible, setIsDropZoneVisible] = useState(false);
  return (
    <>
      {/*
      // @ts-expect-error error types */}
      <DndProvider backend={HTML5Backend}>
        <Parent
          onDragEnter={() => {
            setIsDropZoneVisible(true);
          }}
          onDrop={() => {
            setIsDropZoneVisible(false);
          }}>
          <FlexHeader>
            <Logo>First Approval</Logo>
            <FlexHeaderRight>
              <Button
                variant="outlined"
                size={'large'}
                onClick={() => {
                  authStore.token = undefined;
                }}>
                Sign out
              </Button>
            </FlexHeaderRight>
          </FlexHeader>
          <FlexBodyCenter>
            <FileUploaderBody>
              <FileUploader
                setIsDropZoneVisible={setIsDropZoneVisible}
                isDropZoneVisible={isDropZoneVisible}
                publicationId={publicationId}
              />
            </FileUploaderBody>
          </FlexBodyCenter>
        </Parent>
      </DndProvider>
    </>
  );
};

export const FileUploaderBody = styled('div')`
  width: 728px;
  padding-left: 40px;
  padding-right: 40px;
`;
