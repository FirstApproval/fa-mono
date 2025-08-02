import React, { type ReactElement, type ReactNode } from 'react';
import styled from '@emotion/styled';
import { Card, CardContent, Typography, Button } from '@mui/material';
import AvatarNameBox from './elements/AvatarNameBox';
import { HeightElement } from '../common.styled';
import { CollaborationAuthorDecisionStatus, CollaborationRequestStatus } from "../../apis/first-approval-api"
import _ from "lodash"

function getBorderColor(status: CollaborationAuthorDecisionStatus): string {
  switch (status) {
    case CollaborationAuthorDecisionStatus.PENDING:
      // return '#3b4eff';
    case CollaborationAuthorDecisionStatus.COLLABORATION_DECLINED:
    case CollaborationAuthorDecisionStatus.MANUSCRIPT_DECLINED:
      // return '#ff3b3b';
    case CollaborationAuthorDecisionStatus.COLLABORATION_APPROVED:
    case CollaborationAuthorDecisionStatus.MANUSCRIPT_APPROVED:
      // return '#3bff5c';
    default:
      return '#d2d2d6';
  }
}

function getBGColor(status: CollaborationAuthorDecisionStatus): string {
  switch (status) {
    case CollaborationAuthorDecisionStatus.PENDING:
      return '#f7f8ff';
    case CollaborationAuthorDecisionStatus.COLLABORATION_APPROVED:
    case CollaborationAuthorDecisionStatus.MANUSCRIPT_APPROVED:
    // return '#79ff8c';
    default:
      return '#fff';
  }
}

const BoxyButton: React.FC<{
  variant: 'outlined' | 'contained';
  green?: boolean;
  red?: boolean;
  icon?: boolean;
  onClick?: () => void;
  children: ReactNode;
}> = ({ onClick, variant, green, red, icon = false, children }) => {
  let sx = {};

  if (green) {
    sx = { color: '#2c7e31', borderColor: '#2c7e31' };
  }
  if (red) {
    sx = { color: '#d3302f', borderColor: '#d3302f' };
  }

  return (
    <Boxy onClick={onClick} sx={sx} variant={variant}>
      <span>{children}</span>
      {icon && <BoxyIcon>{'>'}</BoxyIcon>}
    </Boxy>
  );
};

const Boxy = styled(Button)`
  box-shadow: none;
`;

const BoxyIcon = styled.span`
  margin-left: 8px;
  font-size: 16px;
`;

function getButtonText(status: CollaborationAuthorDecisionStatus): string {
  return _.capitalize(status.toLowerCase().replace('_', ' '))
}

export const CollaborationRequestBox = ({
  avatar,
  name,
  status,
  onClick,
  children
}: {
  avatar: string;
  name: string;
  status: CollaborationAuthorDecisionStatus;
  onClick: () => void;
  children: ReactNode;
}): ReactElement => {
  return (
    <StyledCard
      bordercolor={getBorderColor(status)}
      bgcolor={getBGColor(status)}>
      <CardContent sx={{ paddingBottom: '16px !important' }}>
        <AvatarNameBox avatar={avatar} name={name} />
        <HeightElement value={'12px'} />
        <Typography variant="h6">{children}</Typography>
        <HeightElement value={'12px'} />
        {renderButtonByStatus(status, onClick)}
      </CardContent>
    </StyledCard>
  );
};

const renderButtonByStatus = (status: CollaborationAuthorDecisionStatus, onClick: () => void): ReactElement => {
  let props: {
    variant: 'outlined' | 'contained';
    icon?: boolean;
    green?: boolean;
    red?: boolean;
  };
  let title = ''

  switch (status) {
    case CollaborationAuthorDecisionStatus.PENDING:
      props = { variant: 'contained', icon: true };
      title = 'Answer'
      break;
    case CollaborationAuthorDecisionStatus.COLLABORATION_APPROVED:
    case CollaborationAuthorDecisionStatus.MANUSCRIPT_APPROVED:
      props = { variant: 'outlined', green: true };
      title = 'Approved'
      break;
    case CollaborationAuthorDecisionStatus.COLLABORATION_DECLINED:
    case CollaborationAuthorDecisionStatus.MANUSCRIPT_DECLINED:
      props = { variant: 'outlined', red: true };
      title = 'Declined'
      break;
    default:
      throw Error('Unexpected status')
  }

  return (
    <BoxyButton onClick={onClick} {...props}>
      {title}
    </BoxyButton>
  );
};

const StyledCard = styled(Card)<{
  bordercolor: string;
  bgcolor: string;
}>`
  box-shadow: none;
  border: 1px solid ${(props) => props.bordercolor};
  border-radius: 4px;
  background-color: ${(props) => props.bgcolor};
  padding: 0;
`;
