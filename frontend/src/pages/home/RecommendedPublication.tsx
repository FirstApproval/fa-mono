import styled from '@emotion/styled';
import React, { type ReactElement } from 'react';
import { type Publication } from '../../apis/first-approval-api';
import { Avatar, Tooltip, Typography } from '@mui/material';
import { Download, RemoveRedEyeOutlined } from '@mui/icons-material';
import { getInitials, renderProfileImage } from '../../util/userUtil';
import { routerStore } from '../../core/router';
import { authorPath, Page, publicationPath } from '../../core/router/constants';

export const RecommendedPublication = (props: {
  publication: Publication;
  openDownloadersDialog: () => void;
}): ReactElement | null => {
  const { publication } = props;
  const { title, creator } = publication;

  if (!creator) return null;

  return (
    <>
      {title!.length > 120 ? (
        <Tooltip title={title}>
          <Wrap>
            <RecommendedPublicationContent
              publication={publication}
              openDownloadersDialog={props.openDownloadersDialog}
            />
          </Wrap>
        </Tooltip>
      ) : (
        <RecommendedPublicationContent
          publication={publication}
          openDownloadersDialog={props.openDownloadersDialog}
        />
      )}
    </>
  );
};

const RecommendedPublicationContent = (props: {
  publication: Publication;
  openDownloadersDialog: () => void;
}): ReactElement | null => {
  const { publication } = props;
  const { previewTitle, creator } = publication;

  if (!creator) return null;

  return (
    <Wrap>
      <AuthorFlexWrap
        onClick={() => {
          routerStore.navigatePage(
            Page.PROFILE,
            `${authorPath}${creator.username}`
          );
        }}>
        <AvatarWrap>
          <Avatar
            src={renderProfileImage(creator.profileImage)}
            sx={{ width: 24, height: 24 }}>
            {getInitials(creator.firstName, creator.lastName)}
          </Avatar>
        </AvatarWrap>
        <div>
          {creator.firstName} {creator.lastName}
        </div>
      </AuthorFlexWrap>
      <NameWrap
        variant={'h6'}
        component={'a'}
        href={`${publicationPath}/${publication.id}`}>
        {previewTitle?.slice(0, 120)}
        {previewTitle && previewTitle.length > 80 ? '...' : ''}
      </NameWrap>
      <Footer>
        <IconWrap>
          <RemoveRedEyeOutlined fontSize={'small'} />
        </IconWrap>
        <div>{publication.viewsCount}</div>
        <FlexWrap
          style={{ cursor: 'pointer' }}
          onClick={props.openDownloadersDialog}>
          <IconWrap>
            <DownloadWrap fontSize={'small'} />
          </IconWrap>
          <div>{publication.downloadsCount}</div>
        </FlexWrap>
      </Footer>
    </Wrap>
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
  cursor: pointer;
`;

const AuthorFlexWrap = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  margin-bottom: 12px;
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));

  margin-bottom: 32px;
`;

const AvatarWrap = styled.div`
  margin-right: 8px;
`;

const NameWrap = styled(Typography)`
  margin-bottom: 16px;
  word-wrap: break-word;
  text-decoration: none;
  color: #040036;
` as typeof Typography;

const DownloadWrap = styled(Download)`
  margin-left: 24px;
`;

const FlexWrap = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
`;
