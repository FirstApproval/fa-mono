import styled from '@emotion/styled';
import React, { type ReactElement } from 'react';
import { type Author } from '../../apis/first-approval-api';
import { Avatar } from '@mui/material';
import { getInitials } from '../../util/userUtil';
import { renderProfileImage } from '../../fire-browser/utils';
import { Page } from '../../core/RouterStore';
import { routerStore } from '../../core/router';

export const PopularAuthor = (props: { author: Author }): ReactElement => {
  const { author } = props;
  return (
    <FlexWrap
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        routerStore.navigatePage(Page.PROFILE, `/p/${author.username}`);
      }}>
      <MarginWrap>
        <Avatar
          sx={{ width: 32, height: 32 }}
          src={renderProfileImage(author.profileImage)}>
          {getInitials(author.firstName, author.lastName)}
        </Avatar>
      </MarginWrap>
      <div>
        <NameWrap>
          {author.firstName} {author.lastName}
        </NameWrap>
        <BioWrap>{author.selfInfo}</BioWrap>
      </div>
    </FlexWrap>
  );
};

const FlexWrap = styled.div`
  display: flex;
  align-items: start;
  cursor: pointer;
`;

const MarginWrap = styled.div`
  margin-right: 16px;
`;

const NameWrap = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;

const BioWrap = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  color: var(--text-secondary, #68676e);
`;
