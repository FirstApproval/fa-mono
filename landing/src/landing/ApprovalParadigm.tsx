import Grid from '@mui/material/Grid';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Paradigm1 from './assets/paradigm1.png';
import Paradigm2 from './assets/paradigm2.png';
import Paradigm3 from './assets/paradigm3.png';

export const ApprovalParadigm = (): ReactElement => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [visibleCard, setVisibleCard] = useState(0);
  const [progress, setProgress] = useState(0);

  const range1 = {
    start: 0.166,
    end: -0.166
  };
  const range2 = {
    start: -0.166,
    end: -0.486
  };
  const range3 = {
    start: -0.486,
    end: -0.801
  };

  const calculateProgress = (position: any, range: any) => {
    // console.log("position: " + position);
    const totalRange = range.end - range.start;
    const progressInRange = (position - range.start) / totalRange;
    // console.log("progressInRange: " + progressInRange);
    const result = Math.min(Math.max(progressInRange * 100, 0), 100);
    // console.log("result: " + result);
    return result; // Ограничиваем значения между 0% и 100%
  };

  useEffect(() => {
    const handler = (): void => {
      if (!scrollRef.current) return;
      const cardsRect = scrollRef.current.getBoundingClientRect();

      const position = cardsRect.top / cardsRect.height;

      let rangeNumber = 0;

      if (position > -0.166) {
        setVisibleCard(0);
        rangeNumber = 0;
      }
      if (position <= -0.166 && position > -0.486) {
        setVisibleCard(1);
        rangeNumber = 1;
      }
      if (position <= -0.486) {
        setVisibleCard(2);
        rangeNumber = 2;
      }

      if (rangeNumber === 0) {
        setProgress(calculateProgress(position, range1));
      } else if (rangeNumber === 1) {
        setProgress(calculateProgress(position, range2));
      } else if (rangeNumber === 2) {
        setProgress(calculateProgress(position, range3));
      }
    };

    window.addEventListener('scroll', handler, { passive: true });

    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <Grid item xs={12}>
      <CardsContainerWrap>
        <CardsWrap>
          <PublishTermsWrap>
            <Grid container spacing={2}>
              <Grid item xs={6} alignSelf={'center'}>
                <SubtitleWrap>Approval first</SubtitleWrap>
                <TitleWrap>
                  Evolving
                  <br />
                  the approval
                  <br />
                  paradigm
                </TitleWrap>
              </Grid>
              <Grid item xs={6}>
                {visibleCard === 0 && (
                  <>
                    <ProgressBarContainer>
                      <ProgressBar
                        width={progress}
                        color={`rgba(4, 0, 54, ${progress / 100})`}
                      />
                    </ProgressBarContainer>
                    <img src={Paradigm1} width={572} height={760} />
                  </>
                )}
                {visibleCard === 1 && (
                  <>
                    <ProgressBarContainer>
                      <ProgressBar
                        width={progress}
                        color={`rgba(4, 0, 54, ${progress / 100})`}
                      />
                    </ProgressBarContainer>
                    <img src={Paradigm2} width={572} height={760} />
                  </>
                )}
                {visibleCard === 2 && (
                  <>
                    <ProgressBarContainer>
                      <ProgressBar
                        width={progress}
                        color={`rgba(4, 0, 54, ${progress / 100})`}
                      />
                    </ProgressBarContainer>
                    <img src={Paradigm3} width={572} height={760} />
                  </>
                )}
              </Grid>
            </Grid>
          </PublishTermsWrap>
          <div ref={scrollRef} style={{ height: '600vh' }} />
        </CardsWrap>
      </CardsContainerWrap>
    </Grid>
  );
};

const CardsContainerWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  @media (max-width: 500px) {
    display: none;
  }
`;

const CardsWrap = styled.div`
  position: relative;
  z-index: 0;
  width: 1184px;
`;

const PublishTermsWrap = styled.div`
  position: sticky;
  top: calc((100vh - 760px) / 2);
  width: 1184px;
  height: 100vh;
`;

const SubtitleWrap = styled.div`
  color: rgba(4, 0, 54, 0.38);
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/h5 */
  font-family: Roboto, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 32.016px */
  margin-bottom: 20px;
`;

const TitleWrap = styled.div`
  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, sans-serif;
  font-size: 72px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 86.4px */
  letter-spacing: -0.5px;
`;

const ProgressBarContainer = styled.div`
  width: 572px;
  background-color: rgba(4, 0, 54, 0.2);
  border-radius: 5px;
  margin-bottom: 4px;
`;

const ProgressBar = styled('div')<{ width: number; color: string }>`
  height: 4px;
  width: ${(props) => props.width}%;
  background-color: ${(props) => props.color};
`;
