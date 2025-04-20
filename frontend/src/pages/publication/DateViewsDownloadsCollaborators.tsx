import React, { type ReactElement, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Moment from 'react-moment';
import views from './asset/views.svg';
import downloads from './asset/downloads.svg';
import { type PublicationStore } from './store/PublicationStore';
import Menu from '@mui/material/Menu';
import { StyledMenuItem } from '../common.styled';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import WarningAmber from '@mui/icons-material/WarningAmber';
import { ReportProblemDialog } from './ReportProblemDialog';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import styled from '@emotion/styled';
import { getContentLicensingAbbreviation } from '../../util/publicationUtils';
import { routerStore } from '../../core/router';
import { LicenseType } from '../../apis/first-approval-api';
import { collaborationStore } from './store/downloadsStore';

export const DateViewsDownloadsCollaborators = observer(
  (props: {
    publicationStore: PublicationStore;
    displayLicense: boolean;
    openDownloadersDialog: () => void;
    openCollaborationRequestsDialog: () => void;
  }): ReactElement => {
    const [utilAnchor, setUtilAnchor] = useState<null | HTMLElement>(null);
    const openUtilMenu = Boolean(utilAnchor);
    const { publicationStore } = props;

    const [reportProblemOpened, setReportProblemOpened] = useState(false);
    const licenseTypeAbbreviation = getContentLicensingAbbreviation(
      publicationStore.licenseType
    );

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
          <Moment format={'D MMMM YYYY'}>
            {publicationStore.publicationTime}
          </Moment>
          <Tooltip title="Number of views">
            <div
              style={{
                marginLeft: '24px',
                display: 'flex',
                alignItems: 'center'
              }}>
              <img src={views} width={20} height={20} />
              <div style={{ marginLeft: '4px' }}>
                {publicationStore.viewsCount}
              </div>
            </div>
          </Tooltip>
          <Tooltip title="Number of downloads">
            <div
              onClick={() => {
                if (publicationStore.downloadsCount) {
                  props.openDownloadersDialog();
                }
              }}
              style={{
                marginLeft: '24px',
                display: 'flex',
                alignItems: 'center',
                cursor: `${
                  publicationStore.downloadsCount &&
                  publicationStore.downloadsCount > 0
                    ? 'pointer'
                    : 'initial'
                }`
              }}>
              <img src={downloads} width={20} height={20} />
              <div style={{ marginLeft: '4px' }}>
                {publicationStore.downloadsCount}
              </div>
            </div>
          </Tooltip>
          <Tooltip title="Number of collaborators">
            <div
              onClick={() => {
                if (publicationStore.collaboratorsCount) {
                  props.openCollaborationRequestsDialog();
                }
              }}
              style={{
                marginLeft: '24px',
                display: 'flex',
                alignItems: 'center',
                cursor: `${
                  publicationStore.collaboratorsCount &&
                  publicationStore.collaboratorsCount > 0
                    ? 'pointer'
                    : 'initial'
                }`
              }}>
              <AlternateEmailOutlinedIcon />
              <div style={{ marginLeft: '4px' }}>
                {publicationStore.collaboratorsCount}
              </div>
            </div>
          </Tooltip>
          {publicationStore.isDownloadedByUser ? (
            <RequestCollaborationButton
              color="primary"
              variant="text"
              size={'small'}
              onClick={() =>
                (collaborationStore.openCreateCollaborationRequestDialog = true)
              }>
              Request collaboration
            </RequestCollaborationButton>
          ) : (
            <UnderCollaborationRequirements variant={'body2'}>
              Under collaboration requirements
            </UnderCollaborationRequirements>
          )}
          <Menu
            anchorEl={utilAnchor}
            id="user-menu"
            onClose={handleUtilMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            MenuListProps={{
              'aria-labelledby': 'user-button'
            }}
            open={openUtilMenu}>
            <StyledMenuItem
              onClick={() => {
                handleUtilMenuClose();
                setReportProblemOpened(true);
              }}>
              <WarningAmber style={{ marginRight: 16 }}></WarningAmber>
              Report problem
            </StyledMenuItem>
          </Menu>
          <ReportProblemDialog
            isOpen={reportProblemOpened}
            publicationId={publicationStore.publicationId}
            setIsOpen={(value) =>
              setReportProblemOpened(value)
            }></ReportProblemDialog>
          <Tooltip title="More">
            <IconButton
              onClick={handleUtilMenuClick}
              size="small"
              sx={{ ml: 3 }}
              aria-controls={openUtilMenu ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openUtilMenu ? 'true' : undefined}>
              <MoreHoriz htmlColor={'#68676E'} />
            </IconButton>
          </Tooltip>
        </FlexWrapRow>
        <LicensingLinkWrap
          onClick={() => {
            routerStore.openInNewTab(
              publicationStore.licenseType ===
                LicenseType.ATTRIBUTION_NO_DERIVATIVES
                ? 'https://creativecommons.org/licenses/by-nd/4.0/legalcode'
                : 'https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode'
            );
          }}>
          {props.displayLicense && `License: ${licenseTypeAbbreviation}`}
        </LicensingLinkWrap>
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
