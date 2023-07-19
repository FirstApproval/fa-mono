import styled from '@emotion/styled';
import { type ReactElement } from 'react';
import { TextField } from '@mui/material';

interface ContentEditorProps {
  text: string;
  placeholder: string;
}

export const PredictedGoalsEditor = (): ReactElement => {
  return (
    <ContentEditor
      text={'Predicted goals'}
      placeholder={'Mention your expected outcomes or hypotheses...'}
    />
  );
};

export const MethodEditor = (): ReactElement => {
  return (
    <ContentEditor
      text={'Method'}
      placeholder={
        'Detail the steps of your method, helping others to reproduce it...'
      }
    />
  );
};

export const ObjectOfStudyEditor = (): ReactElement => {
  return (
    <ContentEditor
      text={'Object of study'}
      placeholder={
        'Describe the specific conditions or features of your object of study...'
      }
    />
  );
};

export const SoftwareEditor = (): ReactElement => {
  return (
    <ContentEditor
      text={'Software'}
      placeholder={
        'Provide the software you used, with configuration options...'
      }
    />
  );
};

export const FilesEditor = (): ReactElement => {
  return <ContentEditor text={'Files'} placeholder={''} />;
};

export const AuthorsEditor = (): ReactElement => {
  return <ContentEditor text={'Authors'} placeholder={''} />;
};

export const GrantingOrganisationsEditor = (): ReactElement => {
  return (
    <ContentEditor
      text={'Granting organisations'}
      placeholder={
        'Enter the names of the organizations that funded your research...'
      }
    />
  );
};

export const RelatedArticlesEditor = (): ReactElement => {
  return (
    <ContentEditor
      text={'Related articles'}
      placeholder={
        'Provide citations or references of articles that are closely related to your research...'
      }
    />
  );
};

export const TagsEditor = (): ReactElement => {
  return <ContentEditor text={'Tags'} placeholder={''} />;
};

export const ContentEditor = (props: ContentEditorProps): ReactElement => {
  return (
    <ContentEditorWrap>
      <LabelWrap>{props.text}</LabelWrap>
      <TextFieldWrap
        multiline
        autoComplete={'off'}
        variant={'standard'}
        placeholder={props.placeholder}
        InputProps={{
          disableUnderline: true,
          autoComplete: 'off'
        }}
      />
    </ContentEditorWrap>
  );
};

const ContentEditorWrap = styled.div`
  padding-left: 16px;
  margin-bottom: 40px;
`;

const LabelWrap = styled.div`
  font-size: 24px;
  font-style: normal;
  font-weight: 600;

  margin-bottom: 32px;
`;

const TextFieldWrap = styled(TextField)`
  width: 100%;
`;
