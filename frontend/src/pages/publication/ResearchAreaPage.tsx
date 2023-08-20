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
            props.publicationStore.updateResearchArea(researchArea);
          }
        }}>
        Continue
      </Button>
      <ChangeItLater>You can change it later</ChangeItLater>
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

const ChangeItLater = styled.div`
  margin-top: 8px;
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body2 */
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;
`;
