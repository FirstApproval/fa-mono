import Grid from '@mui/material/Grid/Grid';
import { ReactElement } from 'react';
import { Main } from './Main';
import { DatasetUpload } from './DatasetUpload';
import { Hinder } from './Hinder';
import { Terms } from './Terms';

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
