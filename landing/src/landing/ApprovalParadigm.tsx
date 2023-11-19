import Grid from '@mui/material/Grid';
import { ReactElement } from 'react';
import styled from '@emotion/styled';
import feedbackOpt from './assets/approval_first/feedback_opt.png';
import immutable_approve from './assets/approval_first/immutable_approve.svg';
import peer_review from './assets/approval_first/peer_review.svg';

export const ApprovalParadigm = (): ReactElement => {
  // const cardsRef = useRef<HTMLDivElement | null>(null);

  return (
    <Grid item xs={12}>
      <CardsWrap>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SubtitleWrap>Approval first</SubtitleWrap>
            <TitleWrap>
              Evolving the
              <br />
              approval paradigm
            </TitleWrap>
          </Grid>
          <Grid item xs={6}>
            <CardWrap>
              <CardTextContainer>
                <img src={peer_review} />
                <CardCaptionWrap>Data review</CardCaptionWrap>
                <CardTitleWrap>Fair peer review</CardTitleWrap>
                <CardTextWrap>
                  We focus on the quality of your data, ensuring that the value
                  of your research is fully recognized, regardless of the
                  outcomes.
                </CardTextWrap>
              </CardTextContainer>
            </CardWrap>
            <CardWrap>
              <CardTextContainer>
                <img src={feedbackOpt} />
                <CardCaptionWrap>Data review</CardCaptionWrap>
                <CardTitleWrap>Fair peer review</CardTitleWrap>
                <CardTextWrap>
                  We focus on the quality of your data, ensuring that the value
                  of your research is fully recognized, regardless of the
                  outcomes.
                </CardTextWrap>
              </CardTextContainer>
            </CardWrap>
            <CardWrap>
              <CardTextContainer>
                <img src={immutable_approve} />
                <CardCaptionWrap>Data review</CardCaptionWrap>
                <CardTitleWrap>Fair peer review</CardTitleWrap>
                <CardTextWrap>
                  We focus on the quality of your data, ensuring that the value
                  of your research is fully recognized, regardless of the
                  outcomes.
                </CardTextWrap>
              </CardTextContainer>
            </CardWrap>
          </Grid>
        </Grid>
      </CardsWrap>
    </Grid>
  );
};

const CardsWrap = styled.div`
  position: relative;
  z-index: 0;

  margin-top: 200px;

  height: 100vh;

  padding-left: 24px;
  padding-right: 24px;

  @media (min-width: 1024px) {
    padding-left: 74px;
    padding-right: 74px;
  }

  @media (min-width: 1280px) {
    padding-left: 92px;
    padding-right: 92px;
  }

  @media (min-width: 1440px) {
    padding-left: 128px;
    padding-right: 128px;
  }

  @media (min-width: 1536px) {
    padding-left: 176px;
    padding-right: 176px;
  }

  @media (min-width: 1980px) {
    padding-left: 368px;
    padding-right: 368px;
  }
`;

const SubtitleWrap = styled.div`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/h5 */
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 32.016px */
`;

const TitleWrap = styled.div`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 72px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 86.4px */
  letter-spacing: -0.5px;
`;

const CardWrap = styled.div`
  display: flex;
  width: 572px;
  padding: 48px 56px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 56px;
  flex-shrink: 0;
  align-self: stretch;

  background: var(--text-primary, #040036);

  height: 100%;
`;

const CardCaptionWrap = styled.div`
  align-self: stretch;

  color: var(--primary-contrast, #fff);
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 26.68px */

  opacity: 0.4;
`;

const CardTitleWrap = styled.div`
  align-self: stretch;

  color: var(--primary-contrast, #fff);
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 48px; /* 141.176% */
  letter-spacing: 0.25px;
`;

const CardTextWrap = styled.div`
  align-self: stretch;

  color: var(--primary-contrast, #fff);
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;

const CardTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  align-self: stretch;
`;
