import React from 'react';
import { type ReactElement, useState } from 'react';
import {
  type ParagraphWithId,
  type PublicationEditorStore
} from '../store/PublicationEditorStore';
import { observer } from 'mobx-react-lite';
import { ParagraphElement } from './element/ParagraphElement';
import { ContentEditorWrap, LabelWrap } from './styled';

export interface EditorProps {
  editorStore: PublicationEditorStore;
}

interface ContentEditorProps {
  text?: string;
  placeholder: string;
  value: ParagraphWithId[];
  onChange: (idx: number, value: string) => void;
  onAddClick: (idx: number) => void;
}

export const DescriptionEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        value={props.editorStore.description}
        onChange={(idx, value) => {
          props.editorStore.updateDescriptionParagraph(idx, value);
        }}
        onAddClick={(idx) => {
          props.editorStore.addDescriptionParagraph(idx);
        }}
        placeholder={'Describe the aim of your experiment or research...'}
      />
    );
  }
);

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

export const ParagraphContentEditor = (
  props: ContentEditorProps
): ReactElement => {
  const [paragraphToFocus, setParagraphToFocus] = useState<number>(0);

  return (
    <ContentEditorWrap>
      {props.text && <LabelWrap>{props.text}</LabelWrap>}
      {props.value.map((p, idx) => {
        return (
          <ParagraphElement
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
