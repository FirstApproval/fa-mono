import { observer } from 'mobx-react-lite';
import React, { type ReactElement, useEffect, useMemo, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided
} from 'react-beautiful-dnd';
import {
  type ConfirmedAuthor,
  type UnconfirmedAuthor,
  type UserInfo
} from '../../../apis/first-approval-api';
import { AuthorEditorStore } from '../store/AuthorEditorStore';
import { AuthorElement } from './element/AuthorElement';
import { authorService, userService } from '../../../core/service';
import {
  Alert,
  Autocomplete,
  Avatar,
  Button,
  Divider,
  IconButton,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { Add, DeleteOutlined, PersonAdd } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import styled from '@emotion/styled';
import { ContentEditorWrap, LabelWrap } from './styled';
import { getInitials, renderProfileImage } from '../../../util/userUtil';
import { type EditorProps } from './types';
import { WorkplacesEditor } from '../../../components/WorkplacesEditor';
import { FlexWrapColumn, FlexWrapRow, WidthElement } from '../../common.styled';
import { LoadingButton } from '@mui/lab';
import { PublicationStore } from '../store/PublicationStore';

interface AuthorEditState {
  author?: ConfirmedAuthor | UnconfirmedAuthor;
  isConfirmed?: boolean;
  index?: number;
}

export const AuthorsEditor = observer((props: EditorProps): ReactElement => {
  const { publicationStore } = props;
  const [showSuccessSavingAlter, setShowSuccessSavingAlter] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isUserExistsByEmail, setIsUserExistsByEmail] = useState(false);
  const [authorOptions, setAuthorOptions] = useState<UserInfo[]>([]);
  const [editingAuthor, setEditingAuthor] = useState<AuthorEditState>();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!query.trim()) {
      setAuthorOptions([]);
      return;
    }
    authorService
      .getAuthors(query.trim())
      .then((result) => {
        setAuthorOptions(
          result.data.filter(
            (a1) =>
              !publicationStore.confirmedAuthors.find(
                (a2) => a1.id === a2.user.id
              )
          )
        );
      })
      .catch(() => {
        setAuthorOptions([]);
      });
  }, [query]);

  return (
    <>
      <ContentEditorWrap>
        <LabelWrap>Authors</LabelWrap>
        <DragDropContext
          onDragEnd={(result: DropResult, provided: ResponderProvided) => {
            if (!result.destination) return; // Nothing to do if dropped outside the list
            const reorderedItems = Array.from(publicationStore.authors);
            const [movedItem] = reorderedItems.splice(result.source.index, 1); // Remove the dragged item
            reorderedItems.splice(result.destination.index, 0, movedItem); // Insert the item at the new position
            reorderedItems.forEach((reorderedAuthor, index) => {
              const confirmed = reorderedAuthor as ConfirmedAuthor;
              const unconfirmed = reorderedAuthor as UnconfirmedAuthor;
              const email = confirmed.user?.email ?? unconfirmed.email;
              const author = publicationStore.authors.find(
                (author) =>
                  ((author as ConfirmedAuthor).user?.email ??
                    (author as UnconfirmedAuthor).email) === email
              );
              if (author) {
                author.ordinal = index;
              }
            });
            void publicationStore.updateConfirmedAuthors();
            void publicationStore.updateUnconfirmedAuthors();
          }}>
          <Droppable
            droppableId="droppable"
            isDropDisabled={publicationStore.isReadonly}>
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {publicationStore.authors.map(
                  (author: UnconfirmedAuthor | ConfirmedAuthor, index) => {
                    const isConfirmed = !!(author as ConfirmedAuthor).user;
                    return (
                      <Draggable
                        key={index.toString()}
                        draggableId={index.toString()}
                        isDragDisabled={publicationStore.isReadonly}
                        index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <AuthorElement
                              isReadonly={publicationStore.isReadonly}
                              useMarginBottom={true}
                              key={author.id}
                              author={author}
                              isConfirmed={isConfirmed}
                              onAuthorEdit={() =>
                                setEditingAuthor({ author, isConfirmed, index })
                              }
                              shouldOpenInNewTab={true}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  }
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {!publicationStore.isReadonly && !searchVisible && (
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
                onChange={(event: any, newValue: UserInfo | null) => {
                  if (newValue) {
                    publicationStore.addConfirmedAuthor(newValue);
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
                        <AuthorEmail variant={'body2'}>
                          {option.email}
                        </AuthorEmail>
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
              onClick={() => setEditingAuthor({})}>
              Add manually
            </Button>
          </SearchBar>
        )}
      </ContentEditorWrap>
      <AddAuthorDialog
        editingAuthor={editingAuthor}
        publicationStore={publicationStore}
        setIsUserExistsByEmail={setIsUserExistsByEmail}
        setShowSuccessSavingAlter={setShowSuccessSavingAlter}
      />
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
      {showSuccessSavingAlter && (
        <Snackbar
          open={showSuccessSavingAlter}
          autoHideDuration={4000}
          onClose={() => {
            setShowSuccessSavingAlter(false);
          }}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Co-author successfully saved!
          </Alert>
        </Snackbar>
      )}
    </>
  );
});

const AddAuthorDialog = observer(
  (props: {
    editingAuthor: AuthorEditState | undefined;
    publicationStore: PublicationStore;
    setIsUserExistsByEmail: (value: boolean) => void;
    setShowSuccessSavingAlter: (value: boolean) => void;
  }): ReactElement => {
    const { publicationStore } = props;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [savingInProgress, setSavingInProgress] = useState(false);
    const [addAuthorVisible, setAddAuthorVisible] = useState(false);

    const authorStore = useMemo((): AuthorEditorStore => {
      const authorStore = new AuthorEditorStore();
      if (props.editingAuthor === undefined) {
        setAddAuthorVisible(false);
        return authorStore;
      }
      const { author, isConfirmed, index } = props.editingAuthor;
      if (!author) {
        authorStore.isNew = true;
        authorStore.isConfirmed = false;
        setAddAuthorVisible(true);
        return authorStore;
      }
      if (isConfirmed) {
        const user = (author as ConfirmedAuthor).user;
        authorStore.firstName = user.firstName;
        authorStore.lastName = user.lastName;
        authorStore.email = user.email;
        authorStore.userId = user.id;
        authorStore.profileImage = user.profileImage;
      } else {
        const unconfirmedAuthor = author as UnconfirmedAuthor;
        authorStore.firstName = unconfirmedAuthor.firstName;
        authorStore.lastName = unconfirmedAuthor.lastName;
        authorStore.email = unconfirmedAuthor.email;
        authorStore.workplaces = unconfirmedAuthor.workplaces ?? [];
        authorStore.workplacesProps = [];
        authorStore.workplaces?.forEach((w, index) => {
          authorStore.workplacesProps.push({
            orgQuery: w.organization?.name ?? '',
            departmentQuery: w.department?.name ?? '',
            departmentQueryKey: '',
            organizationOptions: [],
            departmentOptions: w.organization?.departments ?? []
          });
        });
      }
      authorStore.isConfirmed = isConfirmed!;
      authorStore.id = author.id;
      authorStore.isNew = false;
      authorStore.index = index;
      setAddAuthorVisible(true);
      return authorStore;
    }, [props.editingAuthor]);

    const handleSaveButton = async (): Promise<void> => {
      if (authorStore.isConfirmed) {
        publicationStore.editConfirmedAuthor(authorStore);
        handleCloseAddAuthor();
      } else {
        return userService.existsByEmail(authorStore.email).then((result) => {
          if (result.data) {
            props.setIsUserExistsByEmail(true);
          } else {
            publicationStore.addOrEditUnconfirmedAuthor(authorStore);
          }
        });
      }
    };

    const handleCloseAddAuthor = (): void => {
      setAddAuthorVisible(false);
    };

    const handleCloseDeleteDialog = (): void => {
      setDeleteDialogOpen(false);
    };

    return (
      <>
        <Dialog
          open={addAuthorVisible}
          onClose={() => {
            if (authorStore.isConfirmed) {
              handleCloseAddAuthor();
            }
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitleWrap id="alert-dialog-title">
            {authorStore.isNew ? 'Add author' : 'Edit author'}
          </DialogTitleWrap>
          <DialogContentWrap>
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
                  error={!authorStore.isValidEmail}
                  helperText={
                    !authorStore.isValidEmail ? 'Invalid address' : undefined
                  }
                />
                <FlexWrapRow>
                  <MarginTextField
                    value={authorStore.firstName}
                    onChange={(e) => {
                      authorStore.firstName = e.currentTarget.value;
                    }}
                    disabled={authorStore.isConfirmed}
                    label="First name"
                    variant="outlined"
                    error={!authorStore.isValidFirstName}
                    helperText={
                      !authorStore.isValidFirstName
                        ? 'Invalid first name'
                        : undefined
                    }
                  />
                  <FullWidthTextField
                    value={authorStore.lastName}
                    onChange={(e) => {
                      authorStore.lastName = e.currentTarget.value;
                    }}
                    disabled={authorStore.isConfirmed}
                    label="Last name"
                    variant="outlined"
                    error={!authorStore.isValidLastName}
                    helperText={
                      !authorStore.isValidLastName
                        ? 'Invalid last name'
                        : undefined
                    }
                  />
                </FlexWrapRow>
                <FlexWrapColumn>
                  <WorkplacesTitle variant={'h6'}>
                    Current workplaces (affiliations)
                  </WorkplacesTitle>
                  <WorkplacesEditor store={authorStore} isModalWindow={true} />
                </FlexWrapColumn>
              </AddAuthorWrap>
            )}
            {authorStore.isConfirmed && (
              <EditConfirmedAuthor>
                {/* dirty hack to show user name and email without possibility to edit any fields. */}
                {/* Partly fixed by adding AuthorEditorStore as author type */}
                <AuthorElement
                  isReadonly={publicationStore.isReadonly}
                  author={authorStore}
                  isConfirmed={true}
                  useMarginBottom={false}
                />
              </EditConfirmedAuthor>
            )}
          </DialogContentWrap>
          <DialogActionsWrap>
            <SpaceBetweenWrap>
              {((authorStore.isNew ||
                authorStore.userId === publicationStore.creator?.id) && (
                <div />
              )) || (
                <IconButton
                  onClick={() => {
                    setDeleteDialogOpen(true);
                  }}>
                  <DeleteOutlined htmlColor={'gray'} />
                </IconButton>
              )}
              <FlexWrapRow>
                <Button onClick={handleCloseAddAuthor}>Cancel</Button>
                <WidthElement value={'15px'} />
                {!authorStore.isConfirmed && (
                  <LoadingButton
                    loading={savingInProgress}
                    variant={'contained'}
                    onClick={() => {
                      const isValid = authorStore.validate();
                      if (isValid) {
                        setSavingInProgress(true);
                        void handleSaveButton().then(() => {
                          setTimeout(() => {
                            setSavingInProgress(false);
                            props.setShowSuccessSavingAlter(true);
                            handleCloseAddAuthor();
                          }, 1000);
                        });
                      }
                    }}>
                    {authorStore.isNew ? 'Add author' : 'Save'}
                  </LoadingButton>
                )}
              </FlexWrapRow>
            </SpaceBetweenWrap>
          </DialogActionsWrap>
        </Dialog>
        <DeleteAuthorDialog
          publicationStore={publicationStore}
          authorStore={authorStore}
          setAddAuthorVisible={setAddAuthorVisible}
          deleteDialogOpen={deleteDialogOpen}
          handleCloseDeleteDialog={handleCloseDeleteDialog}
        />
      </>
    );
  }
);

const DeleteAuthorDialog = observer(
  (props: {
    publicationStore: PublicationStore;
    authorStore: AuthorEditorStore;
    setAddAuthorVisible: (value: boolean) => void;
    deleteDialogOpen: boolean;
    handleCloseDeleteDialog: () => void;
  }): ReactElement => {
    const { deleteDialogOpen, handleCloseDeleteDialog } = props;
    return (
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitleWrap id="alert-dialog-title">Delete?</DialogTitleWrap>
        <DialogContentWrap>
          <DeleteDialogWidthWrap>
            {
              "Everything will be deleted and you won't be able to undo this action."
            }
          </DeleteDialogWidthWrap>
        </DialogContentWrap>
        <DialogActionsWrap>
          <div>
            <Button
              style={{ marginRight: '24px' }}
              onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                props.publicationStore.deleteAuthor(props.authorStore);
                handleCloseDeleteDialog();
                props.setAddAuthorVisible(false);
              }}
              variant="contained"
              color="error">
              Delete
            </Button>
          </div>
        </DialogActionsWrap>
      </Dialog>
    );
  }
);

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

const AuthorEmail = styled(Typography)`
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

const DialogActionsWrap = styled(DialogActions)`
  padding-bottom: 32px !important;
  padding-right: 32px !important;
`;

const DialogTitleWrap = styled(DialogTitle)`
  padding-top: 32px !important;
  padding-left: 32px !important;
`;

const DialogContentWrap = styled(DialogContent)`
  padding-left: 32px !important;
  padding-right: 32px !important;
`;

const WorkplacesTitle = styled(Typography)`
  margin-bottom: 32px;
`;
