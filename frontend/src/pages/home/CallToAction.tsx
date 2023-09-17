import styled from '@emotion/styled';
import React, { type ReactElement } from 'react';
import { Button } from '@mui/material';
import { authStore } from '../../core/auth';
import bannerBg from './asset/Main banner.svg';
import { routerStore } from '../../core/router';
import { Page } from '../../core/RouterStore';
import { type HomePageStore } from './HomePageStore';
import { userStore } from '../../core/user';
import { FlexWrapColumn } from '../common.styled';

export const CallToAction = (props: { store: HomePageStore }): ReactElement => {
  return (
    <Wrap>
      <CallToActionWrap>
        <FlexWrapColumn>
          <Heading>Unleash your data&apos;s potential</Heading>
          <Text>
            Share your datasets and let them fuel new scientific breakthroughs
          </Text>
          <ButtonWrap
            variant="contained"
            onClick={() => {
              if (authStore.token) {
                void userStore.createPublication();
              } else {
                routerStore.navigatePage(Page.SIGN_UP);
              }
            }}>
            <ButtonText>Publish for free</ButtonText>
          </ButtonWrap>
        </FlexWrapColumn>
      </CallToActionWrap>
      <img src={bannerBg} />
    </Wrap>
  );
};

export const Wrap = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;

  width: 80%;
  margin-left: auto;
  margin-right: auto;

  border-radius: 8px;
  background: linear-gradient(90deg, #3b4eff 0%, #3c47e5 36.32%, #030d96 100%);

  color: var(--primary-contrast, #fff);

  margin-bottom: 80px;
`;

export const CallToActionWrap = styled('div')`
  display: flex;
  padding: 40px 48px;
`;

export const Text = styled('div')`
  max-width: 332px;
  font-size: 20px;
  font-weight: 400;
  line-height: 32px;
  letter-spacing: 0.15000000596046448px;
  margin-bottom: 40px;
`;

export const Heading = styled('div')`
  font-size: 34px;
  font-weight: 600;
  line-height: 42px;
  letter-spacing: 0.25px;
  margin-bottom: 16px;
`;

export const ButtonText = styled('div')`
  max-width: 332px;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0.46000000834465027px;
  color: var(--primary-main, #3b4eff);
`;

export const ButtonWrap = styled(Button)`
  background-color: var(--primary-white, #ffffff);
  width: 273px;
  height: 40px;
`;
