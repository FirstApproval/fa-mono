import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';

export const NegativeDataViewMode = observer(
  (props: EditorProps): ReactElement => {
    const { publicationStore } = props;
    return (
      <NegativeDataViewWrapper>
        <NegativeDataHeaderEnabled variant={'h6'}>
          The data is negative
        </NegativeDataHeaderEnabled>
        <NegativeDataTextViewMode variant={'body'} component={'div'}>
          {publicationStore.negativeData}
        </NegativeDataTextViewMode>
      </NegativeDataViewWrapper>
    );
  }
);
const NegativeDataHeaderEnabled = styled(Typography)`
  padding-top: 4px;
`;

const NegativeDataViewWrapper = styled.div`
  display: flex;
  width: var(--stringLength, 680px);
  flex-direction: column;
  padding: 16px;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;

  border-radius: 4px;
  background: var(--grey-50, #f8f7fa);

  margin-bottom: 15px;
`;

const NegativeDataTextViewMode = styled(Typography)`
  word-break: break-word;
` as typeof Typography;
