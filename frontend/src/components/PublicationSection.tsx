import React, { type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import { Avatar, Divider, IconButton, Link, Tooltip } from '@mui/material';
import {
  type Publication,
  PublicationStatus
} from '../apis/first-approval-api';
import { Download, RemoveRedEyeOutlined } from '@mui/icons-material';
import { findResearchAreaIcon } from '../pages/publication/store/ResearchAreas';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import WarningAmber from '@mui/icons-material/WarningAmber';
import FormatQuote from '@mui/icons-material/FormatQuote';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Menu from '@mui/material/Menu';
import { SpaceBetween, StyledMenuItem } from '../pages/common.styled';
import { getTimeElapsedString } from '../util/dateUtil';
import MenuItem from '@mui/material/MenuItem';
import { ConfirmationDialog } from './ConfirmationDialog';
import { ProfilePageStore } from '../pages/user/ProfilePageStore';

import { renderProfileImage } from '../util/userUtil';
import {
  publicationPath,
  shortPublicationPath
} from '../core/router/constants';
import pdf from '../pages/publication/asset/pdf.svg';
import { publicationService } from '../core/service';
import { CitateDialog } from '../pages/publication/CitateDialog';
import { PublicationAuthorName } from '../pages/publication/store/PublicationStore';
import { ReportProblemDialog } from '../pages/publication/ReportProblemDialog';

export const PublicationSection = (props: {
  publication: Publication;
  profilePageStore?: ProfilePageStore;
  openDownloadersDialog: () => void;
}): ReactElement => {
  const { publication } = props;
  const authorsString = publication
    .confirmedAuthors!.map(
      (author) => `${author.user.firstName} ${author.user.lastName}`
    )
    .join(', ');
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const openMenu = Boolean(anchor);

  const [utilAnchor, setUtilAnchor] = useState<null | HTMLElement>(null);
  const openUtilMenu = Boolean(utilAnchor);

  const [citeOpened, setCiteOpened] = useState(false);

  const [reportProblemOpened, setReportProblemOpened] = useState(false);

  const downloadPdf = async (): Promise<void> => {
    const pdf = await publicationService.downloadPdf(publication.id);
    const linkSource = `data:application/pdf;base64,${pdf.data}`;
    const downloadLink = document.createElement('a');
    const fileName = publication.title + '.pdf';
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  const copyPublicationLinkToClipboard = async (): Promise<void> => {
    const text = window.location.host + shortPublicationPath + publication.id;
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand('copy', true, text);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchor(null);
  };

  const handleUtilMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setUtilAnchor(event.currentTarget);
  };

  const handleUtilMenuClose = (): void => {
    setUtilAnchor(null);
  };

  const confirmedAuthorNames =
    props.publication.confirmedAuthors?.map<PublicationAuthorName>(
      (author) => ({
        username: author.user.username,
        firstName: author.user.firstName,
        lastName: author.user.lastName
      })
    );
  const unconfirmedAuthorNames =
    props.publication.unconfirmedAuthors?.map<PublicationAuthorName>(
      (author) => ({
        firstName: author.firstName,
        lastName: author.lastName
      })
    );

  return (
    <>
      <Link
        href={`${publicationPath}${publication.id}`}
        underline={'none'}
        color={'#040036'}>
        <AuthorsWrap>
          <Avatar
            src={renderProfileImage(publication.creator.profileImage)}
            sx={{
              width: 24,
              height: 24
            }}
          />
          <Authors>{authorsString}</Authors>
        </AuthorsWrap>
        <PublicationLabel>
          {publication.previewTitle ?? 'Untitled'}
        </PublicationLabel>
        <PublicationDescriptionBox title={publication.previewSubtitle ?? ''} />
      </Link>
      <FlexWrap>
        {publication.status === PublicationStatus.PUBLISHED && (
          <>
            <ResearchAreas publication={publication} />
            <Footer>
              <RemoveRedEyeOutlined
                style={{ marginRight: '6px' }}
                fontSize={'small'}
              />
              {publication.viewsCount}
              <FlexWrap
                style={{ cursor: 'pointer' }}
                onClick={props.openDownloadersDialog}>
                <DownloadWrap
                  style={{ marginRight: '6px' }}
                  fontSize={'small'}
                />
                {publication.downloadsCount}
              </FlexWrap>
              <div>
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
                      downloadPdf().then(() => {
                        handleUtilMenuClose();
                      });
                    }}>
                    <img
                      src={pdf}
                      style={{
                        marginRight: 16,
                        width: 24,
                        height: 24
                      }}
                    />
                    PDF
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={() => {
                      setCiteOpened(true);
                      handleUtilMenuClose();
                    }}>
                    <FormatQuote style={{ marginRight: 16 }}></FormatQuote>
                    Cite
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={() => {
                      copyPublicationLinkToClipboard().then(() => {
                        handleUtilMenuClose();
                      });
                    }}>
                    <ContentCopy style={{ marginRight: 16 }}></ContentCopy>
                    Copy publication link
                  </StyledMenuItem>
                  <Divider></Divider>
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
                  publicationId={publication.id}
                  setIsOpen={(value) =>
                    setReportProblemOpened(value)
                  }></ReportProblemDialog>
                <CitateDialog
                  isOpen={citeOpened}
                  setIsOpen={(value) => setCiteOpened(value)}
                  authorNames={[
                    ...(confirmedAuthorNames ?? []),
                    ...(unconfirmedAuthorNames ?? [])
                  ]}
                  publicationTime={
                    props.publication.publicationTime
                      ? new Date(props.publication.publicationTime)
                      : null
                  }
                  publicationTitle={
                    props.publication.title ? props.publication.title : ''
                  }
                />
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
            </Footer>
          </>
        )}
        {publication.status !== PublicationStatus.PUBLISHED && (
          <SpaceBetween>
            <FlexWrap>
              <DraftTag>Draft</DraftTag>
              <LastEdited>
                {getTimeElapsedString(publication.editingTime)}
              </LastEdited>
            </FlexWrap>
            <>
              <div>
                <IconButton
                  onClick={handleMenuClick}
                  size="small"
                  sx={{ ml: 3 }}
                  aria-controls={openMenu ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? 'true' : undefined}>
                  <MoreHoriz htmlColor={'#68676E'} />
                </IconButton>
              </div>
              <Menu
                id="user-menu"
                anchorEl={anchor}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                MenuListProps={{
                  sx: { py: 0 },
                  'aria-labelledby': 'user-button'
                }}>
                <CustomMenuItem
                  onClick={() => {
                    setDeleteDialogOpen(true);
                    handleMenuClose();
                  }}>
                  Delete draft
                </CustomMenuItem>
              </Menu>
            </>
          </SpaceBetween>
        )}
      </FlexWrap>
      <DividerWrap />
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          await props.profilePageStore?.deletePublication(publication.id);
        }}
        title={'Delete?'}
        text={
          'Everything will be deleted and you won’t be able to undo this action.'
        }
        yesText={'Delete'}
        noText={'Cancel'}
      />
    </>
  );
};

const ResearchAreas = (props: { publication: Publication }): ReactElement => {
  return (
    <>
      {props.publication.researchAreas
        ?.map((researchArea) => {
          return (
            <PublicationAreaWrap key={researchArea.text}>
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
                  {findResearchAreaIcon(researchArea.text)}
                </div>
                {researchArea.text}
              </div>
            </PublicationAreaWrap>
          );
        })
        .slice(0, 1)}
      {props.publication.researchAreas?.length &&
        props.publication.researchAreas?.length > 1 && (
          <PublicationAreaWrap>
            <Tooltip
              title={props.publication.researchAreas
                .map((ra) => ra.text)
                .join(', ')}>
              <div
                style={{
                  cursor: 'pointer',
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                {(props.publication.researchAreas?.length &&
                  props.publication.researchAreas?.length) - 1}{' '}
                more...
              </div>
            </Tooltip>
          </PublicationAreaWrap>
        )}
    </>
  );
};

const AuthorsWrap = styled.div`
  display: flex;
  align-items: center;
`;

const Authors = styled.span`
  margin-left: 8px;
  color: var(--text-primary, #040036);

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;
`;

const PublicationDescriptionBox = (props: { title: string }): ReactElement => {
  return <PublicationDescriptionWrap>{props.title}</PublicationDescriptionWrap>;
};

const PublicationDescriptionWrap = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;

  margin-bottom: 24px;

  word-break: break-word;
`;

const DividerWrap = styled(Divider)`
  margin-top: 40px;
  margin-bottom: 40px;
`;

const PublicationAreaWrap = styled.div`
  display: inline-flex;
  padding: 2px 8px;
  align-items: center;
  margin-right: 8px;

  border-radius: 4px;
  background: var(--grey-50, #f8f7fa);

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;

  word-break: break-word;
`;

const PublicationLabel = styled.div`
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 123.5%; /* 41.99px */
  letter-spacing: 0.25px;

  margin: 16px 0;
  word-break: break-word;
`;

const FlexWrap = styled.div`
  //margin-top: auto;
  display: flex;
  align-items: center;
`;

const Footer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

const DownloadWrap = styled(Download)`
  margin-left: 24px;
`;

const DraftTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;

  width: 48px;
  height: 32px;
  border-radius: 4px;
  background: var(--amber-50, #fff8e1);

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body2 */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;
`;

const LastEdited = styled.span`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/body2 */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;
`;

const CustomMenuItem = styled(MenuItem)`
  cursor: pointer;
  height: 52px;
`;
