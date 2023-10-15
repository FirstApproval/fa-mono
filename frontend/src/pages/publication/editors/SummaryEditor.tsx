import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { LabelWrap } from './styled';
import { ParagraphContentEditor } from './ParagraphContentEditor';

export const SummaryEditor = observer((props: EditorProps): ReactElement => {
  return (
    <>
      <LabelWrap>Summary</LabelWrap>
      <ParagraphContentEditor
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.summary}
        onChange={(idx, value) => {
          props.publicationStore.updateSummaryParagraph(idx, value);
        }}
        onAddParagraph={(idx) => {
          props.publicationStore.addSummaryParagraph(idx);
        }}
        onMergeParagraph={(idx) => {
          props.publicationStore.mergeSummaryParagraph(idx);
        }}
        onSplitParagraph={(idx, splitIndex) => {
          props.publicationStore.splitSummaryParagraph(idx, splitIndex);
        }}
        placeholder={'Publication summary'}
      />
    </>
  );
});
