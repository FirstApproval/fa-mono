import styled from '@emotion/styled';
import React, { ReactElement, useState } from 'react';
import ReactPlayer from 'react-player';
import { ReactComponent as PdfExample } from './assets/pdf_example.svg';

export const Editor = (): ReactElement => {
  const [ready, setReady] = useState(false);
  const videoUrl =
    'https://firstapproval.s3.amazonaws.com/Highly+secure+and+smart+file+manager.mp4';

  const handleReady = () => {
    setReady(true);
  };

  return (
    <EditorWrap>
      <Title>Well-structured publication editor</Title>
      <SubTitle>A new, easy & fast way to describe your experiment</SubTitle>
      {!ready && (
        <img
          src={'https://firstapproval.s3.amazonaws.com/download-min.png'}
          width={'1000px'}
          height={'630px'}
        />
      )}
      <ReactPlayer
        className="video-editor"
        url={videoUrl}
        playing={true}
        muted={true}
        loop={true}
        onReady={handleReady}
        style={{ display: ready ? 'block' : 'none' }}
      />
      <PdfExampleWrap>
        <PdfExampleLogoContainerWrap>
          <PdfExampleLogoWrap />
        </PdfExampleLogoContainerWrap>
        <PdfExampleText>
          With instant final PDF.{' '}
          <PdfExampleText2>
            Gain confidence in your content. Whether it's before or immediately
            after hitting publish, view your article in PDF.
          </PdfExampleText2>
        </PdfExampleText>
      </PdfExampleWrap>
    </EditorWrap>
  );
};

const EditorWrap = styled.div`
  margin: 80px 0 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
    width: 300px;

    color: rgba(4, 0, 54, 0.38);
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto, serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 154%; /* 24.64px */
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
    width: 300px;

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

const PdfExampleLogoContainerWrap = styled.div`
  @media (max-width: 500px) {
    width: 45px;
  }
`;

const PdfExampleLogoWrap = styled(PdfExample)`
  @media (max-width: 500px) {
    width: 45px;
  }
`;

const PdfExampleWrap = styled.div`
  margin-top: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;

  @media (max-width: 500px) {
    width: 300px;
    align-items: start;
  }
`;

const PdfExampleText = styled.div`
  width: 752px;
  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h5 */
  font-family: Roboto, serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 32.016px */

  @media (max-width: 500px) {
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto, serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 154%; /* 24.64px */
  }
`;

const PdfExampleText2 = styled.span`
  color: rgba(4, 0, 54, 0.38);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h5 */
  font-family: Roboto, serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%;

  @media (max-width: 500px) {
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto, serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 154%;
  }
`;
