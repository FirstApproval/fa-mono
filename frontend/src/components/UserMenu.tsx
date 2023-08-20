import * as React from 'react';
import { type ReactElement } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getInitials } from '../util/userUtil';
import { Avatar, CircularProgress, IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { userStore } from '../core/user';
import { authStore } from '../core/auth';
import { routerStore } from '../core/router';
import { Page } from '../core/RouterStore';

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
    return <CircularProgress />;
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
        <Avatar>{getInitials(user.firstName, user.lastName)}</Avatar>
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
