import { ParagraphWithId } from '../../store/PublicationStore';
import React, { ReactElement, useState } from 'react';
import { ParagraphElement } from './ParagraphElement';

export interface ParagraphElementWrapProps {
  isReadonly?: boolean;
  placeholder: string;
  value: ParagraphWithId[];
  onChange: (idx: number, value: string) => void;
  disableInitFocus?: boolean;
}

export const ParagraphElementWrap = (
  props: ParagraphElementWrapProps
): ReactElement => {
  const [paragraphToFocus] = useState<number>(props.disableInitFocus ? -1 : 0);

  return (
    <>
      {props.value.map((p, idx) => {
        return (
          <ParagraphElement
            paragraphToFocus={paragraphToFocus}
            isReadonly={props.isReadonly}
            key={p.id}
            idx={idx}
            value={p.text}
            onChange={props.onChange}
            placeholder={idx === 0 ? props.placeholder : ''}
          />
        );
      })}
    </>
  );
};
