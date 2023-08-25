import { Avatar, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import {
  type ConfirmedAuthor,
  type UnconfirmedAuthor
} from '../../../../apis/first-approval-api';
import { getInitials } from '../../../../util/userUtil';
import { renderProfileImage } from '../../../../fire-browser/utils';
import { type AuthorEditorStore } from '../../store/AuthorEditorStore';

interface AuthorElementProps {
  author: ConfirmedAuthor | UnconfirmedAuthor;
  isConfirmed: boolean;
  index?: number;
  setEditAuthorVisible?: (
    author: ConfirmedAuthor | UnconfirmedAuthor,
    isUnconfirmed: boolean,
    index?: number
  ) => void;
}

export const AuthorElement = (props: AuthorElementProps): ReactElement => {
  const { author, isConfirmed, index, setEditAuthorVisible } = props;
  const shortBio = author.shortBio;
  let firstName;
  let lastName;
  let email;
  if (isConfirmed) {
    const confirmedAuthor = author as ConfirmedAuthor;
    firstName = confirmedAuthor.user.firstName;
    lastName = confirmedAuthor.user.lastName;
    email = confirmedAuthor.user.email;
  } else {
    const unconfirmedAuthor = author as UnconfirmedAuthor;
    firstName = unconfirmedAuthor.firstName;
    lastName = unconfirmedAuthor.lastName;
    email = unconfirmedAuthor.email;
  }

  const profileImage =
    (author as ConfirmedAuthor).user?.profileImage ||
    (author as AuthorEditorStore).profileImage;
  debugger;
  return (
    <AuthorRowWrap>
      <AuthorElementWrap>
        <Avatar src={renderProfileImage(profileImage)}>
          {getInitials(firstName, lastName)}
        </Avatar>
        <AuthorWrap>
          <AuthorName>
            {firstName} {lastName}
          </AuthorName>
          <AuthorShortBio>
            {setEditAuthorVisible ? shortBio : email}
          </AuthorShortBio>
        </AuthorWrap>
      </AuthorElementWrap>
      <div>
        {setEditAuthorVisible && (
          <IconButton
            onClick={() => {
              setEditAuthorVisible(author, isConfirmed, index);
            }}>
            <Edit htmlColor={'gray'} />
          </IconButton>
        )}
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
