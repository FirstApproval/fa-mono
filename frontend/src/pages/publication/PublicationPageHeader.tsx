import { HeaderComponent } from '../../components/HeaderComponent';
import { Logo, StyledMenuItem } from '../common.styled';
import { routerStore } from '../../core/router';
import logo from '../../assets/logo-black-short.svg';
import { BetaDialogWithButton } from '../../components/BetaDialogWithButton';
import { Button, Tooltip, Typography } from '@mui/material';
import {
  MAX_CHARACTER_COUNT,
  PublicationStore,
  SavingStatusState,
  Section,
  ViewMode
} from './store/PublicationStore';
import { Page } from '../../core/router/constants';
import { Edit } from '@mui/icons-material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { UserMenu } from '../../components/UserMenu';
import React, { MutableRefObject, ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import { useIsHorizontalOverflow } from '../../util/overflowUtil';
import { FileSystemFA } from '../../fire-browser/FileSystemFA';
import Menu from '@mui/material/Menu';
import { PublicationPageStore } from './store/PublicationPageStore';
import { observer } from 'mobx-react-lite';

export const PublicationPageHeader = observer(
  (props: {
    publicationPageStore: PublicationPageStore;
    publicationStore: PublicationStore;
    fs: FileSystemFA;
    sfs: FileSystemFA;
    setContentLicensingDialogOpen: (value: boolean) => void;
    setValidationDialogOpen: (value: boolean) => void;
    setDeleteDialogOpen: (value: boolean) => void;
    setOpenLimitSnackbar: (value: boolean) => void;
    setValidationErrors: (value: Section[]) => void;
  }): ReactElement => {
    const {
      publicationPageStore,
      publicationStore,
      fs,
      sfs,
      setContentLicensingDialogOpen,
      setValidationDialogOpen,
      setDeleteDialogOpen,
      setOpenLimitSnackbar,
      setValidationErrors
    } = props;
    const { validate } = publicationStore;

    const nameRef: MutableRefObject<HTMLDivElement | null> = React.useRef(null);
    const isOverflow = useIsHorizontalOverflow(nameRef, () => {});

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = (): void => {
      setAnchorEl(null);
    };

    const validateSections = (): boolean => {
      const result = validate();
      const isValid = result.length === 0;
      setValidationDialogOpen(!isValid);
      setValidationErrors(result);
      return isValid;
    };

    const nextViewMode =
      publicationStore.viewMode === ViewMode.PREVIEW
        ? ViewMode.EDIT
        : ViewMode.PREVIEW;

    return (
      <>
        {publicationStore.isView &&
          (publicationStore.isPublished || publicationStore.isPublishing) && (
            <HeaderComponent
              showAboutUsButton={true}
              showPublishButton={true}
              showLoginButton={true}
              showSignUpContainedButton={true}
            />
          )}
        {!publicationStore.isPublished && !publicationStore.isPublishing && (
          <FlexHeader>
            <ToolbarContainer>
              <div style={{ display: 'flex' }}>
                <Logo onClick={routerStore.goHome}>
                  <img src={logo} />
                </Logo>
                <BetaDialogWithButton />
                {!publicationStore.isView && (
                  <>
                    {!publicationStore.isExceededLimit && (
                      <Tooltip
                        title={
                          isOverflow
                            ? `${publicationStore.creator?.firstName} ${publicationStore.creator?.lastName}`
                            : undefined
                        }>
                        <DraftedBy variant={'body1'} ref={nameRef}>
                          Draft by
                          {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                          {` ${publicationStore.creator?.firstName} ${publicationStore.creator?.lastName}`}
                        </DraftedBy>
                      </Tooltip>
                    )}
                    {publicationStore.isExceededLimit && (
                      <CharacterCountWrap>
                        <ErrorSpanWrap color="error">
                          {publicationStore.characterCount}
                        </ErrorSpanWrap>
                        {`/${MAX_CHARACTER_COUNT}`}
                      </CharacterCountWrap>
                    )}
                    {publicationStore.savingStatus ===
                      SavingStatusState.SAVING && (
                      <SavingStatus variant={'body1'}>Saving...</SavingStatus>
                    )}
                    {publicationStore.savingStatus ===
                      SavingStatusState.SAVED && (
                      <SavingStatus variant={'body1'}>Saved</SavingStatus>
                    )}
                  </>
                )}
              </div>
              <FlexDiv>
                {!publicationStore.isView && (
                  <>
                    {publicationStore.viewMode === ViewMode.PREVIEW && (
                      <ButtonWrap
                        disabled={fs.activeUploads > 0 || sfs.activeUploads > 0}
                        variant="contained"
                        size={'medium'}
                        onClick={async () => {
                          if (publicationStore.isExceededLimit) {
                            setOpenLimitSnackbar(true);
                            return;
                          }
                          const isValid = validateSections();
                          if (isValid) {
                            routerStore.navigatePage(
                              Page.SHARING_OPTIONS,
                              routerStore.path,
                              true,
                              {
                                publicationTitle: publicationStore.title,
                                publicationSummary:
                                  publicationStore.summary[0].text.substring(
                                    0,
                                    200
                                  ),
                                licenseType: publicationStore.licenseType,
                                filesSize: await fs.getPublicationFilesSize()
                              }
                            );
                          }
                        }}>
                        Publish
                      </ButtonWrap>
                    )}
                    <ButtonWrap
                      disabled={fs.uploadProgress.inProgress > 0}
                      variant={
                        publicationStore.viewMode === ViewMode.PREVIEW
                          ? 'outlined'
                          : 'contained'
                      }
                      size={'medium'}
                      onClick={() => {
                        if (
                          nextViewMode !== ViewMode.PREVIEW ||
                          validateSections()
                        ) {
                          publicationStore.viewMode = nextViewMode;
                        }
                      }}>
                      {nextViewMode === ViewMode.EDIT ? (
                        <Edit
                          sx={{
                            width: '20px',
                            height: '20px'
                          }}
                          style={{ marginRight: '8px' }}
                        />
                      ) : (
                        ''
                      )}
                      {nextViewMode}
                    </ButtonWrap>
                    <ButtonWrap
                      marginright="0px"
                      variant="outlined"
                      size={'medium'}
                      onClick={handleClick}>
                      <span style={{ marginLeft: 8 }}>More</span>
                      <ExpandMore
                        sx={{
                          width: 20,
                          height: 20,
                          marginLeft: '8px'
                        }}
                      />
                    </ButtonWrap>
                  </>
                )}
                <UserMenu />
              </FlexDiv>
            </ToolbarContainer>
          </FlexHeader>
        )}
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
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
          }}>
          <StyledMenuItem
            onClick={async () => {
              if (validateSections()) {
                await publicationPageStore.downloadPdf();
              }
              handleClose();
            }}>
            Preview PDF
          </StyledMenuItem>
          <StyledMenuItem
            onClick={() => {
              setContentLicensingDialogOpen(true);
              handleClose();
            }}>
            Content licensing
          </StyledMenuItem>
          <StyledMenuItem
            onClick={() => {
              setDeleteDialogOpen(true);
              handleClose();
            }}>
            Delete draft
          </StyledMenuItem>
        </Menu>
      </>
    );
  }
);

const FlexHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #eeeeee;
  padding: 12px 32px;
  height: 64px;
  margin-bottom: 80px;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;

  background-color: #fff;
  z-index: 10;
`;

const ButtonWrap = styled(Button)<{ marginright?: string }>`
  margin-right: ${(props) => props.marginright ?? '24px'};
  width: 90px;
  height: 36px;
`;

const ToolbarContainer = styled.div`
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: 988px;
  display: flex;
`;

const DraftedBy = styled(Typography)`
  margin: 0 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
`;

const SavingStatus = styled(Typography)`
  color: var(--text-secondary, #68676e);
`;

const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ErrorSpanWrap = styled.span`
  color: var(--error-main, #d32f2f);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/body1 */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
`;

const CharacterCountWrap = styled.div`
  margin: 0 16px;
  max-width: 260px;
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/body1 */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: 0.15px;
`;
