import React, { type ReactElement } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Autocomplete, Chip, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import {
  findResearchAreaCategory,
  findResearchAreaIcon,
  researchAreaCategories
} from './ResearchAreas';
import { observer } from 'mobx-react-lite';
import { ResearchAreaProps } from './ResearchArea';
import styled from '@emotion/styled';

export const ResearchAreaDialog = observer(
  (props: ResearchAreaProps): ReactElement => {
    return (
      <Dialog
        open={props.researchAreaStore.isDialogOpened}
        onClose={props.researchAreaStore.closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          Choose 1 or more research areas
        </DialogTitle>
        <DialogContent style={{ height: 500 }}>
          <DialogContentWrap>
            <Autocomplete
              multiple={true}
              disablePortal
              freeSolo={true}
              value={props.researchAreaStore.researchAreas.map(
                (researchArea) => {
                  if (researchArea.text) {
                    return {
                      subcategory: researchArea.text,
                      category: findResearchAreaCategory(researchArea.text),
                      icon: findResearchAreaIcon(researchArea.text)
                    };
                  } else {
                    return researchArea as any;
                  }
                }
              )}
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
                    disabled={
                      props.researchAreaStore.researchAreas.length === 1
                    }
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  autoFocus={true}
                  {...params}
                  placeholder={
                    props.researchAreaStore.researchAreas.length === 0
                      ? 'Start typing the primary field or discipline of your research/experiment...'
                      : ''
                  }
                />
              )}
              onChange={(event, newValue: any) => {
                props.researchAreaStore.update(newValue);
              }}
            />
          </DialogContentWrap>
        </DialogContent>
      </Dialog>
    );
  }
);

const DialogContentWrap = styled.div`
  min-width: 488px;
  margin-top: 8px;
`;
