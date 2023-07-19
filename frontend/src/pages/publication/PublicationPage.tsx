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
import {
  AuthorsPlaceholder,
  FilesPlaceholder,
  GrantingOrganisationsPlaceholder,
  MethodPlaceholder,
  ObjectOfStudyPlaceholder,
  PredictedGoalsPlaceholder,
  RelatedArticlesPlaceholder,
  SoftwarePlaceholder,
  TagsPlaceholder
} from './ContentPlaceholder';
import { PublicationEditorStore } from './PublicationEditorStore';
import { observer } from 'mobx-react-lite';
import {
  AuthorsEditor,
  FilesEditor,
  GrantingOrganisationsEditor,
  MethodEditor,
  ObjectOfStudyEditor,
  PredictedGoalsEditor,
  RelatedArticlesEditor,
  SoftwareEditor,
  TagsEditor
} from './ContentEditor';

export const PublicationPage: FunctionComponent = observer(() => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);

  const [editorStore] = useState(() => new PublicationEditorStore());

  const {
    predictedGoalsEnabled,
    methodEnabled,
    objectOfStudyEnabled,
    softwareEnabled,
    filesEnabled,
    authorsEnabled,
    grantingOrganizationsEnabled,
    relatedArticlesEnabled,
    tagsEnabled
  } = editorStore;

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
          <PublicationBody>
            {!predictedGoalsEnabled && (
              <PredictedGoalsPlaceholder
                onClick={() => {
                  editorStore.predictedGoalsEnabled = true;
                }}
              />
            )}
            {predictedGoalsEnabled && <PredictedGoalsEditor />}

            {!methodEnabled && (
              <MethodPlaceholder
                onClick={() => {
                  editorStore.methodEnabled = true;
                }}
              />
            )}
            {methodEnabled && <MethodEditor />}

            {!objectOfStudyEnabled && (
              <ObjectOfStudyPlaceholder
                onClick={() => {
                  editorStore.objectOfStudyEnabled = true;
                }}
              />
            )}
            {objectOfStudyEnabled && <ObjectOfStudyEditor />}

            {!softwareEnabled && (
              <SoftwarePlaceholder
                onClick={() => {
                  editorStore.softwareEnabled = true;
                }}
              />
            )}
            {softwareEnabled && <SoftwareEditor />}

            {!filesEnabled && (
              <FilesPlaceholder
                onClick={() => {
                  editorStore.filesEnabled = true;
                }}
              />
            )}
            {filesEnabled && <FilesEditor />}

            {!authorsEnabled && (
              <AuthorsPlaceholder
                onClick={() => {
                  editorStore.authorsEnabled = true;
                }}
              />
            )}
            {authorsEnabled && <AuthorsEditor />}

            {!grantingOrganizationsEnabled && (
              <GrantingOrganisationsPlaceholder
                onClick={() => {
                  editorStore.grantingOrganizationsEnabled = true;
                }}
              />
            )}
            {grantingOrganizationsEnabled && <GrantingOrganisationsEditor />}

            {!relatedArticlesEnabled && (
              <RelatedArticlesPlaceholder
                onClick={() => {
                  editorStore.relatedArticlesEnabled = true;
                }}
              />
            )}
            {relatedArticlesEnabled && <RelatedArticlesEditor />}

            {!tagsEnabled && (
              <TagsPlaceholder
                onClick={() => {
                  editorStore.tagsEnabled = true;
                }}
              />
            )}
            {tagsEnabled && <TagsEditor />}

            <FileUploader publicationId={publicationId} />
          </PublicationBody>
        </FlexBodyCenter>
      </Parent>
    </>
  );
});

export const PublicationBody = styled('div')`
  width: 728px;
  padding-left: 40px;
  padding-right: 40px;
`;
