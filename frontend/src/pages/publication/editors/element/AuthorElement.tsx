import { Avatar } from '@mui/material';
import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { type Author } from '../../../../apis/first-approval-api';

interface AuthorElementProps {
  author: Author;
}

export const AuthorElement = (props: AuthorElementProps): ReactElement => {
  const { author } = props;
  return (
    <AuthorElementWrap>
      <Avatar>{getInitials(author.firstName, author.lastName)}</Avatar>
      <AuthorWrap>
        <AuthorName>
          {author.firstName} {author.lastName}
        </AuthorName>
        <AuthorEmail>{author.shortBio}</AuthorEmail>
      </AuthorWrap>
    </AuthorElementWrap>
  );
};

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

const AuthorEmail = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: var(--text-secondary, #68676e);
`;

export function getInitials(firstName: string, lastName: string): string {
  const firstNameInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

  return `${firstNameInitial}${lastNameInitial}`;
}
