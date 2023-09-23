import { Avatar, Tooltip } from '@mui/material';
import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { getInitials, renderProfileImage } from 'src/util/userUtil';
import { UserInfo } from 'src/apis/first-approval-api';
import { MutableRefObject } from 'react';
import { useIsHorizontalOverflow } from '../util/overflowUtil';

interface AuthorElementProps {
  author: UserInfo;
}

export const UserElement = (props: AuthorElementProps): ReactElement => {
  const { author } = props;

  const firstName = author.firstName;
  const lastName = author.lastName;
  const profileImage = author.profileImage;
  const nameRef: MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const isOverflow = useIsHorizontalOverflow(nameRef, () => {});

  return (
    <AuthorRowWrap>
      <AuthorElementWrap>
        <Avatar src={renderProfileImage(profileImage)}>
          {getInitials(firstName, lastName)}
        </Avatar>
        <Tooltip title={isOverflow ? `${firstName} ${lastName}` : undefined}>
          <AuthorWrap>
            <AuthorName ref={nameRef}>
              <span style={{ textDecoration: 'underline' }}>
                {firstName} {lastName}
              </span>
            </AuthorName>
          </AuthorWrap>
        </Tooltip>
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
`;
