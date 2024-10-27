import { CSSProperties } from 'react';
import styled from '@emotion/styled';
import { Avatar } from '@mui/material';
import { userStore } from '../../../core/user';
import { observer } from 'mobx-react-lite';
import { getInitials, renderProfileImage } from '../../../util/userUtil';

const AvatarNameBox = ({
  avatar,
  name,
  style
}: {
  name: string;
  avatar?: string;
  style?: CSSProperties;
}): React.ReactElement => {
  return (
    <AvatarContainer style={style}>
      <StyledAvatar>{avatar}</StyledAvatar>
      <div>{name}</div>
    </AvatarContainer>
  );
};

export const SelfAvatar: React.FC = observer(() => {
  const { user } = userStore;
  return (
    <SelfAvatarContainer>
      <StyledAvatar
        // sx={{ marginTop: '5px' }}
        src={renderProfileImage(user?.profileImage)}>
        {getInitials(user?.firstName, user?.lastName)}
      </StyledAvatar>
    </SelfAvatarContainer>
  );
});

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f3f2f5;
  width: fit-content;
  padding: 0 8px 0 0;
  border-radius: 16px;
`;

const SelfAvatarContainer = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: 16px;
`;

const StyledAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  margin-right: 8px;

  &.MuiAvatar-root {
    font-size: 20px;
  }
`;

export default AvatarNameBox;
