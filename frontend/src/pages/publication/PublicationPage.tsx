import React, { type FunctionComponent, useState } from 'react';
import { Button } from '@mui/material';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  Logo,
  Parent
} from './../common.styled';
import { FileUploader } from '../../fire-browser/FileUploader';
import { routerStore } from '../../core/router';
import { authStore } from '../../core/auth';

export const PublicationPage: FunctionComponent = () => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);
  return (
    <Parent>
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
        <FlexBody>
          <FileUploader publicationId={publicationId} />
        </FlexBody>
      </FlexBodyCenter>
    </Parent>
  );
};
