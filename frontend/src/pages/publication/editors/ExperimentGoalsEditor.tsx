import { observer } from 'mobx-react-lite';
import React, { ReactElement } from 'react';
import { DataEditMode } from './DataEditMode';
import { DataViewMode } from './DataViewMode';
import { SectionWrap } from './element/SectionWrap';
import { LabelWrap, SectionWrap as SectionWrap2 } from './styled';
import { PublicationStore } from "../store/PublicationStore"

export interface ExperimentGoalsEditorProps {
  publicationStore: PublicationStore;
}

export const ExperimentGoalsEditor = observer(
  (props: ExperimentGoalsEditorProps): ReactElement => {
    const { publicationStore } = props;

    const sections = [
      {
        header: 'My data is negative',
        booleanField: 'isNegative',
        textField: 'negativeData',
        textFieldPlaceHolder:
          "Why your data didn't confirm the initial hypothesis or expectations",
        isOnlyForStudentDataCollection: false
      },
      {
        header: 'Replication of Previous Experiments',
        booleanField: 'isReplicationOfPreviousExperiments',
        textField: 'replicationOfPreviousExperimentsData',
        textFieldPlaceHolder: 'Which experiment did you replicate?',
        isOnlyForStudentDataCollection: true
      },
      {
        header: 'Previously Published Dataset',
        booleanField: 'isPreviouslyPublishedDataset',
        textField: 'previouslyPublishedDatasetData',
        textFieldPlaceHolder:
          'Where was it published, and what changes were made?',
        isOnlyForStudentDataCollection: true
      }
    ].filter(({ isOnlyForStudentDataCollection }) =>
      isOnlyForStudentDataCollection ? publicationStore.isStudentDataCollection : true
    );

    return (
      <SectionWrap2>
        <LabelWrap>{'Background & Aims'}</LabelWrap>
        <SectionWrap
          isReadonly={publicationStore.isReadonly}
          value={publicationStore.experimentGoals}
          onChange={(value) => {
            publicationStore.updateExperimentGoalsParagraph(value);
          }}
          placeholder={'Describe the context of data collection and the experimental goals'}
          disableInitFocus={publicationStore.disableAutofocus}
        />

        {sections.map(({ header, booleanField, textField, textFieldPlaceHolder }) => {
          const Component = publicationStore.isReadonly ? DataViewMode : DataEditMode;
          return publicationStore.isReadonly && !publicationStore[booleanField as keyof PublicationStore] ? null : (
            <Component
              key={booleanField}
              publicationStore={publicationStore}
              header={header}
              booleanField={booleanField as keyof PublicationStore}
              textField={textField as keyof PublicationStore}
              textFieldPlaceHolder={textFieldPlaceHolder}
            />
          );
        })}
      </SectionWrap2>
    );
  }
);
