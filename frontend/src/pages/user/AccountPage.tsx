import React, { type FunctionComponent, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { observer } from 'mobx-react-lite';
import {
  CustomTab,
  FlexBody,
  FlexBodyCenter,
  HeightElement,
  Parent,
  SpaceBetween
} from '../common.styled';
import styled from '@emotion/styled';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ContentCopy, DeleteForever, LockOutlined } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { userService } from '../../core/service';
import { copyTextToClipboard } from '../../fire-browser/utils';
import { validateEmail } from 'src/util/emailUtil';
import { userStore } from '../../core/user';
import { getInitials, renderProfileImage } from 'src/util/userUtil';
import _, { cloneDeep } from 'lodash';
import { Footer } from '../home/Footer';
import { HeaderComponent } from '../../components/HeaderComponent';
import {
  ActionButtonType,
  WorkplacesEditor
} from '../../components/WorkplacesEditor';
import { accountTab, getShortAuthorLink } from '../../core/router/utils';

const tabs: string[] = ['general', 'profile', 'affiliations', 'password'];

export const AccountPage: FunctionComponent = observer(() => {
  const [saveDisabled, setSaveDisabled] = useState(() => true);
  const { editableUser, user } = userStore;
  const [tab] = useState(() => accountTab());
  const [tabNumber, setTabNumber] = React.useState(
    (tab && tabs.findIndex((element) => element === tab)) ?? 0
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previousPassword, setPreviousPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showSuccessSavingAlter, setShowSuccessSavingAlter] = useState(false);

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isUsedEmail, setUsedEmail] = useState(false);
  const [isUsedUsername, setUsedUsername] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [isValidFirstName, setIsValidFirstName] = useState(true);
  const [isValidLastName, setIsValidLastName] = useState(true);
  const [isValidUsername, setIsValidUsername] = useState(true);

  const hiddenFileInput = useRef(null);

  const handleChangeTabNumber = (
    _: React.SyntheticEvent,
    newValue: number
  ): void => {
    userStore.editableUser = cloneDeep(userStore.user);
    setPreviousPassword('');
    setNewPassword('');
    setTabNumber(newValue);
  };

  const validatePassword = (): boolean => {
    const isVP = newPassword.length >= 8;
    setIsValidPassword(isVP);
    return isVP;
  };

  const openMenu = Boolean(anchor);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchor(null);
  };

  const handleCloseDeleteDialog = (): void => {
    setDeleteDialogOpen(false);
  };

  const changePassword = async (): Promise<void> => {
    const isValid = validatePassword();
    if (isValid) {
      if (editableUser?.canSetPassword) {
        await userService.setPassword({
          newPassword
        });
        setPreviousPassword('');
      } else if (editableUser?.canChangePassword) {
        await userService.changePassword({
          previousPassword,
          newPassword
        });
        setNewPassword('');
        setPreviousPassword('');
      }
      // userStore.requestUserData();
      setSaveDisabled(true);
      setShowSuccessSavingAlter(true);
    }
  };

  if (!editableUser || !user) {
    return <CircularProgress />;
  }

  const emailValidation = (): boolean => {
    const isVE =
      editableUser.email.length > 0 && validateEmail(editableUser.email);
    setIsValidEmail(isVE);
    return isVE;
  };

  const profileFieldsValidation = (): void => {
    const isVFN = editableUser.firstName.length > 0;
    setIsValidFirstName(isVFN);
    const isVLN = editableUser.lastName.length > 0;
    setIsValidLastName(isVLN);
    const isVUN = editableUser.username.length > 0;
    setIsValidUsername(isVUN);
    setSaveDisabled(!isVFN || !isVLN || !isVUN);
  };

  const updateUserInfo = async (): Promise<void> => {
    if (emailValidation() && editableUser?.email !== user.email) {
      void userService.existsByEmail(editableUser.email).then((exist) => {
        if (exist.data) {
          setUsedEmail(true);
        } else {
          void userService.changeEmail({ email: editableUser.email });
          setSaveDisabled(true);
        }
      });
    }
    if (editableUser.username !== user?.username) {
      void userService.existsByUsername(editableUser.username).then((exist) => {
        setUsedUsername(exist.data);
        if (!exist.data) {
          void updateUser();
        }
      });
    } else {
      void updateUser();
    }
  };

  async function updateUser(): Promise<void> {
    void userStore.updateUser([], true, false).then(() => {
      setSaveDisabled(true);
      userStore.requestUserData();
    });
  }

  async function toBase64(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const handleFileInputClick = (): void => {
    // @ts-expect-error need to defined type of hiddenFileInput
    hiddenFileInput.current!.click();
  };

  const handleFileChange = async (e: any): Promise<void> => {
    if (e.target.files) {
      const fileString = await toBase64(e.target.files[0]);
      editableUser.profileImage = fileString.substring(
        fileString.indexOf(',') + 1
      );
      userStore.deleteProfileImage = false;
      setSaveDisabled(false);
    }
  };

  const avatarImg = renderProfileImage(editableUser.profileImage);

  return (
    <>
      <Parent>
        <HeaderComponent showPublishButton={true} />
        <FlexBodyCenter>
          <FlexBody>
            <ColumnElement>
              <SpaceBetween>
                <HeaderElement variant={'h4'}>Account settings</HeaderElement>
                <>
                  <div>
                    <IconButton
                      onClick={handleMenuClick}
                      size="small"
                      sx={{ ml: 3 }}
                      aria-controls={openMenu ? 'user-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? 'true' : undefined}>
                      <MoreVertIcon htmlColor={'#68676E'} />
                    </IconButton>
                  </div>
                  <Menu
                    id="user-menu"
                    anchorEl={anchor}
                    open={openMenu}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center'
                    }}
                    MenuListProps={{
                      'aria-labelledby': 'user-button'
                    }}>
                    <MenuItem
                      onClick={() => {
                        setDeleteDialogOpen(true);
                        handleMenuClose();
                      }}>
                      <DeleteForever style={{ marginRight: '10px' }} />
                      Delete account
                    </MenuItem>
                  </Menu>
                </>
              </SpaceBetween>
              <HeightElement value={'40px'}></HeightElement>
              <Tabs
                value={tabNumber}
                onChange={handleChangeTabNumber}
                aria-label="basic tabs example">
                {tabs.map((tab) => (
                  <CustomTab
                    key={tab}
                    sx={{ textTransform: 'none' }}
                    label={_.capitalize(tab.toLowerCase())}
                  />
                ))}
              </Tabs>
              <Divider style={{ marginTop: '-1.3px' }} />
              <HeightElement value={'32px'}></HeightElement>
              {tabNumber === 0 && (
                <TabContainer>
                  <NameElement variant={'h6'}>Email</NameElement>
                  <FullWidthTextField
                    disabled={true}
                    value={editableUser.email}
                    error={!isValidEmail}
                    helperText={!isValidEmail ? 'Invalid address' : undefined}
                    type={'email'}
                    onChange={(e) => {
                      editableUser.email = e.currentTarget.value;
                      setUsedEmail(false);
                      setSaveDisabled(false);
                    }}
                    label="Email"
                    variant="outlined"
                  />
                  {isUsedEmail && (
                    <AlertWrap severity="error">
                      Email address already registered by another user
                    </AlertWrap>
                  )}
                  {isUsedUsername && (
                    <AlertWrap severity="error">
                      Username address already registered by another user
                    </AlertWrap>
                  )}
                  <NameElement variant={'h6'}>Username</NameElement>
                  <FullWidthTextField
                    marginbottom="0px"
                    value={editableUser.username}
                    onChange={(e) => {
                      editableUser.username = e.currentTarget.value;
                      profileFieldsValidation();
                    }}
                    label="Username"
                    variant="outlined"
                    error={!isValidUsername}
                    helperText={
                      !isValidUsername ? 'Invalid username' : undefined
                    }
                  />
                  {editableUser.username && (
                    <UsernameTip
                      onClick={() => {
                        void copyTextToClipboard(
                          getShortAuthorLink(editableUser.username)
                        ).finally();
                      }}>
                      {'Your FA URL: https://firstapproval.com/profile/' +
                        editableUser.username}
                      <ContentCopy
                        sx={{ width: '15px', height: '15px' }}
                        htmlColor={'#68676e'}
                        style={{ marginTop: '2px', marginLeft: '4px' }}
                      />
                    </UsernameTip>
                  )}
                  <HeightElement value={'32px'} />
                  <SaveButton
                    size={'large'}
                    color={'primary'}
                    variant={'contained'}
                    disabled={saveDisabled}
                    onClick={() => {
                      void updateUserInfo();
                    }}>
                    Save general
                  </SaveButton>
                </TabContainer>
              )}
              {tabNumber === 1 && (
                <TabContainer>
                  <RowElement>
                    <Avatar src={avatarImg} sx={{ width: 100, height: 100 }}>
                      {getInitials(user.firstName, user.lastName)}
                    </Avatar>
                    <input
                      type="file"
                      ref={hiddenFileInput}
                      onChange={handleFileChange}
                      hidden={true}
                      accept={'image/jpeg,image/png'}
                    />
                    <UploadPictureButton
                      size={'large'}
                      onClick={handleFileInputClick}>
                      Upload picture
                    </UploadPictureButton>
                    {editableUser.profileImage && (
                      <DeletePictureButton
                        onClick={() => {
                          editableUser.profileImage = undefined;
                          userStore.deleteProfileImage = true;
                          setSaveDisabled(false);
                        }}>
                        Delete
                      </DeletePictureButton>
                    )}
                  </RowElement>
                  <HeightElement value={'32px'}></HeightElement>
                  <NameElement variant={'h6'}>Name</NameElement>
                  <FullWidthTextField
                    value={editableUser.firstName}
                    onChange={(e) => {
                      editableUser.firstName = e.currentTarget.value;
                      profileFieldsValidation();
                    }}
                    label="First name"
                    variant="outlined"
                    error={!isValidFirstName}
                    helperText={
                      !isValidFirstName ? 'Invalid first name' : undefined
                    }
                  />
                  <FullWidthTextField
                    value={editableUser.lastName}
                    onChange={(e) => {
                      editableUser.lastName = e.currentTarget.value;
                      profileFieldsValidation();
                    }}
                    label="Last name"
                    variant="outlined"
                    error={!isValidLastName}
                    helperText={
                      !isValidLastName ? 'Invalid last name' : undefined
                    }
                  />
                  <HeightElement value={'115px'} />
                  <SaveButton
                    size={'large'}
                    color={'primary'}
                    variant={'contained'}
                    disabled={saveDisabled}
                    onClick={() => {
                      void updateUserInfo();
                    }}>
                    Save profile
                  </SaveButton>
                </TabContainer>
              )}
              {tabNumber === 2 && (
                <TabContainer>
                  <HeightElement value={'32px'}></HeightElement>
                  <WorkplacesEditor
                    isModalWindow={false}
                    store={userStore}
                    buttonType={ActionButtonType.FULL_WIDTH_CONFIRM}
                    saveButtonText={<span>Save affiliations</span>}
                    saveCallback={async (workplaces): Promise<boolean> => {
                      const isValid = userStore.validate();
                      if (isValid) {
                        return userStore
                          .updateUser(workplaces, false, true)
                          .then(() => {
                            return true;
                          });
                      }
                      return Promise.resolve(isValid);
                    }}
                  />
                </TabContainer>
              )}
              {tabNumber === 3 && (
                <TabContainer>
                  {showSuccessSavingAlter && (
                    <Snackbar
                      open={showSuccessSavingAlter}
                      autoHideDuration={4000}
                      onClose={() => {
                        setShowSuccessSavingAlter(false);
                      }}>
                      <Alert severity="success" sx={{ width: '100%' }}>
                        Password successfully saved!
                      </Alert>
                    </Snackbar>
                  )}
                  {editableUser.canChangePassword && (
                    <>
                      <NameElement variant={'h6'}>Old password</NameElement>
                      <FullWidthTextField
                        value={previousPassword}
                        onChange={(e) => {
                          setPreviousPassword(e.currentTarget.value);
                          setSaveDisabled(false);
                        }}
                        label="Old password"
                        variant="outlined"
                        type="password"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined htmlColor={'black'} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </>
                  )}
                  {((editableUser.canSetPassword ?? false) ||
                    (editableUser.canChangePassword ?? false)) && (
                    <>
                      <NameElement variant={'h6'}>New password</NameElement>
                      <FullWidthTextField
                        marginbottom="0px"
                        value={newPassword}
                        error={!isValidPassword}
                        helperText={
                          !isValidPassword ? 'Enter 8+ characters' : undefined
                        }
                        onChange={(e) => {
                          setNewPassword(e.currentTarget.value);
                          setSaveDisabled(false);
                        }}
                        label="Password 8+ characters"
                        variant="outlined"
                        type="password"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined htmlColor={'black'} />
                            </InputAdornment>
                          )
                        }}
                      />
                      <HeightElement value={'32px'} />
                      <SaveButton
                        size={'large'}
                        color={'primary'}
                        variant={'contained'}
                        disabled={saveDisabled}
                        onClick={changePassword}>
                        Change password
                      </SaveButton>
                    </>
                  )}
                </TabContainer>
              )}
            </ColumnElement>
          </FlexBody>
        </FlexBodyCenter>
      </Parent>
      <Footer />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DeleteDialogTitle id="alert-dialog-title">
          We’re sorry to see you go :(
        </DeleteDialogTitle>
        <DeleteDialogContent>
          <DeleteDialogWidthWrap>
            {'If you’d like to change your username or bio, you can do that here. ' +
              'We value every member of our community. ' +
              "If you've made up your mind to leave, we understand and respect your decision.\n" +
              'To proceed with account deletion, please email us at info@firstapproval.io. ' +
              'Our team will assist you promptly.\n' +
              "We'd also appreciate any feedback or reasons for your decision, " +
              'so we can continuously improve and serve our community better.'}
          </DeleteDialogWidthWrap>
        </DeleteDialogContent>
        <DeleteDialogActions>
          <SpaceBetween>
            <Button
              color="error"
              variant={'outlined'}
              href={'mailto:info@firstapproval.io'}
              onClick={handleCloseDeleteDialog}>
              Write email
            </Button>
            <Button
              color={'primary'}
              variant="contained"
              onClick={handleCloseDeleteDialog}>
              Nevermind
            </Button>
          </SpaceBetween>
        </DeleteDialogActions>
      </Dialog>
    </>
  );
});

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

export const RowElement = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const ColumnElement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const HeaderElement = styled(Typography)`
  text-align: left;
`;

export const NameElement = styled(Typography)`
  margin-bottom: 24px;
`;

export const UploadPictureButton = styled(Button)`
  margin-left: 32px;
  width: 150px;
  height: 36px;
  color: var(--inherit-text-primary-main, #040036);

  border-radius: 4px;
  border: 1px solid var(--inherit-text-primary-main, #040036);
`;

export const DeletePictureButton = styled(Button)`
  color: var(--inherit-text-primary-main, #040036);

  /* components/button-medium */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  letter-spacing: 0.4px;

  margin-left: 16px;
`;

export const SaveButton = styled(Button)`
  width: 100%;
`;

const FullWidthTextField = styled(TextField)<{
  marginbottom?: string | undefined;
}>`
  width: 100%;
  height: 56px;
  margin-bottom: ${(props) => props.marginbottom ?? '32px'};
`;

const UsernameTip = styled.span`
  display: flex;
  padding: 3px 14px 0 14px;
  align-items: flex-start;
  align-self: stretch;
  cursor: pointer;

  color: var(--text-secondary, #68676e);

  /* components/helper-text */
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 166%; /* 19.92px */
  letter-spacing: 0.4px;
`;

const DeleteDialogWidthWrap = styled.div`
  max-width: 336px;
`;

const DeleteDialogTitle = styled(DialogTitle)`
  padding-top: 32px !important;
  padding-left: 32px !important;
`;

const DeleteDialogContent = styled(DialogContent)`
  padding-left: 32px !important;
  padding-right: 32px !important;
`;

const DeleteDialogActions = styled(DialogActions)`
  padding-bottom: 32px !important;
  padding-right: 32px !important;
  padding-left: 32px !important;
`;

const AlertWrap = styled(Alert)`
  margin-bottom: 16px;
  width: 100%;
`;
