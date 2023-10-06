import styled from '@emotion/styled';
import React, { type ReactElement } from 'react';
import { Button, Typography } from '@mui/material';
import bannerBg from './asset/Main banner.svg';
import { type HomePageStore } from './HomePageStore';
import { userStore } from '../../core/user';
import { FlexWrapColumn } from '../common.styled';

export const CallToAction = (props: { store: HomePageStore }): ReactElement => {
  return (
    <Wrap>
      <CallToActionWrap>
        <FlexWrapColumn>
          <Heading variant={'h4'} component={'div'}>
            Unleash your data&apos;s potential
          </Heading>
          <Text variant={'body'} component={'div'}>
            Share your datasets and let them fuel new scientific breakthroughs
          </Text>
          <ButtonWrap
            variant="contained"
            href={userStore.getCreatePublicationLink()}
            onClick={(e) => {
              e.preventDefault();
              userStore.goToCreatePublication();
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

  width: 100%;
  margin: 0 80px 80px;

  border-radius: 8px;
  background: linear-gradient(90deg, #3b4eff 0%, #3c47e5 36.32%, #030d96 100%);

  color: var(--primary-contrast, #fff);
`;

export const CallToActionWrap = styled('div')`
  display: flex;
  padding: 40px 48px;
`;

export const Text = styled(Typography)`
  max-width: 332px;
  margin-bottom: 40px;
` as typeof Typography;

export const Heading = styled(Typography)`
  margin-bottom: 16px;
` as typeof Typography;

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
