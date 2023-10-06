import styled from '@emotion/styled';
import React, { MutableRefObject, type ReactElement } from 'react';
import { type UserInfo } from '../../apis/first-approval-api';
import { Avatar, Tooltip, Typography } from '@mui/material';
import {
  getCurrentWorkplacesString,
  getInitials,
  renderProfileImage
} from '../../util/userUtil';
import { routerStore } from '../../core/router';
import { Page } from '../../core/router/constants';
import { getAuthorLink } from '../../core/router/utils';
import { useIsHorizontalOverflow } from '../../util/overflowUtil';

const MAX_SELF_BIO_LENGTH = 116;

export const PopularAuthor = (props: { author: UserInfo }): ReactElement => {
  const { author } = props;
  const nameRef: MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const isOverflow = useIsHorizontalOverflow(nameRef, () => {});
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
        <Tooltip
          title={
            isOverflow ? `${author.firstName} ${author.lastName}` : undefined
          }>
          <NameWrap variant={'h6'} component={'div'} ref={nameRef}>
            {author.firstName} {author.lastName}
          </NameWrap>
        </Tooltip>
        <Tooltip
          disableHoverListener={
            getCurrentWorkplacesString(author.workplaces)?.length <
            MAX_SELF_BIO_LENGTH
          }
          title={getCurrentWorkplacesString(author.workplaces)}>
          <WorkplacesWrap>
            {getCurrentWorkplacesString(author.workplaces)}
          </WorkplacesWrap>
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

const NameWrap = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 260px;
` as typeof Typography;

const WorkplacesWrap = styled.div`
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
