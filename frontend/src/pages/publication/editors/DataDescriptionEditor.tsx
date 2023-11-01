import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { ParagraphContentEditor } from './ParagraphContentEditor';

export const DataDescriptionEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.dataDescription}
        onChange={(idx, value) => {
          props.publicationStore.updateDataDescriptionParagraph(idx, value);
        }}
        placeholder={
          'Describe the data’s contents, structure and preliminary findings...'
        }
        text={'Data description'}
        disableInitFocus={props.publicationStore.disableAutofocus}
      />
    );
  }
);
