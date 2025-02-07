import styled from '@emotion/styled';
import { Input, Switch, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import { PublicationStore } from "../store/PublicationStore"

export const DataEditMode = observer(
  (props: EditorProps): ReactElement => {
    const { publicationStore } = props;
    const booleanFieldValue = publicationStore[props.booleanField!!]
    const textFieldValue = publicationStore[props.textField!!]
    return (
      <Wrapper>
        <DataAllWrapper>
          <DataWrapper>
            <DataHeaderWrapper>
              {!booleanFieldValue && (
                <>
                  <WarningIcon
                    htmlColor={'#a8a8b4'}
                    style={{ marginRight: '5px' }}
                  />
                  <DataHeaderDisabled variant={'h6'}>
                    {props.header}
                  </DataHeaderDisabled>
                </>
              )}
              {booleanFieldValue && (
                <DataHeaderEnabled variant={'h6'}>
                  {props.header}
                </DataHeaderEnabled>
              )}
            </DataHeaderWrapper>
            <Switch
              checked={publicationStore[props.booleanField!!] as boolean}
              onClick={() => publicationStore.invertBoolean(props.booleanField!!)}
            />
          </DataWrapper>
          {booleanFieldValue && (
            <FullWidthInput
              autoFocus={!publicationStore.disableAutofocus}
              value={textFieldValue}
              onChange={(e) =>
                publicationStore.updateData(
                  props.textField as keyof PublicationStore,
                  e.currentTarget.value
                )
              }
              disableUnderline={true}
              multiline={true}
              placeholder={props.textFieldPlaceHolder}
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
        </DataAllWrapper>
      </Wrapper>
    );
  }
);

const DataHeaderEnabled = styled(Typography)`
  padding-top: 4px;
`;

const DataHeaderDisabled = styled(Typography)`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

const DataHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  margin-top: 32px;
`;

const DataAllWrapper = styled.div`
  border: 1px solid #d2d2d6;
  padding: 16px;
  border-radius: 4px;
  gap: 8px;
  align-self: stretch;
  margin-bottom: 16px;
`;

const FullWidthInput = styled(Input)`
  width: 100%;
  padding-bottom: 12px;
`;
