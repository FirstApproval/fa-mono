import React, { type ReactElement } from 'react';
import { AcademicIcon, SearchIcon } from "../SectionIcon"
import { ContentPlaceholder, PlaceholderProps } from '../ContentPlaceholder';

export const AcademicLevelPlaceholder = (
  props: PlaceholderProps
): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Academic Level'}
      icon={<AcademicIcon />}
    />
  );
};
