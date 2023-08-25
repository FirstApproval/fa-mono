import React, { type FunctionComponent, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Tabs,
  TextField
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { observer } from 'mobx-react-lite';
import {
  CustomTab,
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  HeightElement,
  Logo,
  Parent
} from '../common.styled';
import { routerStore } from '../../core/router';
import { UserMenu } from '../../components/UserMenu';
import logo from '../../assets/logo.svg';
import styled from '@emotion/styled';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ContentCopy, DeleteForever, LockOutlined } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { userService } from '../../core/service';
import {
  copyTextToClipboard,
  getProfileLink,
  renderProfileImage
} from '../../fire-browser/utils';
import { validateEmail } from 'src/util/emailUtil';
import { userStore } from '../../core/user';
import { getInitials } from 'src/util/userUtil';
import { cloneDeep } from 'lodash';
import { Footer } from '../home/Footer';

const tabs: string[] = ['general', 'profile', 'password'];

export const AccountPage: FunctionComponent = observer(() => {
  const [saveDisabled, setSaveDisabled] = useState(() => true);
  const { editableUser, user } = userStore;
  const [accountTab] = useState(() => routerStore.accountTab);
  const [tabNumber, setTabNumber] = React.useState(
    (accountTab && tabs.findIndex((element) => element === accountTab)) ?? 0
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previousPassword, setPreviousPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isUsedEmail, setUsedEmail] = useState(false);
  const [isUsedUsername, setUsedUsername] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const hiddenFileInput = useRef(null);

  const handleChangeTabNumber = (
    _: React.SyntheticEvent,
    newValue: number
  ): void => {
    setTabNumber(newValue);
    userStore.editableUser = cloneDeep(userStore.user);
    setPreviousPassword('');
    setNewPassword('');
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
      });
    }

    if (!isUsedUsername) {
      const username =
        (!isUsedUsername && editableUser.username) ?? editableUser?.username;
      void userService
        .updateUser({
          firstName: editableUser.firstName,
          lastName: editableUser.lastName,
          username,
          selfInfo: editableUser.selfInfo,
          middleName: editableUser.middleName,
          profileImage: editableUser.profileImage
        })
        .then(() => {
          setSaveDisabled(true);
          userStore.requestUserData();
        });
    }
  };

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
      debugger;
      user.profileImage = fileString;
      await updateUserInfo();
    }
  };

  const avatarImg = renderProfileImage(user.profileImage);

  return (
    <>
      <Parent>
        <FlexHeader>
          <Logo onClick={routerStore.goHome}>
            <img src={logo} />
          </Logo>
          <FlexHeaderRight>
            <UserMenu />
          </FlexHeaderRight>
        </FlexHeader>
        <FlexBodyCenter>
          <FlexBody>
            <ColumnElement>
              <SpaceBetween>
                <HeaderElement>Account settings</HeaderElement>
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
              <HeightElement value={'27px'}></HeightElement>
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
                <UploadPictureButton onClick={handleFileInputClick}>
                  Upload picture
                </UploadPictureButton>
              </RowElement>
              <HeightElement value={'40px'}></HeightElement>
              <Tabs
                value={tabNumber}
                onChange={handleChangeTabNumber}
                aria-label="basic tabs example">
                <CustomTab sx={{ textTransform: 'none' }} label="General" />
                <CustomTab sx={{ textTransform: 'none' }} label="Profile" />
                <CustomTab sx={{ textTransform: 'none' }} label="Password" />
              </Tabs>
              <Divider style={{ marginTop: '-1.3px' }} />
              <HeightElement value={'32px'}></HeightElement>
              {tabNumber === 0 && (
                <TabContainer>
                  <NameElement>Email</NameElement>
                  <FullWidthTextField
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
                  <NameElement>Username</NameElement>
                  <FullWidthTextField
                    marginbottom="0px"
                    value={editableUser.username}
                    onChange={(e) => {
                      editableUser.username = e.currentTarget.value;
                      setSaveDisabled(false);
                    }}
                    label="Username"
                    variant="outlined"
                  />
                  {editableUser.username && (
                    <UsernameTip
                      onClick={() => {
                        void copyTextToClipboard(
                          getProfileLink(editableUser.username)
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
                  <NameElement>Name</NameElement>
                  <FullWidthTextField
                    value={editableUser.firstName}
                    onChange={(e) => {
                      editableUser.firstName = e.currentTarget.value;
                      setSaveDisabled(false);
                    }}
                    label="First name"
                    variant="outlined"
                  />
                  <FullWidthTextField
                    value={editableUser.lastName}
                    onChange={(e) => {
                      editableUser.lastName = e.currentTarget.value;
                      setSaveDisabled(false);
                    }}
                    label="Last name"
                    variant="outlined"
                  />
                  <NameElement>Self info</NameElement>
                  <FullWidthTextField
                    multiline
                    minRows={6}
                    maxRows={6}
                    value={editableUser.selfInfo}
                    onChange={(e) => {
                      editableUser.selfInfo = e.currentTarget.value;
                      setSaveDisabled(false);
                    }}
                    label="Self info"
                    variant="outlined"
                  />
                  <HeightElement value={'115px'} />
                  <SaveButton
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
                  {editableUser.canChangePassword && (
                    <>
                      <NameElement>Old password</NameElement>
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
                      <NameElement>New password</NameElement>
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
              'To proceed with account deletion, please email us at support@firstapproval.io. ' +
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
              href={'mailto:hello@firstapproval.io'}
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

export const SpaceBetween = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ColumnElement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const HeaderElement = styled.span`
  font-family: Roboto;
  font-size: 34px;
  font-weight: 600;
  line-height: 42px;
  letter-spacing: 0.25px;
  text-align: left;
`;

export const NameElement = styled.span`
  color: var(--text-primary, #040036);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h6 */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;

  margin-bottom: 24px;
`;

export const UploadPictureButton = styled(Button)`
  margin-left: 32px;
  width: 150px;
  height: 36px;
  color: var(--inherit-text-primary-main, #040036);
  font-feature-settings: 'clig' off, 'liga' off;
  /* components/button-large */
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.46px;

  border-radius: 4px;
  border: 1px solid var(--inherit-text-primary-main, #040036);
`;

export const SaveButton = styled(Button)`
  width: 100%;

  font-feature-settings: 'clig' off, 'liga' off;
  /* components/button-large */
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.46px;
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
  font-feature-settings: 'clig' off, 'liga' off;

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
