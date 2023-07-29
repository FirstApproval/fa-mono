import React, { type ReactElement } from 'react';
import { AddCircleOutlined } from '@mui/icons-material';
import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import { IconButtonWrap } from './styled';

interface ParagraphProps {
  idx: number;
  value: string;
  onChange: (idx: number, value: string) => void;
  onAddParagraph: (idx: number) => void;
  placeholder: string;
  autoFocus: boolean;
}

export const Paragraph = (props: ParagraphProps): ReactElement => {
  const { idx, value, onChange, onAddParagraph, placeholder, autoFocus } =
    props;

  return (
    <ParagraphWrap>
      {value.length === 0 && (
        <IconButtonWrap>
          <AddCircleOutlined />
        </IconButtonWrap>
      )}
      {value.length !== 0 && <MarginAlign />}
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
  align-items: start;
  margin-left: -64px;
  margin-bottom: 32px;
`;

const MarginAlign = styled.div`
  width: 72px;
`;

const TextFieldWrap = styled(TextField)`
  width: 100%;
`;
