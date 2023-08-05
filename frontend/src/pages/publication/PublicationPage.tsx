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
import { PublicationStore, ViewMode } from './store/PublicationStore';
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
import { UserMenu } from '../../components/UserMenu';
import { Page } from '../../core/RouterStore';
import { Edit } from '@mui/icons-material';

export const PublicationPage: FunctionComponent = observer(() => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);

  const [fs] = useState(() => new ChonkyFileSystem(publicationId));

  const [editorStore] = useState(() => new PublicationStore(publicationId, fs));

  const { isLoading, researchArea, viewMode } = editorStore;

  const isView = viewMode === ViewMode.PREVIEW || viewMode === ViewMode.VIEW;

  const emptyResearchArea = researchArea.length === 0;

  return (
    <>
      <Parent>
        <FlexHeader>
          <Logo onClick={routerStore.goHome}>First Approval</Logo>
          <FlexHeaderRight>
            <ButtonWrap
              variant="contained"
              size={'medium'}
              onClick={() => {
                routerStore.navigatePage(
                  Page.SHARING_OPTIONS,
                  routerStore.path,
                  true,
                  { publicationTitle: editorStore.title }
                );
              }}>
              Publish
            </ButtonWrap>
            {editorStore.viewMode === ViewMode.EDIT && (
              <ButtonWrap
                variant="outlined"
                size={'medium'}
                onClick={() => {
                  editorStore.viewMode = ViewMode.PREVIEW;
                }}>
                Preview
              </ButtonWrap>
            )}
            {editorStore.viewMode === ViewMode.PREVIEW && (
              <ButtonWrap
                variant="outlined"
                size={'medium'}
                startIcon={<Edit />}
                onClick={() => {
                  editorStore.viewMode = ViewMode.EDIT;
                }}>
                Edit
              </ButtonWrap>
            )}
            <UserMenu />
          </FlexHeaderRight>
        </FlexHeader>
        <FlexBodyCenter>
          <PublicationBodyWrap>
            {isLoading && <LinearProgress />}
            {!isLoading && (
              <>
                {!emptyResearchArea && (
                  <PublicationBody
                    isView={isView}
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
    isView: boolean;
    editorStore: PublicationStore;
    fs: ChonkyFileSystem;
  }): ReactElement => {
    const { isView, fs, editorStore } = props;

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
        <TitleEditor editorStore={editorStore} isReadonly={isView} />
        <ResearchAreaEditor editorStore={editorStore} isReadonly={isView} />
        <DescriptionEditor editorStore={editorStore} isReadonly={isView} />
        {!predictedGoalsEnabled && (
          <PredictedGoalsPlaceholder
            onClick={action(() => {
              editorStore.predictedGoalsEnabled = true;
              editorStore.addPredictedGoalsParagraph(0);
            })}
          />
        )}
        {predictedGoalsEnabled && (
          <PredictedGoalsEditor editorStore={editorStore} isReadonly={isView} />
        )}
        {!methodEnabled && (
          <MethodPlaceholder
            onClick={action(() => {
              editorStore.methodEnabled = true;
              editorStore.addMethodParagraph(0);
            })}
          />
        )}
        {methodEnabled && (
          <MethodEditor editorStore={editorStore} isReadonly={isView} />
        )}
        {!objectOfStudyEnabled && (
          <ObjectOfStudyPlaceholder
            onClick={action(() => {
              editorStore.objectOfStudyEnabled = true;
              editorStore.addObjectOfStudyParagraph(0);
            })}
          />
        )}
        {objectOfStudyEnabled && (
          <ObjectOfStudyEditor editorStore={editorStore} isReadonly={isView} />
        )}
        {!softwareEnabled && (
          <SoftwarePlaceholder
            onClick={action(() => {
              editorStore.softwareEnabled = true;
              editorStore.addSoftwareParagraph(0);
            })}
          />
        )}
        {softwareEnabled && (
          <SoftwareEditor editorStore={editorStore} isReadonly={isView} />
        )}
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
        {authorsEnabled && (
          <AuthorsEditor editorStore={editorStore} isReadonly={isView} />
        )}
        {!grantingOrganizationsEnabled && (
          <GrantingOrganisationsPlaceholder
            onClick={action(() => {
              editorStore.grantingOrganizationsEnabled = true;
              editorStore.addGrantingOrganization(0);
            })}
          />
        )}
        {grantingOrganizationsEnabled && (
          <GrantingOrganizationsEditor
            editorStore={editorStore}
            isReadonly={isView}
          />
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
          <RelatedArticlesEditor
            editorStore={editorStore}
            isReadonly={isView}
          />
        )}
        {!tagsEnabled && (
          <TagsPlaceholder
            onClick={action(() => {
              editorStore.tagsEnabled = true;
            })}
          />
        )}
        {tagsEnabled && (
          <TagsEditor editorStore={editorStore} isReadonly={isView} />
        )}
      </>
    );
  }
);

const PublicationBodyWrap = styled('div')`
  width: 728px;
  padding-left: 40px;
  padding-right: 40px;
`;

const ButtonWrap = styled(Button)`
  margin-right: 24px;
`;
