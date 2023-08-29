import * as React from 'react';
import { type ReactElement } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getInitials } from '../util/userUtil';
import { Avatar, Button, IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { userStore } from '../core/user';
import { authStore } from '../core/auth';
import { routerStore } from '../core/router';
import { Page } from '../core/RouterStore';
import { renderProfileImage } from '../fire-browser/utils';
import styled from '@emotion/styled';

export const UserMenu = observer((): ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const { user } = userStore;

  if (!user) {
    return (
      <ButtonWrap
        variant="outlined"
        onClick={() => {
          routerStore.navigatePage(Page.SIGN_IN);
        }}
        size={'medium'}>
        Sign in
      </ButtonWrap>
    );
  }

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 3 }}
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}>
        <Avatar src={renderProfileImage(user.profileImage)}>
          {getInitials(user.firstName, user.lastName)}
        </Avatar>
      </IconButton>
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
            routerStore.navigatePage(Page.PROFILE, '/profile');
            handleClose();
          }}>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            routerStore.navigatePage(Page.ACCOUNT, '/account');
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

const ButtonWrap = styled(Button)`
  width: 90px;
  height: 36px;
`;
