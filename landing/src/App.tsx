import './App.css';
import Grid from '@mui/material/Grid/Grid';
import { ReactElement } from 'react';
import { Main } from './landing/Main';
import { DatasetUpload } from './landing/DatasetUpload';
import { Hinder } from './landing/Hinder';
import { Terms } from './landing/Terms';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import styled from '@emotion/styled';
import { DataFirst } from './landing/DataFirst';

const LandingApp = (): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <FlexWrap>
        <PageWrap>
          <Grid container spacing={2}>
            <Main />
            <DatasetUpload />
            <Terms />
            <Hinder />
            <DataFirst />
          </Grid>
        </PageWrap>
      </FlexWrap>
    </ThemeProvider>
  );
};

export default LandingApp;

const PageWrap = styled.div`
  max-width: 1980px;
`;

const FlexWrap = styled.div`
  //display: flex;
  //flex-direction: column;
  //align-items: center;
`;
