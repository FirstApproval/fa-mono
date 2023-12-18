import Grid from '@mui/material/Grid';
import { ReactElement } from 'react';
import styled from '@emotion/styled';
import { ReactComponent as FeedbackOpt } from './assets/approval_first/feedback_opt_mobile.svg';
import { ReactComponent as Immutable_approve } from './assets/approval_first/immutable_approve_mobile.svg';
import { ReactComponent as Peer_review } from './assets/approval_first/peer_review_mobile.svg';

export const ApprovalParadigmMobile = (): ReactElement => {
  return (
    <Grid item xs={12}>
      <CardsWrap>
        <SubtitleWrap>Approval first</SubtitleWrap>
        <TitleWrap>
          Evolving the
          <br />
          approval paradigm
        </TitleWrap>
        <ImagesWrap>
          <AdaptiveFeedbackOpt />
          <AdaptiveImmutable_approve />
          <AdaptivePeer_review />
        </ImagesWrap>
      </CardsWrap>
    </Grid>
  );
};

const CardsWrap = styled.div`
  width: 100%;
  position: relative;
  z-index: 0;

  margin-bottom: 128px;

  @media (min-width: 500px) {
    display: none;
  }
`;

const SubtitleWrap = styled.div`
  padding: 0 24px;

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

const AdaptiveFeedbackOpt = styled(FeedbackOpt)`
  width: 100%;
`;

const AdaptiveImmutable_approve = styled(Immutable_approve)`
  width: 100%;
`;

const AdaptivePeer_review = styled(Peer_review)`
  width: 100%;
`;

const TitleWrap = styled.div`
  padding: 0 24px;

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
  flex-direction: column;
  gap: 24px;
  align-items: center;
`;
