import Grid from '@mui/material/Grid';
import { ReactElement } from 'react';
import styled from '@emotion/styled';
import Paradigm1 from './assets/paradigm1_mobile.png';
import Paradigm2 from './assets/paradigm2_mobile.png';
import Paradigm3 from './assets/paradigm3_mobile.png';

export const ApprovalParadigmMobile = (): ReactElement => {
  return (
    <Grid item xs={12}>
      <CardsWrap>
        <SubtitleWrap>Approval first</SubtitleWrap>
        <TitleWrap>
          Evolving the approval
          <br />
          paradigm
        </TitleWrap>
        <ImagesWrap>
          <img src={Paradigm1} width={282} height={443} />
          <img src={Paradigm2} width={282} height={443} />
          <img src={Paradigm3} width={282} height={443} />
        </ImagesWrap>
      </CardsWrap>
    </Grid>
  );
};

const CardsWrap = styled.div`
  width: calc(100% - 16px);
  position: relative;
  z-index: 0;
  padding-left: 16px;

  margin-bottom: 128px;

  @media (min-width: 500px) {
    display: none;
  }
`;

const SubtitleWrap = styled.div`
  color: rgba(4, 0, 54, 0.38);
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/h5 */
  font-family: Roboto, serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 32.016px */

  @media (max-width: 500px) {
    color: rgba(4, 0, 54, 0.38);
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto, serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 154%; /* 24.64px */
  }
`;

const TitleWrap = styled.div`
  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 72px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 86.4px */
  letter-spacing: -0.5px;

  @media (max-width: 500px) {
    margin-top: 16px;
    margin-bottom: 48px;
    color: #040036;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto, serif;
    font-size: 34px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 40.8px */
    letter-spacing: -0.5px;
  }
`;

const ImagesWrap = styled.div`
  margin-top: 24px;
  display: flex;
  overflow-x: scroll;
  gap: 24px;
  align-items: center;
`;
