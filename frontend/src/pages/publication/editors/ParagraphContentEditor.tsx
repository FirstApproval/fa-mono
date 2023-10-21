import React, { type ReactElement } from 'react';
import { LabelWrap, SectionWrap } from './styled';
import {
  ParagraphElementWrap,
  ParagraphElementWrapProps
} from './element/ParagraphElementWrap';
import { Grid } from '@mui/material';

export const ParagraphContentEditor = (
  props: ParagraphElementWrapProps & { text?: string }
): ReactElement => {
  return (
    <Grid item sm={12}>
      <SectionWrap>
        {props.text && <LabelWrap>{props.text}</LabelWrap>}
        <ParagraphElementWrap {...props} />
      </SectionWrap>
    </Grid>
  );
};
