import { Avatar } from '@mui/material';
import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { getInitials, renderProfileImage } from 'src/util/userUtil';
import { UserInfo } from 'src/apis/first-approval-api';

interface AuthorElementProps {
  author: UserInfo;
}

export const UserElement = (props: AuthorElementProps): ReactElement => {
  const { author } = props;

  const firstName = author.firstName;
  const lastName = author.lastName;
  const profileImage = author.profileImage;

  return (
    <AuthorRowWrap>
      <AuthorElementWrap>
        <Avatar src={renderProfileImage(profileImage)}>
          {getInitials(firstName, lastName)}
        </Avatar>
        <AuthorWrap>
          <AuthorName>
            <span style={{ textDecoration: 'underline' }}>
              {firstName} {lastName}
            </span>
          </AuthorName>
        </AuthorWrap>
      </AuthorElementWrap>
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
  cursor: pointer;
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
