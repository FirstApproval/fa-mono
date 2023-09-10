import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { Avatar, Divider, Tooltip } from '@mui/material';
import {
  type Publication,
  PublicationStatus
} from '../apis/first-approval-api';
import { routerStore } from '../core/router';
import { Page } from '../core/RouterStore';
import { Download, RemoveRedEyeOutlined } from '@mui/icons-material';
import { renderProfileImage } from '../fire-browser/utils';
import { findResearchAreaIcon } from '../pages/publication/store/ResearchAreas';

export const PublicationSection = (props: {
  publication: Publication;
  openDownloadersDialog: () => void;
}): ReactElement => {
  const { publication } = props;
  const authorsString = publication
    .confirmedAuthors!.map(
      (author) => `${author.user.firstName} ${author.user.lastName}`
    )
    .join(', ');

  return (
    <>
      <LinkWrap
        onClick={() => {
          routerStore.navigatePage(
            Page.PUBLICATION,
            `/publication/${publication.id}`
          );
        }}>
        <AuthorsWrap>
          <Avatar
            src={renderProfileImage(publication.creator.profileImage)}
            sx={{
              width: 24,
              height: 24
            }}
          />
          <Authors>{authorsString}</Authors>
        </AuthorsWrap>
        <PublicationLabel>
          {publication.title ?? publication.id}
        </PublicationLabel>
        <PublicationDescriptionBox
          title={publication.description?.[0]?.text ?? ''}
        />
      </LinkWrap>
      <FlexWrap>
        <ResearchAreas publication={publication} />
        {publication.status === PublicationStatus.PUBLISHED && (
          <Footer>
            <RemoveRedEyeOutlined
              style={{ marginRight: '6px' }}
              fontSize={'small'}
            />
            {publication.viewsCount}
            <FlexWrap
              style={{ cursor: 'pointer' }}
              onClick={props.openDownloadersDialog}>
              <DownloadWrap style={{ marginRight: '6px' }} fontSize={'small'} />
              {publication.downloadsCount}
            </FlexWrap>
          </Footer>
        )}
      </FlexWrap>
      <DividerWrap />
    </>
  );
};

const ResearchAreas = (props: { publication: Publication }): ReactElement => {
  return (
    <>
      {props.publication.researchAreas
        ?.map((researchArea) => {
          return (
            <PublicationAreaWrap key={researchArea.text}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                <div
                  style={{
                    paddingTop: 4,
                    marginRight: 4
                  }}>
                  {findResearchAreaIcon(researchArea.text)}
                </div>
                {researchArea.text}
              </div>
            </PublicationAreaWrap>
          );
        })
        .slice(0, 1)}
      {props.publication.researchAreas?.length &&
        props.publication.researchAreas?.length > 1 && (
          <PublicationAreaWrap>
            <Tooltip
              title={props.publication.researchAreas
                .map((ra) => ra.text)
                .join(', ')}>
              <div
                style={{
                  cursor: 'pointer',
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                {(props.publication.researchAreas?.length &&
                  props.publication.researchAreas?.length) - 1}{' '}
                more...
              </div>
            </Tooltip>
          </PublicationAreaWrap>
        )}
    </>
  );
};

const AuthorsWrap = styled.div`
  display: flex;
  align-items: center;
`;

const Authors = styled.span`
  margin-left: 8px;
  color: var(--text-primary, #040036);

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;
`;

const PublicationDescriptionBox = (props: { title: string }): ReactElement => {
  return <PublicationDescriptionWrap>{props.title}</PublicationDescriptionWrap>;
};

const PublicationDescriptionWrap = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;

  margin-bottom: 24px;

  word-break: break-word;
`;

const DividerWrap = styled(Divider)`
  margin-top: 40px;
  margin-bottom: 40px;
`;

const PublicationAreaWrap = styled.div`
  display: inline-flex;
  padding: 2px 8px;
  align-items: center;
  margin-right: 8px;

  border-radius: 4px;
  background: var(--grey-50, #f8f7fa);

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;

  word-break: break-word;
`;

const PublicationLabel = styled.div`
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 123.5%; /* 41.99px */
  letter-spacing: 0.25px;

  margin: 16px 0;
  word-break: break-word;
`;

const LinkWrap = styled.div`
  cursor: pointer;
`;

const FlexWrap = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
`;

const Footer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

const DownloadWrap = styled(Download)`
  margin-left: 24px;
`;
