import React, { ReactElement, useState } from 'react';
import { Section } from './Section';

export interface SectionWrapProps {
  isReadonly?: boolean;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disableInitFocus?: boolean;
}

export const SectionWrap = (props: SectionWrapProps): ReactElement => {
  const [paragraphToFocus] = useState<number>(props.disableInitFocus ? -1 : 0);

  return (
    <Section
      paragraphToFocus={paragraphToFocus}
      isReadonly={props.isReadonly}
      idx={0}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  );
};
