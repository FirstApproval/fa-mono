import styled from '@emotion/styled';
import React, { type ReactElement } from 'react';
import { type Publication } from '../../apis/first-approval-api';
import { Avatar } from '@mui/material';
import { Download, RemoveRedEyeOutlined } from '@mui/icons-material';
import { getInitials } from '../../util/userUtil';
import { routerStore } from '../../core/router';
import { Page } from '../../core/RouterStore';
import { renderProfileImage } from '../../fire-browser/utils';

export const RecommendedPublication = (props: {
  publication: Publication;
}): ReactElement | null => {
  const { publication } = props;
  const { title, confirmedAuthors } = publication;
  const author = confirmedAuthors?.[0];

  if (!author) return null;

  return (
    <>
      <Wrap>
        <FlexWrap>
          <AvatarWrap>
            <Avatar
              src={renderProfileImage(publication.creator.profileImage)}
              sx={{ width: 24, height: 24 }}>
              {getInitials(author.user.firstName, author.user.lastName)}
            </Avatar>
          </AvatarWrap>
          <div>
            {author.user.firstName} {author.user.lastName}
          </div>
        </FlexWrap>
        <NameWrap
          onClick={() => {
            routerStore.navigatePage(
              Page.PUBLICATION,
              `/publication/${publication.id}`
            );
          }}>
          {title}
        </NameWrap>
        <Footer>
          <IconWrap>
            <RemoveRedEyeOutlined fontSize={'small'} />
          </IconWrap>
          <div>{publication.viewsCount}</div>
          <IconWrap>
            <DownloadWrap fontSize={'small'} />
          </IconWrap>
          <div>{publication.downloadsCount}</div>
        </Footer>
      </Wrap>
    </>
  );
};

const IconWrap = styled.div`
  display: flex;
  margin-right: 4px;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FlexWrap = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 12px;
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

const AvatarWrap = styled.div`
  margin-right: 8px;
`;

const NameWrap = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
  cursor: pointer;

  margin-bottom: 16px;
`;

const DownloadWrap = styled(Download)`
  margin-left: 24px;
`;
