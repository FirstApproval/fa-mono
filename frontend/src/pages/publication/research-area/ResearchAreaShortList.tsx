import React, { type ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { Paragraph } from '../../../apis/first-approval-api';
import { Flex, FlexAlignItems } from '../../../ui-kit/flex';
import { researchAreaIcon } from './ResearchAreas';
import { Typography } from '@mui/material';

export interface ResearchAreaShortListProps {
  researchAreas: Paragraph[];
}

export const ResearchAreaShortList = observer(
  (props: ResearchAreaShortListProps): ReactElement => {
    return (
      <ReadonlyContentPlaceholderWrap>
        {props.researchAreas?.slice(0, 2).map((researchArea: any) => {
          return (
            <PublicationAreaWrap variant={'body2'} key={researchArea.text}>
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
                  {researchAreaIcon(researchArea.text)}
                </div>
                {researchArea.text}
              </div>
            </PublicationAreaWrap>
          );
        })}
        {props.researchAreas?.length > 2 && (
          <PublicationAreaWrap variant={'body2'}>
            <Flex alignItems={FlexAlignItems.center} style={{ height: 32 }}>
              {props.researchAreas?.length - 2} more...
            </Flex>
          </PublicationAreaWrap>
        )}
      </ReadonlyContentPlaceholderWrap>
    );
  }
);

const ReadonlyContentPlaceholderWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
`;

const PublicationAreaWrap = styled(Typography)`
  display: inline-flex;
  padding: 2px 8px;
  align-items: center;
  margin-right: 8px;
  margin-bottom: 8px;

  border-radius: 4px;
  background: var(--grey-50, #f8f7fa);

  word-break: break-word;
`;
