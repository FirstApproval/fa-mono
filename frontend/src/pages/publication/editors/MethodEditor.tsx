import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { ParagraphContentEditor } from './ParagraphContentEditor';

export const MethodEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ParagraphContentEditor
      isReadonly={props.publicationStore.isReadonly}
      value={props.publicationStore.method}
      onChange={(value) => {
        props.publicationStore.updateMethodParagraph(value);
      }}
      placeholder={
        'Detail the steps of your method, helping others to reproduce it...'
      }
      text={'Materials and methods'}
      disableInitFocus={props.publicationStore.disableAutofocus}
    />
  );
});
