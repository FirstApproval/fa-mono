import Grid from '@mui/material/Grid/Grid';
import Ticker from 'react-ticker';
import styled from '@emotion/styled';
import { Main as MainSvg } from './assets/svg-animation/Main';
import { ReactComponent as PartneredWith } from './assets/partners/partnered_with.svg';
import { ReactComponent as BostonMatrix } from './assets/partners/boston_matrix.svg';
import { ReactComponent as OpenGenes } from './assets/partners/open_genes.svg';
import { ReactComponent as OpenLongevity } from './assets/partners/open_longevity.svg';
import { ReactElement } from 'react';

export const Main = (): ReactElement => {
  return (
    <Grid item xs={12}>
      <MainWrapper>
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
          <Grid
            item
            xs={12}
            display={'flex'}
            justifyContent={'center'}
            order={{ xs: 3 }}>
            <TickerWrap>
              <Ticker height={34}>
                {({ index }) => {
                  const idx = index % 4;
                  return (
                    <>
                      {idx === 0 && (
                        <PartnerWrap>
                          <PartneredWith />
                        </PartnerWrap>
                      )}
                      {idx === 1 && (
                        <PartnerWrap>
                          <BostonMatrix />
                        </PartnerWrap>
                      )}
                      {idx === 2 && (
                        <PartnerWrap>
                          <OpenGenes />
                        </PartnerWrap>
                      )}
                      {idx === 3 && (
                        <PartnerWrap>
                          <OpenLongevity />
                        </PartnerWrap>
                      )}
                    </>
                  );
                }}
              </Ticker>
            </TickerWrap>
          </Grid>
        </Grid>
      </MainWrapper>
    </Grid>
  );
};

const TickerWrap = styled.div`
  position: relative;

  margin-top: 80px;

  width: 80%;
`;

const MainWrapper = styled.div`
  padding-left: 16px;
  padding-right: 16px;

  margin-bottom: 104px;

  @media (max-width: 500px) {
    margin-bottom: 64px;
  }

  @media (min-width: 400px) {
    padding-left: 20px;
    padding-right: 20px;
  }

  @media (min-width: 600px) {
    padding-left: 120px;
    padding-right: 120px;
  }

  @media (min-width: 1000px) {
    padding-left: 40px;
    padding-right: 40px;
  }

  @media (min-width: 1200px) {
    padding-left: 40px;
    padding-right: 40px;
  }

  @media (min-width: 1536px) {
    padding-left: 64px;
    padding-right: 64px;
  }

  @media (min-width: 1980px) {
    padding-left: 120px;
    padding-right: 120px;
  }
`;

const MainTitle = styled.div`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
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
  margin-right: 0px;

  @media (min-width: 400px) {
    margin-right: 0px;
  }

  @media (min-width: 600px) {
    margin-right: 0px;
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
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
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

const PartnerWrap = styled.div`
  margin-left: 80px;
`;
