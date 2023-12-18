import Grid from '@mui/material/Grid/Grid';
import stored from './assets/not_just_stored.mov';
import files from './assets/make_your_files_talk.mov';
import styled from '@emotion/styled';
import React, { ReactElement, useEffect, useState } from 'react';

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
      <TitleWrap>
        <Title>Highly secure and smart file manager</Title>
        <SubTitle>Upload your dataset and enjoy peace of mind</SubTitle>
      </TitleWrap>

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
            <div
              style={{
                height: '100%',
                backgroundColor: '#f3f2f5'
              }}>
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

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
    
    @media (max-width: 500px) {
        text-align: center;
    }
`;

const Title = styled.div`
  width: 720px;
  color: rgba(4, 0, 54, 0.38);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 26.68px */
    
    @media (max-width: 500px) {
        width: 100%;
    }
`;

const SubTitle = styled.div`
  width: 720px;
  margin-top: 20px;
  margin-bottom: 64px;
  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 57.6px */
  letter-spacing: -0.5px;

    @media (max-width: 500px) {
        width: 100%;
        padding-left: 16px;
    }
`;

const VideoMaxWidth = styled.video`
  max-width: 100%;
`;

const VideoWrap = styled.div`
  padding: 48px;
  background: #f3f2f5;
  overflow: hidden;

  @media (max-width: 500px) {
    padding: 24px;
  }
`;

const VideoSubtitle = styled.div`
  color: rgba(4, 0, 54, 0.38);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 26.68px */

  margin-top: 40px;
`;

const VideoTitle = styled.div`
  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 141%; /* 47.94px */
  letter-spacing: 0.25px;

  margin-top: 12px;
`;

const VideoText = styled.div`
  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body */
  font-family: Roboto, serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;

  margin-top: 24px;
`;

const UploadWrap = styled.div`
  padding-left: 16px;

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
