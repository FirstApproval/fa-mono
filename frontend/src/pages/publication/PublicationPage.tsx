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

export const PublicationPage: FunctionComponent = () => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);
  return (
    <>
      <Parent>
        <FlexHeader>
          <Logo onClick={routerStore.goHome}>First Approval</Logo>
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
            <FileUploader publicationId={publicationId} />
          </FileUploaderBody>
        </FlexBodyCenter>
      </Parent>
    </>
  );
};

export const FileUploaderBody = styled('div')`
  width: 728px;
  padding-left: 40px;
  padding-right: 40px;
`;
