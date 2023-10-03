import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { type Publication } from '../../apis/first-approval-api';
import { Typography } from '@mui/material';

interface PublicationElementProps {
  index: number;
  publication: Publication;
  setEditAuthorVisible?: (publicationId: number) => void;
}

export const PublicationElement = (
  props: PublicationElementProps
): ReactElement => {
  const { publication } = props;
  const authorsString = publication
    .confirmedAuthors!.map(
      (author) =>
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${author.user.firstName} ${author.user.lastName}`
    )
    .join(' , ');
  return (
    <PublicationRowWrap>
      <Typography variant={'body2'}>{authorsString}</Typography>
      <PublicationHeader>{publication.previewTitle ?? ''}</PublicationHeader>
      <PublicationDescription>
        {publication.previewSubtitle ?? ''}
      </PublicationDescription>
    </PublicationRowWrap>
  );
};

const PublicationRowWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const PublicationHeader = styled.span`
  color: var(--text-primary, #040036);

  /* typography/h4 */
  font-family: Roboto;
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 123.5%; /* 41.99px */
  letter-spacing: 0.25px;

  margin: 16px 0;
`;

export const PublicationDescription = styled.span`
  color: var(--text-primary, #040036);

  /* typography/body */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;
