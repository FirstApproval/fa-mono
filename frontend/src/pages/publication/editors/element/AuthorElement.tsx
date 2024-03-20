import { Avatar, IconButton, Tooltip, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
import React, { MutableRefObject, type ReactElement } from 'react';
import styled from '@emotion/styled';
import {
  Author,
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
import { useIsHorizontalOverflow } from '../../../../util/overflowUtil';

interface AuthorElementProps {
  isReadonly: boolean;
  useMarginBottom: boolean;
  author: Author | UserInfo | AuthorEditorStore;
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
  const nameRef: MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const isOverflow = useIsHorizontalOverflow(nameRef, () => {});

  if (isConfirmed) {
    const confirmedAuthor = author as Author;
    // check that it is really confirmed user
    if (confirmedAuthor.user?.username) {
      firstName = confirmedAuthor.firstName;
      lastName = confirmedAuthor.lastName;
      workplaces = confirmedAuthor.workplaces ?? [];
      username = confirmedAuthor.user.username;
      profileImage = confirmedAuthor.user.profileImage;
    } else {
      const authorEditorStore = author as AuthorEditorStore;
      firstName = authorEditorStore.firstName;
      lastName = authorEditorStore.lastName;
      profileImage = authorEditorStore.profileImage;
      workplaces = authorEditorStore.workplaces;
    }
  } else if (isConfirmed === false) {
    const unconfirmedAuthor = author as Author;
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
    <AuthorRowWrap useMarginBottom={props.useMarginBottom}>
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
          <Tooltip title={isOverflow ? `${firstName} ${lastName}` : undefined}>
            <AuthorName ref={nameRef}>
              {(isConfirmed ?? isConfirmed === undefined) && (
                <span style={{ textDecoration: 'underline' }}>
                  {firstName} {lastName}
                </span>
              )}
              {isConfirmed === false && (
                <span>
                  {firstName} {lastName} (not registered)
                </span>
              )}
            </AuthorName>
          </Tooltip>
          <AuthorWorkplace variant={'body2'}>
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

const AuthorWorkplace = styled(Typography)`
  color: var(--text-secondary, #68676e);
`;
