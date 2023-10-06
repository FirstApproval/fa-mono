import React, { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import lock from './asset/lock.svg';
import { Typography } from '@mui/material';

export const DraftText = observer((): ReactElement => {
  const DraftWrap = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `;

  const DraftTextWrap = styled(Typography)`
    color: var(--text-secondary, #68676e);
    margin-left: 4px;
  `;

  return (
    <DraftWrap>
      <img src={lock} width={'18px'} height={'18px'} />
      <DraftTextWrap variant={'body2'}>
        Preview mode. Not published.
      </DraftTextWrap>
    </DraftWrap>
  );
});
