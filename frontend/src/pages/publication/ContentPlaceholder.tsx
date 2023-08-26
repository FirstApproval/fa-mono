import { type ReactElement } from 'react';
import styled from '@emotion/styled';
import {
  AuthorsIcon,
  FilesIcon,
  GrantingOrganisationsIcon,
  MethodIcon,
  ObjectOfStudyIcon,
  PredictedGoalsIcon,
  RelatedArticlesIcon,
  SoftwareIcon,
  TagsIcon
} from './SectionIcon';

interface PlaceholderProps {
  isReadonly?: boolean;
  onClick?: () => void;
}

interface ContentPlaceholderProps {
  isReadonly?: boolean;
  onClick?: () => void;
  text: string;
  icon: ReactElement;
}

export const PredictedGoalsPlaceholder = (
  props: PlaceholderProps
): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Experiment goals'}
      icon={<PredictedGoalsIcon />}
    />
  );
};

export const MethodPlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Method'}
      icon={<MethodIcon />}
    />
  );
};

export const ObjectOfStudyPlaceholder = (
  props: PlaceholderProps
): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Object of study'}
      icon={<ObjectOfStudyIcon />}
    />
  );
};

export const SoftwarePlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Software | optional'}
      icon={<SoftwareIcon />}
    />
  );
};

export const FilesPlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Files'}
      icon={<FilesIcon />}
    />
  );
};

export const AuthorsPlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Authors'}
      icon={<AuthorsIcon />}
    />
  );
};

export const GrantingOrganisationsPlaceholder = (
  props: PlaceholderProps
): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Granting organizations | optional'}
      icon={<GrantingOrganisationsIcon />}
    />
  );
};

export const RelatedArticlesPlaceholder = (
  props: PlaceholderProps
): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Related articles | optional'}
      icon={<RelatedArticlesIcon />}
    />
  );
};

export const TagsPlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Tags'}
      icon={<TagsIcon />}
    />
  );
};

export const ContentPlaceholder = (
  props: ContentPlaceholderProps
): ReactElement => {
  return (
    <ContentPlaceholderWrap tabIndex={0} onClick={props.onClick}>
      <FlexWrap>{props.icon} </FlexWrap>
      <LabelWrap>{props.text}</LabelWrap>
    </ContentPlaceholderWrap>
  );
};

const FlexWrap = styled.div`
  display: flex;
  mix-blend-mode: luminosity;
`;

const ContentPlaceholderWrap = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 8px;
  &:hover {
    border-radius: 4px;
    background: var(--action-hover, rgba(4, 0, 54, 0.05));
    cursor: pointer;
  }
  &:focus {
    border-radius: 4px;
    background: var(--action-hover, rgba(4, 0, 54, 0.05));
  }
`;

const LabelWrap = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  margin-left: 8px;
`;
