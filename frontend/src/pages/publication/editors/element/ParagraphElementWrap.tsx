import { ParagraphWithId } from '../../store/PublicationStore';
import React, { ReactElement, useState } from 'react';
import { ParagraphElement } from './ParagraphElement';

export interface ParagraphEditorProps {
  isReadonly?: boolean;
  text?: string;
  placeholder: string;
  value: ParagraphWithId[];
  onChange: (idx: number, value: string) => void;
  onAddParagraph: (idx: number) => void;
  onMergeParagraph: (idx: number) => void;
  onSplitParagraph: (idx: number, splitIndex: number) => void;
}

export const ParagraphElementWrap = (
  props: Omit<ParagraphEditorProps, 'text'> & { disableInitFocus?: boolean }
): ReactElement => {
  const [paragraphToFocus, setParagraphToFocus] = useState<number>(
    props.disableInitFocus ? -1 : 0
  );
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  return (
    <>
      {props.value.map((p, idx) => {
        return (
          <ParagraphElement
            cursorPosition={cursorPosition}
            paragraphToFocus={paragraphToFocus}
            isReadonly={props.isReadonly}
            key={p.id}
            idx={idx}
            value={p.text}
            onAddParagraph={(idx) => {
              setParagraphToFocus(idx + 1);
              props.onAddParagraph(idx);
            }}
            onMergeParagraph={(idx) => {
              setCursorPosition(props.value[idx - 1]?.text.length);
              setParagraphToFocus(idx - 1);
              props.onMergeParagraph(idx);
            }}
            onSplitParagraph={(idx, splitIndex) => {
              setParagraphToFocus(idx + 1);
              setCursorPosition(0);
              props.onSplitParagraph(idx, splitIndex);
            }}
            onChange={props.onChange}
            placeholder={idx === 0 ? props.placeholder : ''}
          />
        );
      })}
    </>
  );
};
