import { observer } from 'mobx-react-lite';
import React, { type ReactElement, useEffect, useState } from 'react';
import {
  type Author,
  type ConfirmedAuthor,
  type UnconfirmedAuthor
} from '../../../apis/first-approval-api';
import { AuthorEditorStore } from '../store/AuthorEditorStore';
import { AuthorElement } from './element/AuthorElement';
import { userService } from '../../../core/service';
import {
  Alert,
  Autocomplete,
  Avatar,
  Button,
  Divider,
  IconButton,
  Snackbar,
  TextField
} from '@mui/material';
import { Add, DeleteOutlined, PersonAdd } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import styled from '@emotion/styled';
import { ContentEditorWrap, LabelWrap } from './styled';
import { type EditorProps } from './ParagraphEditor';
import { getInitials } from '../../../util/userUtil';
import { renderProfileImage } from '../../../fire-browser/utils';

export const AuthorsEditor = observer((props: EditorProps): ReactElement => {
  const [addAuthorVisible, setAddAuthorVisible] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isUserExistsByEmail, setIsUserExistsByEmail] = useState(false);
  const [authorOptions, setAuthorOptions] = useState<Author[]>([]);

  const [query, setQuery] = useState('');

  const [authorStore] = useState(() => new AuthorEditorStore());

  const setEditAuthorVisible = (
    author: ConfirmedAuthor | UnconfirmedAuthor,
    isConfirmed: boolean,
    index?: number
  ): void => {
    if (isConfirmed) {
      const user = (author as ConfirmedAuthor).user;
      authorStore.firstName = user.firstName!;
      authorStore.lastName = user.lastName!;
      authorStore.email = user.email!;
      authorStore.userId = user.id;
      authorStore.profileImage = user.profileImage;
    } else {
      const unconfirmedAuthor = author as UnconfirmedAuthor;
      authorStore.firstName = unconfirmedAuthor.firstName;
      authorStore.lastName = unconfirmedAuthor.lastName;
      authorStore.email = unconfirmedAuthor.email;
    }
    authorStore.isConfirmed = isConfirmed;
    authorStore.id = author.id;
    authorStore.shortBio = author.shortBio ?? '';
    authorStore.isNew = false;
    authorStore.index = index;
    setAddAuthorVisible(true);
  };

  useEffect(() => {
    if (!query.trim()) {
      setAuthorOptions([]);
      return;
    }
    authorStore
      .searchAuthors(query.trim())
      .then((result) => {
        setAuthorOptions(
          result.filter(
            (a1) =>
              !props.publicationStore.confirmedAuthors.find(
                (a2) => a1.id === a2.user.id
              )
          )
        );
      })
      .catch(() => {
        setAuthorOptions([]);
      });
  }, [query]);

  const handleCloseAddAuthor = (): void => {
    setAddAuthorVisible(false);
    authorStore.clean();
  };

  const handleCloseDeleteDialog = (): void => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <ContentEditorWrap>
        <LabelWrap>Authors</LabelWrap>
        {props.publicationStore.confirmedAuthors.map(
          (confirmedAuthor, index) => {
            return (
              <AuthorElement
                isReadonly={props.publicationStore.isReadonly}
                key={confirmedAuthor.id}
                author={confirmedAuthor}
                isConfirmed={true}
                index={index}
                setEditAuthorVisible={setEditAuthorVisible}
              />
            );
          }
        )}
        {props.publicationStore.unconfirmedAuthors.map(
          (unconfirmedAuthor, index) => {
            return (
              <AuthorElement
                isReadonly={props.publicationStore.isReadonly}
                key={unconfirmedAuthor.id}
                author={unconfirmedAuthor}
                isConfirmed={false}
                index={index}
                setEditAuthorVisible={setEditAuthorVisible}
              />
            );
          }
        )}
        {!props.publicationStore.isReadonly && !searchVisible && (
          <Button
            variant={'outlined'}
            startIcon={<Add />}
            onClick={() => {
              setSearchVisible(true);
            }}>
            Add author
          </Button>
        )}
        {searchVisible && (
          <SearchBar>
            <FlexGrowWrap>
              <Autocomplete
                onChange={(event: any, newValue: Author | null) => {
                  if (newValue) {
                    props.publicationStore.addConfirmedAuthor(newValue);
                  }
                }}
                forcePopupIcon={false}
                inputValue={query}
                onInputChange={(event, newInputValue) => {
                  setQuery(newInputValue);
                }}
                renderOption={(props, option, state) => {
                  return (
                    <AuthorSelectOption {...props}>
                      <Avatar src={renderProfileImage(option.profileImage)}>
                        {getInitials(option.firstName, option.lastName)}
                      </Avatar>
                      <AuthorWrap>
                        <AuthorName>
                          {option.firstName} {option.lastName}
                        </AuthorName>
                        <AuthorEmail>{option.email}</AuthorEmail>
                      </AuthorWrap>
                    </AuthorSelectOption>
                  );
                }}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName} (${option.email})`
                }
                id="controllable-states-demo"
                options={authorOptions}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder={
                      'Start typing to search other FA users by email or name...'
                    }></TextField>
                )}
              />
            </FlexGrowWrap>

            <DividerWrap orientation={'vertical'} />
            <Button
              variant={'text'}
              startIcon={<PersonAdd />}
              onClick={() => {
                authorStore.isNew = true;
                authorStore.isConfirmed = false;
                setAddAuthorVisible(true);
              }}>
              Add manually
            </Button>
          </SearchBar>
        )}
      </ContentEditorWrap>
      <Dialog
        open={addAuthorVisible}
        onClose={handleCloseAddAuthor}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {authorStore.isNew ? 'Add author' : 'Edit author'}
        </DialogTitle>
        <DialogContent>
          {!authorStore.isConfirmed && (
            <AddAuthorWrap>
              <FullWidthTextField
                autoFocus
                value={authorStore.email}
                onChange={(e) => {
                  authorStore.email = e.currentTarget.value;
                }}
                disabled={authorStore.isConfirmed}
                label="Email"
                variant="outlined"
              />
              <OneLineWrap>
                <MarginTextField
                  value={authorStore.firstName}
                  onChange={(e) => {
                    authorStore.firstName = e.currentTarget.value;
                  }}
                  disabled={authorStore.isConfirmed}
                  label="First name"
                  variant="outlined"
                />
                <FullWidthTextField
                  value={authorStore.lastName}
                  onChange={(e) => {
                    authorStore.lastName = e.currentTarget.value;
                  }}
                  disabled={authorStore.isConfirmed}
                  label="Last name"
                  variant="outlined"
                />
              </OneLineWrap>
              <FullWidthTextField
                multiline
                minRows={4}
                maxRows={4}
                value={authorStore.shortBio}
                onChange={(e) => {
                  authorStore.shortBio = e.currentTarget.value;
                }}
                label="Short bio"
                variant="outlined"
              />
            </AddAuthorWrap>
          )}
          {authorStore.isConfirmed && (
            <EditConfirmedAuthor>
              {/* dirty hack to show user name and email without possibility to edit any fields except of short bio */}
              <AuthorElement
                isReadonly={props.publicationStore.isReadonly}
                author={authorStore}
                isConfirmed={false}
              />
              <FullWidthTextField
                multiline
                minRows={4}
                maxRows={4}
                value={authorStore.shortBio}
                onChange={(e) => {
                  authorStore.shortBio = e.currentTarget.value;
                }}
                label="Short bio"
                variant="outlined"
              />
            </EditConfirmedAuthor>
          )}
        </DialogContent>
        <DialogActions>
          <SpaceBetweenWrap>
            {((authorStore.isNew ||
              authorStore.userId === props.publicationStore.creator?.id) && (
              <div />
            )) || (
              <IconButton
                onClick={() => {
                  setDeleteDialogOpen(true);
                }}>
                <DeleteOutlined htmlColor={'gray'} />
              </IconButton>
            )}
            <div>
              <Button onClick={handleCloseAddAuthor}>Cancel</Button>
              <Button
                onClick={async () => {
                  if (authorStore.isConfirmed) {
                    props.publicationStore.editConfirmedAuthor(authorStore);
                    handleCloseAddAuthor();
                  } else {
                    await userService
                      .existsByEmail(authorStore.email)
                      .then((result) => {
                        if (result.data) {
                          authorStore.clean();
                          setIsUserExistsByEmail(true);
                        } else {
                          props.publicationStore.addOrEditUnconfirmedAuthor(
                            authorStore
                          );
                        }
                        handleCloseAddAuthor();
                      });
                  }
                }}>
                Save
              </Button>
            </div>
          </SpaceBetweenWrap>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DeleteDialogTitle id="alert-dialog-title">Delete?</DeleteDialogTitle>
        <DeleteDialogContent>
          <DeleteDialogWidthWrap>
            {
              "Everything will be deleted and you won't be able to undo this action."
            }
          </DeleteDialogWidthWrap>
        </DeleteDialogContent>
        <DeleteDialogActions>
          <div>
            <Button
              style={{ marginRight: '24px' }}
              onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                props.publicationStore.deleteAuthor(authorStore);
                authorStore.clean();
                setDeleteDialogOpen(false);
                setAddAuthorVisible(false);
              }}
              variant="contained"
              color="error">
              Delete
            </Button>
          </div>
        </DeleteDialogActions>
      </Dialog>
      {isUserExistsByEmail && (
        <Snackbar
          open={isUserExistsByEmail}
          autoHideDuration={6000}
          onClose={() => {
            setIsUserExistsByEmail(false);
          }}>
          <Alert severity="error" sx={{ width: '100%' }}>
            User with this email already registered and can be added searching
            by email
          </Alert>
        </Snackbar>
      )}
    </>
  );
});

const AddAuthorWrap = styled.div`
  min-width: 488px;
  margin-top: 8px;
`;

const EditConfirmedAuthor = styled.div`
  min-width: 488px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
`;

const OneLineWrap = styled.div`
  display: flex;
`;

const AuthorSelectOption = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 16px;
`;

const AuthorWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

const AuthorName = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
`;

const AuthorEmail = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: var(--text-secondary, #68676e);
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
`;

const DividerWrap = styled(Divider)`
  margin-left: 24px;
  margin-right: 16px;
  height: 40px;
`;

const MarginTextField = styled(TextField)`
  width: 100%;
  margin-right: 32px;
`;

const FlexGrowWrap = styled.div`
  flex-grow: 1;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 32px;
`;

const SpaceBetweenWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const DeleteDialogWidthWrap = styled.div`
  max-width: 336px;
`;

const DeleteDialogActions = styled(DialogActions)`
  padding-bottom: 32px !important;
  padding-right: 32px !important;
`;

const DeleteDialogTitle = styled(DialogTitle)`
  padding-top: 32px !important;
  padding-left: 32px !important;
`;

const DeleteDialogContent = styled(DialogContent)`
  padding-left: 32px !important;
  padding-right: 32px !important;
`;
