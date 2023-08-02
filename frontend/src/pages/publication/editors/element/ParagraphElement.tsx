import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { TextField } from '@mui/material';

interface ParagraphProps {
  paragraphPrefixType?: ParagraphPrefixType;
  idx: number;
  value: string;
  onChange: (idx: number, value: string) => void;
  onAddParagraph: (idx: number) => void;
  placeholder: string;
  autoFocus: boolean;
}

export const ParagraphElement = (props: ParagraphProps): ReactElement => {
  const { idx, value, onChange, onAddParagraph, placeholder, autoFocus } =
    props;

  const prefix =
    props.paragraphPrefixType === ParagraphPrefixType.BULLET
      ? '•'
      : props.paragraphPrefixType === ParagraphPrefixType.NUMERATION
      ? (idx + 1).toString() + '.'
      : '';

  return (
    <ParagraphWrap>
      {prefix && <PrefixRowWrap>{prefix}</PrefixRowWrap>}
      <TextFieldWrap
        autoFocus={autoFocus}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            onAddParagraph(idx);
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
    </ParagraphWrap>
  );
};

const ParagraphWrap = styled.div`
  display: flex;
`;

const TextFieldWrap = styled(TextField)`
  width: 100%;
`;

export const PrefixRowWrap = styled.span`
  margin: 4px 6px 0;
  text-align: center;
`;

export enum ParagraphPrefixType {
  NUMERATION = 'NUMERATION',
  BULLET = 'BULLET'
}
