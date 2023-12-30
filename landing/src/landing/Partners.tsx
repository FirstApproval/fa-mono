import styled from '@emotion/styled';
import { ReactElement } from 'react';
import { keyframes } from '@emotion/react';
import { ReactComponent as BostonMatrix } from './assets/bostonMatrix.svg';
import { ReactComponent as OpenGenes } from './assets/openGenes.svg';
import { ReactComponent as OpenLongevity } from './assets/openLongevity.svg';

export const Partners = (): ReactElement => {
  return (
    <MainWrap>
      <JoinBetaWrap>
        <MovingText>
          <TextBlock>
            <div style={{ color: '#04003661' }}>PARTNERED WITH</div>
            <OpenLongevity />
            <BostonMatrix />
            <OpenGenes />
          </TextBlock>
          <div style={{ width: 80 }}></div>
          <TextBlock>
            <div style={{ color: '#04003661' }}>PARTNERED WITH</div>
            <OpenLongevity />
            <BostonMatrix />
            <OpenGenes />
          </TextBlock>
        </MovingText>
      </JoinBetaWrap>
    </MainWrap>
  );
};

const moveText = keyframes`
    0% {
        transform: translateX(0%);
    }
    100% {
        transform: translateX(-50%);
    }
`;

const MovingText = styled.div`
  display: inline-flex;
  white-space: nowrap;
  animation: ${moveText} 45s linear infinite;

  @media (max-width: 500px) {
    animation: ${moveText} 20s linear infinite;
  }
`;

const TextBlock = styled.span`
  display: flex;
  align-items: center;
  gap: 80px;

  width: calc(50% - 40px);

  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 26.68px */

  @media (max-width: 500px) {
  }
`;

const MainWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 220px;

  @media (max-width: 500px) {
    margin-bottom: 120px;
  }
`;

const JoinBetaWrap = styled.div`
  width: 1184px;
  overflow: hidden;
  position: relative;

  mask-image: linear-gradient(
    to right,
    transparent,
    black 20%,
    black 90%,
    transparent
  );

  @media (max-width: 500px) {
    width: 100%;
  }
`;
