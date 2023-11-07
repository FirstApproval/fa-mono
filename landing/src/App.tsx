import Grid from '@mui/material/Grid/Grid';
import { ReactElement } from 'react';
import { Main } from './landing/Main';
import { DatasetUpload } from './landing/DatasetUpload';
import { Hinder } from './landing/Hinder';
import { Terms } from './landing/Terms';

const LandingApp = (): ReactElement => {
  return (
    <Grid container spacing={2}>
      <Main />
      <DatasetUpload />
      <Terms />
      <Hinder />
    </Grid>
  );
};

export default LandingApp;
