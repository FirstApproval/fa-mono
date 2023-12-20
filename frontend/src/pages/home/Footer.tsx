import styled from '@emotion/styled';
import React, { type ReactElement, useState } from 'react';
import logo from '../../assets/logo.svg';
import { Button, Stack } from '@mui/material';
import { BetaDialogWithButton } from '../../components/BetaDialogWithButton';
import { BetaDialog } from '../../components/BetaDialog';
import { routerStore } from '../../core/router';
import { Page } from '../../core/router/constants';

export const Footer = (): ReactElement => {
  const [isBetaDialogOpen, setIsBetaDialogOpen] = useState(false);
  const onClose = (): void => setIsBetaDialogOpen(false);
  return (
    <>
      <FooterWrap>
        <LogoWrap>
          <img src={logo} />
        </LogoWrap>
        <BetaDialogWithButton />
        <MarginLeftWrap>
          <LogoWrap>
            <Stack direction="row" spacing={2}>
              <ButtonWrap
                onClick={() => setIsBetaDialogOpen(true)}
                size={'medium'}>
                Help
              </ButtonWrap>
              <ButtonLinkWrap
                href={'/docs/privacy_policy.pdf'}
                target={'_blank'}>
                <ButtonWrap size={'medium'}>Privacy</ButtonWrap>
              </ButtonLinkWrap>
              <ButtonLinkWrap
                href={'/docs/terms_and_conditions.pdf'}
                target={'_blank'}>
                <ButtonWrap size={'medium'}>Terms</ButtonWrap>
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
            </Stack>
          </LogoWrap>
        </MarginLeftWrap>
      </FooterWrap>
      <BetaDialog isOpen={isBetaDialogOpen} onClose={onClose} />
    </>
  );
};

const ButtonLinkWrap = styled.a``;

const ButtonWrap = styled(Button)`
  color: var(--inherit-white-main, #fff);
`;

const FooterWrap = styled.div`
  display: flex;
  align-items: center;
  height: 104px;

  background: var(--text-primary, #040036);

  padding-left: 32px;
  padding-right: 32px;
`;

const MarginLeftWrap = styled.div`
  margin-left: auto;
`;

const LogoWrap = styled.div`
  color: var(--inherit-white-main, #fff);

  display: flex;
`;
