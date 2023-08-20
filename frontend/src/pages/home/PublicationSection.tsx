import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { Divider } from '@mui/material';
import { type Publication } from '../../apis/first-approval-api';
import { routerStore } from '../../core/router';
import { Page } from '../../core/RouterStore';

export const PublicationBox = (props: {
  publication: Publication;
}): ReactElement => {
  const { publication } = props;

  return (
    <>
      <LinkWrap
        onClick={() => {
          routerStore.navigatePage(
            Page.PUBLICATION,
            `/publication/${publication.id}`
          );
        }}>
        <PublicationLabel>
          {publication.title ?? publication.id}
        </PublicationLabel>
        <PublicationDescriptionBox
          title={publication.description?.[0]?.text ?? ''}
        />
      </LinkWrap>
      <PublicationAreaBox title={publication.researchArea ?? ''} />
      <DividerWrap />
    </>
  );
};
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
`;
const PublicationAreaBox = (props: { title: string }): ReactElement => {
  return <PublicationAreaWrap>{props.title}</PublicationAreaWrap>;
};

const DividerWrap = styled(Divider)`
  margin-top: 40px;
  margin-bottom: 40px;
`;

const PublicationAreaWrap = styled.div`
  display: inline-flex;
  padding: 2px 8px;
  align-items: center;

  border-radius: 4px;
  background: var(--grey-50, #f8f7fa);

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;
`;

const PublicationLabel = styled.div`
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 123.5%; /* 41.99px */
  letter-spacing: 0.25px;

  margin-bottom: 16px;
`;

const LinkWrap = styled.div`
  cursor: pointer;
`;
