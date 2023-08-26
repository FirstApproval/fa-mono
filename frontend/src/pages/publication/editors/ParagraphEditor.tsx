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
import { PrimaryArticleData } from './PrimaryArticleData';

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
  onAddParagraph: (idx: number) => void;
  onMergeParagraph: (idx: number) => void;
}

export const DescriptionEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.summary}
        onChange={(idx, value) => {
          props.publicationStore.updateSummaryParagraph(idx, value);
        }}
        onAddParagraph={(idx) => {
          props.publicationStore.addDescriptionParagraph(idx);
        }}
        onMergeParagraph={(idx) => {
          props.publicationStore.mergeSummaryParagraph(idx);
        }}
        placeholder={'Publication summary'}
      />
    );
  }
);

export const ExperimentGoalsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.experimentGoals}
        onChange={(idx, value) => {
          props.publicationStore.updateExperimentGoalsParagraph(idx, value);
        }}
        onAddParagraph={(idx) => {
          props.publicationStore.addExperimentGoalsParagraph(idx);
        }}
        onMergeParagraph={(idx) => {
          props.publicationStore.mergeExperimentGoalsParagraph(idx);
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
      onAddParagraph={(idx) => {
        props.publicationStore.addMethodParagraph(idx);
      }}
      onMergeParagraph={(idx) => {
        props.publicationStore.mergeMethodParagraph(idx);
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
        onAddParagraph={(idx) => {
          props.publicationStore.addObjectOfStudyParagraph(idx);
        }}
        onMergeParagraph={(idx) => {
          props.publicationStore.mergeObjectOfStudyParagraph(idx);
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
      onAddParagraph={(idx) => {
        props.publicationStore.addSoftwareParagraph(idx);
      }}
      onMergeParagraph={(idx) => {
        props.publicationStore.mergeSoftwareParagraph(idx);
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
        onAddParagraph={(idx) => {
          props.publicationStore.addGrantingOrganization(idx);
        }}
        onMergeParagraph={(idx) => {
          props.publicationStore.mergeGrantingOrganizationsParagraph(idx);
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
      <>
        <ParagraphContentEditor
          isReadonly={props.publicationStore.isReadonly}
          value={props.publicationStore.relatedArticles}
          onChange={(idx, value) => {
            props.publicationStore.updateRelatedArticle(idx, value);
          }}
          onAddParagraph={(idx) => {
            props.publicationStore.addRelatedArticle(idx);}}
        onMergeParagraph={(idx) => {
          props.publicationStore.mergeRelatedArticlesParagraph(idx);
          }}
          paragraphPrefixType={ParagraphPrefixType.NUMERATION}
          text={'Related articles'}
          placeholder={
            'Provide citations or references of articles that are closely related to your research...'
          }
        />
        <div style={{ marginBottom: 48 }}>
          <PrimaryArticleData
            isReadOnly={props.publicationStore.isReadonly}
            onChange={(value) => {
              props.publicationStore.updatePrimaryArticle(value);
            }}
            value={props.publicationStore.primaryArticles}></PrimaryArticleData>
        </div>
      </>
    );
  }
);

export const ParagraphContentEditor = (
  props: ContentEditorProps
): ReactElement => {
  const [paragraphToFocus, setParagraphToFocus] = useState<number>(0);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  return (
    <ContentEditorWrap>
      {props.text && <LabelWrap>{props.text}</LabelWrap>}
      {props.value.map((p, idx) => {
        return (
          <ParagraphElement
            cursorPosition={cursorPosition}
            paragraphToFocus={paragraphToFocus}
            isReadonly={props.isReadonly}
            key={p.id}
            idx={idx}
            value={p.text}
            onAddParagraph={(idx) => {
              setParagraphToFocus(idx + 1);
              props.onAddParagraph(idx);
            }}
            onMergeParagraph={(idx) => {
              setCursorPosition(props.value[idx - 1].text.length);
              setParagraphToFocus(idx - 1);
              props.onMergeParagraph(idx);
            }}
            onChange={props.onChange}
            placeholder={idx === 0 ? props.placeholder : ''}
            paragraphPrefixType={props.paragraphPrefixType}
          />
        );
      })}
    </ContentEditorWrap>
  );
};
