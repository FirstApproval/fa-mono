import { Avatar, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { type Author } from '../../../../apis/first-approval-api';
import { getInitials } from '../../../../util/userUtil';

interface AuthorElementProps {
  author: Author;
  isUnconfirmed: boolean;
  index?: number;
  setEditAuthorVisible: (
    author: Author,
    isUnconfirmed: boolean,
    index?: number
  ) => void;
}

export const AuthorElement = (props: AuthorElementProps): ReactElement => {
  const { author, isUnconfirmed, index, setEditAuthorVisible } = props;

  return (
    <AuthorRowWrap>
      <AuthorElementWrap>
        <Avatar>{getInitials(author.firstName, author.lastName)}</Avatar>
        <AuthorWrap>
          <AuthorName>
            {author.firstName} {author.lastName}
          </AuthorName>
          <AuthorShortBio>{author.shortBio}</AuthorShortBio>
        </AuthorWrap>
      </AuthorElementWrap>
      <div>
        <IconButton
          onClick={() => {
            setEditAuthorVisible(author, isUnconfirmed, index);
          }}>
          <Edit htmlColor={'gray'} />
        </IconButton>
      </div>
    </AuthorRowWrap>
  );
};

const AuthorRowWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const AuthorElementWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 28px;
`;

const AuthorWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

const AuthorName = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
`;

const AuthorShortBio = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: var(--text-secondary, #68676e);
`;
