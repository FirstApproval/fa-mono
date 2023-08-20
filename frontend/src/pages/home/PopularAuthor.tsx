import styled from '@emotion/styled';
import { type ReactElement } from 'react';
import { type RecommendedAuthor } from '../../apis/first-approval-api';
import { Avatar } from '@mui/material';
import { getInitials } from '../../util/userUtil';

export const PopularAuthor = (props: {
  author: RecommendedAuthor;
}): ReactElement => {
  const { author } = props;
  return (
    <>
      <FlexWrap>
        <MarginWrap>
          <Avatar sx={{ width: 32, height: 32 }}>
            {getInitials(author.firstName, author.lastName)}
          </Avatar>
        </MarginWrap>
        <div>
          <NameWrap>
            {author.firstName} {author.lastName}
          </NameWrap>
          <BioWrap>{author.shortBio}</BioWrap>
        </div>
      </FlexWrap>
    </>
  );
};

const FlexWrap = styled.div`
  display: flex;
  align-items: baseline;
`;

const MarginWrap = styled.div`
  margin-right: 16px;
`;

const NameWrap = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;

const BioWrap = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;

  color: var(--text-secondary, #68676e);
`;
