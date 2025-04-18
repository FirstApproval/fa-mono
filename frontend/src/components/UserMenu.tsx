import * as React from 'react';
import { type ReactElement } from 'react';
import Menu from '@mui/material/Menu';
import { getInitials, renderProfileImage } from '../util/userUtil';
import { Avatar, Button, IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { userStore } from '../core/user';
import { authStore } from '../core/auth';
import { routerStore } from '../core/router';
import styled from '@emotion/styled';
import { Edit, Logout, SettingsOutlined } from '@mui/icons-material';
import { HeightElement, StyledMenuItem } from '../pages/common.styled';
import { Page, signInPath } from '../core/router/constants';
import { UserElement } from './UserElement';

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
          routerStore.navigatePage(Page.SIGN_IN, signInPath);
        }}
        size={'medium'}>
        Log in
      </ButtonWrap>
    );
  }

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 3, padding: 0 }}
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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        MenuListProps={{
          'aria-labelledby': 'user-button'
        }}>
        <StyledMenuItem
          onClick={() => {
            routerStore.navigatePage(Page.PROFILE, '/profile');
            handleClose();
          }}>
          <UserElement author={user} />
        </StyledMenuItem>
        <HeightElement value={'12px'} />
        <StyledMenuItem
          onClick={() => {
            routerStore.navigatePage(Page.PROFILE, '/profile/drafts');
            handleClose();
          }}>
          <Edit
            sx={{ width: 24, height: 24, marginRight: '16px' }}
            htmlColor={'#040036'}
          />
          <span>Drafts</span>
        </StyledMenuItem>
        <HeightElement value={'12px'} />
        <StyledMenuItem
          onClick={() => {
            routerStore.navigatePage(Page.ACCOUNT, '/account');
            handleClose();
          }}>
          <SettingsOutlined
            sx={{ width: 24, height: 24, marginRight: '16px' }}
            htmlColor={'#040036'}
          />
          <span>Settings</span>
        </StyledMenuItem>
        <HeightElement value={'12px'} />
        <StyledMenuItem
          onClick={() => {
            authStore.token = undefined;
            userStore.user = undefined;
            userStore.editableUser = undefined;
            userStore.workplaces = [];
            userStore.workplacesProps = [];
            routerStore.navigatePage(Page.HOME_PAGE, '/', true);
            handleClose();
          }}>
          <Logout
            sx={{ width: 24, height: 24, marginRight: '16px' }}
            htmlColor={'#040036'}
          />
          <span>Sign out</span>
        </StyledMenuItem>
      </Menu>
    </div>
  );
});

const ButtonWrap = styled(Button)`
  width: 90px;
  height: 36px;
`;
