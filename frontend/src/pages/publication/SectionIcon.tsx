import predicted_goals from './asset/predicted_goals.svg';
import method from './asset/method.svg';
import object_of_study from './asset/object_of_study.svg';
import software from './asset/software.svg';
import files from './asset/files.svg';
import sample_files from './asset/sample_files.svg';
import authors from './asset/authors.svg';
import granting_organizations from './asset/granting_organizations.svg';
import related_articles from './asset/related_articles.svg';
import tags from './asset/tags.svg';
import { type ReactElement } from 'react';
import { ShortText, Title } from '@mui/icons-material';

export const TitleIcon = (): ReactElement => {
  return <Title fontSize={'small'} />;
};

export const SummaryIcon = (): ReactElement => {
  return <ShortText fontSize={'small'} />;
};

export const PredictedGoalsIcon = (): ReactElement => {
  return <img src={predicted_goals} />;
};

export const MethodIcon = (): ReactElement => {
  return <img src={method} />;
};

export const ObjectOfStudyIcon = (): ReactElement => {
  return <img src={object_of_study} />;
};

export const SoftwareIcon = (): ReactElement => {
  return <img src={software} />;
};

export const FilesIcon = (): ReactElement => {
  return <img src={files} />;
};

export const SampleFilesIcon = (): ReactElement => {
  return <img src={sample_files} />;
};

export const AuthorsIcon = (): ReactElement => {
  return <img src={authors} />;
};

export const GrantingOrganisationsIcon = (): ReactElement => {
  return <img src={granting_organizations} />;
};

export const RelatedArticlesIcon = (): ReactElement => {
  return <img src={related_articles} />;
};

export const TagsIcon = (): ReactElement => {
  return <img src={tags} />;
};
