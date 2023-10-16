import React, { type ReactElement } from 'react';
import { LabelWrap, SectionWrap } from './styled';
import {
  ParagraphElementWrap,
  ParagraphElementWrapProps
} from './element/ParagraphElementWrap';

export const ParagraphContentEditor = (
  props: ParagraphElementWrapProps & { text?: string }
): ReactElement => {
  return (
    <SectionWrap>
      {props.text && <LabelWrap>{props.text}</LabelWrap>}
      <ParagraphElementWrap {...props} />
    </SectionWrap>
  );
};
