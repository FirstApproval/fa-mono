import React, { type ReactElement, useState } from 'react';
import {
  type ParagraphWithId
} from '../store/PublicationStore';
import { observer } from 'mobx-react-lite';
import {
  ParagraphElement,
  ParagraphPrefixType
} from './element/ParagraphElement';
import { ContentEditorWrap, LabelWrap } from './styled';
import { PrimaryArticleData } from './PrimaryArticleData';
import WarningIcon from '@mui/icons-material/Warning';
import { Switch } from '@mui/material';
import { type EditorProps } from './types';
import styled from '@emotion/styled';

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
    const { publicationStore } = props;
    return (
      <>
        <ParagraphContentEditor
          isReadonly={publicationStore.isReadonly}
          value={publicationStore.experimentGoals}
          onChange={(idx, value) => {
            publicationStore.updateExperimentGoalsParagraph(idx, value);
          }}
          onAddParagraph={(idx) => {
            publicationStore.addExperimentGoalsParagraph(idx);
          }}
          onMergeParagraph={(idx) => {
            publicationStore.mergeExperimentGoalsParagraph(idx);
          }}
          text={'Experiment goals'}
          placeholder={
            'Describe the experiment goals and preliminary results...'
          }
        />
        <NegativeData publicationStore={props.publicationStore} />
      </>
    );
  }
);

export const NegativeData = observer((props: EditorProps): ReactElement => {
  const { publicationStore } = props;
  return (
    <NegativeDataAllWrapper>
      <NegativeDataWrapper>
        <NegativeDataHeaderWrapper>
          {!publicationStore.isNegative && (
            <>
              <WarningIcon
                htmlColor={'#a8a8b4'}
                style={{ marginRight: '5px' }}
              />
              <NegativeDataHeaderDisabled>
                My data is negative
              </NegativeDataHeaderDisabled>
            </>
          )}
          {publicationStore.isNegative && (
            <NegativeDataHeaderEnabled>
              My data is negative
            </NegativeDataHeaderEnabled>
          )}
        </NegativeDataHeaderWrapper>
        <Switch
          checked={publicationStore.isNegative}
          onClick={publicationStore.invertNegativeData}
        />
      </NegativeDataWrapper>
      {publicationStore.isNegative && (
        <FullWidthTextField
          autoFocus
          value={publicationStore.negativeData}
          onChange={(e) => {
            publicationStore.updateNegativeData(e.currentTarget.value);
          }}
          disableUnderline={true}
          multiline={true}
          placeholder="Why your data didn't confirm the initial hypothesis or expectations"
          minRows={1}
          maxRows={4}
        />
      )}
    </NegativeDataAllWrapper>
  );
});

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

const NegativeDataHeaderEnabled = styled.span`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h6 */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
  padding-top: 4px;
`;

const NegativeDataHeaderDisabled = styled.span`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h6 */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;

const NegativeDataHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NegativeDataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NegativeDataAllWrapper = styled.div`
  border: 1px solid #d2d2d6;
  border-radius: 4px 0 4px 8px;
  gap: 8px;
  align-self: stretch;
  margin-bottom: 15px;
  padding-left: 10px;
`;

const FullWidthTextField = styled(Input)`
  width: 100%;
  padding-bottom: 12px;
`;
