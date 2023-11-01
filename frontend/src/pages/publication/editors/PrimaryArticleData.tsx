import { observer } from 'mobx-react-lite';
import React, { type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import Dialog from '@mui/material/Dialog';
import { IconButton, Link, TextField } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { type Paragraph } from '../../../apis/first-approval-api';
import { DeleteOutlined } from '@mui/icons-material';

interface PrimaryArticleDataProps {
  value: Paragraph[];
  onChange: (value: Paragraph[]) => void;
  isReadOnly: boolean;
}

export const PrimaryArticleData = observer(
  (props: PrimaryArticleDataProps): ReactElement => {
    const [dialogArticleIndex, setDialogArticleIndex] = useState<number | null>(
      null
    );
    const [dialogContent, setDialogContent] = useState('');
    const [addPrimaryArticleOpened, setAddPrimaryArticleOpened] =
      useState(false);

    const handleCloseNoteDialog = (): void => {
      setAddPrimaryArticleOpened(false);
      setDialogContent('');
    };

    const openDialogWithPreCreated = (index: number): void => {
      setDialogArticleIndex(index);
      setDialogContent(props.value[index].text);
      setAddPrimaryArticleOpened(true);
    };

    const updateContent = (content: string): void => {
      const contentList = [...props.value];
      if (dialogArticleIndex != null) {
        contentList[dialogArticleIndex] = { text: content };
      } else {
        contentList.push({ text: content });
      }
      props.onChange(contentList);
    };

    const removeElement = (): void => {
      const contentList = [...props.value];
      if (typeof dialogArticleIndex === 'number') {
        contentList.splice(dialogArticleIndex, 1);
        props.onChange(contentList);
      }
    };

    return (
      <>
        <div style={{ marginBottom: 32 }}>
          {props.value.map((v, index) => (
            <ArticleContentWrap
              key={index}
              onClick={() => {
                if (props.isReadOnly) {
                  return;
                }
                openDialogWithPreCreated(index);
              }}>
              <PrimaryArticleNameWrap>{`Primary article: ${v.text}`}</PrimaryArticleNameWrap>
            </ArticleContentWrap>
          ))}
        </div>
        <LinkWrap
          color="inherit"
          onClick={() => {
            if (props.isReadOnly) {
              return;
            }
            setDialogArticleIndex(null);
            setAddPrimaryArticleOpened(true);
          }}>
          {!props.isReadOnly && props.value.length === 0 && (
            <span>
              Published elsewhere? Provide the primary article based on this
              dataset.
            </span>
          )}
          {!props.isReadOnly && props.value.length > 0 && (
            <span>Add primary article</span>
          )}
        </LinkWrap>
        <Dialog
          open={addPrimaryArticleOpened}
          onClose={() => {
            setAddPrimaryArticleOpened(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">Primary article</DialogTitle>
          <DialogContent>
            <ContentWrap>
              <FullWidthTextarea
                multiline={true}
                minRows={4}
                maxRows={4}
                autoFocus
                value={dialogContent}
                placeholder={
                  'Enter the citation or URL of the primary/original article here'
                }
                onChange={(e) => {
                  setDialogContent(e.currentTarget.value);
                }}
                variant="outlined"
              />
            </ContentWrap>
          </DialogContent>
          <DialogActions>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
              <div>
                {dialogArticleIndex != null && (
                  <IconButton
                    onClick={() => {
                      removeElement();
                      handleCloseNoteDialog();
                    }}>
                    <DeleteOutlined htmlColor={'gray'} />
                  </IconButton>
                )}
              </div>
              <div>
                <Button onClick={handleCloseNoteDialog}>Cancel</Button>
                <Button
                  disabled={!dialogContent}
                  onClick={() => {
                    updateContent(dialogContent);
                    handleCloseNoteDialog();
                  }}>
                  Add article
                </Button>
              </div>
            </div>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

const PrimaryArticleNameWrap = styled.span`
  overflow-wrap: anywhere;
  display: inline-block;
`;

const ArticleContentWrap = styled.div`
  &:hover {
    background: var(--grey-50, #f8f7fa);
  }
`;

const ContentWrap = styled.div`
  padding-top: 8px;
`;

const FullWidthTextarea = styled(TextField)`
  min-width: 536px;
`;

const LinkWrap = styled(Link)`
  cursor: pointer;
`;
