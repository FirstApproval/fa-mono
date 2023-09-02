import React, { type ReactElement, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { TextField } from '@mui/material';

interface ParagraphProps {
  cursorPosition: number;
  paragraphToFocus: number;
  isReadonly?: boolean;
  paragraphPrefixType?: ParagraphPrefixType;
  idx: number;
  value: string;
  onChange: (idx: number, value: string) => void;
  onAddParagraph: (idx: number) => void;
  onMergeParagraph: (idx: number) => void;
  onSplitParagraph: (idx: number, splitIndex: number) => void;
  placeholder: string;
}

export const ParagraphElement = (props: ParagraphProps): ReactElement => {
  const {
    paragraphToFocus,
    cursorPosition,
    idx,
    value,
    onChange,
    onAddParagraph,
    onMergeParagraph,
    onSplitParagraph,
    placeholder,
    paragraphPrefixType
  } = props;

  const prefix =
    paragraphPrefixType === ParagraphPrefixType.BULLET
      ? '•'
      : paragraphPrefixType === ParagraphPrefixType.NUMERATION
      ? (idx + 1).toString() + '.'
      : '';

  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) return;
    if (paragraphToFocus === idx) {
      ref.current.focus();
      // @ts-expect-error wrong types
      ref.current.selectionStart = cursorPosition;
      // @ts-expect-error wrong types
      ref.current.selectionEnd = cursorPosition;
    }
  }, [paragraphToFocus, cursorPosition, ref]);

  return (
    <ParagraphWrap paragraphPrefixType={paragraphPrefixType}>
      {prefix && <PrefixRowWrap>{prefix}</PrefixRowWrap>}
      {!props.isReadonly && (
        <TextFieldWrap
          inputRef={ref}
          onKeyDown={(event) => {
            // @ts-expect-error wrong types
            const selectionStart = event.target.selectionStart;
            // @ts-expect-error wrong types
            const selectionEnd = event.target.selectionEnd;
            if (event.key === 'Enter' || event.keyCode === 13) {
              event.preventDefault();
              event.stopPropagation();
              if (
                selectionEnd === value.length &&
                selectionStart === value.length
              ) {
                onAddParagraph(idx);
              } else {
                onSplitParagraph(idx, selectionEnd);
              }
            } else if (
              selectionStart === 0 &&
              selectionEnd === 0 &&
              (event.key === 'Backspace' || event.key === 'Delete')
            ) {
              event.preventDefault();
              event.stopPropagation();
              onMergeParagraph(idx);
            }
          }}
          value={value}
          onChange={(e) => {
            onChange(idx, e.currentTarget.value);
          }}
          multiline
          autoComplete={'off'}
          variant={'standard'}
          placeholder={placeholder}
          InputProps={{
            disableUnderline: true,
            autoComplete: 'off'
          }}
        />
      )}
      {props.isReadonly && <div>{value}</div>}
    </ParagraphWrap>
  );
};

const ParagraphWrap = styled.div<{ paragraphPrefixType?: ParagraphPrefixType }>`
  display: flex;
  margin-bottom: ${(props) => (props.paragraphPrefixType ? '0px' : '16px')};
`;

const TextFieldWrap = styled(TextField)`
  width: 100%;
`;

export const PrefixRowWrap = styled.span`
  margin: 3.5px 6px 0;
  text-align: center;
`;

export enum ParagraphPrefixType {
  NUMERATION = 'NUMERATION',
  BULLET = 'BULLET'
}
