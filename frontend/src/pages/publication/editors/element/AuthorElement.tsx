import { Avatar, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import {
  type ConfirmedAuthor,
  type UnconfirmedAuthor,
  UserInfo,
  Workplace
} from '../../../../apis/first-approval-api';
import {
  getCurrentWorkplacesString,
  getInitials,
  renderProfileImage
} from '../../../../util/userUtil';
import { type AuthorEditorStore } from '../../store/AuthorEditorStore';
import { routerStore } from '../../../../core/router';

import { Page } from '../../../../core/router/constants';
import { getAuthorLink } from '../../../../core/router/utils';

interface AuthorElementProps {
  isReadonly: boolean;
  author: ConfirmedAuthor | UnconfirmedAuthor | UserInfo | AuthorEditorStore;
  isConfirmed?: boolean;
  onAuthorEdit?: () => void;
  shouldOpenInNewTab?: boolean;
}

export const AuthorElement = (props: AuthorElementProps): ReactElement => {
  const { isReadonly, author, isConfirmed, onAuthorEdit, shouldOpenInNewTab } =
    props;
  let workplaces: Workplace[];
  let firstName;
  let lastName;
  let username: string;
  let profileImage: string | undefined;

  if (isConfirmed) {
    const confirmedAuthor = author as ConfirmedAuthor;
    // check that it is really confirmed user
    if (confirmedAuthor.user?.username) {
      const authorUser = confirmedAuthor.user;
      firstName = authorUser.firstName;
      lastName = authorUser.lastName;
      username = authorUser.username;
      profileImage = authorUser.profileImage;
      workplaces = authorUser.workplaces ?? [];
    } else {
      const authorEditorStore = author as AuthorEditorStore;
      firstName = authorEditorStore.firstName;
      lastName = authorEditorStore.lastName;
      profileImage = authorEditorStore.profileImage;
      workplaces = authorEditorStore.workplaces;
    }
  } else if (!isConfirmed) {
    const unconfirmedAuthor = author as UnconfirmedAuthor;
    firstName = unconfirmedAuthor.firstName;
    lastName = unconfirmedAuthor.lastName;
    workplaces = unconfirmedAuthor.workplaces ?? [];
  } else {
    const userInfo = author as UserInfo;
    firstName = userInfo.firstName;
    lastName = userInfo.lastName;
    username = userInfo.username;
    profileImage = userInfo.profileImage;
    workplaces = userInfo.workplaces ?? [];
  }

  return (
    <AuthorRowWrap useMarginBottom={!isReadonly}>
      <AuthorElementWrap
        onClick={() => {
          if (username) {
            if (shouldOpenInNewTab) {
              routerStore.openInNewTab(getAuthorLink(username));
            } else {
              routerStore.navigatePage(Page.PROFILE, getAuthorLink(username));
            }
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
                {firstName} {lastName} (not registered)
              </span>
            )}
          </AuthorName>
          <AuthorWorkplace>
            {onAuthorEdit && getCurrentWorkplacesString(workplaces)}
          </AuthorWorkplace>
        </AuthorWrap>
      </AuthorElementWrap>
      {!isReadonly && (
        <div>
          {onAuthorEdit && (
            <IconButton onClick={onAuthorEdit}>
              <Edit htmlColor={'gray'} />
            </IconButton>
          )}
        </div>
      )}
    </AuthorRowWrap>
  );
};

const AuthorRowWrap = styled.div<{
  useMarginBottom: boolean;
}>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: ${(props) => (props.useMarginBottom ? '28px' : 0)};
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
`;

const AuthorWorkplace = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: var(--text-secondary, #68676e);
`;
