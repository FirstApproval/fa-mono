import styled from '@emotion/styled';
import {
  type Publication,
  type RecommendedAuthor
} from '../../apis/first-approval-api';
import { PopularAuthor } from './PopularAuthor';
import { type ReactElement } from 'react';
import { RecommendedPublication } from './RecommendedPublication';

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const AuthorCard = styled.div`
  width: calc(25% - 42px);
  margin-right: 42px;
`;

const RecommendedPublicationsSection = (props: {
  publications: Publication[];
}): ReactElement => {
  const { publications } = props;
  return (
    <>
      <NameWrap>Popular authors</NameWrap>
      <GridContainer>
        {publications.map((publication, idx) => (
          <AuthorCard key={idx}>
            <RecommendedPublication publication={publication} />
          </AuthorCard>
        ))}
      </GridContainer>
    </>
  );
};

const NameWrap = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

export default RecommendedPublicationsSection;
