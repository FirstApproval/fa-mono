import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { ParagraphContentEditor } from './ParagraphContentEditor';

export const SoftwareEditor = observer((props: EditorProps): ReactElement => {
  return (
    <ParagraphContentEditor
      isReadonly={props.publicationStore.isReadonly}
      value={props.publicationStore.software}
      onChange={(idx, value) => {
        props.publicationStore.updateSoftwareParagraph(idx, value);
      }}
      onAddParagraph={(idx) => {
        props.publicationStore.addSoftwareParagraph(idx);
      }}
      onMergeParagraph={(idx) => {
        props.publicationStore.mergeSoftwareParagraph(idx);
      }}
      onSplitParagraph={(idx, splitIndex) => {
        props.publicationStore.splitSoftwareParagraph(idx, splitIndex);
      }}
      text={'Software'}
      placeholder={
        'Provide the software you used, with configuration options...'
      }
    />
  );
});
