import Grid from '@mui/material/Grid/Grid';
import stored from './assets/not_just_stored.mov';
import files from './assets/make_your_files_talk.mov';
import styled from '@emotion/styled';
import { ReactElement, useEffect, useState } from 'react';

export const DatasetUpload = (): ReactElement => {
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [videoMaxHeight, setVideoMaxHeight] = useState(0);

  useEffect(() => {
    if (!videoRef) return;
    const resizeObserver = new ResizeObserver((entries) => {
      setVideoMaxHeight(entries[0].contentRect.height);
    });

    resizeObserver.observe(videoRef);

    return () => {
      resizeObserver.disconnect();
    };
  }, [videoRef]);

  return (
    <Grid item xs={12}>
      <UploadWrap>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <VideoWrap>
              <VideoMaxWidth ref={setVideoRef} muted autoPlay loop playsInline>
                <source src={stored} />
              </VideoMaxWidth>
              <VideoSubtitle>Encrypted storage</VideoSubtitle>
              <VideoTitle>Not just stored, it's shielded</VideoTitle>
              <VideoText>
                We use decentralized storage what ensures your research is
                impervious to theft.
              </VideoText>
            </VideoWrap>
          </Grid>
          <Grid item xs={12} md={6}>
            <div style={{ height: '100%', backgroundColor: '#f3f2f5' }}>
              <VideoWrap>
                <video
                  muted
                  autoPlay
                  loop
                  playsInline
                  style={{ maxHeight: `${videoMaxHeight}px` }}>
                  <source src={files} />
                </video>
                <VideoSubtitle>Files annotations</VideoSubtitle>
                <VideoTitle>Make your files talk</VideoTitle>
                <VideoText>
                  Add notes to your files, ensuring every piece of your research
                  speaks clearly to others.
                </VideoText>
              </VideoWrap>
            </div>
          </Grid>
        </Grid>
      </UploadWrap>
    </Grid>
  );
};

const VideoMaxWidth = styled.video`
  max-width: 100%;
`;

const VideoWrap = styled.div`
  padding: 48px;
  background: var(--grey-100, #f3f2f5);
  overflow: hidden;
`;

const VideoSubtitle = styled.div`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 26.68px */

  margin-top: 40px;
`;

const VideoTitle = styled.div`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 141%; /* 47.94px */
  letter-spacing: 0.25px;

  margin-top: 12px;
`;

const VideoText = styled.div`
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

const UploadWrap = styled.div`
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
