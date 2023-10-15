import styled from '@emotion/styled';
import { Input, Switch, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import WarningIcon from '@mui/icons-material/Warning';

export const NegativeDataEditMode = observer(
  (props: EditorProps): ReactElement => {
    const { publicationStore } = props;
    return (
      <NegativeDataAllWrapper>
        <NegativeDataWrapper>
          <NegativeDataHeaderWrapper>
            {!publicationStore.isNegative && (
              <>
                <WarningIcon
                  htmlColor={'#a8a8b4'}
                  style={{ marginRight: '5px' }}
                />
                <NegativeDataHeaderDisabled variant={'h6'}>
                  My data is negative
                </NegativeDataHeaderDisabled>
              </>
            )}
            {publicationStore.isNegative && (
              <NegativeDataHeaderEnabled variant={'h6'}>
                My data is negative
              </NegativeDataHeaderEnabled>
            )}
          </NegativeDataHeaderWrapper>
          <Switch
            checked={publicationStore.isNegative}
            onClick={publicationStore.invertNegativeData}
          />
        </NegativeDataWrapper>
        {publicationStore.isNegative && (
          <FullWidthInput
            autoFocus
            value={publicationStore.negativeData}
            onChange={(e) => {
              publicationStore.updateNegativeData(e.currentTarget.value);
            }}
            disableUnderline={true}
            multiline={true}
            placeholder="Why your data didn't confirm the initial hypothesis or expectations"
            minRows={1}
            maxRows={4}
            inputProps={{
              disableUnderline: true,
              autoComplete: 'off',
              style: {
                fontSize: '20px',
                fontWeight: '400',
                fontStyle: 'normal',
                lineHeight: '160%'
              }
            }}
          />
        )}
      </NegativeDataAllWrapper>
    );
  }
);
const NegativeDataHeaderEnabled = styled(Typography)`
  padding-top: 4px;
`;

const NegativeDataHeaderDisabled = styled(Typography)`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

const NegativeDataHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NegativeDataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NegativeDataAllWrapper = styled.div`
  border: 1px solid #d2d2d6;
  padding: 4px 0 4px 8px;
  border-radius: 4px;
  gap: 8px;
  align-self: stretch;
  margin-bottom: 16px;
`;

const FullWidthInput = styled(Input)`
  width: 100%;
  padding-bottom: 12px;
`;
