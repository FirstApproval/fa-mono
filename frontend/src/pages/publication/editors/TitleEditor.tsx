import { type EditorProps } from './ParagraphEditor';
import React from 'react';
import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';

export const TitleEditor = observer((props: EditorProps) => {
  const { editorStore } = props;

  if (props.isReadonly) {
    return <ContentWrap>{editorStore.title}</ContentWrap>;
  }

  return (
    <TextFieldWrap
      autoFocus={editorStore.title.length === 0}
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
  margin-bottom: 48px;
`;

const ContentWrap = styled.div`
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 116.7%;
  margin-bottom: 48px;
`;
