import { ListElement, ParagraphPrefixType } from './element/ListElement';
import React, { ReactElement, useState } from 'react';
import { SectionWrap, LabelWrap } from './styled';
import styled from '@emotion/styled';
import { ParagraphWithId } from '../store/PublicationStore';

export interface ListContentEditorProps {
  isReadonly?: boolean;
  placeholder: string;
  value: ParagraphWithId[];
  onChange: (idx: number, value: string) => void;
  disableInitFocus?: boolean;
  text?: string;
  onAddParagraph: (idx: number) => void;
  onMergeParagraph: (idx: number) => void;
  onSplitParagraph: (idx: number, splitIndex: number) => void;
  paragraphPrefixType?: ParagraphPrefixType;
}

export const ListContentEditor = (
  props: ListContentEditorProps
): ReactElement => {
  return (
    <SectionWrap>
      {props.text && <LabelWrap>{props.text}</LabelWrap>}
      <UlWrap>
        <ListElementWrap {...props} />
      </UlWrap>
    </SectionWrap>
  );
};
export const OrderedListContentEditor = (
  props: ListContentEditorProps
): ReactElement => {
  return (
    <SectionWrap>
      {props.text && <LabelWrap>{props.text}</LabelWrap>}
      <OlWrap>
        <ListElementWrap {...props} />
      </OlWrap>
    </SectionWrap>
  );
};
const ListElementWrap = (props: ListContentEditorProps): ReactElement => {
  const [paragraphToFocus, setParagraphToFocus] = useState<number>(
    props.disableInitFocus ? -1 : 0
  );
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  return (
    <>
      {props.value.map((p, idx) => {
        return (
          <ListElement
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
            paragraphPrefixType={props.paragraphPrefixType}
          />
        );
      })}
    </>
  );
};

const UlWrap = styled.ul`
  list-style-type: disc;
  list-style-position: outside;

  margin-left: -40px;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
`;

const OlWrap = styled.ol`
  list-style-type: decimal;
  list-style-position: outside;

  margin-left: -40px;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
`;
