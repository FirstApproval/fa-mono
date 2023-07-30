import { observer } from 'mobx-react-lite';
import React, { type ReactElement, useState } from 'react';
import keyboardEnter from '../asset/keyboard_enter.svg';
import styled from '@emotion/styled';
import { Chip, IconButton, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import { ContentEditorWrap, IconButtonWrap, LabelWrap } from './styled';
import { type EditorProps } from './ParagraphEditor';

export const TagsEditor = observer((props: EditorProps): ReactElement => {
  const [newTag, setNewTag] = useState('');
  const [enableAddingNewTag, setEnableAddingNewTag] = useState(
    props.editorStore.tags.size === 0
  );

  return (
    <ContentEditorWrap>
      <LabelWrap>Tags</LabelWrap>
      <div>
        {Array.from(props.editorStore.tags).map((tag, index) => (
          <ChipWrap
            key={index}
            label={tag}
            onDelete={() => {
              props.editorStore.deleteTag(tag);
            }}></ChipWrap>
        ))}
        {!enableAddingNewTag && (
          <a>
            <AddNewTagIconButtonWrap
              onClick={() => {
                setEnableAddingNewTag(true);
              }}>
              <AddIconWrap></AddIconWrap>
              Add tag
            </AddNewTagIconButtonWrap>
          </a>
        )}
      </div>
      {enableAddingNewTag && (
        <TagTextInputWrap>
          <FullWidthTextField
            size={'medium'}
            placeholder={
              'Enter tag, help others discover your work (e.g., “genomics”, “climate change”)'
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault();
                event.stopPropagation();
                props.editorStore.addTag(newTag);
                setNewTag('');
                setEnableAddingNewTag(false);
              }
            }}
            onChange={(e) => {
              setNewTag(e.currentTarget.value);
            }}
            value={newTag}
            variant="outlined"></FullWidthTextField>
          <IconButtonWrap
            onClick={() => {
              if (newTag) {
                props.editorStore.addTag(newTag);
                setNewTag('');
                setEnableAddingNewTag(false);
              }
            }}>
            <img src={keyboardEnter}></img>
          </IconButtonWrap>
        </TagTextInputWrap>
      )}
    </ContentEditorWrap>
  );
});

const ChipWrap = styled(Chip)`
  margin-right: 12px;
  margin-bottom: 12px;
`;

const TagTextInputWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 32px;
`;

const AddNewTagIconButtonWrap = styled(IconButton)`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
  margin-bottom: 12px;
`;

const AddIconWrap = styled(Add)`
  height: 18px;
  width: 18px;
`;
