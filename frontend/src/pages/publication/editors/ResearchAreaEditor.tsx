import React, { type ReactElement, useState } from 'react';
import { type EditorProps } from './ParagraphEditor';
import styled from '@emotion/styled';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';

export const ResearchAreaEditor = (props: EditorProps): ReactElement => {
  const [addAuthorVisible, setAddAuthorVisible] = useState(false);

  const [researchArea, setResearchArea] = useState(
    props.editorStore.researchArea
  );
  const [isValidResearchArea, setIsValidResearchArea] = useState(true);

  const validate = (): boolean => {
    const isVE = researchArea.length > 0;
    setIsValidResearchArea(isVE);
    return isVE;
  };

  const researchAreaNonEmpty = researchArea.length > 0;

  const handleCloseEdit = (): void => {
    setAddAuthorVisible(false);
  };

  return (
    <>
      <ContentPlaceholderWrap
        tabIndex={0}
        onClick={() => {
          setAddAuthorVisible(true);
        }}>
        {props.editorStore.researchArea}
      </ContentPlaceholderWrap>
      <Dialog
        open={addAuthorVisible}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Research area</DialogTitle>
        <DialogContent>
          <AddAuthorWrap>
            <FullWidthTextField
              autoFocus
              value={researchArea}
              onChange={(e) => {
                setResearchArea(e.currentTarget.value);
              }}
              error={!isValidResearchArea}
              helperText={
                !isValidResearchArea ? 'Please enter research area' : undefined
              }
              label="Research area"
              variant="outlined"
              placeholder={
                'Enter the primary field or discipline of your research/experiment...'
              }
            />
          </AddAuthorWrap>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button
            disabled={!researchAreaNonEmpty}
            onClick={() => {
              const isValid = validate();
              if (isValid) {
                props.editorStore.updateResearchArea(researchArea);
                handleCloseEdit();
              }
            }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ContentPlaceholderWrap = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 48px;

  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;

  border-radius: 4px;
  background: var(--action-hover, rgba(4, 0, 54, 0.05));

  &:hover {
    cursor: pointer;
  }
`;

const AddAuthorWrap = styled.div`
  min-width: 488px;
  margin-top: 8px;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 32px;
`;