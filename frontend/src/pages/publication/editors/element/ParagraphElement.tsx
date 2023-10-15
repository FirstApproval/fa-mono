import React, { type ReactElement, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { TextField, Typography } from '@mui/material';

interface ParagraphProps {
  cursorPosition: number;
  paragraphToFocus: number;
  isReadonly?: boolean;
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
    placeholder
  } = props;

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
    <ParagraphWrap>
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
            autoComplete: 'off',
            style: {
              fontSize: '20px',
              fontWeight: '400',
              fontStyle: 'normal',
              lineHeight: '160%',
              paddingTop: 0,
              paddingBottom: 0
            }
          }}
        />
      )}
      {props.isReadonly && (
        <Typography variant={'body'} component={'div'}>
          {value}
        </Typography>
      )}
    </ParagraphWrap>
  );
};

const ParagraphWrap = styled.div`
  display: flex;
  margin-bottom: 16px;

  padding-left: 16px;
  padding-right: 16px;
`;

const TextFieldWrap = styled(TextField)`
  width: 100%;
`;
