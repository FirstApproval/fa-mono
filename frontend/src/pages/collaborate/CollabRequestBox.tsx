import React, { type ReactElement, type ReactNode } from 'react';
import styled from '@emotion/styled';
import { Card, CardContent, Typography, Button } from '@mui/material';
import AvatarNameBox from './elements/AvatarNameBox';
import { HeightElement } from '../common.styled';

export enum CollabRequestBoxStatus {
  NEW,
  APPROVED,
  DECLINED
}

function getBorderColor(status: CollabRequestBoxStatus): string {
  switch (status) {
    case CollabRequestBoxStatus.NEW:
      return '#3b4eff';
    default:
      return '#d2d2d6';
  }
}

function getBGColor(status: CollabRequestBoxStatus): string {
  switch (status) {
    case CollabRequestBoxStatus.NEW:
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
// export default BoxyButton;

function getButtonText(status: CollabRequestBoxStatus): string {
  switch (status) {
    case CollabRequestBoxStatus.NEW:
      return 'Answer';
    case CollabRequestBoxStatus.APPROVED:
      return 'Approved';
    case CollabRequestBoxStatus.DECLINED:
      return 'Declined';
  }
}

export const CollabRequestBox = ({
  avatar,
  name,
  status,
  onClick,
  children
}: {
  avatar: string;
  name: string;
  status: CollabRequestBoxStatus;
  onClick: () => void;
  children: ReactNode;
}): ReactElement => {
  return (
    <StyledCard
      borderColor={getBorderColor(status)}
      bgColor={getBGColor(status)}>
      <CardContent sx={{ paddingBottom: '16px !important' }}>
        <AvatarNameBox avatar={avatar} name={name} />
        <HeightElement value={'12px'} />
        <Typography variant="h6">{children}</Typography>
        <HeightElement value={'12px'} />
        {status === CollabRequestBoxStatus.NEW && (
          <BoxyButton onClick={onClick} variant="contained" icon>
            {getButtonText(status)}
          </BoxyButton>
        )}
        {status === CollabRequestBoxStatus.APPROVED && (
          <BoxyButton onClick={onClick} green variant="outlined">
            {getButtonText(status)}
          </BoxyButton>
        )}
        {status === CollabRequestBoxStatus.DECLINED && (
          <BoxyButton onClick={onClick} red variant="outlined">
            {getButtonText(status)}
          </BoxyButton>
        )}
      </CardContent>
    </StyledCard>
  );
};

const StyledCard = styled(Card)<{
  borderColor: string;
  bgColor: string;
}>`
  box-shadow: none;
  border: 1px solid ${(props) => props.borderColor};
  border-radius: 4px;
  background-color: ${(props) => props.bgColor};
  padding: 0;
`;
