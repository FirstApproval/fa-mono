import React, {
  type FunctionComponent,
  type ReactElement,
  useState
} from 'react';
import { Button, IconButton, LinearProgress } from '@mui/material';
import { FlexBodyCenter, FlexHeader, Parent } from '../common.styled';
import { FileUploader } from '../../fire-browser/FileUploader';
import { routerStore } from '../../core/router';
import styled from '@emotion/styled';
import { action } from 'mobx';
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
import logo from './asset/logo.svg';
import { UserMenu } from '../../components/UserMenu';
import { Page } from '../../core/RouterStore';

export const PublicationPage: FunctionComponent = observer(() => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);

  const [fs] = useState(() => new ChonkyFileSystem(publicationId));

  const [publicationStore] = useState(
    () => new PublicationStore(publicationId, fs)
  );

  const { isLoading, researchArea } = publicationStore;

  const emptyResearchArea = researchArea.length === 0;

  const nextViewMode =
    publicationStore.viewMode === ViewMode.PREVIEW
      ? ViewMode.EDIT
      : ViewMode.PREVIEW;

  return (
    <>
      <Parent>
        <FlexHeader>
          <ToolbarContainer>
            <div>
              <IconButton
                onClick={() => {
                  routerStore.goHome();
                }}>
                <img src={logo} />
              </IconButton>
              <DraftedBy>
                Drafted by
                {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                {` ${publicationStore.creator?.firstName} ${publicationStore.creator?.lastName}`}
              </DraftedBy>
              <SavingStatus></SavingStatus>
            </div>
            <FlexDiv>
              <ButtonWrap
                variant="contained"
                size={'medium'}
                onClick={() => {
                  routerStore.navigatePage(
                    Page.SHARING_OPTIONS,
                    routerStore.path,
                    true,
                    { publicationTitle: publicationStore.title }
                  );
                }}>
                Publish
              </ButtonWrap>
              {publicationStore.viewMode && (
                <ButtonWrap
                  marginRight="0px"
                  variant="outlined"
                  size={'medium'}
                  onClick={() => {
                    publicationStore.viewMode = nextViewMode;
                  }}>
                  {nextViewMode}
                </ButtonWrap>
              )}
              <UserMenu />
            </FlexDiv>
          </ToolbarContainer>
        </FlexHeader>
        <FlexBodyCenter>
          <PublicationBodyWrap>
            {isLoading && <LinearProgress />}
            {!isLoading && (
              <>
                {!emptyResearchArea && (
                  <PublicationBody
                    publicationId={publicationId}
                    publicationStore={publicationStore}
                    fs={fs}
                  />
                )}
                {emptyResearchArea && (
                  <ResearchAreaPage publicationStore={publicationStore} />
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
    publicationStore: PublicationStore;
    fs: ChonkyFileSystem;
  }): ReactElement => {
    const { fs, publicationStore } = props;

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
    } = publicationStore;

    return (
      <>
        <TitleEditor publicationStore={publicationStore} />
        <ResearchAreaEditor publicationStore={publicationStore} />
        <DescriptionEditor publicationStore={publicationStore} />
        {!predictedGoalsEnabled && (
          <PredictedGoalsPlaceholder
            onClick={action(() => {
              publicationStore.predictedGoalsEnabled = true;
              publicationStore.addPredictedGoalsParagraph(0);
            })}
          />
        )}
        {predictedGoalsEnabled && (
          <PredictedGoalsEditor publicationStore={publicationStore} />
        )}
        {!methodEnabled && (
          <MethodPlaceholder
            onClick={action(() => {
              publicationStore.methodEnabled = true;
              publicationStore.addMethodParagraph(0);
            })}
          />
        )}
        {methodEnabled && <MethodEditor publicationStore={publicationStore} />}
        {!objectOfStudyEnabled && (
          <ObjectOfStudyPlaceholder
            onClick={action(() => {
              publicationStore.objectOfStudyEnabled = true;
              publicationStore.addObjectOfStudyParagraph(0);
            })}
          />
        )}
        {objectOfStudyEnabled && (
          <ObjectOfStudyEditor publicationStore={publicationStore} />
        )}
        {!softwareEnabled && (
          <SoftwarePlaceholder
            onClick={action(() => {
              publicationStore.softwareEnabled = true;
              publicationStore.addSoftwareParagraph(0);
            })}
          />
        )}
        {softwareEnabled && (
          <SoftwareEditor publicationStore={publicationStore} />
        )}
        {!filesEnabled && (
          <FilesPlaceholder
            onClick={action(() => {
              publicationStore.filesEnabled = true;
            })}
          />
        )}
        {filesEnabled && <FileUploader fs={fs} />}
        {!authorsEnabled && (
          <AuthorsPlaceholder
            onClick={action(() => {
              publicationStore.authorsEnabled = true;
            })}
          />
        )}
        {authorsEnabled && (
          <AuthorsEditor publicationStore={publicationStore} />
        )}
        {!grantingOrganizationsEnabled && (
          <GrantingOrganisationsPlaceholder
            onClick={action(() => {
              publicationStore.grantingOrganizationsEnabled = true;
              publicationStore.addGrantingOrganization(0);
            })}
          />
        )}
        {grantingOrganizationsEnabled && (
          <GrantingOrganizationsEditor publicationStore={publicationStore} />
        )}
        {!relatedArticlesEnabled && (
          <RelatedArticlesPlaceholder
            onClick={action(() => {
              publicationStore.relatedArticlesEnabled = true;
              publicationStore.addRelatedArticle(0);
            })}
          />
        )}
        {relatedArticlesEnabled && (
          <RelatedArticlesEditor publicationStore={publicationStore} />
        )}
        {!tagsEnabled && (
          <TagsPlaceholder
            onClick={action(() => {
              publicationStore.tagsEnabled = true;
            })}
          />
        )}
        {tagsEnabled && <TagsEditor publicationStore={publicationStore} />}
      </>
    );
  }
);

const PublicationBodyWrap = styled('div')`
  width: 728px;
  padding-left: 40px;
  padding-right: 40px;
`;

const ButtonWrap = styled(Button)<{ marginRight?: string }>`
  margin-right: ${(props) => props.marginRight ?? '24px'};
  width: 90px;
  height: 36px;
`;

const ToolbarContainer = styled.div`
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: 55%;
  padding: 0 16px;
  display: flex;
`;

const DraftedBy = styled.span`
  margin: 0 16px;
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body1 */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
`;

const SavingStatus = styled.span`
  color: var(--text-secondary, #68676e);
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body1 */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
`;

const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
