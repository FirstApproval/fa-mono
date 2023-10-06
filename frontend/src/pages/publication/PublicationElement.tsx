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
      <PublicationHeader variant={'h4'}>
        {publication.previewTitle ?? ''}
      </PublicationHeader>
      <Typography variant={'body'}>
        {publication.previewSubtitle ?? ''}
      </Typography>
    </PublicationRowWrap>
  );
};

const PublicationRowWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const PublicationHeader = styled(Typography)`
  margin: 16px 0;
`;
