import styled from '@emotion/styled';
import { type ReactElement } from 'react';
import { Button } from '@mui/material';

export const CallToAction = (): ReactElement => {
  return (
    <Wrap>
      <CallToActionWrap>
        <FlexWrap>
          <Heading>Unleash your data&apos;s potential</Heading>
          <Text>
            Share your datasets and let them fuel new scientific breakthroughs
          </Text>
          <Button variant="contained">Start publishing for free</Button>
        </FlexWrap>
      </CallToActionWrap>
    </Wrap>
  );
};

export const Wrap = styled('div')`
  width: 80%;
  margin-left: auto;
  margin-right: auto;

  border-radius: 8px;
  background: linear-gradient(90deg, #3b4eff 0%, #3c47e5 36.32%, #030d96 100%);

  color: var(--primary-contrast, #fff);

  padding: 40px 48px;

  margin-bottom: 80px;
`;

export const CallToActionWrap = styled('div')`
  display: flex;
`;

export const Text = styled('div')`
  max-width: 332px;

  margin-bottom: 40px;
`;

export const Heading = styled('div')`
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%;

  margin-bottom: 16px;
`;

export const FlexWrap = styled('div')`
  display: flex;
  flex-direction: column;
`;
