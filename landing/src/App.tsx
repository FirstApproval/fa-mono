import './App.css';
import React, { ReactElement } from 'react';
import { Main } from './landing/Main';
import { DatasetUpload } from './landing/DatasetUpload';
import { Hinder } from './landing/Hinder';
import { Terms } from './landing/Terms';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { DataFirst } from './landing/DataFirst';
import { ApprovalParadigm } from './landing/ApprovalParadigm';
import { Header } from './landing/Header';
import { Footer } from './landing/Footer';
import { JoinBeta } from './landing/JoinBeta';
import { ApprovalParadigmMobile } from './landing/ApprovalParadigmMobile';
import { Editor } from './landing/Editor';
import { Partners } from './landing/Partners';

const LandingApp = (): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Main />
      <Partners />
      <Editor />
      <DatasetUpload />
      <Terms />
      <Hinder />
      <ApprovalParadigm />
      <ApprovalParadigmMobile />
      <DataFirst />
      <JoinBeta />
      <Footer />
    </ThemeProvider>
  );
};

export default LandingApp;
