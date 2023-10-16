import React from 'react';
import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { type EditorProps } from './types';

export const TitleEditor = observer((props: EditorProps) => {
  const { publicationStore } = props;

  if (props.publicationStore.isReadonly) {
    return <ContentWrap>{publicationStore.title}</ContentWrap>;
  }

  return (
    <TextFieldWrap
      autoFocus={publicationStore.title.length === 0}
      value={publicationStore.title}
      onChange={(e) => {
        publicationStore.updateTitle(e.currentTarget.value);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
          event.preventDefault();
        }
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
  word-break: break-word;
`;

const ContentWrap = styled.div`
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 116.7%;
  margin-bottom: 24px;
`;
