import React, {
  type FunctionComponent,
  type ReactElement,
  useState
} from 'react';
import { Button, LinearProgress } from '@mui/material';
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
  GrantingOrganisationsEditor,
  MethodEditor,
  ObjectOfStudyEditor,
  PredictedGoalsEditor,
  RelatedArticlesEditor,
  SoftwareEditor,
  TagsEditor
} from './ContentEditor';
import { ChonkyFileSystem } from '../../fire-browser/ChonkyFileSystem';

export const PublicationPage: FunctionComponent = observer(() => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);

  const [fs] = useState(() => new ChonkyFileSystem(publicationId));

  const [editorStore] = useState(
    () => new PublicationEditorStore(publicationId, fs)
  );

  const { isLoading } = editorStore;

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
          <PublicationBodyWrap>
            {isLoading && <LinearProgress />}
            {!isLoading && (
              <PublicationBody
                publicationId={publicationId}
                editorStore={editorStore}
                fs={fs}
              />
            )}
          </PublicationBodyWrap>
        </FlexBodyCenter>
      </Parent>
    </>
  );
});

const PublicationBody = observer(
  (props: {
    publicationId: string;
    editorStore: PublicationEditorStore;
    fs: ChonkyFileSystem;
  }): ReactElement => {
    const { fs, editorStore } = props;

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
        {' '}
        {!predictedGoalsEnabled && (
          <PredictedGoalsPlaceholder
            onClick={() => {
              editorStore.predictedGoalsEnabled = true;
            }}
          />
        )}
        {predictedGoalsEnabled && (
          <PredictedGoalsEditor editorStore={editorStore} />
        )}
        {!methodEnabled && (
          <MethodPlaceholder
            onClick={() => {
              editorStore.methodEnabled = true;
            }}
          />
        )}
        {methodEnabled && <MethodEditor editorStore={editorStore} />}
        {!objectOfStudyEnabled && (
          <ObjectOfStudyPlaceholder
            onClick={() => {
              editorStore.objectOfStudyEnabled = true;
            }}
          />
        )}
        {objectOfStudyEnabled && (
          <ObjectOfStudyEditor editorStore={editorStore} />
        )}
        {!softwareEnabled && (
          <SoftwarePlaceholder
            onClick={() => {
              editorStore.softwareEnabled = true;
            }}
          />
        )}
        {softwareEnabled && <SoftwareEditor editorStore={editorStore} />}
        {!filesEnabled && (
          <FilesPlaceholder
            onClick={() => {
              editorStore.filesEnabled = true;
            }}
          />
        )}
        {filesEnabled && <FileUploader fs={fs} />}
        {!authorsEnabled && (
          <AuthorsPlaceholder
            onClick={() => {
              editorStore.authorsEnabled = true;
            }}
          />
        )}
        {authorsEnabled && <AuthorsEditor editorStore={editorStore} />}
        {!grantingOrganizationsEnabled && (
          <GrantingOrganisationsPlaceholder
            onClick={() => {
              editorStore.grantingOrganizationsEnabled = true;
            }}
          />
        )}
        {grantingOrganizationsEnabled && (
          <GrantingOrganisationsEditor editorStore={editorStore} />
        )}
        {!relatedArticlesEnabled && (
          <RelatedArticlesPlaceholder
            onClick={() => {
              editorStore.relatedArticlesEnabled = true;
            }}
          />
        )}
        {relatedArticlesEnabled && (
          <RelatedArticlesEditor editorStore={editorStore} />
        )}
        {!tagsEnabled && (
          <TagsPlaceholder
            onClick={() => {
              editorStore.tagsEnabled = true;
            }}
          />
        )}
        {tagsEnabled && <TagsEditor editorStore={editorStore} />}
      </>
    );
  }
);

export const PublicationBodyWrap = styled('div')`
  width: 728px;
  padding-left: 40px;
  padding-right: 40px;
`;
