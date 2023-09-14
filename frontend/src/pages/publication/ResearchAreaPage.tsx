import React, { type ReactElement, useState } from 'react';
import { Autocomplete, Button, Chip, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { type EditorProps } from './editors/types';
import { ArrowForward } from '@mui/icons-material';
import { researchAreaCategories } from './store/ResearchAreas';

export const ResearchAreaPage = (props: EditorProps): ReactElement => {
  const [researchAreas, setResearchAreas] = useState([]);

  const researchAreaNonEmpty = researchAreas.length > 0;

  const updateResearchArea = (): void => {
    const isValid = researchAreas.length > 0;
    if (isValid) {
      props.publicationStore.updateResearchArea(researchAreas);
    }
  };

  return (
    <>
      <ResearchAreaTitle>
        Before the start:
        <br />
        What&apos;s the research area of the new publication?
      </ResearchAreaTitle>
      <Autocomplete
        multiple={true}
        disablePortal
        freeSolo={true}
        id="combo-box-demo"
        options={researchAreaCategories}
        getOptionLabel={(option: any) =>
          option.category + ' ' + option.subcategory
        }
        sx={{ width: '100%' }}
        renderOption={(props, option) => {
          return (
            <li {...props} style={{ padding: '8px 16px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                <div style={{ marginRight: 16 }}>{option.icon}</div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                  <div style={{ fontSize: 16 }}>{option.subcategory}</div>
                  <div
                    style={{
                      fontSize: 14,
                      color: 'var(--text-secondary, #68676E)'
                    }}>
                    {option.category}
                  </div>
                </div>
              </div>
            </li>
          );
        }}
        renderTags={(value: readonly any[], getTagProps) =>
          value.map((option: any, index: number) => (
            <Chip
              icon={
                <div
                  style={{
                    marginLeft: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  {option.icon}
                </div>
              }
              // @ts-expect-error(2322)
              key={option.category + option.subcategory}
              style={{
                borderRadius: 2,
                border: '1px solid var(--divider, #D2D2D6)',
                background: 'var(--grey-50, #F8F7FA)'
              }}
              label={option.subcategory}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            autoFocus={true}
            {...params}
            placeholder={
              researchAreas.length === 0
                ? 'Start typing the primary field or discipline of your research/experiment...'
                : ''
            }
          />
        )}
        onChange={(event, newValue: any) => {
          setResearchAreas(newValue);
        }}
      />
      <div
        style={{
          marginTop: 4,
          fontSize: 14,
          fontWeight: 400,
          marginBottom: 40
        }}>
        e.g., Molecular Biology, Astrophysics, Artificial Intelligence, etc.
      </div>
      <Button
        disabled={!researchAreaNonEmpty}
        variant="contained"
        size={'large'}
        endIcon={<ArrowForward />}
        onClick={() => updateResearchArea()}>
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
