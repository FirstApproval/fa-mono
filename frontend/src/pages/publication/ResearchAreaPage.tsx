import { type EditorProps } from './editors/ParagraphEditor';
import React, { type ReactElement, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import styled from '@emotion/styled';

export const ResearchAreaPage = (props: EditorProps): ReactElement => {
  const [researchArea, setResearchArea] = useState('');
  const [isValidResearchArea, setIsValidResearchArea] = useState(true);

  const validate = (): boolean => {
    const isVE = researchArea.length > 0;
    setIsValidResearchArea(isVE);
    return isVE;
  };

  const researchAreaNonEmpty = researchArea.length > 0;

  return (
    <>
      <ResearchAreaTitle>
        Before the start:
        <br />
        What&apos;s the research area of the new publication?
      </ResearchAreaTitle>
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
      <Button
        disabled={!researchAreaNonEmpty}
        variant="contained"
        size={'large'}
        endIcon={<ArrowForward />}
        onClick={() => {
          const isValid = validate();
          if (isValid) {
            props.editorStore.updateResearchArea(researchArea);
          }
        }}>
        Continue
      </Button>
      <div>You can change it later</div>
    </>
  );
};

const ResearchAreaTitle = styled.div`
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 116.7%;
  margin-bottom: 40px;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 40px;
`;