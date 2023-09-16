import React, { type ReactElement, useEffect, useState } from 'react';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import styled from '@emotion/styled';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Switch,
  TextField
} from '@mui/material';
import { FullWidth, HeightElement, WidthElement } from '../pages/common.styled';
import {
  Organization,
  OrganizationDepartment,
  Workplace
} from '../apis/first-approval-api';
import { organizationService } from '../core/service';
import { WorkplaceProps } from '../core/WorkplaceProps';
import { observer } from 'mobx-react-lite';
import { LoadingButton } from '@mui/lab';
import { Clear } from '@mui/icons-material';
import { userStore } from '../core/user';

interface WorkplacesEditorProps {
  showSaveButton: boolean;
}

export const WorkplacesEditor = observer(
  (props: WorkplacesEditorProps): ReactElement => {
    const [savingInProgress, setSavingInProgress] = useState(false);
    const { workplaces, workplacesProps } = userStore;
    const [workplaceOrgQueryIndex, setWorkplaceOrgQueryIndex] = useState('0-');

    useEffect(() => {
      const index = +workplaceOrgQueryIndex.substring(
        0,
        workplaceOrgQueryIndex.indexOf('-')
      );
      const workplaceProps = workplacesProps[index]!;
      if (
        workplaceProps?.orgQuery &&
        workplaceProps?.orgQuery?.trim().length > 2
      ) {
        organizationService
          .searchOrganizations(workplaceProps.orgQuery)
          .then((result) => {
            workplacesProps[index].organizationOptions =
              result.data.organizations;
          })
          .catch(() => {
            workplacesProps[index].organizationOptions = [];
          });
      }
    }, [workplaceOrgQueryIndex]);

    const notValid = workplaces.some(
      (workplace) => !workplace.organization || !workplace.address
    );

    const currentWorkplaceAbsent = !workplaces.some(
      (workplace) => !workplace.isFormer
    );

    const mapWorkplace = (
      workplace: Workplace,
      workplaceProps: WorkplaceProps,
      index: number
    ): ReactElement => {
      return (
        <FullWidth key={index}>
          <DividerWrap hidden={index === 0} />
          <FlexWrapOrganization>
            <Autocomplete
              key={`orgKey-${index}`}
              filterOptions={(options, params) => {
                if (!options) {
                  return options;
                }
                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.name
                );
                if (inputValue !== '' && !isExisting) {
                  options.push({ name: inputValue });
                }
                return options;
              }}
              onChange={(event: any, newValue: Organization | null) => {
                workplace.organization = newValue ?? undefined;
                workplaceProps.departmentOptions = newValue?.departments ?? [];
                workplaceProps.departmentQuery = '';
                workplaceProps.orgQuery = newValue?.name ?? '';
                workplaceProps.departmentQueryKey = newValue?.name ?? ''; // for re-rendering
                // }
              }}
              onInputChange={(event, newInputValue, reason) => {
                if (reason === 'reset' && newInputValue) {
                  workplaceProps.orgQuery = newInputValue;
                }
                if (!['selectOption', 'reset', 'blur'].includes(reason)) {
                  workplace.department = undefined;
                  workplaceProps.orgQuery = newInputValue;
                  workplaceProps.departmentOptions = [];
                  workplaceProps.departmentQuery = '';
                  setWorkplaceOrgQueryIndex(`${index}-${newInputValue}`);
                }
              }}
              blurOnSelect={true}
              forcePopupIcon={false}
              inputValue={workplaceProps?.orgQuery}
              renderOption={(props, option, state) => {
                return (
                  <SelectOption {...props}>{`${
                    option.id ? '' : 'Add organization: '
                  }${option.name}`}</SelectOption>
                );
              }}
              getOptionLabel={(option) => option.name}
              options={workplaceProps.organizationOptions ?? []}
              sx={{ width: '100%' }}
              renderInput={(params) => (
                <TextField
                  autoFocus={!workplaceProps.orgQuery}
                  {...params}
                  variant="outlined"
                  label={'Organization name'}
                  // error={!workplace.organization}
                  placeholder={
                    'Institution, company, or organization you are affiliated with'
                  }
                />
              )}
            />
            {workplaces.length > 1 ? (
              <IconButtonWrap
                onClick={() => {
                  workplaces.splice(index, 1);
                  workplacesProps.splice(index, 1);
                }}>
                <Clear
                  sx={{
                    width: 24,
                    height: 24
                  }}
                  htmlColor={'#68676E'}
                />
              </IconButtonWrap>
            ) : (
              <WidthElement value={'62px'} />
            )}
          </FlexWrapOrganization>
          <HeightElement value={'32px'} />
          <Autocomplete
            key={`departmentKey-${index}-${workplaceProps.departmentQueryKey}`}
            filterOptions={(options, params) => {
              if (!options) {
                return options;
              }
              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some(
                (option) => inputValue === option.name
              );
              if (inputValue !== '' && !isExisting) {
                options.push({ name: inputValue });
              }
              return options;
            }}
            disabled={!workplace.organization}
            onChange={(event: any, newValue: OrganizationDepartment | null) => {
              if (newValue) {
                workplace.department = newValue;
              }
            }}
            onBlur={(e) => {
              e.preventDefault();
              if (
                workplaceProps.departmentQuery &&
                !workplaceProps.departmentOptions
                  .map((org) => org.name)
                  .includes(workplaceProps.departmentQuery)
              ) {
                const newDepartment = {
                  name: workplaceProps.departmentQuery
                };
                workplaceProps.departmentOptions.push(newDepartment);
                workplace.department = newDepartment;
              }
            }}
            forcePopupIcon={false}
            inputValue={workplaceProps.departmentQuery}
            onInputChange={(event, newInputValue, reason) => {
              if (reason !== 'reset' || newInputValue) {
                workplacesProps[index].departmentQuery = newInputValue;
              }
            }}
            renderOption={(props, option, state) => {
              return (
                <SelectOption {...props}>
                  {`${option.id ? '' : 'Add department: '}${option.name}`}
                </SelectOption>
              );
            }}
            getOptionLabel={(option) => option.name ?? ''}
            id="controllable-states-demo"
            options={
              (!workplaceProps.departmentQuery
                ? workplaceProps.departmentOptions
                : workplaceProps.departmentOptions.filter((dep) =>
                    dep.name
                      ?.toLowerCase()
                      .includes(workplaceProps.departmentQuery.toLowerCase())
                  )) ?? []
            }
            sx={{ width: '100%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Department (opt)"
                placeholder="Department (opt)"
              />
            )}
          />
          <HeightElement value={'32px'} />
          <FlexWrapRow>
            <AddressField
              multiline={true}
              maxRows={1}
              value={workplace.address}
              onChange={(e) => {
                workplaces[index].address = e.currentTarget.value;
              }}
              // error={!workplace.address}
              label="Address"
              variant="outlined"
            />
            <WidthElement value={'16px'} />
            <PostalCodeField
              multiline={true}
              maxRows={1}
              value={workplace.postalCode}
              onChange={(e) => {
                workplaces[index].postalCode = e.currentTarget.value;
              }}
              label="Postal code (opt.)"
              variant="outlined"
            />
          </FlexWrapRow>
          <FormerWorkplace
            labelPlacement={'start'}
            control={
              <Switch
                checked={workplace.isFormer}
                onChange={(event) => {
                  if (!event.currentTarget.checked) {
                    workplaces.forEach((w) => (w.isFormer = true));
                  }
                  workplaces[index].isFormer = event.currentTarget.checked;
                }}
              />
            }
            label="Former workplace"
          />
        </FullWidth>
      );
    };

    if (workplaces.length === 0 || workplacesProps.length === 0) {
      return (
        <FlexWrapColumnCenter>
          <CircularProgress />
          <HeightElement value={'24px'} />
        </FlexWrapColumnCenter>
      );
    }

    return (
      <EditorWrap>
        <FullWidth key={`workspaces-${'workspacesWrapKey'}`}>
          {workplaces.map((workplace: Workplace, index: number) => {
            return mapWorkplace(workplace, workplacesProps[index], index);
          })}
        </FullWidth>
        {notValid && (
          <>
            <HeightElement value={'32px'} />
            <ValidationError>
              <ErrorOutline
                htmlColor={'#D32F2F'}
                sx={{ width: '22px', height: '22px' }}
              />
              <WidthElement value={'12px'} />
              <ValidationErrorText>
                Fill in all the required fields
              </ValidationErrorText>
            </ValidationError>
          </>
        )}
        {currentWorkplaceAbsent && (
          <>
            <HeightElement value={'32px'} />
            <ValidationError>
              <ErrorOutline
                htmlColor={'#D32F2F'}
                sx={{ width: '22px', height: '22px' }}
              />
              <WidthElement value={'12px'} />
              <ValidationErrorText>
                You must add at least one current workplace.
              </ValidationErrorText>
            </ValidationError>
          </>
        )}
        <HeightElement value="32px" />
        <Button
          disabled={false}
          variant={'text'}
          onClick={() => {
            workplacesProps[workplaces.length] = {
              orgQuery: '',
              departmentQuery: '',
              departmentQueryKey: '',
              organizationOptions: [],
              departmentOptions: []
            };
            workplaces.push({ isFormer: workplaces.length > 0 });
          }}>
          + Add workplace
        </Button>
        <HeightElement value="32px" />
        {props.showSaveButton && (
          <SaveButton
            loading={savingInProgress}
            disabled={notValid || currentWorkplaceAbsent}
            color={'primary'}
            variant={'contained'}
            onClick={() => {
              setSavingInProgress(true);
              void userStore.saveWorkplaces(workplaces).then(() => {
                setSavingInProgress(false);
              });
            }}>
            Save affiliations
          </SaveButton>
        )}
      </EditorWrap>
    );
  }
);

const AddressField = styled(TextField)`
  width: 65%;
`;

const PostalCodeField = styled(TextField)`
  width: 35%;
`;

const SelectOption = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 16px;
`;

const EditorWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
`;

export const FlexWrapRow = styled.div`
  display: flex;
  width: 100%;
`;

export const FlexWrapOrganization = styled.div`
  display: flex;
  width: calc(100% + 56px);
  align-items: center;
`;

const IconButtonWrap = styled(IconButton)`
  margin-left: 8px;
  padding: 12px;
  cursor: pointer;
`;

const DividerWrap = styled(Divider)`
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`;

const FormerWorkplace = styled(FormControlLabel)`
  margin-top: 32px;
  align-self: end;
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body1 */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
`;

const ValidationError = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  padding: 6px 16px;
  align-items: center;
  border-radius: 4px;
  background: var(--alert-error-fill, #fdeded);
`;

const ValidationErrorText = styled.span`
  color: var(--alert-error-content, #5f2120);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/body2 */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 143%; /* 20.02px */
  letter-spacing: 0.17px;
`;

export const SaveButton = styled(LoadingButton)`
  width: 100%;

  font-feature-settings: 'clig' off, 'liga' off;
  /* components/button-large */
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.46px;
`;

export const FlexWrapColumnCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
