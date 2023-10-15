import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { ParagraphContentEditor } from './ParagraphContentEditor';

export const ObjectOfStudyEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ParagraphContentEditor
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.objectOfStudy}
        onChange={(idx, value) => {
          props.publicationStore.updateObjectOfStudyParagraph(idx, value);
        }}
        onAddParagraph={(idx) => {
          props.publicationStore.addObjectOfStudyParagraph(idx);
        }}
        onMergeParagraph={(idx) => {
          props.publicationStore.mergeObjectOfStudyParagraph(idx);
        }}
        onSplitParagraph={(idx, splitIndex) => {
          props.publicationStore.splitObjectOfStudyParagraph(idx, splitIndex);
        }}
        placeholder={
          'Describe the data’s contents, structure and preliminary findings...'
        }
        disableInitFocus
        text={'Data description'}
      />
    );
  }
);
