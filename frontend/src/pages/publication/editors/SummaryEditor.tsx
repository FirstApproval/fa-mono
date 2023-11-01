import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { ParagraphContentEditor } from './ParagraphContentEditor';

export const SummaryEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ParagraphContentEditor
      isReadonly={props.publicationStore.isReadonly}
      value={props.publicationStore.summary}
      onChange={(idx, value) => {
        props.publicationStore.updateSummaryParagraph(idx, value);
      }}
      placeholder={'Publication summary'}
      disableInitFocus={props.publicationStore.disableAutofocus}
    />
  );
});
