import Grid from '@mui/material/Grid';
import { ReactElement, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Paradigm1 from './assets/paradigm1.png';
import Paradigm2 from './assets/paradigm2.png';
import Paradigm3 from './assets/paradigm3.png';

export const ApprovalParadigm = (): ReactElement => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [visibleCard, setVisibleCard] = useState(0);

  useEffect(() => {
    const handler = (): void => {
      if (!scrollRef.current) return;
      const cardsRect = scrollRef.current.getBoundingClientRect();
      if (cardsRect.top > 0 && cardsRect.top < cardsRect.height) {
        const position = Math.abs(cardsRect.top) / cardsRect.height;
        if (position > 0.0) {
          setVisibleCard(2);
        }
        if (position > 0.3) {
          setVisibleCard(1);
        }
        if (position > 0.6) {
          setVisibleCard(0);
        }
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
                  <img src={Paradigm1} width={572} height={760} />
                )}
                {visibleCard === 1 && (
                  <img src={Paradigm2} width={572} height={760} />
                )}
                {visibleCard === 2 && (
                  <img src={Paradigm3} width={572} height={760} />
                )}
              </Grid>
            </Grid>
          </PublishTermsWrap>
          <div ref={scrollRef} style={{ height: '100vh' }} />
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
