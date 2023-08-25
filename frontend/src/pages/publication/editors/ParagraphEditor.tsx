import React from 'react';
import { type ReactElement, useState } from 'react';
import {
  type ParagraphWithId,
  type PublicationStore
} from '../store/PublicationStore';
import { observer } from 'mobx-react-lite';
import {
  ParagraphElement,
  ParagraphPrefixType
} from './element/ParagraphElement';
import { ContentEditorWrap, LabelWrap } from './styled';

export interface EditorProps {
  publicationStore: PublicationStore;
}

interface ContentEditorProps {
  isReadonly?: boolean;
  text?: string;
  paragraphPrefixType?: ParagraphPrefixType;
  placeholder: string;
  value: ParagraphWithId[];
  onChange: (idx: number, value: string) => void;
  onAddClick: (idx: number) => void;
}

export const DescriptionEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.description}
        onChange={(idx, value) => {
          props.publicationStore.updateDescriptionParagraph(idx, value);
        }}
        onAddClick={(idx) => {
          props.publicationStore.addDescriptionParagraph(idx);
        }}
        placeholder={'Publication summary'}
      />
    );
  }
);

export const PredictedGoalsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.predictedGoals}
        onChange={(idx, value) => {
          props.publicationStore.updatePredictedGoalsParagraph(idx, value);
        }}
        onAddClick={(idx) => {
          props.publicationStore.addPredictedGoalsParagraph(idx);
        }}
        text={'Experiment goals'}
        placeholder={'Describe the experiment goals and preliminary results...'}
      />
    );
  }
);

export const MethodEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ParagraphContentEditor
      isReadonly={props.publicationStore.isReadonly}
      value={props.publicationStore.method}
      onChange={(idx, value) => {
        props.publicationStore.updateMethodParagraph(idx, value);
      }}
      onAddClick={(idx) => {
        props.publicationStore.addMethodParagraph(idx);
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
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.objectOfStudy}
        onChange={(idx, value) => {
          props.publicationStore.updateObjectOfStudyParagraph(idx, value);
        }}
        onAddClick={(idx) => {
          props.publicationStore.addObjectOfStudyParagraph(idx);
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
      isReadonly={props.publicationStore.isReadonly}
      value={props.publicationStore.software}
      onChange={(idx, value) => {
        props.publicationStore.updateSoftwareParagraph(idx, value);
      }}
      onAddClick={(idx) => {
        props.publicationStore.addSoftwareParagraph(idx);
      }}
      text={'Software'}
      placeholder={
        'Provide the software you used, with configuration options...'
      }
    />
  );
});

export const GrantingOrganizationsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.grantingOrganizations}
        onChange={(idx, value) => {
          props.publicationStore.updateGrantingOrganization(idx, value);
        }}
        onAddClick={(idx) => {
          props.publicationStore.addGrantingOrganization(idx);
        }}
        paragraphPrefixType={ParagraphPrefixType.BULLET}
        text={'Granting organizations'}
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
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.relatedArticles}
        onChange={(idx, value) => {
          props.publicationStore.updateRelatedArticle(idx, value);
        }}
        onAddClick={(idx) => {
          props.publicationStore.addRelatedArticle(idx);
        }}
        paragraphPrefixType={ParagraphPrefixType.NUMERATION}
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
  const [paragraphToFocus, setParagraphToFocus] = useState<number>();

  return (
    <ContentEditorWrap>
      {props.text && <LabelWrap>{props.text}</LabelWrap>}
      {props.value.map((p, idx) => {
        return (
          <ParagraphElement
            isReadonly={props.isReadonly}
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
            paragraphPrefixType={props.paragraphPrefixType}
          />
        );
      })}
    </ContentEditorWrap>
  );
};
