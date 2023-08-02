import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { type ReactElement } from 'react';
import { getInitials } from '../util/userUtil';
import { Avatar, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { userStore } from '../core/user';
import { authStore } from '../core/auth';
import styled from '@emotion/styled';

export const UserMenu = observer((): ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const { user } = userStore;

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <div>
      <AvatarWrap
        id="user-button"
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}>
        {getInitials(user.firstName, user.lastName)}
      </AvatarWrap>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'user-button'
        }}>
        <MenuItem
          onClick={() => {
            handleClose();
          }}>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
          }}>
          My account
        </MenuItem>
        <MenuItem
          onClick={() => {
            authStore.token = undefined;
            handleClose();
          }}>
          Sign out
        </MenuItem>
      </Menu>
    </div>
  );
});

const AvatarWrap = styled(Avatar)`
  &:hover {
    cursor: pointer;
  }
`;
