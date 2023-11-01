import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { ParagraphContentEditor } from './ParagraphContentEditor';

export const SoftwareEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ParagraphContentEditor
      isReadonly={props.publicationStore.isReadonly}
      value={props.publicationStore.software}
      onChange={(value) => {
        props.publicationStore.updateSoftwareParagraph(value);
      }}
      text={'Software'}
      placeholder={
        'Provide the software you used, with configuration options...'
      }
      disableInitFocus={props.publicationStore.disableAutofocus}
    />
  );
});
