import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import lock from './asset/lock.svg';

export const DraftText = observer(
  (): ReactElement => {
    const DraftWrap = styled.div`
      display: flex;
      flex-direction: row;
      align-items: center;
    `;

    const DraftTextWrap = styled.div`
      color: var(--text-secondary, #68676e);
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0.17000000178813934px;
      margin-left: 4px;
    `;

    return (
      <DraftWrap>
        <img src={lock} width={'18px'} height={'18px'} />
        <DraftTextWrap>Preview mode. Not published.</DraftTextWrap>
      </DraftWrap>
    );
  }
);
