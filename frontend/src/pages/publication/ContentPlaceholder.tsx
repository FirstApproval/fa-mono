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
  SampleFilesIcon,
  SoftwareIcon,
  SummaryIcon,
  TagsIcon,
  TitleIcon
} from './SectionIcon';

interface PlaceholderProps {
  onClick?: () => void;
}

interface ContentPlaceholderProps {
  onClick?: () => void;
  text: string;
  description?: string;
  icon: ReactElement;
}

export const TitlePlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Title'}
      icon={<TitleIcon />}
    />
  );
};

export const SummaryPlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Publication summary'}
      icon={<SummaryIcon />}
    />
  );
};

export const ExperimentGoalsPlaceholder = (
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

export const SampleFilesPlaceholder = (
  props: PlaceholderProps
): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Sample Files | optional'}
      description={
        'Give others a "sneak peek" into your files without committing to a full download - provide a sample/preview file(s)'
      }
      icon={<SampleFilesIcon />}
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
      <FlexWrap>{props.icon}</FlexWrap>
      <TextWrap>
        <LabelWrap>{props.text}</LabelWrap>
        {props.description && (
          <DescriptionWrap>{props.description}</DescriptionWrap>
        )}
      </TextWrap>
    </ContentPlaceholderWrap>
  );
};

export const TagsWrap = styled.div``;

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

const DescriptionWrap = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  margin-left: 8px;
`;

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 4px;
`;
