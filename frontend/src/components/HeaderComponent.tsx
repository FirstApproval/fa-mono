import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { Box, Button, Grid, Stack } from '@mui/material';
import { routerStore } from '../core/router';
import { Logo } from '../pages/common.styled';
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
  showContactsButton?: boolean;
  showLoginButton?: boolean;
  showSignUpContainedButton?: boolean;
  showSignUpOutlinedButton?: boolean;
  showLoginOutlinedButton?: boolean;
}

export const HeaderComponent = (
  props: HeaderComponentProps = {
    showAboutUsButton: false,
    showPublishButton: false,
    showContactsButton: false,
    showLoginButton: false,
    showSignUpContainedButton: false,
    showSignUpOutlinedButton: false,
    showLoginOutlinedButton: false
  }
): ReactElement => {
  const showSignUpButton =
    props.showSignUpContainedButton ?? props.showSignUpOutlinedButton;

  return (
    <Wrap>
      <FlexHeader>
        <Grid item xs={12}>
          <FALinkWrap link={'/'}>
            <Logo onClick={routerStore.goHome}>
              <img src={logo} />
            </Logo>
          </FALinkWrap>
        </Grid>
        <BetaDialogWithButton />
        <Box
          component={Grid}
          item
          xs={1}
          display={{
            xs: 'none',
            md: 'block'
          }}>
          {props.showAboutUsButton && (
            <ButtonWrap
              href={'https://about.firstapproval.io/'}
              style={{ marginLeft: '32px' }}
              variant="text"
              size={'large'}>
              About
            </ButtonWrap>
          )}
        </Box>
        <Box
          component={Grid}
          item
          xs={1}
          display={{
            xs: 'none',
            md: 'block'
          }}>
          {props.showContactsButton && (
            <ButtonWrap
              onClick={() => {
                routerStore.navigatePage(Page.CONTACTS_PAGE);
              }}
              variant="text"
              style={{ width: '120px' }}
              size={'large'}>
              Contact us
            </ButtonWrap>
          )}
        </Box>
        <FlexHeaderRight>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              component={Grid}
              item
              xs={1}
              display={{
                xs: 'none',
                md: 'block'
              }}>
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
            </Box>
            {!authStore.token && (
              <>
                {props.showLoginButton && (
                  <Box
                    component={Grid}
                    item
                    xs={1}
                    display={{
                      xs: showSignUpButton ? 'none' : 'block',
                      md: 'block'
                    }}>
                    <ButtonWrap
                      variant="outlined"
                      onClick={() => {
                        routerStore.navigatePage(Page.SIGN_IN);
                      }}
                      size={'large'}>
                      Log in
                    </ButtonWrap>
                  </Box>
                )}
                {props.showLoginOutlinedButton && (
                  <Box
                    component={Grid}
                    item
                    xs={1}
                    display={{
                      xs: showSignUpButton ? 'none' : 'block',
                      md: 'block'
                    }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        routerStore.navigatePage(Page.SIGN_IN);
                      }}>
                      Log in
                    </Button>
                  </Box>
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
    </Wrap>
  );
};

export const Wrap = styled.div`
  display: flex;
  padding: 8px 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid #eeeeee;

  @media (min-width: 768px) {
    padding: 12px 32px;
    margin-bottom: 80px;
  }
`;

export const FlexHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  width: 100%;

  z-index: 10;
`;

export const FlexHeaderRight = styled.div`
  margin-left: auto;
  display: flex;
`;

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
