import React, { type ReactElement, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Moment from 'react-moment';
import views from './../../../assets/views.svg';
import downloads from './../../../assets/downloads.svg';
import { Button, Tooltip, Typography } from '@mui/material';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import styled from '@emotion/styled';
import { PublicationShortInfo } from '../../../apis/first-approval-api';

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

    const [utilAnchor, setUtilAnchor] = useState<null | HTMLElement>(null);
    const openUtilMenu = Boolean(utilAnchor);

    const [reportProblemOpened, setReportProblemOpened] = useState(false);

    const handleUtilMenuClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ): void => {
      setUtilAnchor(event.currentTarget);
    };

    const handleUtilMenuClose = (): void => {
      setUtilAnchor(null);
    };

    return (
      <FlexWrapRowSpaceBetween variant={'body2'} component={'div'}>
        <FlexWrapRow>
          <Moment format={'D MMMM YYYY'}>{publicationTime}</Moment>
          <div
            style={{
              marginLeft: '24px',
              display: 'flex',
              alignItems: 'center'
            }}>
            <img src={views} width={20} height={20} />
            <div style={{ marginLeft: '4px' }}>{viewsCount}</div>
          </div>
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
              <AlternateEmailOutlinedIcon />
              <div style={{ marginLeft: '4px' }}>{collaboratorsCount}</div>
            </div>
          </Tooltip>
        </FlexWrapRow>
      </FlexWrapRowSpaceBetween>
    );
  }
);

export const FlexWrapRowSpaceBetween = styled(Typography)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #68676e;
` as typeof Typography;

const LicensingLinkWrap = styled.div`
  cursor: pointer;

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));

  /* typography/caption */
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 166%; /* 19.92px */
  letter-spacing: 0.4px;
`;

export const FlexWrapRow = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const UnderCollaborationRequirements = styled(Typography)`
  display: flex;
  height: 48px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

const RequestCollaborationButton = styled(Button)`
  display: flex;
  height: 32px;
  padding: 4px 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 1px solid;

  margin-left: 24px;
`;
