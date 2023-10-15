import React, { type ReactElement } from 'react';
import { LabelWrap } from './styled';
import {
  ParagraphEditorProps,
  ParagraphElementWrap
} from './element/ParagraphElementWrap';

export const ParagraphContentEditor = (
  props: ParagraphEditorProps
): ReactElement => {
  return (
    <>
      {props.text && <LabelWrap>{props.text}</LabelWrap>}
      <ParagraphElementWrap {...props} />
    </>
  );
};
