import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { ParagraphContentEditor } from './ParagraphContentEditor';

export const PreliminaryResultsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.preliminaryResults}
        onChange={(value) => {
          props.publicationStore.updatePreliminaryResultsParagraph(value);
        }}
        placeholder={
          'Describe your initial observations or interpretations derived from the data'
        }
        text={'Preliminary Results'}
        disableInitFocus={props.publicationStore.disableAutofocus}
      />
    );
  }
);
