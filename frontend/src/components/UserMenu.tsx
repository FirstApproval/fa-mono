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
import { AuthorElement } from '../pages/publication/editors/element/AuthorElement';
import { Edit, Logout, SettingsOutlined } from '@mui/icons-material';
import { HeightElement } from '../pages/common.styled';

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
        <StyledMenuItem
          onClick={() => {
            routerStore.navigatePage(Page.PROFILE, '/profile');
            handleClose();
          }}>
          <AuthorElement
            author={{ user }}
            isReadonly={true}
            isConfirmed={true}
          />
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

const StyledMenuItem = styled(MenuItem)`
  &:hover {
    background-color: transparent;
  }
`;
