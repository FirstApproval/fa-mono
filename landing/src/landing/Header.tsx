import styled from '@emotion/styled';
import { ReactElement } from 'react';
import { ReactComponent as Logo } from './assets/logo.svg';
import { Button } from '@mui/material';

export const Header = (): ReactElement => {
  return (
    <HeaderWrap>
      <LogoWrap href={'https://firstapproval.io/'} target={'_blank'}>
        <AdaptiveLogoWrap />
      </LogoWrap>
      <ButtonWrap href={'https://firstapproval.io/'}>Join Beta</ButtonWrap>
    </HeaderWrap>
  );
};

const HeaderWrap = styled.div`
  position: sticky;
  top: 0;

  padding: 30px 40px 120px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 500px) {
    padding: 16px 8px 64px;
  }
`;

const AdaptiveLogoWrap = styled(Logo)`
  @media (max-width: 500px) {
    width: 160px;
  }
`;

const LogoWrap = styled.a``;

const ButtonWrap = styled(Button)`
  width: 129px;
  height: 44px;

  &:hover {
    background-color: rgba(4, 0, 54, 0.61);
  }

  background-color: #040036;
  color: #ffffff;

  font-family: Roboto, serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 100% */
  letter-spacing: 0.14px;

  display: flex;
  padding: 8px 11px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 500px) {
    font-feature-settings: 'clig' off, 'liga' off;

    /* components/button-large */
    font-family: Roboto, serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px; /* 144.444% */
    letter-spacing: 0.46px;
  }
`;
