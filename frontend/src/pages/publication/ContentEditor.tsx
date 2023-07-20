import styled from '@emotion/styled';
import { type ReactElement } from 'react';
import { TextField } from '@mui/material';
import { type PublicationEditorStore } from './PublicationEditorStore';
import { observer } from 'mobx-react-lite';

interface EditorProps {
  editorStore: PublicationEditorStore;
}

interface ContentEditorProps {
  text: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const PredictedGoalsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ContentEditor
        value={props.editorStore.predictedGoals}
        onChange={(value) => {
          props.editorStore.predictedGoals = value;
          void props.editorStore.updatePredictedGoals(value);
        }}
        text={'Predicted goals'}
        placeholder={'Mention your expected outcomes or hypotheses...'}
      />
    );
  }
);

export const MethodEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ContentEditor
      value={props.editorStore.predictedGoals}
      onChange={(value) => {
        props.editorStore.predictedGoals = value;
      }}
      text={'Method'}
      placeholder={
        'Detail the steps of your method, helping others to reproduce it...'
      }
    />
  );
});

export const ObjectOfStudyEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ContentEditor
        value={props.editorStore.predictedGoals}
        onChange={(value) => {
          props.editorStore.predictedGoals = value;
        }}
        text={'Object of study'}
        placeholder={
          'Describe the specific conditions or features of your object of study...'
        }
      />
    );
  }
);

export const SoftwareEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ContentEditor
      value={props.editorStore.predictedGoals}
      onChange={(value) => {
        props.editorStore.predictedGoals = value;
      }}
      text={'Software'}
      placeholder={
        'Provide the software you used, with configuration options...'
      }
    />
  );
});

export const FilesEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ContentEditor
      value={props.editorStore.predictedGoals}
      onChange={(value) => {
        props.editorStore.predictedGoals = value;
      }}
      text={'Files'}
      placeholder={''}
    />
  );
});

export const AuthorsEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ContentEditor
      value={props.editorStore.predictedGoals}
      onChange={(value) => {
        props.editorStore.predictedGoals = value;
      }}
      text={'Authors'}
      placeholder={''}
    />
  );
});

export const GrantingOrganisationsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ContentEditor
        value={props.editorStore.predictedGoals}
        onChange={(value) => {
          props.editorStore.predictedGoals = value;
        }}
        text={'Granting organisations'}
        placeholder={
          'Enter the names of the organizations that funded your research...'
        }
      />
    );
  }
);

export const RelatedArticlesEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ContentEditor
        value={props.editorStore.predictedGoals}
        onChange={(value) => {
          props.editorStore.predictedGoals = value;
        }}
        text={'Related articles'}
        placeholder={
          'Provide citations or references of articles that are closely related to your research...'
        }
      />
    );
  }
);

export const TagsEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ContentEditor
      value={props.editorStore.predictedGoals}
      onChange={(value) => {
        props.editorStore.predictedGoals = value;
      }}
      text={'Tags'}
      placeholder={''}
    />
  );
});

export const ContentEditor = (props: ContentEditorProps): ReactElement => {
  return (
    <ContentEditorWrap>
      <LabelWrap>{props.text}</LabelWrap>
      <TextFieldWrap
        value={props.value}
        onChange={(e) => {
          props.onChange(e.currentTarget.value);
        }}
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
