import React, { type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import { Avatar, Divider, IconButton, Link, Typography } from '@mui/material';
import {
  type Publication,
  PublicationStatus
} from '../apis/first-approval-api';
import { Download, RemoveRedEyeOutlined } from '@mui/icons-material';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import WarningAmber from '@mui/icons-material/WarningAmber';
import FormatQuote from '@mui/icons-material/FormatQuote';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Menu from '@mui/material/Menu';
import {
  CircularProgressWrap,
  CursorPointer,
  HeightElement,
  SpaceBetween,
  StyledMenuItem,
  Width100Percent
} from '../pages/common.styled';
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
import { CitateDialog } from '../pages/publication/CitateDialog';
import { PublicationAuthorName } from '../pages/publication/store/PublicationStore';
import { ReportProblemDialog } from '../pages/publication/ReportProblemDialog';
import Moment from 'react-moment';
import { ResearchAreaShortList } from '../pages/publication/research-area/ResearchAreaShortList';
import {
  Flex,
  FlexAlignItems,
  FlexDirection,
  FlexJustifyContent
} from '../ui-kit/flex';
import { sanitizer } from '../util/sanitizer';

export const PublicationSection = (props: {
  publication: Publication;
  profilePageStore?: ProfilePageStore;
  openDownloadersDialog: () => void;
}): ReactElement => {
  const { publication } = props;

  const authorNames = publication.authors!.map<PublicationAuthorName>(
    (author) => ({
      username: author.user?.username,
      firstName: author.firstName,
      lastName: author.lastName,
      ordinal: author.ordinal!
    })
  );
  const authors = authorNames?.sort(
    (authorName1, authorName2) => authorName1.ordinal! - authorName2.ordinal!
  );
  const authorsString = authors
    .map((author) => `${author.firstName} ${author.lastName}`)
    .join(', ');
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const openMenu = Boolean(anchor);

  const [utilAnchor, setUtilAnchor] = useState<null | HTMLElement>(null);
  const openUtilMenu = Boolean(utilAnchor);

  const [citeOpened, setCiteOpened] = useState(false);

  const [reportProblemOpened, setReportProblemOpened] = useState(false);

  const downloadPdf = async (): Promise<void> => {
    const downloadLink = document.createElement('a');
    downloadLink.href = `${window.origin}/api/publication/${publication.id}/pdf/download`;
    downloadLink.download = publication.title + '.pdf';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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

  return (
    <>
      <Link
        href={`${publicationPath}/${publication.id}`}
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
          <Authors variant={'body2'}>{authorsString}</Authors>
        </AuthorsWrap>
        <PublicationLabel variant={'h4'} component={'div'}>
          {publication.previewTitle ?? publication.title ?? 'Untitled'}
        </PublicationLabel>
        {publication.previewSubtitle && (
          <PublicationDescriptionBox
            title={publication.previewSubtitle ?? ''}
          />
        )}
        {!publication.previewSubtitle && (
          <PublicationDescriptionWrap
            variant={'body'}
            component={'div'}
            dangerouslySetInnerHTML={{
              __html: sanitizer(publication.description ?? '')
            }}></PublicationDescriptionWrap>
        )}
      </Link>
      <Flex alignItems={FlexAlignItems.center}>
        {(publication.status === PublicationStatus.PUBLISHED ||
          publication.status === PublicationStatus.READY_FOR_PUBLICATION) && (
          <Width100Percent>
            <Flex direction={FlexDirection.column}>
              <div>
                {publication.researchAreas && (
                  <ResearchAreaShortList
                    researchAreas={publication.researchAreas}
                  />
                )}
              </div>
              <HeightElement value={'16px'} />
              <Footer>
                <Flex
                  alignItems={FlexAlignItems.center}
                  justifyContent={FlexJustifyContent.spaceBetween}>
                  <Flex alignItems={FlexAlignItems.center}>
                    <Flex alignItems={FlexAlignItems.center}>
                      <RemoveRedEyeOutlined
                        style={{ marginRight: '6px' }}
                        fontSize={'small'}
                      />
                      {publication.viewsCount}
                    </Flex>
                    <Flex
                      alignItems={FlexAlignItems.center}
                      onClick={props.openDownloadersDialog}>
                      <CursorPointer>
                        <DownloadWrap
                          style={{
                            marginRight: '6px',
                            marginTop: '6px'
                          }}
                          fontSize={'small'}
                        />
                      </CursorPointer>
                      {publication.downloadsCount}
                    </Flex>
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
                          <FormatQuote
                            style={{ marginRight: 16 }}></FormatQuote>
                          Cite
                        </StyledMenuItem>
                        <StyledMenuItem
                          onClick={() => {
                            copyPublicationLinkToClipboard().then(() => {
                              handleUtilMenuClose();
                            });
                          }}>
                          <ContentCopy
                            style={{ marginRight: 16 }}></ContentCopy>
                          Copy publication link
                        </StyledMenuItem>
                        <Divider></Divider>
                        <StyledMenuItem
                          onClick={() => {
                            handleUtilMenuClose();
                            setReportProblemOpened(true);
                          }}>
                          <WarningAmber
                            style={{ marginRight: 16 }}></WarningAmber>
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
                        authorNames={authors}
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
                  </Flex>
                  {publication.status ===
                    PublicationStatus.READY_FOR_PUBLICATION && (
                    <Flex alignItems={FlexAlignItems.center}>
                      <CircularProgressWrap size={32} />
                      <Typography variant={'body2'}>Publishing...</Typography>
                    </Flex>
                  )}
                  {publication.status === PublicationStatus.PUBLISHED && (
                    <div>
                      <Moment format={'D MMMM YYYY'}>
                        {publication.publicationTime}
                      </Moment>
                    </div>
                  )}
                </Flex>
              </Footer>
            </Flex>
          </Width100Percent>
        )}
        {publication.status === PublicationStatus.PENDING && (
          <SpaceBetween>
            <Flex alignItems={FlexAlignItems.center}>
              <DraftBadge variant={'body2'}>Draft</DraftBadge>
              <LastEdited variant={'body2'}>
                {getTimeElapsedString(publication.editingTime)}
              </LastEdited>
            </Flex>
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
      </Flex>
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

const AuthorsWrap = styled.div`
  display: flex;
  align-items: center;
`;

const Authors = styled(Typography)`
  margin-left: 8px;
`;

const PublicationDescriptionBox = (props: { title: string }): ReactElement => {
  return (
    <PublicationDescriptionWrap variant={'body'} component={'div'}>
      {props.title}
    </PublicationDescriptionWrap>
  );
};

const PublicationDescriptionWrap = styled(Typography)`
  margin-bottom: 24px;

  word-break: break-word;
` as typeof Typography;

const DividerWrap = styled(Divider)`
  margin-top: 40px;
  margin-bottom: 40px;
`;

const PublicationLabel = styled(Typography)`
  margin: 16px 0;
  word-break: break-word;
` as typeof Typography;

const Footer = styled.div`
  width: 100%;
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

const DownloadWrap = styled(Download)`
  margin-left: 24px;
`;

const DraftBadge = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;

  width: 48px;
  height: 32px;
  border-radius: 4px;
  background: var(--amber-50, #fff8e1);

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

const LastEdited = styled(Typography)`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

const CustomMenuItem = styled(MenuItem)`
  cursor: pointer;
  height: 52px;
`;
