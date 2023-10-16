import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { NegativeDataEditMode } from './NegativeDataEditMode';
import { NegativeDataViewMode } from './NegativeDataViewMode';
import { ParagraphElementWrap } from './element/ParagraphElementWrap';
import { LabelWrap, SectionWrap } from './styled';

export const ExperimentGoalsEditor = observer(
  (props: EditorProps): ReactElement => {
    const { publicationStore } = props;
    return (
      <SectionWrap>
        <LabelWrap>{'Background & Aims'}</LabelWrap>
        <ParagraphElementWrap
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
          onSplitParagraph={(idx, splitIndex) => {
            publicationStore.splitExperimentGoalsParagraph(idx, splitIndex);
          }}
          placeholder={
            'Describe the context of data collection and the experimental goals'
          }
          disableInitFocus={props.publicationStore.disableAutofocus}
        />
        {!publicationStore.isReadonly && (
          <NegativeDataEditMode publicationStore={props.publicationStore} />
        )}
        {publicationStore.isReadonly && publicationStore.isNegative && (
          <NegativeDataViewMode publicationStore={props.publicationStore} />
        )}
      </SectionWrap>
    );
  }
);
