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
        onChange={(value) => {
          props.publicationStore.updateDataDescriptionParagraph(value);
        }}
        placeholder={
          "Describe your data's contents, structure, and any transformations applied to the raw data"
        }
        text={'Data description'}
        disableInitFocus={props.publicationStore.disableAutofocus}
      />
    );
  }
);
