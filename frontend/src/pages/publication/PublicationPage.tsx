import React, { type FunctionComponent, type ReactElement, useEffect, useState } from 'react';
import { Button, LinearProgress } from '@mui/material';
import { FlexBodyCenter, FlexHeader, Logo, Parent } from '../common.styled';
import { FileUploader } from '../../fire-browser/FileUploader';
import { routerStore } from '../../core/router';
import styled from '@emotion/styled';
import {
  AuthorsPlaceholder,
  ExperimentGoalsPlaceholder,
  FilesPlaceholder,
  GrantingOrganisationsPlaceholder,
  MethodPlaceholder,
  ObjectOfStudyPlaceholder,
  RelatedArticlesPlaceholder,
  SoftwarePlaceholder,
  TagsPlaceholder
} from './ContentPlaceholder';
import { PublicationStore, SavingStatusState, type Section, ViewMode } from './store/PublicationStore';
import { observer } from 'mobx-react-lite';
import {
  DescriptionEditor,
  ExperimentGoalsEditor,
  GrantingOrganizationsEditor,
  MethodEditor,
  ObjectOfStudyEditor,
  RelatedArticlesEditor,
  SoftwareEditor
} from './editors/ParagraphEditor';
import { ChonkyFileSystem } from '../../fire-browser/ChonkyFileSystem';
import { TagsEditor } from './editors/TagsEditor';
import { AuthorsEditor } from './editors/AuthorsEditor';
import { TitleEditor } from './editors/TitleEditor';
import { ResearchAreaEditor } from './editors/ResearchAreaEditor';
import { ResearchAreaPage } from './ResearchAreaPage';
import logo from '../../assets/logo-black.svg';
import { UserMenu } from '../../components/UserMenu';
import { Page } from '../../core/RouterStore';
import { ValidationDialog } from './ValidationDialog';
import { incrementPublicationViewCounter } from './SeenPublicationService';
import { DraftText } from './editors/DraftText';
import { Authors } from './editors/Authors';

export const PublicationPage: FunctionComponent = observer(() => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);

  const [fs] = useState(() => new ChonkyFileSystem(publicationId));
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Section[]>([]);

  const [publicationStore] = useState(
    () => new PublicationStore(publicationId, fs)
  );

  const {
    isLoading,
    researchArea,
    validate
  } = publicationStore;

  const validateSections = (): boolean => {
    const result = validate();
    const isValid = result.length === 0;
    setValidationDialogOpen(!isValid);
    setValidationErrors(result);
    return isValid;
  };

  useEffect(() => {
    if (publicationStore.viewMode === ViewMode.VIEW) {
      incrementPublicationViewCounter(publicationStore.publicationId);
    }
  }, [publicationStore.publicationId]);

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
            <div style={{ display: 'flex' }}>
              <Logo onClick={routerStore.goHome}>
                <img src={logo} />
              </Logo>
              {!publicationStore.isView && (
                <>
                  <DraftedBy>
                    Draft by
                    {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                    {` ${publicationStore.creator?.firstName} ${publicationStore.creator?.lastName}`}
                  </DraftedBy>
                  {publicationStore.savingStatus ===
                    SavingStatusState.SAVING && (
                      <SavingStatus>Saving...</SavingStatus>
                    )}
                  {publicationStore.savingStatus ===
                    SavingStatusState.SAVED && (
                      <SavingStatus>Saved</SavingStatus>
                    )}
                </>
              )}
            </div>
            <FlexDiv>
              {!publicationStore.isView && (
                <>
                  <ButtonWrap
                    variant='contained'
                    size={'medium'}
                    onClick={() => {
                      const isValid = validateSections();
                      if (isValid) {
                        routerStore.navigatePage(
                          Page.SHARING_OPTIONS,
                          routerStore.path,
                          true,
                          { publicationTitle: publicationStore.title }
                        );
                      }
                    }}>
                    Publish
                  </ButtonWrap>
                  <ButtonWrap
                    marginRight='0px'
                    variant='outlined'
                    size={'medium'}
                    onClick={() => {
                      publicationStore.viewMode = nextViewMode;
                    }}>
                    {nextViewMode}
                  </ButtonWrap>
                </>
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
      <ValidationDialog
        publicationStore={publicationStore}
        isOpen={validationDialogOpen}
        onClose={() => {
          setValidationDialogOpen(false);
        }}
        errors={validationErrors}
      />
    </>
  );
});

const PublicationBody = observer(
  (props: {
    publicationId: string;
    publicationStore: PublicationStore;
    fs: ChonkyFileSystem;
  }): ReactElement => {
    const {
      fs,
      publicationStore
    } = props;

    const {
      openExperimentGoals,
      openMethod,
      openObjectOfStudy,
      openSoftware,
      openFiles,
      openAuthors,
      openGrantingOrganizations,
      openRelatedArticles,
      openTags,
      experimentGoalsEnabled,
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
        {publicationStore.isPreview && (
          <DraftText />
        )}
        <div style={{ height: '16px' }}></div>
        <TitleEditor publicationStore={publicationStore} />
        {publicationStore.isReadonly && (
          <Authors publicationStore={publicationStore} />
        )}
        <ResearchAreaEditor publicationStore={publicationStore} />
        <DescriptionEditor publicationStore={publicationStore} />
        {!experimentGoalsEnabled && (
          <ExperimentGoalsPlaceholder onClick={openExperimentGoals} />
        )}
        {experimentGoalsEnabled && (
          <ExperimentGoalsEditor publicationStore={publicationStore} />
        )}
        {!methodEnabled && <MethodPlaceholder onClick={openMethod} />}
        {methodEnabled && <MethodEditor publicationStore={publicationStore} />}
        {!objectOfStudyEnabled && (
          <ObjectOfStudyPlaceholder onClick={openObjectOfStudy} />
        )}
        {objectOfStudyEnabled && (
          <ObjectOfStudyEditor publicationStore={publicationStore} />
        )}
        {!softwareEnabled && <SoftwarePlaceholder onClick={openSoftware} />}
        {softwareEnabled && (
          <SoftwareEditor publicationStore={publicationStore} />
        )}
        {!filesEnabled && <FilesPlaceholder onClick={openFiles} />}
        {filesEnabled && <FileUploader fs={fs} />}
        {!authorsEnabled && <AuthorsPlaceholder onClick={openAuthors} />}
        {authorsEnabled && (
          <AuthorsEditor publicationStore={publicationStore} />
        )}
        {!grantingOrganizationsEnabled && (
          <GrantingOrganisationsPlaceholder
            onClick={openGrantingOrganizations}
          />
        )}
        {grantingOrganizationsEnabled && (
          <GrantingOrganizationsEditor publicationStore={publicationStore} />
        )}
        {!relatedArticlesEnabled && (
          <RelatedArticlesPlaceholder onClick={openRelatedArticles} />
        )}
        {relatedArticlesEnabled && (
          <RelatedArticlesEditor publicationStore={publicationStore} />
        )}
        {!tagsEnabled && <TagsPlaceholder onClick={openTags} />}
        {tagsEnabled && <TagsEditor publicationStore={publicationStore} />}
        {publicationStore.isPreview && (
          <DraftText />
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

const ButtonWrap = styled(Button)<{ marginRight?: string }>`
  margin-right: ${(props) => props.marginRight ?? '24px'};
  width: 90px;
  height: 36px;
`;

const ToolbarContainer = styled.div`
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: 100%;
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
