import Grid from '@mui/material/Grid/Grid';
import { ReactElement } from 'react';
import { Main } from './landing/Main';
import { DatasetUpload } from './landing/DatasetUpload';
import { Hinder } from './landing/Hinder';
import { Terms } from './landing/Terms';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';

const LandingApp = (): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        <Main />
        <DatasetUpload />
        <Terms />
        <Hinder />
      </Grid>
    </ThemeProvider>
  );
};

export default LandingApp;
