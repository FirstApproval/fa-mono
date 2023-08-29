import React, {
  type FunctionComponent,
  type ReactElement,
  useEffect,
  useState
} from 'react';
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
  SampleFilesPlaceholder,
  SoftwarePlaceholder,
  TagsPlaceholder
} from './ContentPlaceholder';
import {
  PublicationStore,
  SavingStatusState,
  type Section,
  ViewMode
} from './store/PublicationStore';
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
import download from './asset/download.svg';
import downloadSample from './asset/download_sample.svg';
import pdf from './asset/pdf.svg';
import citate from './asset/citate.svg';
import share from './asset/share.svg';
import { UserMenu } from '../../components/UserMenu';
import { Page } from '../../core/RouterStore';
import { ValidationDialog } from './ValidationDialog';
import { publicationService } from '../../core/service';
import { DraftText } from './DraftText';
import { Authors } from './Authors';
import { DateViewsDownloads } from './DateViewsDownloads';
import { ChonkySampleFileSystem } from '../../fire-browser/sample-files/ChonkySampleFileSystem';
import { SampleFileUploader } from '../../fire-browser/sample-files/SampleFileUploader';
import { authStore } from '../../core/auth';

export const PublicationPage: FunctionComponent = observer(() => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);

  const [fs] = useState(() => new ChonkyFileSystem(publicationId));
  const [sfs] = useState(() => new ChonkySampleFileSystem(publicationId));
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Section[]>([]);

  const [publicationStore] = useState(
    () => new PublicationStore(publicationId, fs, sfs)
  );

  const { isLoading, researchArea, validate } = publicationStore;

  const validateSections = (): boolean => {
    const result = validate();
    const isValid = result.length === 0;
    setValidationDialogOpen(!isValid);
    setValidationErrors(result);
    return isValid;
  };

  useEffect(() => {
    if (publicationStore.viewMode === ViewMode.VIEW) {
      void publicationService.incrementPublicationViewCount(publicationId);
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
                    variant="contained"
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
                    marginRight="0px"
                    variant="outlined"
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
                    sfs={sfs}
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
    sfs: ChonkySampleFileSystem;
  }): ReactElement => {
    const { fs, sfs, publicationStore } = props;

    const {
      openExperimentGoals,
      openMethod,
      openObjectOfStudy,
      openSoftware,
      openFiles,
      openSampleFiles,
      openAuthors,
      openGrantingOrganizations,
      openRelatedArticles,
      openTags,
      experimentGoalsEnabled,
      methodEnabled,
      objectOfStudyEnabled,
      softwareEnabled,
      filesEnabled,
      sampleFilesEnabled,
      authorsEnabled,
      grantingOrganizationsEnabled,
      relatedArticlesEnabled,
      tagsEnabled
    } = publicationStore;

    return (
      <>
        {publicationStore.isPreview && <DraftText />}
        {publicationStore.isView && (
          <DateViewsDownloads publicationStore={publicationStore} />
        )}
        <div style={{ height: '16px' }}></div>
        <TitleEditor publicationStore={publicationStore} />
        {publicationStore.isReadonly && (
          <Authors publicationStore={publicationStore} />
        )}
        <ResearchAreaEditor publicationStore={publicationStore} />

        {publicationStore.isView && (
          <div style={{ marginTop: '32px', marginBottom: '12px' }}>
            <div
              style={{
                height: '1px',
                width: '100%',
                backgroundColor: '#D2D2D6',
                marginBottom: '16px'
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                <DownloadFilesButtonWrap
                  variant="outlined"
                  onClick={() => {
                    if (authStore.token) {
                      publicationStore.downloadFiles();
                    } else {
                      routerStore.navigatePage(Page.SIGN_UP);
                    }
                  }}
                  size={'medium'}>
                  <img src={download} style={{ marginRight: '8px' }} /> Download
                </DownloadFilesButtonWrap>
                <DownloadSampleFilesButtonWrap
                  variant="outlined"
                  onClick={() => publicationStore.downloadSampleFiles()}
                  size={'medium'}>
                  <img src={downloadSample} style={{ marginRight: '8px' }} />{' '}
                  Download sample
                </DownloadSampleFilesButtonWrap>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                <PdfButtonWrap variant="outlined" size={'medium'}>
                  <img src={pdf} style={{ marginRight: '8px' }} /> PDF
                </PdfButtonWrap>
                <ActionButtonWrap variant="outlined" size={'medium'}>
                  <img src={citate} />
                </ActionButtonWrap>
                <ActionButtonWrap
                  variant="outlined"
                  onClick={publicationStore.copyPublicationLinkToClipboard}
                  size={'medium'}>
                  <img src={share} />
                </ActionButtonWrap>
              </div>
            </div>

            <div
              style={{
                height: '1px',
                width: '100%',
                backgroundColor: '#D2D2D6',
                marginTop: '16px'
              }}
            />
          </div>
        )}

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
        {!sampleFilesEnabled && (
          <SampleFilesPlaceholder onClick={openSampleFiles} />
        )}
        {sampleFilesEnabled && <SampleFileUploader sfs={sfs} />}
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
        {publicationStore.isPreview && <DraftText />}
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

const DownloadFilesButtonWrap = styled(Button)`
  margin-right: 16px;
  height: 36px;
  border-color: #3b4eff;
  color: #3b4eff;
`;

const DownloadSampleFilesButtonWrap = styled(Button)`
  height: 36px;
`;

const PdfButtonWrap = styled(Button)`
  height: 36px;
  margin-right: 12px;
`;

const ActionButtonWrap = styled(Button)`
  height: 36px;
  border: none;
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
