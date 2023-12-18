import './App.css';
import Grid from '@mui/material/Grid/Grid';
import { ReactElement } from 'react';
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

const LandingApp = (): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container spacing={2} maxWidth={'1980px'}>
          <Main />
          <DatasetUpload />
          <Terms />
          <Hinder />
          <ApprovalParadigm />
          <ApprovalParadigmMobile />
          <DataFirst />
        </Grid>
      </Grid>
      <JoinBeta />
      <Footer />
    </ThemeProvider>
  );
};

export default LandingApp;
