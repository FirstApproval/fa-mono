import React, { type ReactElement } from "react"
import styled from '@emotion/styled';
import {
  AuthorsIcon,
  FilesIcon,
  GrantingOrganisationsIcon,
  MethodIcon,
  DataDescriptionIcon,
  PredictedGoalsIcon,
  RelatedArticlesIcon,
  SampleFilesIcon,
  SoftwareIcon,
  SummaryIcon,
  TagsIcon,
  TitleIcon,
  PreliminaryResultsIcon
} from './SectionIcon';
import { Tooltip, Typography } from '@mui/material';
import { PostAdd } from "@mui/icons-material"

export interface PlaceholderProps {
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
      text={'Summary'}
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
      text={'Background & Aims'}
      icon={<PredictedGoalsIcon />}
    />
  );
};

export const MethodPlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Materials and methods'}
      icon={<MethodIcon />}
    />
  );
};

export const DataDescriptionPlaceholder = (
  props: PlaceholderProps
): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Data description'}
      icon={<DataDescriptionIcon />}
    />
  );
};

export const PreliminaryResultsPlaceholder = (
  props: PlaceholderProps
): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Preliminary Results | optional'}
      icon={<PreliminaryResultsIcon />}
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

export const AcademicSupervisorLetterPlaceholder = (
  props: PlaceholderProps
): ReactElement => {
  return (
    <Tooltip
      placement={'bottom-end'}
      title={
        "Your academic supervisor may be your thesis advisor, " +
        "laboratory head, or another authorized university representative " +
        "who can confirm your right to submit this dataset."
      }
    >
      <div>
        <ContentPlaceholder
          onClick={props.onClick}
          text={"Upload a signed letter from your academic supervisor"}
          icon={
            <PostAdd
              sx={{
                color: "gray",
                height: "32px",
                width: "32px",
                marginLeft: "-3px",
              }}
            />
          }
        />
      </div>
    </Tooltip>
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

export const RelatedPublicationsPlaceholder = (
  props: PlaceholderProps
): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Related publications | optional'}
      icon={<RelatedArticlesIcon />}
    />
  );
};

export const TagsPlaceholder = (props: PlaceholderProps): ReactElement => {
  return (
    <ContentPlaceholder
      onClick={props.onClick}
      text={'Tags | optional'}
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
        <LabelWrap variant={'h6'} component={'div'}>
          {props.text}
        </LabelWrap>
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
  margin-left: -16px;
  margin-right: -16px;
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

const LabelWrap = styled(Typography)`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  margin-left: 8px;
` as typeof Typography;

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
