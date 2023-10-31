import { observer } from 'mobx-react-lite';
import React, { type ReactElement, useEffect, useMemo, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided
} from 'react-beautiful-dnd';
import { type Author, type UserInfo } from '../../../apis/first-approval-api';
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
import {
  Add,
  DeleteOutlined,
  InfoOutlined,
  PersonAdd
} from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import styled from '@emotion/styled';
import { LabelWrap, SectionWrap } from './styled';
import { getInitials, renderProfileImage } from '../../../util/userUtil';
import { type EditorProps } from './types';
import { WorkplacesEditor } from '../../../components/WorkplacesEditor';
import {
  FlexWrapColumn,
  FlexWrapRow,
  HeightElement,
  WidthElement
} from '../../common.styled';
import { LoadingButton } from '@mui/lab';
import { PublicationStore } from '../store/PublicationStore';
import { Flex, FlexAlignItems, FlexJustifyContent } from '../../../ui-kit/flex';

interface AuthorEditState {
  author?: Author;
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
              !publicationStore.authors.find((a2) => a1.id === a2.user?.id)
          )
        );
      })
      .catch(() => {
        setAuthorOptions([]);
      });
  }, [query]);

  const { authors } = publicationStore;
  return (
    <>
      <SectionWrap>
        <LabelWrap marginBottom={'18px'}>Authors</LabelWrap>
        <AuthorsEditorWrap>
          <DragDropContext
            onDragEnd={(result: DropResult, provided: ResponderProvided) => {
              if (!result.destination) return; // Nothing to do if dropped outside the list
              const reorderedItems = Array.from(publicationStore.authors);
              const [movedItem] = reorderedItems.splice(result.source.index, 1); // Remove the dragged item
              reorderedItems.splice(result.destination.index, 0, movedItem); // Insert the item at the new position
              reorderedItems.forEach((reorderedAuthor, index) => {
                const author = publicationStore.authors.find(
                  (author) => author.id === reorderedAuthor.id
                );
                if (author) {
                  author.ordinal = index;
                }
              });
              void publicationStore.updateAuthors();
            }}>
            <Droppable
              droppableId="droppable"
              isDropDisabled={publicationStore.isReadonly}>
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {authors
                    .sort(
                      (author1, author2) => author1.ordinal! - author2.ordinal!
                    )
                    .map((author: Author, index) => {
                      return (
                        <Draggable
                          key={index.toString()}
                          draggableId={index.toString()}
                          isDragDisabled={publicationStore.isReadonly}
                          index={index}>
                          {(provided, snapshot) => (
                            <DraggableContentWrapper
                              isDragging={snapshot.isDragging}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}>
                              <AuthorElement
                                isReadonly={publicationStore.isReadonly}
                                useMarginBottom={false}
                                key={author.id}
                                author={author}
                                isConfirmed={author.isConfirmed}
                                onAuthorEdit={() =>
                                  setEditingAuthor({ author, index })
                                }
                                shouldOpenInNewTab={true}
                              />
                            </DraggableContentWrapper>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <HeightElement value={publicationStore.isReadonly ? '0px' : '28px'} />
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
                      setEditingAuthor({
                        author: {
                          user: newValue,
                          ordinal: authors.length,
                          workplaces: newValue.workplaces.map((workplace) => {
                            return {
                              organization: workplace.organization,
                              department: workplace.department,
                              address: workplace.address,
                              postalCode: workplace.postalCode,
                              creationTime: workplace.creationTime
                            };
                          }),
                          email: newValue.email,
                          firstName: newValue.firstName,
                          lastName: newValue.lastName,
                          isConfirmed: true
                        },
                        index: undefined
                      });
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
        </AuthorsEditorWrap>
      </SectionWrap>
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
    const [isGotItShowed, setIsGotItShowed] = useState(true);

    const authorStore = useMemo((): AuthorEditorStore => {
      const authorStore = new AuthorEditorStore();
      if (props.editingAuthor === undefined) {
        setAddAuthorVisible(false);
        return authorStore;
      }
      const { author, index } = props.editingAuthor;
      if (!author) {
        authorStore.isNew = true;
        authorStore.isConfirmed = false;
        setAddAuthorVisible(true);
        return authorStore;
      }
      authorStore.firstName = author.firstName;
      authorStore.lastName = author.lastName;
      authorStore.email = author.email;
      if (author.isConfirmed) {
        authorStore.profileImage = author.user?.profileImage;
        authorStore.user = author.user;
      }
      if (author.workplaces?.length) {
        authorStore.workplacesProps = [];
        authorStore.workplacesValidation = [];
        authorStore.workplaces = author.workplaces;
      }
      authorStore.workplaces?.forEach((w) => {
        authorStore.workplacesProps.push({
          orgQuery: w.organization?.name ?? '',
          orgQueryKey: '',
          organizationOptions: []
        });
        authorStore.workplacesValidation.push({
          isValidOrganization: !!w.organization
        });
      });
      authorStore.isConfirmed = author.isConfirmed;
      authorStore.id = author.id;
      authorStore.isNew = false;
      authorStore.index = index;
      setAddAuthorVisible(true);
      return authorStore;
    }, [props.editingAuthor]);

    const handleSaveButton = async (): Promise<void> => {
      if (authorStore.isConfirmed) {
        publicationStore.addOrEditAuthor(authorStore);
        props.setShowSuccessSavingAlter(true);
      } else {
        return userService.existsByEmail(authorStore.email).then((result) => {
          if (result.data) {
            props.setIsUserExistsByEmail(true);
          } else {
            publicationStore.addOrEditAuthor(authorStore);
            props.setShowSuccessSavingAlter(true);
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
                <HeightElement value={'32px'} />
                <FlexWrapRow>
                  <MarginTextField
                    value={authorStore.firstName}
                    onChange={(e) => {
                      authorStore.firstName = e.currentTarget.value;
                    }}
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
                {isGotItShowed && (
                  <>
                    <ChangesOnThisFormDoesntAffectProfileInfoWrap>
                      <Flex
                        alignItems={FlexAlignItems.center}
                        justifyContent={FlexJustifyContent.spaceBetween}>
                        <InfoOutlined
                          htmlColor={'#0288D1'}
                          sx={{ width: 22, height: 22, marginRight: '12px' }}
                        />
                        <ChangesOnThisFormDoesntAffectProfileText>
                          Changes on this form doesn’t affect your profile info.
                        </ChangesOnThisFormDoesntAffectProfileText>
                      </Flex>
                      <Button
                        onClick={() => {
                          setIsGotItShowed(false);
                        }}>
                        Got it
                      </Button>
                    </ChangesOnThisFormDoesntAffectProfileInfoWrap>
                    <HeightElement value={'32px'} />
                  </>
                )}
                <FlexWrapColumn>
                  <WorkplacesTitle variant={'h6'}>
                    Current workplaces (affiliations)
                  </WorkplacesTitle>
                  <WorkplacesEditor store={authorStore} isModalWindow={true} />
                </FlexWrapColumn>
              </EditConfirmedAuthor>
            )}
          </DialogContentWrap>
          <DialogActionsWrap>
            <SpaceBetweenWrap>
              {((authorStore.isNew ||
                authorStore.user?.id === publicationStore.creator?.id) && (
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
                <LoadingButton
                  loading={savingInProgress}
                  variant={'contained'}
                  onClick={() => {
                    const isValid = authorStore.validate();
                    if (isValid) {
                      setSavingInProgress(true);
                      void handleSaveButton().then(() => {
                        setSavingInProgress(false);
                        handleCloseAddAuthor();
                      });
                    }
                  }}>
                  {authorStore.isNew ? 'Add author' : 'Save'}
                </LoadingButton>
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

const AuthorsEditorWrap = styled.div``;

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

const ChangesOnThisFormDoesntAffectProfileInfoWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 8px 6px 16px;
  align-items: center;
  align-self: stretch;
  height: 48px;
  border-radius: 4px;
  background: var(--alert-info-fill, #e5f6fd);

  color: var(--alert-info-content, #014361);
  font-feature-settings: 'clig' off, 'liga' off;
`;

const ChangesOnThisFormDoesntAffectProfileText = styled.span`
  /* typography/body2 */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;
`;

const DraggableContentWrapper = styled.div<{
  isDragging: boolean;
}>`
  padding-top: 14px;
  padding-bottom: 14px;
  ${(props) =>
    props.isDragging
      ? 'border-radius: 4px;  transition-property: padding-left;\n  transition-duration: 1s;\n  transition-timing-function: ease-out;\n  ' +
        'padding-left: 14px;\n' +
        'opacity: 0.8;\n' +
        'background: var(--primary-contrast, #fff);\n\n  /* elevation/5 */\n' +
        'box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),\n' +
        '    0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12);'
      : ''}
`;
