import styled from '@emotion/styled';
import Grid from '@mui/material/Grid';
import { ReactElement } from 'react';
import image from './assets/scientific_proccess.png';

export const DataFirst = (): ReactElement => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Wrap>
            <TextWrap>
              <Subtitle>Bite-sized publications</Subtitle>
              <Title>
                Data-first publishing:
                <br />
                future of research in AI era
              </Title>
            </TextWrap>
            <ImgWrap>
              <Img src={image} />
            </ImgWrap>
          </Wrap>
        </Grid>
      </Grid>
    </Grid>
  );
};

const Wrap = styled.div`
  padding-left: 120px;
  padding-right: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Subtitle = styled.div`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/h5 */
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 32.016px */
`;

const Title = styled.div`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 86.4px */
  letter-spacing: -0.5px;

  margin-top: 20px;

  font-size: 34px;

  @media (min-width: 400px) {
    font-size: 40px;
  }

  @media (min-width: 600px) {
    font-size: 48px;
  }

  @media (min-width: 1000px) {
    font-size: 48px;
  }

  @media (min-width: 1200px) {
    font-size: 64px;
  }

  @media (min-width: 1536px) {
    font-size: 64px;
  }
`;

const Img = styled.img`
  max-height: 664px;
`;

const ImgWrap = styled.div`
  overflow: auto;
  max-width: 100vw;
`;
