import { observer } from 'mobx-react-lite';
import React, { type ReactElement, useEffect, useState } from 'react';
import { type Author } from '../../../apis/first-approval-api';
import { AddAuthorStore } from '../store/AddAuthorStore';
import { AuthorElement } from './element/AuthorElement';
import {
  Autocomplete,
  Avatar,
  Button,
  Divider,
  TextField
} from '@mui/material';
import { Add, PersonAdd } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import styled from '@emotion/styled';
import { ContentEditorWrap, LabelWrap } from './styled';
import { type EditorProps } from './ParagraphEditor';
import { getInitials } from '../../../util/userUtil';

export const AuthorsEditor = observer((props: EditorProps): ReactElement => {
  const [addAuthorVisible, setAddAuthorVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [authorOptions, setAuthorOptions] = useState<Author[]>([]);

  const [query, setQuery] = useState('');

  const [addAuthorStore] = useState(() => new AddAuthorStore());

  useEffect(() => {
    if (!query.trim()) {
      setAuthorOptions([]);
      return;
    }
    addAuthorStore
      .searchAuthors(query.trim())
      .then((result) => {
        setAuthorOptions(
          result.filter(
            (a1) =>
              !props.editorStore.confirmedAuthors.find((a2) => a1.id === a2.id)
          )
        );
      })
      .catch(() => {
        setAuthorOptions([]);
      });
  }, [query]);

  const handleCloseAddAuthor = (): void => {
    setAddAuthorVisible(false);
  };

  return (
    <>
      <ContentEditorWrap>
        <LabelWrap>Authors</LabelWrap>
        {props.editorStore.authors.map((author) => {
          return <AuthorElement key={author.email} author={author} />;
        })}
        {!props.isReadonly && !searchVisible && (
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
                    props.editorStore.addConfirmedAuthor(newValue);
                  }
                }}
                inputValue={query}
                onInputChange={(event, newInputValue) => {
                  setQuery(newInputValue);
                }}
                renderOption={(props, option, state) => {
                  return (
                    <AuthorSelectOption {...props}>
                      <Avatar>
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
        <DialogTitle id="alert-dialog-title">Add author</DialogTitle>
        <DialogContent>
          <AddAuthorWrap>
            <FullWidthTextField
              autoFocus
              value={addAuthorStore.email}
              onChange={(e) => {
                addAuthorStore.email = e.currentTarget.value;
              }}
              label="Email"
              variant="outlined"
            />
            <OneLineWrap>
              <MarginTextField
                value={addAuthorStore.fistName}
                onChange={(e) => {
                  addAuthorStore.fistName = e.currentTarget.value;
                }}
                label="First name"
                variant="outlined"
              />
              <FullWidthTextField
                value={addAuthorStore.lastName}
                onChange={(e) => {
                  addAuthorStore.lastName = e.currentTarget.value;
                }}
                label="Last name"
                variant="outlined"
              />
            </OneLineWrap>
            <FullWidthTextField
              multiline
              minRows={4}
              maxRows={4}
              value={addAuthorStore.shortBio}
              onChange={(e) => {
                addAuthorStore.shortBio = e.currentTarget.value;
              }}
              label="Short bio"
              variant="outlined"
            />
          </AddAuthorWrap>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddAuthor}>Cancel</Button>
          <Button
            onClick={() => {
              props.editorStore.addUnconfirmedAuthor(addAuthorStore);
              handleCloseAddAuthor();
            }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

const AddAuthorWrap = styled.div`
  min-width: 488px;
  margin-top: 8px;
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
