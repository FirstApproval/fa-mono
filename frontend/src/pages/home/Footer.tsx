import styled from '@emotion/styled';
import React, { type ReactElement, useState } from 'react';
import { YouTube, LinkedIn } from '@mui/icons-material';
import logo from '../../assets/logo.svg';
import xTwitter from '../../assets/x_white.svg';
import { Button, IconButton, Link, Stack } from "@mui/material"
import { BetaDialogWithButton } from '../../components/BetaDialogWithButton';
import { BetaDialog } from '../../components/BetaDialog';
import { routerStore } from '../../core/router';
import { Page } from '../../core/router/constants';

export const Footer = (): ReactElement => {
  const [isBetaDialogOpen, setIsBetaDialogOpen] = useState(false);
  const onClose = (): void => setIsBetaDialogOpen(false);
  return (
    <>
      <BetaDialog isOpen={isBetaDialogOpen} onClose={onClose} />
      <FooterWrap>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          {/* Левая часть */}
          <Stack direction="row" spacing={2} alignItems="center">
            <img src={logo} alt="logo" />
            <BetaDialogWithButton />
          </Stack>

          {/* Правая часть */}
          <Stack direction="row" spacing={2} justifyContent={{ xs: "center", sm: "flex-end" }}>
            <IconButton component={Link} target="_blank" href="https://x.com/firstapproval">
              <img src={xTwitter} />
            </IconButton>
            <IconButton component={Link} target="_blank" href="https://www.linkedin.com/company/first-approval/">
              <LinkedIn sx={{ width: 35, height: 35 }} htmlColor="white" />
            </IconButton>
            <IconButton component={Link} target="_blank" href="https://www.youtube.com/@First_Approval">
              <YouTube sx={{ width: 35, height: 35 }} htmlColor="white" />
            </IconButton>
          </Stack>
        </Stack>

        <FooterButtons>
          <ButtonWrap onClick={() => setIsBetaDialogOpen(true)} size={'medium'}>
            Help
          </ButtonWrap>

          <ButtonLinkWrap href={'/docs/privacy_policy.pdf'} target={'_blank'}>
            <ButtonWrap size={'medium'}>Privacy</ButtonWrap>
          </ButtonLinkWrap>

          <ButtonLinkWrap
            href={'/docs/terms_and_conditions.pdf'}
            target={'_blank'}>
            <ButtonWrap size={'medium'}>Terms</ButtonWrap>
          </ButtonLinkWrap>

          <ButtonLinkWrap
            href={'https://intro.dev.firstapproval.io/'}
            target={'_blank'}>
            <ButtonWrap size={'medium'}>Intro</ButtonWrap>
          </ButtonLinkWrap>

          <ButtonLinkWrap
            href={'https://about.firstapproval.io/'}
            target={'_blank'}>
            <ButtonWrap size={'medium'}>About</ButtonWrap>
          </ButtonLinkWrap>

          <ButtonWrap
            onClick={() =>
              routerStore.navigatePage(Page.CONTACTS_PAGE, '/contacts')
            }
            size={'medium'}>
            Contact us
          </ButtonWrap>
        </FooterButtons>
      </FooterWrap>
    </>
  );
};

const ButtonLinkWrap = styled.a``;

const ButtonWrap = styled(Button)`
  color: #fff;
`;

const FooterWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 104px;

  background: #040036;

  padding-left: 32px;
  padding-right: 32px;

  @media (max-width: 1300px) {
    padding: 32px;
    height: auto;
    flex-direction: column;
  }
`;

const FooterButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1300px) {
    margin-top: 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
