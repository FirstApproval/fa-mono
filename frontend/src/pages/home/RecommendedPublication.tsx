import styled from '@emotion/styled';
import { type ReactElement } from 'react';
import { type Publication } from '../../apis/first-approval-api';
import { Avatar } from '@mui/material';
import { getInitials } from '../../util/userUtil';

export const RecommendedPublication = (props: {
  publication: Publication;
}): ReactElement | null => {
  const { publication } = props;
  const { title, authors } = publication;
  const author = authors?.[0];

  if (!author) return null;

  return (
    <>
      <div>
        <FlexWrap>
          <Avatar sx={{ width: 24, height: 24 }}>
            {getInitials(author.firstName, author.lastName)}
          </Avatar>
          <div>
            {author.firstName} {author.lastName}
          </div>
        </FlexWrap>
        <NameWrap>{title}</NameWrap>
      </div>
    </>
  );
};

const FlexWrap = styled.div`
  display: flex;
  align-items: center;
`;

const NameWrap = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;
