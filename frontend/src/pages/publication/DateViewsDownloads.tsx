import React, { type ReactElement, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Moment from 'react-moment';
import views from './asset/views.svg';
import downloads from './asset/downloads.svg';
import { type PublicationStore } from './store/PublicationStore';
import Menu from '@mui/material/Menu';
import { StyledMenuItem } from '../common.styled';
import { IconButton, Tooltip, Typography } from '@mui/material';
import WarningAmber from '@mui/icons-material/WarningAmber';
import { ReportProblemDialog } from './ReportProblemDialog';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import styled from '@emotion/styled';
import { getContentLicensingAbbreviation } from '../../util/publicationUtils';
import { routerStore } from '../../core/router';
import { LicenseType } from '../../apis/first-approval-api';

export const DateViewsDownloads = observer(
  (props: {
    publicationStore: PublicationStore;
    displayLicense: boolean;
    openDownloadersDialog: () => void;
  }): ReactElement => {
    const [utilAnchor, setUtilAnchor] = useState<null | HTMLElement>(null);
    const openUtilMenu = Boolean(utilAnchor);

    const [reportProblemOpened, setReportProblemOpened] = useState(false);
    const licenseTypeAbbreviation = getContentLicensingAbbreviation(
      props.publicationStore.licenseType
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
            {props.publicationStore.publicationTime}
          </Moment>
          <div
            style={{
              marginLeft: '24px',
              display: 'flex',
              alignItems: 'center'
            }}>
            <img src={views} width={20} height={20} />
            <div style={{ marginLeft: '4px' }}>
              {props.publicationStore.viewsCount}
            </div>
          </div>
          <div
            onClick={() => {
              if (props.publicationStore.downloadsCount) {
                props.openDownloadersDialog();
              }
            }}
            style={{
              marginLeft: '24px',
              display: 'flex',
              alignItems: 'center',
              cursor: `${
                props.publicationStore.downloadsCount &&
                props.publicationStore.downloadsCount > 0
                  ? 'pointer'
                  : 'initial'
              }`
            }}>
            <img src={downloads} width={20} height={20} />
            <div style={{ marginLeft: '4px' }}>
              {props.publicationStore.downloadsCount}
            </div>
          </div>
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
            publicationId={props.publicationStore.publicationId}
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
              props.publicationStore.licenseType ===
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
