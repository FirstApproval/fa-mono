import React, { type ReactElement, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Moment from 'react-moment';
import views from './asset/views.svg';
import downloads from './asset/downloads.svg';
import { type PublicationStore } from './store/PublicationStore';
import Menu from '@mui/material/Menu';
import { StyledMenuItem } from '../common.styled';
import { IconButton } from '@mui/material';
import WarningAmber from '@mui/icons-material/WarningAmber';
import { ReportProblemDialog } from './ReportProblemDialog';
import MoreHoriz from '@mui/icons-material/MoreHoriz';

export const DateViewsDownloads = observer(
  (props: {
    publicationStore: PublicationStore;
    openDownloadersDialog: () => void;
  }): ReactElement => {
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '20px',
          letterSpacing: '0.17000000178813934px',
          color: '#68676E'
        }}>
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
          onClick={props.openDownloadersDialog}
          style={{
            marginLeft: '24px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
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
        <IconButton
          onClick={handleUtilMenuClick}
          size="small"
          sx={{ ml: 3 }}
          aria-controls={openUtilMenu ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openUtilMenu ? 'true' : undefined}>
          <MoreHoriz htmlColor={'#68676E'} />
        </IconButton>
      </div>
    );
  }
);
