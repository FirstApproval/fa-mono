import styled from '@emotion/styled';
import { type Publication } from '../../apis/first-approval-api';
import React, { type ReactElement } from 'react';
import { RecommendedPublication } from './RecommendedPublication';
import { DownloadersDialog } from '../publication/DownloadersDialog';
import { downloadersStore } from '../publication/store/downloadsStore';
import { Grid, Typography } from '@mui/material';

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
`;

const RecommendedPublicationsSection = (props: {
  publications: Publication[];
}): ReactElement => {
  const { publications } = props;

  return (
    <>
      {publications.length > 0 && (
        <Wrap>
          <NameWrap variant={'h6'} component={'div'}>
            Recommended datasets
          </NameWrap>
          <GridContainer>
            {publications.map((publication, idx) => (
              <Grid item xs={12} md={6} lg={3} key={idx}>
                <RecommendedPublication
                  publication={publication}
                  openDownloadersDialog={() => {
                    downloadersStore.clearAndOpen(
                      publication.id,
                      publication.downloadsCount
                    );
                  }}
                />
              </Grid>
            ))}
          </GridContainer>
        </Wrap>
      )}
      <DownloadersDialog
        isOpen={downloadersStore.open}
        downloaders={downloadersStore.downloaders}
      />
    </>
  );
};

export const Wrap = styled('div')`
  width: 100%;

  margin-bottom: 40px;
`;

const NameWrap = styled(Typography)`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));

  margin-bottom: 24px;
` as typeof Typography;

export default RecommendedPublicationsSection;
