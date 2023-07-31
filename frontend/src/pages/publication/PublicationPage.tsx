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
import { PublicationEditorStore } from './store/PublicationEditorStore';
import { observer } from 'mobx-react-lite';
import {
  DescriptionEditor,
  GrantingOrganizationsEditor,
  MethodEditor,
  ObjectOfStudyEditor,
  PredictedGoalsEditor,
  RelatedArticlesEditor,
  SoftwareEditor
} from './editors/ParagraphEditor';
import { ChonkyFileSystem } from '../../fire-browser/ChonkyFileSystem';
import { TagsEditor } from './editors/TagsEditor';
import { AuthorsEditor } from './editors/AuthorsEditor';
import { TitleEditor } from './editors/TitleEditor';
import { ResearchAreaEditor } from './editors/ResearchAreaEditor';
import { ResearchAreaPage } from './ResearchAreaPage';
import { action } from 'mobx';

export const PublicationPage: FunctionComponent = observer(() => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);

  const [fs] = useState(() => new ChonkyFileSystem(publicationId));

  const [editorStore] = useState(
    () => new PublicationEditorStore(publicationId, fs)
  );

  const { isLoading, researchArea } = editorStore;

  const emptyResearchArea = researchArea.length === 0;

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
              <>
                {!emptyResearchArea && (
                  <PublicationBody
                    publicationId={publicationId}
                    editorStore={editorStore}
                    fs={fs}
                  />
                )}
                {emptyResearchArea && (
                  <ResearchAreaPage editorStore={editorStore} />
                )}
              </>
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
        <TitleEditor editorStore={editorStore} />
        <ResearchAreaEditor editorStore={editorStore} />
        <DescriptionEditor editorStore={editorStore} />
        {!predictedGoalsEnabled && (
          <PredictedGoalsPlaceholder
            onClick={action(() => {
              editorStore.predictedGoalsEnabled = true;
              editorStore.addPredictedGoalsParagraph(0);
            })}
          />
        )}
        {predictedGoalsEnabled && (
          <PredictedGoalsEditor editorStore={editorStore} />
        )}
        {!methodEnabled && (
          <MethodPlaceholder
            onClick={action(() => {
              editorStore.methodEnabled = true;
              editorStore.addMethodParagraph(0);
            })}
          />
        )}
        {methodEnabled && <MethodEditor editorStore={editorStore} />}
        {!objectOfStudyEnabled && (
          <ObjectOfStudyPlaceholder
            onClick={action(() => {
              editorStore.objectOfStudyEnabled = true;
              editorStore.addObjectOfStudyParagraph(0);
            })}
          />
        )}
        {objectOfStudyEnabled && (
          <ObjectOfStudyEditor editorStore={editorStore} />
        )}
        {!softwareEnabled && (
          <SoftwarePlaceholder
            onClick={action(() => {
              editorStore.softwareEnabled = true;
              editorStore.addSoftwareParagraph(0);
            })}
          />
        )}
        {softwareEnabled && <SoftwareEditor editorStore={editorStore} />}
        {!filesEnabled && (
          <FilesPlaceholder
            onClick={action(() => {
              editorStore.filesEnabled = true;
            })}
          />
        )}
        {filesEnabled && <FileUploader fs={fs} />}
        {!authorsEnabled && (
          <AuthorsPlaceholder
            onClick={action(() => {
              editorStore.authorsEnabled = true;
            })}
          />
        )}
        {authorsEnabled && <AuthorsEditor editorStore={editorStore} />}
        {!grantingOrganizationsEnabled && (
          <GrantingOrganisationsPlaceholder
            onClick={action(() => {
              editorStore.grantingOrganizationsEnabled = true;
              editorStore.addGrantingOrganization(0);
            })}
          />
        )}
        {grantingOrganizationsEnabled && (
          <GrantingOrganizationsEditor editorStore={editorStore} />
        )}
        {!relatedArticlesEnabled && (
          <RelatedArticlesPlaceholder
            onClick={action(() => {
              editorStore.relatedArticlesEnabled = true;
              editorStore.addRelatedArticle(0);
            })}
          />
        )}
        {relatedArticlesEnabled && (
          <RelatedArticlesEditor editorStore={editorStore} />
        )}
        {!tagsEnabled && (
          <TagsPlaceholder
            onClick={action(() => {
              editorStore.tagsEnabled = true;
            })}
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
