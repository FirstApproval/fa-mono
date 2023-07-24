import styled from '@emotion/styled';
import { type ReactElement, useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import {
  type ParagraphWithId,
  type PublicationEditorStore
} from './PublicationEditorStore';
import { observer } from 'mobx-react-lite';
import { AddCircleOutlined } from '@mui/icons-material';

interface EditorProps {
  editorStore: PublicationEditorStore;
}

interface ContentEditorProps {
  text: string;
  placeholder: string;
  value: ParagraphWithId[];
  onChange: (idx: number, value: string) => void;
  onAddClick: (idx: number) => void;
}

export const PredictedGoalsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        value={props.editorStore.predictedGoals}
        onChange={(idx, value) => {
          props.editorStore.updatePredictedGoalsParagraph(idx, value);
        }}
        onAddClick={(idx) => {
          props.editorStore.addPredictedGoalsParagraph(idx);
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
      value={props.editorStore.method}
      onChange={(idx, value) => {
        props.editorStore.updateMethodParagraph(idx, value);
      }}
      onAddClick={(idx) => {
        props.editorStore.addMethodParagraph(idx);
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
        value={props.editorStore.objectOfStudy}
        onChange={(idx, value) => {
          props.editorStore.updateObjectOfStudyParagraph(idx, value);
        }}
        onAddClick={(idx) => {
          props.editorStore.addObjectOfStudyParagraph(idx);
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
      value={props.editorStore.software}
      onChange={(idx, value) => {
        props.editorStore.updateSoftwareParagraph(idx, value);
      }}
      onAddClick={(idx) => {
        props.editorStore.addSoftwareParagraph(idx);
      }}
      text={'Software'}
      placeholder={
        'Provide the software you used, with configuration options...'
      }
    />
  );
});

export const AuthorsEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ContentEditorWrap>
      <LabelWrap>Authors</LabelWrap>
    </ContentEditorWrap>
  );
});

export const GrantingOrganisationsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        value={props.editorStore.grantingOrganizations}
        onChange={(idx, value) => {
          props.editorStore.updateGrantingOrganization(idx, value);
        }}
        onAddClick={(idx) => {
          props.editorStore.addGrantingOrganization(idx);
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
        value={props.editorStore.relatedArticles}
        onChange={(idx, value) => {
          props.editorStore.updateRelatedArticle(idx, value);
        }}
        onAddClick={(idx) => {
          props.editorStore.addRelatedArticle(idx);
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
    <ContentEditorWrap>
      <LabelWrap>Tags</LabelWrap>
    </ContentEditorWrap>
  );
});

export const ParagraphContentEditor = (
  props: ContentEditorProps
): ReactElement => {
  const [paragraphToFocus, setParagraphToFocus] = useState<number>(0);

  return (
    <ContentEditorWrap>
      <LabelWrap>{props.text}</LabelWrap>
      {props.value.map((p, idx) => {
        return (
          <Paragraph
            autoFocus={paragraphToFocus === idx}
            key={p.id}
            idx={idx}
            value={p.text}
            onAddParagraph={(idx) => {
              setParagraphToFocus(idx + 1);
              props.onAddClick(idx);
            }}
            onChange={props.onChange}
            placeholder={props.placeholder}
          />
        );
      })}
    </ContentEditorWrap>
  );
};

interface ParagraphProps {
  idx: number;
  value: string;
  onChange: (idx: number, value: string) => void;
  onAddParagraph: (idx: number) => void;
  placeholder: string;
  autoFocus: boolean;
}

const Paragraph = (props: ParagraphProps): ReactElement => {
  const { idx, value, onChange, onAddParagraph, placeholder, autoFocus } =
    props;

  return (
    <ParagraphWrap>
      {value.length === 0 && (
        <IconButtonWrap>
          <AddCircleOutlined />
        </IconButtonWrap>
      )}
      {value.length !== 0 && <MarginAlign />}
      <TextFieldWrap
        autoFocus={autoFocus}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            onAddParagraph(idx);
          }
        }}
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
  margin-bottom: 40px;
`;

const ParagraphWrap = styled.div`
  display: flex;
  align-items: start;
  margin-left: -64px;
  margin-bottom: 32px;
`;

const IconButtonWrap = styled(IconButton)`
  margin-top: -4px;
  margin-right: 24px;
`;

const MarginAlign = styled.div`
  width: 72px;
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
