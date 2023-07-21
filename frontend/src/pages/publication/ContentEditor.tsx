import styled from '@emotion/styled';
import { type ReactElement } from 'react';
import { IconButton, TextField } from '@mui/material';
import { type PublicationEditorStore } from './PublicationEditorStore';
import { observer } from 'mobx-react-lite';
import { AddCircleOutlined } from '@mui/icons-material';

interface EditorProps {
  editorStore: PublicationEditorStore;
}

interface ContentEditorProps {
  text: string;
  placeholder: string;
  value: string[];
  onChange: (idx: number, value: string) => void;
  onAddClick: () => void;
}

export const PredictedGoalsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        value={props.editorStore.predictedGoals.map((e) => e.text)}
        onChange={(idx, value) => {
          props.editorStore.updatePredictedGoalsParagraph(idx, value);
        }}
        onAddClick={() => {
          props.editorStore.addPredictedGoalsParagraph();
        }}
        text={'Predicted goals'}
        placeholder={'Mention your expected outcomes or hypotheses...'}
      />
    );
  }
);

export const MethodEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ParagraphContentEditor
      value={props.editorStore.method.map((e) => e.text)}
      onChange={(idx, value) => {
        props.editorStore.updateMethodParagraph(idx, value);
      }}
      onAddClick={() => {
        props.editorStore.addMethodParagraph();
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
      <ParagraphContentEditor
        value={props.editorStore.predictedGoals.map((e) => e.text)}
        onChange={(idx, value) => {
          props.editorStore.updatePredictedGoalsParagraph(idx, value);
        }}
        onAddClick={() => {
          props.editorStore.addPredictedGoalsParagraph();
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
    <ParagraphContentEditor
      value={props.editorStore.software.map((e) => e.text)}
      onChange={(idx, value) => {
        props.editorStore.updateSoftwareParagraph(idx, value);
      }}
      onAddClick={() => {
        props.editorStore.addSoftwareParagraph();
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
    <ParagraphContentEditor
      value={props.editorStore.predictedGoals.map((e) => e.text)}
      onChange={(idx, value) => {
        props.editorStore.updatePredictedGoalsParagraph(idx, value);
      }}
      onAddClick={() => {
        props.editorStore.addPredictedGoalsParagraph();
      }}
      text={'Files'}
      placeholder={''}
    />
  );
});

export const AuthorsEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ParagraphContentEditor
      value={props.editorStore.predictedGoals.map((e) => e.text)}
      onChange={(idx, value) => {
        props.editorStore.updatePredictedGoalsParagraph(idx, value);
      }}
      onAddClick={() => {
        props.editorStore.addPredictedGoalsParagraph();
      }}
      text={'Authors'}
      placeholder={''}
    />
  );
});

export const GrantingOrganisationsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        value={props.editorStore.grantingOrganizations.map((e) => e.text)}
        onChange={(idx, value) => {
          props.editorStore.updateGrantingOrganization(idx, value);
        }}
        onAddClick={() => {
          props.editorStore.addGrantingOrganization();
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
      <ParagraphContentEditor
        value={props.editorStore.predictedGoals.map((e) => e.text)}
        onChange={(idx, value) => {
          props.editorStore.updatePredictedGoalsParagraph(idx, value);
        }}
        onAddClick={() => {
          props.editorStore.addPredictedGoalsParagraph();
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
    <ParagraphContentEditor
      value={props.editorStore.predictedGoals.map((e) => e.text)}
      onChange={(idx, value) => {
        props.editorStore.updatePredictedGoalsParagraph(idx, value);
      }}
      onAddClick={() => {
        props.editorStore.addPredictedGoalsParagraph();
      }}
      text={'Tags'}
      placeholder={''}
    />
  );
});

export const ParagraphContentEditor = (
  props: ContentEditorProps
): ReactElement => {
  return (
    <ContentEditorWrap>
      <LabelWrap>{props.text}</LabelWrap>
      {props.value.map((v, idx) => {
        return (
          <Paragraph
            key={`paragraph-${idx}`}
            idx={idx}
            value={v}
            onAddClick={props.onAddClick}
            onChange={props.onChange}
            placeholder={props.placeholder}
          />
        );
      })}
      {props.value.length === 0 && (
        <Paragraph
          idx={0}
          value={''}
          onAddClick={props.onAddClick}
          onChange={props.onChange}
          placeholder={props.placeholder}
        />
      )}
    </ContentEditorWrap>
  );
};

interface ParagraphProps {
  idx: number;
  value: string;
  onChange: (idx: number, value: string) => void;
  onAddClick: () => void;
  placeholder: string;
}

const Paragraph = (props: ParagraphProps): ReactElement => {
  const { idx, value, onChange, onAddClick, placeholder } = props;

  return (
    <ParagraphWrap>
      <IconButtonWrap onClick={onAddClick}>
        <AddCircleOutlined />
      </IconButtonWrap>
      <TextFieldWrap
        value={value}
        onChange={(e) => {
          onChange(idx, e.currentTarget.value);
        }}
        multiline
        autoComplete={'off'}
        variant={'standard'}
        placeholder={placeholder}
        InputProps={{
          disableUnderline: true,
          autoComplete: 'off'
        }}
      />
    </ParagraphWrap>
  );
};

const ContentEditorWrap = styled.div`
  margin-top: 40px;
  padding-left: 16px;
  margin-bottom: 40px;
`;

const ParagraphWrap = styled.div`
  display: flex;
  align-items: start;
  margin-left: -64px;
  margin-bottom: 32px;
`;

const IconButtonWrap = styled(IconButton)`
  margin-top: -6px;
  margin-right: 24px;
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
