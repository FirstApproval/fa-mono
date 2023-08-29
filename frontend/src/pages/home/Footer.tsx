import styled from '@emotion/styled';
import React, { type ReactElement } from 'react';
import logo from '../../assets/logo.svg';
import { Button, Stack } from '@mui/material';

export const Footer = (): ReactElement => {
  return (
    <FooterWrap>
      <LogoWrap>
        <img src={logo} />
      </LogoWrap>
      <MarginLeftWrap>
        <LogoWrap>
          <Stack direction="row" spacing={2}>
            <ButtonWrap href={'/docs/privacy_policy.pdf'} size={'medium'}>
              Privacy
            </ButtonWrap>{' '}
            <ButtonWrap href={'/docs/terms_and_conditions.pdf'} size={'medium'}>
              Terms
            </ButtonWrap>
          </Stack>
        </LogoWrap>
      </MarginLeftWrap>
    </FooterWrap>
  );
};

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
