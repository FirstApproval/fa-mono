import styled from '@emotion/styled';
import { type ReactElement } from 'react';
import group_6 from './assets/group_6.svg';
import group_7 from './assets/group_7.svg';
import { Button } from '@mui/material';

export const CallToAction = (): ReactElement => {
  return (
    <Wrap>
      <CallToActionWrap>
        <LeftImgWrap>
          <img src={group_6} />
        </LeftImgWrap>
        <FlexWrap>
          <Heading>Unleash your data&apos;s potential</Heading>
          <Text>
            Share your datasets and let them fuel new scientific breakthroughs
          </Text>
          <Button variant="contained">Start publishing for free</Button>
        </FlexWrap>
        <FlexLeftWrap>
          <img src={group_7} />
        </FlexLeftWrap>
      </CallToActionWrap>
    </Wrap>
  );
};

const LeftImgWrap = styled.div``;

export const Wrap = styled('div')`
  width: 80%;
  margin-left: auto;
  margin-right: auto;

  background: var(--primary-states-hover, rgba(59, 78, 255, 0.04));

  margin-bottom: 80px;
`;

export const CallToActionWrap = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FlexLeftWrap = styled('div')``;

export const Text = styled('div')`
  margin-bottom: 16px;
`;

export const Heading = styled('div')`
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%;

  margin-bottom: 12px;
`;

export const FlexWrap = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;
