import { ReactElement, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid/Grid';
import { Citations } from './assets/svg-animation/Citations';
import { Rocket } from './assets/svg-animation/Rocket';
import { OpenAccess } from './assets/svg-animation/OpenAccess';
import { Request } from './assets/svg-animation/Request';
import { Clock } from './assets/svg-animation/Clock';
import { Benefits } from './assets/svg-animation/Benefits';
import styled from '@emotion/styled';
import { UploadWrap } from './styled';

export const Terms = (): ReactElement => {
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const publishTermsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.addEventListener('scroll', (e) => {
      if (!cardsRef.current) return;
      if (!publishTermsRef.current) return;
      const scrollY = window.scrollY;
      const cardsRect = cardsRef.current.getBoundingClientRect();
      const publishTermsRect = publishTermsRef.current.getBoundingClientRect();
      const elementHeight = publishTermsRect.height;
      const top = cardsRect.top + scrollY;
      const diff = scrollY - top;
      const opacity = Math.max(1 - diff / (elementHeight / 2), 0.2);
      if (diff > 0) {
        publishTermsRef.current.style.opacity = String(opacity);
      }
    });
  }, []);

  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CardsWrap ref={cardsRef}>
            <PublishTermsWrap ref={publishTermsRef}>
              Publish on your terms
            </PublishTermsWrap>
            <CardWrap>
              <IconWrap>
                <Citations />
              </IconWrap>
              <CardSubtitle>Open access with FA</CardSubtitle>
              <CardTitle>Elevate your citation index</CardTitle>
              <CardText>
                With open-access mode and a focus on bite-sized experiments,
                your research gets the attention and citations it deserves.
              </CardText>
            </CardWrap>
            <CardWrap style={{ marginLeft: 'auto' }}>
              <IconWrap>
                <Rocket />
              </IconWrap>
              <CardSubtitle>Co-authorship agreement</CardSubtitle>
              <CardTitle>Boost your publishing activity</CardTitle>
              <CardText>
                Before download, users formally commit to crediting you as a
                co-author when basing their research on your dataset. Put
                collaboration on stream.
              </CardText>
            </CardWrap>
            <CardWrap>
              <IconWrap>
                <OpenAccess />
              </IconWrap>
              <CardSubtitle>Option</CardSubtitle>
              <CardTitle>Open access</CardTitle>
              <CardText>
                Freely accessible to our community. Share your dataset openly
                with all registered users.
              </CardText>
            </CardWrap>
            <CardWrap style={{ marginLeft: 'auto' }}>
              <IconWrap>
                <Request />
              </IconWrap>
              <CardSubtitle>Option</CardSubtitle>
              <CardTitle>On request</CardTitle>
              <CardText>
                Share with discretion. Handpick the researchers who gain access,
                ensuring it's in the right hands.
              </CardText>
            </CardWrap>
            <CardWrap>
              <IconWrap>
                <Clock />
              </IconWrap>
              <CardSubtitle>Monetization</CardSubtitle>
              <CardTitle>Set the price for early access</CardTitle>
              <CardText>
                Start with monetizing your data with exclusive early access,
                then, on your terms, transition to sharing it openly for the
                wider scientific good.
              </CardText>
            </CardWrap>
            <CardWrap style={{ marginLeft: 'auto' }}>
              <IconWrap>
                <Benefits />
              </IconWrap>
              <CardSubtitle>Other benefits</CardSubtitle>
              <CardTitle>Get rewards for activity</CardTitle>
              <CardText>
                Get tokens for your quality data and community interaction,
                turning your insights and activity into measurable gains.
              </CardText>
            </CardWrap>
          </CardsWrap>
        </Grid>
      </Grid>
    </Grid>
  );
};

const IconWrap = styled.div`
  height: 64px;
  width: 64px;
`;

const CardWrap = styled.div`
  background: var(--action-hover, rgba(4, 0, 54, 0.05));
  backdrop-filter: blur(12px);
  padding: 48px;
  max-width: 400px;

  position: relative;
  z-index: 10;

  margin-top: 40px;
`;

const CardSubtitle = styled.div`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 26.68px */

  margin-top: 32px;
`;

const CardTitle = styled.div`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 48px; /* 141.176% */
  letter-spacing: 0.25px;

  margin-top: 12px;
`;

const CardText = styled.div`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;

  margin-top: 24px;
`;

const PublishTermsWrap = styled.div`
  color: var(--text-primary, #040036);
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 64px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 76.8px */
  letter-spacing: -0.5px;

  position: sticky;
  top: 50%;
  left: 50%;
  height: 100vh;
`;

const CardsWrap = styled(UploadWrap)`
  position: relative;
  z-index: 0;

  margin-top: 200px;
`;
