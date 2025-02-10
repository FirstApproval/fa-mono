import predicted_goals from './asset/predicted_goals.svg';
import method from './asset/method.svg';
import academic from './asset/academic.svg';
import data_description from './asset/data_description.svg';
import preliminary_results from './asset/preliminary_results.svg';
import software from './asset/software.svg';
import summary from './asset/summary.svg';
import research_area from './asset/research_area.svg';
import files from './asset/files.svg';
import sample_files from './asset/sample_files.svg';
import authors from './asset/authors.svg';
import granting_organizations from './asset/granting_organizations.svg';
import related_articles from './asset/related_articles.svg';
import tags from './asset/tags.svg';
import { type ReactElement } from 'react';
import { Title } from '@mui/icons-material';

export const TitleIcon = (): ReactElement => {
  return <Title fontSize={'small'} />;
};

export const AcademicIcon = (): ReactElement => {
  return <img src={academic} />;
};

export const SearchIcon = (): ReactElement => {
  return <img src={research_area} />;
};

export const SummaryIcon = (): ReactElement => {
  return <img src={summary} />;
};

export const PredictedGoalsIcon = (): ReactElement => {
  return <img src={predicted_goals} />;
};

export const MethodIcon = (): ReactElement => {
  return <img src={method} />;
};

export const DataDescriptionIcon = (): ReactElement => {
  return <img src={data_description} />;
};

export const PreliminaryResultsIcon = (): ReactElement => {
  return <img src={preliminary_results} />;
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
