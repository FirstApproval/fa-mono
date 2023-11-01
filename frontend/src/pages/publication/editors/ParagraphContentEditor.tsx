import React, { type ReactElement } from 'react';
import { LabelWrap, SectionWrap as SectionWrap2 } from './styled';
import { SectionWrap, SectionWrapProps } from './element/SectionWrap';

export const ParagraphContentEditor = (
  props: SectionWrapProps & { text?: string }
): ReactElement => {
  return (
    <SectionWrap2>
      {props.text && <LabelWrap>{props.text}</LabelWrap>}
      <SectionWrap {...props} />
    </SectionWrap2>
  );
};
