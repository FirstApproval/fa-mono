import React, { type ReactElement } from 'react';
import { AddCircleOutlined } from '@mui/icons-material';
import styled from '@emotion/styled';
import { IconButton, TextField } from '@mui/material';

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
      {value.length === 0 && (
        <IconButtonWrap>
          <AddCircleOutlined />
        </IconButtonWrap>
      )}
      {value.length !== 0 && <MarginAlign />}
      <PrefixRowWrap>{prefix}</PrefixRowWrap>
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
  flex-direction: row;
  align-items: self-start;
  margin-left: -96px;
`;

const MarginAlign = styled.div`
  width: 72px;
`;

const TextFieldWrap = styled(TextField)`
  margin-left: 8px;
  width: 100%;
`;

const IconButtonWrap = styled(IconButton)`
  margin-top: -4px;
  margin-right: 24px;
`;

export const PrefixRowWrap = styled.p`
  margin-top: 4px;
  margin-bottom: 0;
  width: 30px;
  text-align: end;
`;

export enum ParagraphPrefixType {
  NUMERATION = 'NUMERATION',
  BULLET = 'BULLET'
}
