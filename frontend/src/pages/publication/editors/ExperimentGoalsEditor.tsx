import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { ParagraphContentEditor } from './ParagraphContentEditor';
import { NegativeDataEditMode } from './NegativeDataEditMode';
import { NegativeDataViewMode } from './NegativeDataViewMode';

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
          onSplitParagraph={(idx, splitIndex) => {
            publicationStore.splitExperimentGoalsParagraph(idx, splitIndex);
          }}
          text={'Background & Aims'}
          placeholder={
            'Describe the context of data collection and the experimental goals'
          }
        />
        {!publicationStore.isReadonly && (
          <NegativeDataEditMode publicationStore={props.publicationStore} />
        )}
        {publicationStore.isReadonly && publicationStore.isNegative && (
          <NegativeDataViewMode publicationStore={props.publicationStore} />
        )}
      </>
    );
  }
);
