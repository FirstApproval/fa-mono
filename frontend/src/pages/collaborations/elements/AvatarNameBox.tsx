import { CSSProperties } from 'react';
import styled from '@emotion/styled';
import { Avatar, Link } from "@mui/material"
import { userStore } from '../../../core/user';
import { observer } from 'mobx-react-lite';
import { getInitials, renderProfileImage } from '../../../util/userUtil';
import { profilePath } from 'src/core/router/constants';

const AvatarNameBox = ({
  avatar,
  name,
  username,
  style
}: {
  name: string;
  avatar?: string;
  username?: string;
  style?: CSSProperties;
}): React.ReactElement => {
  return (
    <Link style={{cursor: username ? 'pointer': 'default'}}
          sx={{ color: "black" }}
          target={'_blank'}
          underline={'none'}
          href={username ? `${profilePath}${username}` : undefined}>
      <AvatarContainer style={style}>
        <StyledAvatar>{avatar}</StyledAvatar>
        <div>{name}</div>
      </AvatarContainer>
    </Link>
  );
};

export const SelfAvatar: React.FC = observer(() => {
  const { user } = userStore;
  return (
    <SelfAvatarContainer>
      <StyledAvatar
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
