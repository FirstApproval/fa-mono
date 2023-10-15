import styled from '@emotion/styled';
import { TextField, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { LabelWrap } from './styled';
import { ParagraphElementWrap } from './element/ParagraphElementWrap';

export const ObjectOfStudyEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <>
        <LabelWrap>Data description</LabelWrap>
        {!props.publicationStore.isReadonly && (
          <FullWidthTextField
            autoFocus
            value={props.publicationStore.objectOfStudyTitle}
            onChange={(event) => {
              props.publicationStore.updateObjectOfStudyTitle(
                event.currentTarget.value
              );
            }}
            placeholder={'Data description'}
          />
        )}
        {props.publicationStore.isReadonly && (
          <ReadonlyContentPlaceholderWrap variant={'h6'} component={'div'}>
            {props.publicationStore.objectOfStudyTitle}
          </ReadonlyContentPlaceholderWrap>
        )}
        <ParagraphElementWrap
          isReadonly={props.publicationStore.isReadonly}
          value={props.publicationStore.objectOfStudy}
          onChange={(idx, value) => {
            props.publicationStore.updateObjectOfStudyParagraph(idx, value);
          }}
          onAddParagraph={(idx) => {
            props.publicationStore.addObjectOfStudyParagraph(idx);
          }}
          onMergeParagraph={(idx) => {
            props.publicationStore.mergeObjectOfStudyParagraph(idx);
          }}
          onSplitParagraph={(idx, splitIndex) => {
            props.publicationStore.splitObjectOfStudyParagraph(idx, splitIndex);
          }}
          placeholder={
            'Describe the data’s contents, structure and preliminary findings...'
          }
          disableInitFocus
        />
      </>
    );
  }
);
const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 32px;
`;

const ReadonlyContentPlaceholderWrap = styled(Typography)`
  display: inline-flex;
  padding: 8px 16px;
  align-items: center;

  border-radius: 4px;
  background: var(--grey-50, #f8f7fa);

  width: 100%;

  margin-bottom: 32px;
` as typeof Typography;
