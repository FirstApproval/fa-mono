import React, { type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Autocomplete, Button, Chip, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { ResearchAreaEditorProps } from './types';
import {
  findResearchAreaCategory,
  findResearchAreaIcon,
  researchAreaCategories
} from '../store/ResearchAreas';
import { observer } from 'mobx-react-lite';

export const ResearchAreaEditor = observer(
  (props: ResearchAreaEditorProps): ReactElement => {
    const [researchAreas, setResearchAreas] = useState(
      props.publicationStore.researchAreas
    );

    const researchAreaNonEmpty = researchAreas.length > 0;

    if (props.publicationStore.isReadonly) {
      return (
        <ReadonlyContentPlaceholderWrap>
          {researchAreas?.map((researchArea: any) => {
            return (
              <PublicationAreaWrap
                key={researchArea.text || researchArea.subcategory}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <div
                    style={{
                      paddingTop: 4,
                      marginRight: 4
                    }}>
                    {researchArea.text
                      ? findResearchAreaIcon(researchArea.text)
                      : findResearchAreaIcon(researchArea.subcategory)}
                  </div>
                  {researchArea.text || researchArea.subcategory}
                </div>
              </PublicationAreaWrap>
            );
          })}
        </ReadonlyContentPlaceholderWrap>
      );
    }

    const updateResearchArea = (): void => {
      const isValid = researchAreas.length > 0;
      if (isValid) {
        props.publicationStore.updateResearchArea(researchAreas);
        props.publicationPageStore.closeResearchAreasModal();
      }
    };

    return (
      <>
        <ContentPlaceholderWrap
          tabIndex={0}
          onClick={props.publicationPageStore.openResearchAreasModal}>
          {researchAreas?.map((researchArea: any) => {
            return (
              <PublicationAreaWrap
                key={researchArea.text || researchArea.subcategory}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <div
                    style={{
                      paddingTop: 4,
                      marginRight: 4
                    }}>
                    {researchArea.text
                      ? findResearchAreaIcon(researchArea.text)
                      : findResearchAreaIcon(researchArea.subcategory)}
                  </div>
                  {researchArea.text || researchArea.subcategory}
                </div>
              </PublicationAreaWrap>
            );
          })}
        </ContentPlaceholderWrap>
        <Dialog
          open={props.publicationPageStore.isResearchAreasDialogOpen}
          onClose={props.publicationPageStore.closeResearchAreasModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            Choose 1 or more research areas
          </DialogTitle>
          <DialogContent style={{ height: 500 }}>
            <AddAuthorWrap>
              <Autocomplete
                multiple={true}
                disablePortal
                freeSolo={true}
                value={researchAreas.map((researchArea) => {
                  if (researchArea.text) {
                    return {
                      subcategory: researchArea.text,
                      category: findResearchAreaCategory(researchArea.text),
                      icon: findResearchAreaIcon(researchArea.text)
                    };
                  } else {
                    return researchArea as any;
                  }
                })}
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
                          <div style={{ fontSize: 16 }}>
                            {option.subcategory}
                          </div>
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
                      disabled={researchAreas.length === 1}
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
            </AddAuthorWrap>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={props.publicationPageStore.closeResearchAreasModal}>
              Cancel
            </Button>
            <Button
              disabled={!researchAreaNonEmpty}
              onClick={updateResearchArea}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

const ContentPlaceholderWrap = styled.div`
  word-break: break-word;
  display: flex;
  flex-wrap: wrap;

  align-items: center;
  margin-bottom: 48px;

  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;

  &:hover {
    cursor: pointer;
  }
`;

const ReadonlyContentPlaceholderWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
`;

const AddAuthorWrap = styled.div`
  min-width: 488px;
  margin-top: 8px;
`;

const PublicationAreaWrap = styled.div`
  display: inline-flex;
  padding: 2px 8px;
  align-items: center;
  margin-right: 8px;
  margin-bottom: 8px;

  border-radius: 4px;
  background: var(--grey-50, #f8f7fa);

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;

  word-break: break-word;
`;
