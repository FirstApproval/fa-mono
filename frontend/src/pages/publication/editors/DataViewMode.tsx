import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';

export const DataViewMode = observer(
  (props: EditorProps): ReactElement => {
    const { publicationStore, header } = props;
    return (
      <Wrapper>
        <NegativeDataViewWrapper>
          <NegativeDataHeaderEnabled variant={'h6'}>
            {header}
          </NegativeDataHeaderEnabled>
          <NegativeDataTextViewMode variant={'body'} component={'div'}>
            {publicationStore.negativeData}
          </NegativeDataTextViewMode>
        </NegativeDataViewWrapper>
      </Wrapper>
    );
  }
);

const Wrapper = styled.div`
  margin-top: 32px;
`;

const NegativeDataHeaderEnabled = styled(Typography)`
  padding-top: 4px;
`;

const NegativeDataViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;

  border-radius: 4px;
  background: var(--grey-50, #f8f7fa);

  margin-bottom: 16px;
`;

const NegativeDataTextViewMode = styled(Typography)`
  word-break: break-word;
` as typeof Typography;
