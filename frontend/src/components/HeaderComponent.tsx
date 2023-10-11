import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { Button, Stack } from '@mui/material';
import { routerStore } from '../core/router';
import { FlexHeader, FlexHeaderRight, Logo } from '../pages/common.styled';
import logo from '../assets/logo-black.svg';
import { BetaDialogWithButton } from './BetaDialogWithButton';
import { authStore } from '../core/auth';
import { userStore } from '../core/user';
import { UserMenu } from './UserMenu';
import { Page } from '../core/router/constants';
import { FALinkWrap } from './LinkWrap';

interface HeaderComponentProps {
  showAboutUsButton?: boolean;
  showPublishButton?: boolean;
  showLoginButton?: boolean;
  showSignUpContainedButton?: boolean;
  showSignUpOutlinedButton?: boolean;
  showLoginOutlinedButton?: boolean;
}

export const HeaderComponent = (
  props: HeaderComponentProps = {
    showAboutUsButton: false,
    showPublishButton: false,
    showLoginButton: false,
    showSignUpContainedButton: false,
    showSignUpOutlinedButton: false,
    showLoginOutlinedButton: false
  }
): ReactElement => {
  return (
    <FlexHeader>
      <FALinkWrap link={'/'}>
        <Logo onClick={routerStore.goHome}>
          <img src={logo} />
        </Logo>
      </FALinkWrap>
      <BetaDialogWithButton />
      {props.showAboutUsButton && (
        <ButtonWrap
          href={'https://firstapproval.io/'}
          style={{ marginLeft: '32px' }}
          variant="text"
          size={'large'}>
          About
        </ButtonWrap>
      )}
      <FlexHeaderRight>
        <Stack direction="row" alignItems="center" spacing={2}>
          {props.showPublishButton && (
            <ButtonWrap
              href={userStore.getCreatePublicationLink()}
              onClick={(e) => {
                e.preventDefault();
                userStore.goToCreatePublication();
              }}
              variant="outlined"
              size={'large'}>
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
                  size={'large'}>
                  Log in
                </ButtonWrap>
              )}
              {props.showLoginOutlinedButton && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    routerStore.navigatePage(Page.SIGN_IN);
                  }}>
                  Log in
                </Button>
              )}
              {props.showSignUpContainedButton && (
                <SignUpButton
                  variant="contained"
                  onClick={() => {
                    routerStore.navigatePage(Page.SIGN_UP);
                  }}
                  size={'large'}>
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

const ButtonWrap = styled(Button)<{
  width?: string;
  marginLeft?: string;
}>`
  width: ${(props) => (props.width ? props.width : '85px')};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : '0')};
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
`;

const SignUpButton = styled(Button)`
  display: flex;
  height: 40px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  color: var(--primary-contrast, #fff);
`;
