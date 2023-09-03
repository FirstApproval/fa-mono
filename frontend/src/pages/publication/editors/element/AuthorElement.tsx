import { Avatar, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import {
  type ConfirmedAuthor,
  type UnconfirmedAuthor,
  UserInfo
} from '../../../../apis/first-approval-api';
import { getInitials } from '../../../../util/userUtil';
import {
  getRelativeProfileLink,
  renderProfileImage
} from '../../../../fire-browser/utils';
import { type AuthorEditorStore } from '../../store/AuthorEditorStore';
import { routerStore } from '../../../../core/router';
import { Page } from '../../../../core/RouterStore';

interface AuthorElementProps {
  isReadonly: boolean;
  author: ConfirmedAuthor | UnconfirmedAuthor | UserInfo;
  isConfirmed?: boolean;
  index?: number;
  setEditAuthorVisible?: (
    author: ConfirmedAuthor | UnconfirmedAuthor,
    isConfirmed?: boolean,
    index?: number
  ) => void;
}

export const AuthorElement = (props: AuthorElementProps): ReactElement => {
  const { isReadonly, author, isConfirmed, index, setEditAuthorVisible } =
    props;
  let shortBio;
  let firstName;
  let lastName;
  let email;
  let username: string;
  if (isConfirmed) {
    const confirmedAuthor = author as ConfirmedAuthor;
    firstName = confirmedAuthor.user.firstName;
    lastName = confirmedAuthor.user.lastName;
    email = confirmedAuthor.user.email;
    username = confirmedAuthor.user.username;
    shortBio = confirmedAuthor.shortBio;
  } else if (isConfirmed === false) {
    const unconfirmedAuthor = author as UnconfirmedAuthor;
    firstName = unconfirmedAuthor.firstName;
    lastName = unconfirmedAuthor.lastName;
    email = unconfirmedAuthor.email;
    shortBio = unconfirmedAuthor.shortBio;
  } else {
    const userInfo = author as UserInfo;
    firstName = userInfo.firstName;
    lastName = userInfo.lastName;
    email = userInfo.email;
    username = userInfo.username;
  }

  const profileImage =
    (author as ConfirmedAuthor).user?.profileImage ??
    (author as AuthorEditorStore).profileImage;
  return (
    <AuthorRowWrap>
      <AuthorElementWrap
        onClick={() => {
          if (username) {
            routerStore.navigatePage(
              Page.PROFILE,
              getRelativeProfileLink(username)
            );
          }
        }}>
        <Avatar src={renderProfileImage(profileImage)}>
          {getInitials(firstName, lastName)}
        </Avatar>
        <AuthorWrap>
          <AuthorName>
            {isConfirmed && (
              <span style={{ textDecoration: 'underline' }}>
                {firstName} {lastName}
              </span>
            )}
            {!isConfirmed && (
              <span>
                {firstName} {lastName}
              </span>
            )}
          </AuthorName>
          <AuthorShortBio>
            {setEditAuthorVisible ? shortBio : email}
          </AuthorShortBio>
        </AuthorWrap>
      </AuthorElementWrap>
      {!isReadonly && (
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
      )}
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

const AuthorShortBio = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: var(--text-secondary, #68676e);
`;
