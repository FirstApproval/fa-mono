import { observer } from 'mobx-react-lite';
import React, { type ReactElement, useState } from 'react';
import keyboardEnter from '../asset/keyboard_enter.svg';
import styled from '@emotion/styled';
import { Button, Chip, IconButton, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import { ContentEditorWrap, LabelWrap } from './styled';

import { type EditorProps } from './types';
import { TagsWrap } from '../ContentPlaceholder';

export const TagsEditor = observer((props: EditorProps): ReactElement => {
  const [newTag, setNewTag] = useState('');
  const [enableAddingNewTag, setEnableAddingNewTag] = useState(
    props.publicationStore.tags.size === 0
  );

  return (
    <TagsWrap>
      <ContentEditorWrap>
        <LabelWrap>Tags</LabelWrap>
        <FlexWrap>
          {Array.from(props.publicationStore.tags).map((tag, index) => (
            <ChipWrap
              key={index}
              label={tag}
              onDelete={
                props.publicationStore.isReadonly
                  ? undefined
                  : () => {
                      props.publicationStore.deleteTag(tag);
                    }
              }></ChipWrap>
          ))}
          {!props.publicationStore.isReadonly && !enableAddingNewTag && (
            <AddNewTagButtonWrap
              size={'small'}
              onClick={() => {
                setEnableAddingNewTag(true);
              }}
              startIcon={<AddIconWrap />}>
              Add tag
            </AddNewTagButtonWrap>
          )}
        </FlexWrap>
        {enableAddingNewTag && !props.publicationStore.isReadonly && (
          <TagTextInputWrap>
            <FullWidthTextField
              size={'medium'}
              placeholder={
                'Enter tag, help others to discover your research (e.g., “genomics”, “climate change”)'
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.keyCode === 13) {
                  event.preventDefault();
                  event.stopPropagation();
                  props.publicationStore.addTag(newTag);
                  setNewTag('');
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
                  props.publicationStore.addTag(newTag);
                  setNewTag('');
                  setEnableAddingNewTag(false);
                }
              }}>
              <img src={keyboardEnter}></img>
            </IconButtonWrap>
          </TagTextInputWrap>
        )}
      </ContentEditorWrap>
    </TagsWrap>
  );
});

const FlexWrap = styled.div`
  display: flex;
  align-items: center;
`;

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
`;

const AddNewTagButtonWrap = styled(Button)`
  color: var(--inherit-text-primary-main, #040036);
  margin-bottom: 12px;
`;

const AddIconWrap = styled(Add)`
  height: 18px;
  width: 18px;
`;

const IconButtonWrap = styled(IconButton)`
  margin-top: -4px;
  margin-right: 24px;
`;
