import React, { type ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import Moment from 'react-moment';
import views from './../../../assets/views.svg';
import downloads from './../../../assets/downloads.svg';
import { Tooltip, Typography } from '@mui/material';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import styled from '@emotion/styled';
import { PublicationShortInfo } from '../../../apis/first-approval-api';
import { HeightElement } from "../../common.styled"

export const PublicationInfoBox = observer(
  (props: {
    publicationInfo: PublicationShortInfo;
    // openDownloadersDialog: () => void;
    // openCollaborationRequestsDialog: () => void;
  }): ReactElement => {
    const { publicationInfo } = props;

    const {
      title,
      viewsCount,
      downloadsCount,
      collaboratorsCount,
      publicationTime
    } = publicationInfo;

    debugger;

    return (
      <FlexWrapRowSpaceBetween variant={'body2'} component={'div'}>
        <FlexWrapRow>
          <Moment format={'D MMMM YYYY'}>{publicationTime}</Moment>
          <Tooltip title="Number of views">
            <div
              style={{
                marginLeft: '24px',
                display: 'flex',
                alignItems: 'center',
                cursor: `${
                  viewsCount && viewsCount > 0 ? 'pointer' : 'initial'
                }`
              }}>
              <img src={views} width={20} height={20} />
              <div style={{ marginLeft: '4px' }}>{viewsCount}</div>
            </div>
          </Tooltip>
          <Tooltip title="Number of downloads">
            <div
              onClick={() => {
                if (downloadsCount) {
                  // props.openDownloadersDialog();
                }
              }}
              style={{
                marginLeft: '24px',
                display: 'flex',
                alignItems: 'center',
                cursor: `${
                  downloadsCount && downloadsCount > 0 ? 'pointer' : 'initial'
                }`
              }}>
              <img src={downloads} width={20} height={20} />
              <div style={{ marginLeft: '4px' }}>{downloadsCount}</div>
            </div>
          </Tooltip>
          <Tooltip title="Number of collaborators">
            <div
              onClick={() => {
                if (collaboratorsCount) {
                  // props.openCollaborationRequestsDialog();
                }
              }}
              style={{
                marginLeft: '24px',
                display: 'flex',
                alignItems: 'center',
                cursor: `${
                  collaboratorsCount && collaboratorsCount > 0
                    ? 'pointer'
                    : 'initial'
                }`
              }}>
              <AlternateEmailOutlinedIcon htmlColor={'#9c9c9f'} />
              <div style={{ marginLeft: '4px' }}>{collaboratorsCount}</div>
            </div>
          </Tooltip>
        </FlexWrapRow>
        <HeightElement value={'4px'} />
        <FlexWrapRow>
          <TitleWrap>{title}</TitleWrap>
        </FlexWrapRow>
      </FlexWrapRowSpaceBetween>
    );
  }
);

export const FlexWrapRowSpaceBetween = styled(Typography)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  color: #68676e;
` as typeof Typography;

export const FlexWrapRow = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const TitleWrap = styled(Typography)`
  font-weight: 500;
  font-family: Roboto;
  color: var(--text-secondary, #68676e);
` as typeof Typography;
