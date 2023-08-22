import styled from '@emotion/styled';
import { type ReactElement } from 'react';
import { type Publication } from '../../apis/first-approval-api';
import { Avatar } from '@mui/material';
import { getInitials } from '../../util/userUtil';

export const RecommendedPublication = (props: {
  publication: Publication;
}): ReactElement | null => {
  const { publication } = props;
  const { title, confirmedAuthors } = publication;
  const author = confirmedAuthors?.[0];

  if (!author) return null;

  return (
    <>
      <div>
        <FlexWrap>
          <AvatarWrap>
            <Avatar sx={{ width: 24, height: 24 }}>
              {getInitials(author.user.firstName, author.user.lastName)}
            </Avatar>
          </AvatarWrap>
          <div>
            {author.user.firstName} {author.user.lastName}
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

  margin-bottom: 12px;
`;

const AvatarWrap = styled.div`
  margin-right: 8px;
`;

const NameWrap = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;
