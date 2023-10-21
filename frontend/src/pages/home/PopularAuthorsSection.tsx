import styled from '@emotion/styled';
import { type UserInfo } from '../../apis/first-approval-api';
import { PopularAuthor } from './PopularAuthor';
import { type ReactElement } from 'react';
import { Grid, Typography } from '@mui/material';

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const AuthorCard = styled.div`
  display: flex;
  width: calc(50% - 16px);
  margin-bottom: 32px;
`;

const PopularAuthorsSection = (props: {
  authors: UserInfo[];
}): ReactElement => {
  const { authors } = props;
  return (
    <>
      <NameWrap variant={'h6'} component={'div'}>
        Popular authors
      </NameWrap>
      <GridContainer>
        {authors.map((author, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <AuthorCard>
              <PopularAuthor author={author} />
            </AuthorCard>
          </Grid>
        ))}
      </GridContainer>
    </>
  );
};

const NameWrap = styled(Typography)`
  margin-bottom: 32px;
` as typeof Typography;

export default PopularAuthorsSection;
