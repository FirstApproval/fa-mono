import { type EditorProps } from './ContentEditor';
import React from 'react';
import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';

export const TitleEditor = observer((props: EditorProps) => {
  const { editorStore } = props;

  return (
    <TextFieldWrap
      autoFocus
      value={editorStore.title}
      onChange={(e) => {
        editorStore.updateTitle(e.currentTarget.value);
      }}
      multiline
      autoComplete={'off'}
      variant={'standard'}
      placeholder={'Title'}
      InputProps={{
        disableUnderline: true,
        autoComplete: 'off',
        style: {
          fontSize: '48px',
          fontWeight: '700',
          fontStyle: 'normal',
          lineHeight: '116.7%'
        }
      }}
    />
  );
});

const TextFieldWrap = styled(TextField)`
  width: 100%;
`;
