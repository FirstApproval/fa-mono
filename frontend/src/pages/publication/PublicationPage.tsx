import React, {
  type FunctionComponent,
  type ReactElement,
  useState
} from 'react';
import { Button, LinearProgress, TextField } from '@mui/material';
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
  type EditorProps,
  GrantingOrganisationsEditor,
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
import { ArrowForward } from '@mui/icons-material';

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
                  <ResearchAreaEditor editorStore={editorStore} />
                )}
              </>
            )}
          </PublicationBodyWrap>
        </FlexBodyCenter>
      </Parent>
    </>
  );
});

const ResearchAreaEditor = (props: EditorProps): ReactElement => {
  const [researchArea, setResearchArea] = useState('');
  const [isValidResearchArea, setIsValidResearchArea] = useState(true);

  const validate = (): boolean => {
    const isVE = researchArea.length > 0;
    setIsValidResearchArea(isVE);
    return isVE;
  };

  const researchAreaNonEmpty = researchArea.length > 0;

  return (
    <>
      <ResearchAreaTitle>
        Before the start:
        <br />
        What&apos;s the research area of the new publication?
      </ResearchAreaTitle>
      <FullWidthTextField
        autoFocus
        value={researchArea}
        onChange={(e) => {
          setResearchArea(e.currentTarget.value);
        }}
        error={!isValidResearchArea}
        helperText={
          !isValidResearchArea ? 'Please enter research area' : undefined
        }
        label="Research area"
        variant="outlined"
        placeholder={
          'Enter the primary field or discipline of your research/experiment...'
        }
      />
      <Button
        disabled={!researchAreaNonEmpty}
        variant="contained"
        size={'large'}
        endIcon={<ArrowForward />}
        onClick={() => {
          const isValid = validate();
          if (isValid) {
            props.editorStore.updateResearchArea(researchArea);
          }
        }}>
        Continue
      </Button>
      <div>You can change it later</div>
    </>
  );
};

const ResearchAreaTitle = styled.div`
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 116.7%;
  margin-bottom: 40px;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 40px;
`;

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
        {!predictedGoalsEnabled && (
          <PredictedGoalsPlaceholder
            onClick={() => {
              editorStore.predictedGoalsEnabled = true;
              editorStore.addPredictedGoalsParagraph(0);
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
              editorStore.addMethodParagraph(0);
            }}
          />
        )}
        {methodEnabled && <MethodEditor editorStore={editorStore} />}
        {!objectOfStudyEnabled && (
          <ObjectOfStudyPlaceholder
            onClick={() => {
              editorStore.objectOfStudyEnabled = true;
              editorStore.addObjectOfStudyParagraph(0);
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
              editorStore.addSoftwareParagraph(0);
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
              editorStore.addGrantingOrganization(0);
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
              editorStore.addRelatedArticle(0);
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
