import styled from '@emotion/styled';
import { type RecommendedAuthor } from '../../apis/first-approval-api';
import { PopularAuthor } from './PopularAuthor';
import { type ReactElement } from 'react';

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const AuthorCard = styled.div`
  width: calc(50% - 32px);
  margin-bottom: 32px;
  margin-right: 32px;
`;

const PopularAuthorsSection = (props: {
  authors: RecommendedAuthor[];
}): ReactElement => {
  const { authors } = props;
  return (
    <>
      <NameWrap>Popular authors</NameWrap>
      <GridContainer>
        {authors.map((author, idx) => (
          <AuthorCard key={idx}>
            <PopularAuthor author={author} />
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

  margin-bottom: 32px;
`;

export default PopularAuthorsSection;
