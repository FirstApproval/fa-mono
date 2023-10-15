import React, { type ReactElement } from 'react';
import { LabelWrap, ContentEditorWrap } from './styled';
import {
  ParagraphElementWrap,
  ParagraphElementWrapProps
} from './element/ParagraphElementWrap';

export const ParagraphContentEditor = (
  props: ParagraphElementWrapProps & { text?: string }
): ReactElement => {
  return (
    <ContentEditorWrap>
      {props.text && <LabelWrap>{props.text}</LabelWrap>}
      <ParagraphElementWrap {...props} />
    </ContentEditorWrap>
  );
};
