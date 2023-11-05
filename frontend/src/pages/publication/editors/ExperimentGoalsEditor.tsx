import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { NegativeDataEditMode } from './NegativeDataEditMode';
import { NegativeDataViewMode } from './NegativeDataViewMode';
import { SectionWrap } from './element/SectionWrap';
import { LabelWrap, SectionWrap as SectionWrap2 } from './styled';

export const ExperimentGoalsEditor = observer(
  (props: EditorProps): ReactElement => {
    const { publicationStore } = props;
    return (
      <SectionWrap2>
        <LabelWrap>{'Background & Aims'}</LabelWrap>
        <SectionWrap
          isReadonly={publicationStore.isReadonly}
          value={publicationStore.experimentGoals}
          onChange={(value) => {
            publicationStore.updateExperimentGoalsParagraph(value);
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
      </SectionWrap2>
    );
  }
);
