import styled from '@emotion/styled';
import React, { ReactElement, useState } from 'react';
import ReactPlayer from 'react-player';
import { ReactComponent as PdfExample } from './assets/pdf_example.svg';
import { ReactComponent as EditorHeader } from './assets/editorHeader.svg';
import { Button } from '@mui/material';

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
      <EditorHeaderWrap />
      {!ready && (
        <ImgWrap
          style={{ border: '1px solid #D2D2D6' }}
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
      <ButtonContainer>
        <ButtonWrap onClick={handleDownloadPdfExample}>
          Check the sample
        </ButtonWrap>
      </ButtonContainer>
    </EditorWrap>
  );
};

const handleDownloadPdfExample = () => {
  // Укажите путь к файлу PDF
  const link = document.createElement('a');
  link.href = 'example.pdf'; // Путь к файлу PDF в папке public или assets
  link.download = 'example.pdf'; // Название скачиваемого файла
  document.body.appendChild(link); // Временно добавляем ссылку в DOM
  link.click(); // Программно "нажимаем" на ссылку для скачивания
  document.body.removeChild(link); // Удаляем ссылку из DOM
};

const ButtonContainer = styled.div`
  width: 640px;
  margin-top: 32px;
  display: flex;

  @media (max-width: 500px) {
    margin-top: 16px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ButtonWrap = styled(Button)`
  width: 206px;
  height: 44px;

  color: #040036;

  &:hover {
    background-color: #0400360d;
  }

  border-radius: 4px;
  border: 2px solid #040036;

  background-color: #ffffff;

  font-family: Roboto, serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 100% */
  letter-spacing: 0.14px;

  display: flex;
  padding: 8px 11px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 500px) {
    width: 195px;
    height: 42px;
    margin-left: 18px;

    font-feature-settings: 'clig' off, 'liga' off;

    /* components/button-large */
    font-family: Roboto, serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px; /* 144.444% */
    letter-spacing: 0.46px;
  }
`;

const EditorWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 320px;

  @media (max-width: 500px) {
    margin-bottom: 112px;
  }
`;

const Title = styled.div`
  width: 850px;
  color: rgba(4, 0, 54, 0.38);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%;

  @media (max-width: 500px) {
    width: 328px;

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
  width: 850px;
  margin-top: 20px;
  margin-bottom: 64px;
  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 72px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 86.4px */
  letter-spacing: -0.5px;

  @media (max-width: 500px) {
    width: 328px;

    color: #040036;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto, serif;
    font-size: 34px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 40.8px */
    letter-spacing: -0.5px;
    margin-top: 8px;
    margin-bottom: 32px;
  }
`;

const PdfExampleLogoContainerWrap = styled.div`
  @media (max-width: 500px) {
    width: 45px;
  }
`;

const ImgWrap = styled.img`
  width: 1000px;
  height: 630px;

  @media (max-width: 500px) {
    width: 333px;
    height: 210px;
  }
`;

const EditorHeaderWrap = styled(EditorHeader)`
  width: 1004px;
  height: 35px;
  margin-right: 2px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  @media (max-width: 500px) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    width: 335px;
    height: 35px;
    margin-right: 0;
    margin-bottom: -12px;
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
  width: 850px;

  @media (max-width: 500px) {
    margin-top: 32px;
    width: 328px;
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
