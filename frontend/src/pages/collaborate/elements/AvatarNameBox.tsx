import styled from '@emotion/styled';
import { Avatar } from '@mui/material';

const AvatarNameBox = ({
  avatar,
  name
}: {
  avatar: string;
  name: string;
}): React.ReactElement => {
  return (
    <AvatarContainer>
      <StyledAvatar>{avatar}</StyledAvatar>
      <div>{name}</div>
    </AvatarContainer>
  );
};

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f3f2f5;
  width: fit-content;
  padding: 0 8px 0 0;
  border-radius: 16px;
`;

const StyledAvatar = styled(Avatar)`
  width: 24px;
  height: 24px;
  margin-right: 8px;

  &.MuiAvatar-root {
    font-size: 12px;
  }
`;

export default AvatarNameBox;
