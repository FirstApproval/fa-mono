import React, { type ReactElement } from 'react';
import { SearchIcon } from '../SectionIcon';
import { ContentPlaceholder, PlaceholderProps } from '../ContentPlaceholder';

export const ResearchAreaPlaceholder = (
  props: PlaceholderProps
): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Research area'}
      icon={<SearchIcon />}
    />
  );
};
