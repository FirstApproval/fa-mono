import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { Button, Stack } from '@mui/material';
import { routerStore } from '../core/router';
import { Page } from '../core/RouterStore';
import { FlexHeader, FlexHeaderRight, Logo } from '../pages/common.styled';
import logo from '../assets/logo-black.svg';
import { BetaDialogWithButton } from './BetaDialogWithButton';
import { authStore } from '../core/auth';
import { userStore } from '../core/user';
import { UserMenu } from './UserMenu';

interface HeaderComponentProps {
  showPublishButton?: boolean;
  showLoginButton?: boolean;
  showSignUpContainedButton?: boolean;
  showSignUpOutlinedButton?: boolean;
  showLoginOutlinedButton?: boolean;
}

export const HeaderComponent = (
  props: HeaderComponentProps = {
    showPublishButton: false,
    showLoginButton: false,
    showSignUpContainedButton: false,
    showSignUpOutlinedButton: false,
    showLoginOutlinedButton: false
  }
): ReactElement => {
  return (
    <FlexHeader>
      <Logo onClick={routerStore.goHome}>
        <img src={logo} />
      </Logo>
      <BetaDialogWithButton />
      <FlexHeaderRight>
        <Stack direction="row" alignItems="center" spacing={2}>
          {props.showPublishButton && (
            <ButtonWrap
              variant="outlined"
              onClick={() => {
                if (authStore.token) {
                  void userStore.createPublication();
                } else {
                  routerStore.navigatePage(Page.SIGN_UP);
                }
              }}
              size={'medium'}>
              Publish
            </ButtonWrap>
          )}
          {!authStore.token && (
            <>
              {props.showLoginButton && (
                <ButtonWrap
                  variant="outlined"
                  onClick={() => {
                    routerStore.navigatePage(Page.SIGN_IN);
                  }}
                  size={'medium'}>
                  Sign in
                </ButtonWrap>
              )}
              {props.showLoginOutlinedButton && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    routerStore.navigatePage(Page.SIGN_IN);
                  }}>
                  Sign in
                </Button>
              )}
              {props.showSignUpContainedButton && (
                <SignUpButton
                  variant="contained"
                  onClick={() => {
                    routerStore.navigatePage(Page.SIGN_UP);
                  }}
                  size={'medium'}>
                  Sign up
                </SignUpButton>
              )}
              {props.showSignUpOutlinedButton && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    routerStore.navigatePage(Page.SIGN_UP);
                  }}>
                  Sign up
                </Button>
              )}
            </>
          )}
        </Stack>
        {authStore.token && <UserMenu />}
      </FlexHeaderRight>
    </FlexHeader>
  );
};

const ButtonWrap = styled(Button)`
  width: 85px;
  height: 40px;
  border: 0;

  &:hover {
    border: 0;
    background-color: transparent;
  }

  display: flex;
  padding: 8px 11px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--inherit-text-primary-main, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  /* components/button-large */
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.46px;
`;

const SignUpButton = styled(Button)`
  display: flex;
  height: 40px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  color: var(--primary-contrast, #fff);
  font-feature-settings: 'clig' off, 'liga' off;
  /* components/button-large */
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.46px;
`;
