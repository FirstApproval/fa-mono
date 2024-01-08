import Grid from '@mui/material/Grid/Grid';
import styled from '@emotion/styled';
import { Main as MainSvg } from './assets/svg-animation/Main';
import { ReactElement } from 'react';

export const Main = (): ReactElement => {
  return (
    <MainContentWrap>
      <MainWrap>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={6}
            order={{
              xs: 2,
              md: 1
            }}>
            <MainLeft>
              <MainTitle>Reimagined scientific data publishing</MainTitle>
              <MainSubtitle>
                First Approval is a modern format of scientific publishing. Easy
                and protected data sharing. Directly benefit and monetize your
                contributions!
              </MainSubtitle>
            </MainLeft>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            order={{
              xs: 1,
              md: 2
            }}>
            <MainSvg />
          </Grid>
        </Grid>
      </MainWrap>
    </MainContentWrap>
  );
};

const MainContentWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 200px;

  @media (max-width: 1300px) {
    margin-bottom: 120px;
  }
`;

const MainWrap = styled.div`
  max-width: 1920px;
  padding: 0 120px;

  @media (max-width: 1300px) {
    padding: 0 16px;
  }
`;

const MainTitle = styled.div`
  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-style: normal;
  font-weight: 700;
  line-height: 121%; /* 116.16px */

  font-size: 51px;

  text-align: center;

  @media (min-width: 400px) {
    font-size: 60px;
    text-align: center;
  }

  @media (min-width: 600px) {
    font-size: 60px;
    text-align: center;
  }

  @media (min-width: 1000px) {
    font-size: 60px;
    text-align: left;
  }

  @media (min-width: 1200px) {
    font-size: 74px;
    text-align: left;
  }

  @media (min-width: 1536px) {
    font-size: 80px;
    text-align: left;
  }
`;

const MainLeft = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 0;

  @media (min-width: 400px) {
    margin-right: 0;
  }

  @media (min-width: 600px) {
    margin-right: 0;
  }

  @media (min-width: 1000px) {
    margin-right: 40px;
  }

  @media (min-width: 1200px) {
    margin-right: 96px;
  }

  @media (min-width: 1536px) {
    margin-right: 96px;
  }
`;

const MainSubtitle = styled.div`
  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-style: normal;
  font-weight: 400;
  line-height: 154%; /* 36.96px */

  margin-top: 40px;

  font-size: 16px;

  text-align: center;

  @media (min-width: 400px) {
    font-size: 18px;
    text-align: center;
  }

  @media (min-width: 600px) {
    font-size: 18px;
    text-align: center;
  }

  @media (min-width: 1000px) {
    font-size: 18px;
    text-align: left;
  }

  @media (min-width: 1200px) {
    font-size: 20px;
    text-align: left;
  }

  @media (min-width: 1536px) {
    font-size: 24px;
    text-align: left;
  }
`;
