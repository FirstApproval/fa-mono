import styled from '@emotion/styled';
import { type Publication } from '../../apis/first-approval-api';
import React, { type ReactElement } from 'react';
import { RecommendedPublication } from './RecommendedPublication';
import { DownloadersDialog } from '../publication/DownloadersDialog';
import { downloadersStore } from '../publication/store/downloadsStore';

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
`;

const PublicationCard = styled.div`
  width: calc(25%);
  padding: 4px;
`;

const RecommendedPublicationsSection = (props: {
  publications: Publication[];
}): ReactElement => {
  const { publications } = props;

  return (
    <>
      {publications.length > 0 && (
        <Wrap>
          <NameWrap>Recommended datasets</NameWrap>
          <GridContainer>
            {publications.map((publication, idx) => (
              <PublicationCard key={idx}>
                <RecommendedPublication
                  publication={publication}
                  openDownloadersDialog={() => {
                    downloadersStore.clearAndOpen(
                      publication.id,
                      publication.downloadsCount
                    );
                  }}
                />
              </PublicationCard>
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
  width: 80%;
  margin-left: auto;
  margin-right: auto;

  margin-bottom: 40px;
`;

const NameWrap = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));

  margin-bottom: 24px;
`;

export default RecommendedPublicationsSection;
