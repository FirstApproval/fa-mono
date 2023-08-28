import React, { type ReactElement, useState } from 'react';
import { type ParagraphWithId } from '../store/PublicationStore';
import { observer } from 'mobx-react-lite';
import {
  ParagraphElement,
  ParagraphPrefixType
} from './element/ParagraphElement';
import { ContentEditorWrap, LabelWrap } from './styled';
import { PrimaryArticleData } from './PrimaryArticleData';
import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import { type EditorProps } from './types';

interface ParagraphEditorProps {
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
    <ContentEditorWrap>
      <LabelWrap>Method</LabelWrap>
      <FullWidthTextField
        autoFocus
        value={props.publicationStore.methodTitle}
        onChange={(event) => {
          props.publicationStore.updateMethodTitle(event.currentTarget.value);
        }}
        placeholder={'Method name'}
      />
      <ParagraphElementWrap
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
        placeholder={
          'Detail the steps of your method, helping others to reproduce it...'
        }
        disableInitFocus
      />
    </ContentEditorWrap>
  );
});

export const ObjectOfStudyEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ContentEditorWrap>
        <LabelWrap>Object of study</LabelWrap>
        <FullWidthTextField
          autoFocus
          value={props.publicationStore.objectOfStudyTitle}
          onChange={(event) => {
            props.publicationStore.updateObjectOfStudyTitle(
              event.currentTarget.value
            );
          }}
          placeholder={'Object category'}
        />
        <ParagraphElementWrap
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
          placeholder={
            'Describe the specific conditions or features of your object of study...'
          }
          disableInitFocus
        />
      </ContentEditorWrap>
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
            props.publicationStore.addRelatedArticle(idx);
          }}
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
  props: ParagraphEditorProps
): ReactElement => {
  return (
    <ContentEditorWrap>
      {props.text && <LabelWrap>{props.text}</LabelWrap>}
      <ParagraphElementWrap {...props} />
    </ContentEditorWrap>
  );
};

const ParagraphElementWrap = (
  props: Omit<ParagraphEditorProps, 'text'> & { disableInitFocus?: boolean }
): ReactElement => {
  const [paragraphToFocus, setParagraphToFocus] = useState<number>(
    props.disableInitFocus ? -1 : 0
  );
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  return (
    <>
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
              setCursorPosition(props.value[idx - 1]?.text.length);
              setParagraphToFocus(idx - 1);
              props.onMergeParagraph(idx);
            }}
            onChange={props.onChange}
            placeholder={idx === 0 ? props.placeholder : ''}
            paragraphPrefixType={props.paragraphPrefixType}
          />
        );
      })}
    </>
  );
};

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 32px;
`;
