import React, { type ReactElement, type ReactNode } from 'react';
import styled from '@emotion/styled';
import { Card, CardContent, Typography, Button } from '@mui/material';
import AvatarNameBox from './elements/AvatarNameBox';
import { HeightElement } from '../common.styled';
import { CollaborationRequestStatus } from "../../apis/first-approval-api"

function getBorderColor(status: CollaborationRequestStatus): string {
  switch (status) {
    case CollaborationRequestStatus.NEW:
      return '#3b4eff';
    case CollaborationRequestStatus.DECLINED:
      return '#ff3b3b';
    case CollaborationRequestStatus.APPROVED:
      return '#3bff5c';
    default:
      return '#d2d2d6';
  }
}

function getBGColor(status: CollaborationRequestStatus): string {
  switch (status) {
    case CollaborationRequestStatus.NEW:
      return '#f7f8ff';
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

function getButtonText(status: CollaborationRequestStatus): string {
  switch (status) {
    case CollaborationRequestStatus.NEW:
      return 'Answer';
    case CollaborationRequestStatus.APPROVED:
      return 'Approved';
    case CollaborationRequestStatus.DECLINED:
      return 'Declined';
  }
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
  status: CollaborationRequestStatus;
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

const renderButtonByStatus = (status: CollaborationRequestStatus, onClick: () => void): ReactElement => {
  const children = getButtonText(status);

  let props: {
    variant: 'outlined' | 'contained';
    icon?: boolean;
    green?: boolean;
    red?: boolean;
  };

  switch (status) {
    case CollaborationRequestStatus.NEW:
      props = { variant: 'contained', icon: true };
      break;
    case CollaborationRequestStatus.APPROVED:
      props = { variant: 'outlined', green: true };
      break;
    case CollaborationRequestStatus.DECLINED:
      props = { variant: 'outlined', red: true };
      break;
    default:
      throw Error('Unexpected status')
  }

  return (
    <BoxyButton onClick={onClick} {...props}>
      {children}
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
