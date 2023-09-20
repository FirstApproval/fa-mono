import styled from '@emotion/styled';
import React, { type ReactElement } from 'react';
import { type UserInfo } from '../../apis/first-approval-api';
import { Avatar, Tooltip } from '@mui/material';
import {
  getCurrentWorkplacesString,
  getInitials,
  renderProfileImage
} from '../../util/userUtil';
import { routerStore } from '../../core/router';
import { Page } from '../../core/router/constants';
import { getAuthorLink } from '../../core/router/utils';

const MAX_SELF_BIO_LENGTH = 116;

export const PopularAuthor = (props: { author: UserInfo }): ReactElement => {
  const { author } = props;
  return (
    <FlexWrap
      onClick={() => {
        routerStore.navigatePage(Page.PROFILE, getAuthorLink(author.username));
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
        <Tooltip
          disableHoverListener={
            getCurrentWorkplacesString(author.workplaces)?.length <
            MAX_SELF_BIO_LENGTH
          }
          title={getCurrentWorkplacesString(author.workplaces)}>
          <BioWrap>{getCurrentWorkplacesString(author.workplaces)}</BioWrap>
        </Tooltip>
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
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  color: var(--text-secondary, #68676e);
`;
