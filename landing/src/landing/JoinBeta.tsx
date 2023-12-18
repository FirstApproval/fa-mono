import styled from '@emotion/styled';
import { ReactElement } from 'react';
import { keyframes } from '@emotion/react';

export const JoinBeta = (): ReactElement => {
  return (
    <JoinBetaLinkWrap href={'https://firstapproval.io/'} target={'_blank'}>
      <JoinBetaWrap>
        <MovingText>
          <TextBlock>Be First · Join Beta ·&nbsp;</TextBlock>
          <TextBlock>Be First · Join Beta ·&nbsp;</TextBlock>
        </MovingText>
      </JoinBetaWrap>
    </JoinBetaLinkWrap>
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
  flex: none;
  width: 50%;
  text-align: center;

  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 180px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 216px */
  letter-spacing: -0.5px;

  @media (max-width: 500px) {
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto, serif;
    font-size: 34px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 40.8px */
    letter-spacing: -0.5px;
  }
`;

const JoinBetaLinkWrap = styled.a`
  text-decoration: none;
`;

const JoinBetaWrap = styled.div`
  margin: 164px 0 208px;
  overflow: hidden;
  position: relative;
  width: 100%; /* Ширина, соответствующая одному блоку текста */

  @media (max-width: 500px) {
    margin: 102px 0;
  }
`;
