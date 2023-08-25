import { type ReactElement } from 'react';
import styled from '@emotion/styled';
import predicted_goals from './asset/predicted_goals.svg';
import method from './asset/method.svg';
import object_of_study from './asset/object_of_study.svg';
import software from './asset/software.svg';
import files from './asset/files.svg';
import authors from './asset/authors.svg';
import granting_organizations from './asset/granting_organizations.svg';
import related_articles from './asset/related_articles.svg';
import tags from './asset/tags.svg';

interface PlaceholderProps {
  onClick: () => void;
}

interface ContentPlaceholderProps {
  onClick: () => void;
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
      icon={<img src={predicted_goals} />}
    />
  );
};

export const MethodPlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Method'}
      icon={<img src={method} />}
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
      icon={<img src={object_of_study} />}
    />
  );
};

export const SoftwarePlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Software | optional'}
      icon={<img src={software} />}
    />
  );
};

export const FilesPlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Files'}
      icon={<img src={files} />}
    />
  );
};

export const AuthorsPlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Authors'}
      icon={<img src={authors} />}
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
      icon={<img src={granting_organizations} />}
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
      icon={<img src={related_articles} />}
    />
  );
};

export const TagsPlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Tags'}
      icon={<img src={tags} />}
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
