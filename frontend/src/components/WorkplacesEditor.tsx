import React, { type ReactElement, useEffect, useState } from 'react';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import styled from '@emotion/styled';
import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Snackbar,
  Switch,
  TextField
} from '@mui/material';
import {
  FullWidth,
  HeightElement,
  ValidationError,
  ValidationErrorText,
  WidthElement
} from '../pages/common.styled';
import { Organization, Workplace } from '../apis/first-approval-api';
import { organizationService } from '../core/service';
import {
  IWorkplaceStore,
  WorkplaceProps,
  WorkplaceValidationState
} from '../core/WorkplaceProps';
import { observer } from 'mobx-react-lite';
import { LoadingButton } from '@mui/lab';
import { Clear } from '@mui/icons-material';

export enum ActionButtonType {
  FULL_WIDTH_CONFIRM = 'FULL_WIDTH_CONFIRM'
}

interface WorkplacesEditorProps {
  store: IWorkplaceStore;
  buttonType?: ActionButtonType;
  saveButtonText?: ReactElement;
  isModalWindow: boolean;
  saveCallback?: (workplaces: Workplace[]) => Promise<boolean>;
}

export const WorkplacesEditor = observer(
  (props: WorkplacesEditorProps): ReactElement => {
    const { isModalWindow, saveCallback, buttonType, store, saveButtonText } =
      props;
    const [savingInProgress, setSavingInProgress] = useState(false);
    const [showSuccessSavingAlter, setShowSuccessSavingAlter] = useState(false);
    const { workplaces, workplacesProps, workplacesValidation } = store;
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

    const currentWorkplaceAbsent = !workplaces.some(
      (workplace) => !workplace.isFormer
    );

    const mapWorkplace = (
      workplace: Workplace,
      workplaceProps: WorkplaceProps,
      workplaceValidationState: WorkplaceValidationState,
      index: number
    ): ReactElement => {
      return (
        <FullWidth key={index}>
          <DividerWrap hidden={index === 0} />
          <FlexWrapOrganization extendWidth={!isModalWindow}>
            <Autocomplete
              key={`orgKey-${index}-${workplaceProps.orgQueryKey}`}
              onChange={(event: any, newValue: Organization | null) => {
                workplace.organization = newValue ?? undefined;
                workplaceProps.orgQuery = newValue?.name ?? '';
                workplaceProps.orgQueryKey = '';
              }}
              onBlur={(event: any) => {
                const orgName = event.target.value;
                workplace.organization = workplaceProps
                  .organizationOptions[0] ?? { name: orgName };
                workplaceProps.orgQuery = workplace.organization.name;
                workplaceProps.orgQueryKey = '';
              }}
              onInputChange={(event, newInputValue, reason) => {
                if (reason === 'reset' && newInputValue) {
                  workplaceProps.orgQuery = newInputValue;
                }
                if (!['selectOption', 'reset', 'blur'].includes(reason)) {
                  workplaceProps.orgQuery = newInputValue;
                  workplaceProps.orgQueryKey = '';
                  setWorkplaceOrgQueryIndex(`${index}-${newInputValue}`);
                }
              }}
              blurOnSelect={true}
              forcePopupIcon={false}
              inputValue={workplaceProps?.orgQuery}
              renderOption={(props, option, state) => {
                return <SelectOption {...props}>{option.name}</SelectOption>;
              }}
              getOptionLabel={(option) => option.name}
              options={workplaceProps.organizationOptions ?? []}
              sx={{ width: '100%' }}
              renderInput={(params) => (
                <TextField
                  autoFocus={!workplaceProps.orgQuery && !isModalWindow}
                  {...params}
                  variant="outlined"
                  label={'Organization name'}
                  placeholder={
                    'Institution, company, or organization you are affiliated with'
                  }
                  error={!workplaceValidationState.isValidOrganization}
                  helperText={
                    !workplaceValidationState.isValidOrganization
                      ? 'Organization can not be empty'
                      : undefined
                  }
                />
              )}
            />
            {workplaces.length > 1 ? (
              <IconButtonWrap
                useMarginRight={!isModalWindow}
                onClick={() => {
                  workplaces.splice(index, 1);
                  workplacesProps.splice(index, 1);
                  workplacesValidation.splice(index, 1);
                  if (workplaces.length === 1) {
                    workplaces[0].isFormer = false;
                  }
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
              !isModalWindow && <WidthElement value={'62px'} />
            )}
          </FlexWrapOrganization>
          <HeightElement value={'32px'} />
          <TextField
            multiline={false}
            maxRows={1}
            value={workplace.department ?? ''}
            onChange={(e) => {
              workplaces[index].department = e.currentTarget.value;
            }}
            label="Department (opt.)"
            variant="outlined"
          />
          <HeightElement value={'32px'} />
          <FlexWrapRowFullWidth>
            <AddressField
              multiline={true}
              maxRows={1}
              value={workplace.address ?? ''}
              onChange={(e) => {
                workplaces[index].address = e.currentTarget.value;
              }}
              label="Address (opt.)"
              variant="outlined"
            />
            <WidthElement value={'16px'} />
            <PostalCodeField
              multiline={true}
              maxRows={1}
              value={workplace.postalCode ?? ''}
              onChange={(e) => {
                workplaces[index].postalCode = e.currentTarget.value;
              }}
              label="Postal code (opt.)"
              variant="outlined"
            />
          </FlexWrapRowFullWidth>
          {!isModalWindow && (
            <FormerWorkplace
              labelPlacement={'start'}
              control={
                <Switch
                  checked={workplace.isFormer}
                  onChange={(event) => {
                    workplaces[index].isFormer = event.currentTarget.checked;
                  }}
                />
              }
              label="Former workplace"
            />
          )}
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
            return mapWorkplace(
              workplace,
              workplacesProps[index],
              workplacesValidation[index],
              index
            );
          })}
        </FullWidth>
        {currentWorkplaceAbsent && (
          <>
            <HeightElement value={'32px'} />
            <ValidationError>
              <ErrorOutline
                htmlColor={'#D32F2F'}
                sx={{ width: '22px', height: '22px' }}
              />
              <WidthElement value={'12px'} />
              <ValidationErrorText variant={'body2'}>
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
              orgQueryKey: '',
              organizationOptions: []
            };
            workplaces.push({ isFormer: false });
            workplacesValidation.push({ isValidOrganization: true });
          }}>
          + Add affiliation
        </Button>
        <HeightElement value="32px" />
        {buttonType === ActionButtonType.FULL_WIDTH_CONFIRM && saveCallback && (
          <SaveButton
            size={'large'}
            loading={savingInProgress}
            disabled={currentWorkplaceAbsent}
            color={'primary'}
            variant={'contained'}
            onClick={() => {
              setSavingInProgress(true);
              void saveCallback(workplaces).then((saved) => {
                setSavingInProgress(false);
                if (saved) {
                  setShowSuccessSavingAlter(true);
                }
              });
            }}>
            {saveButtonText}
          </SaveButton>
        )}
        {showSuccessSavingAlter && (
          <Snackbar
            open={showSuccessSavingAlter}
            autoHideDuration={4000}
            onClose={() => {
              setShowSuccessSavingAlter(false);
            }}>
            <Alert severity="success" sx={{ width: '100%' }}>
              Affiliations successfully saved!
            </Alert>
          </Snackbar>
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

export const FlexWrapRowFullWidth = styled.div`
  display: flex;
  width: 100%;
`;

export const FlexWrapOrganization = styled.div<{
  extendWidth: boolean;
}>`
  ${(props) => (props.extendWidth ? 'width: calc(100% + 56px);' : '100%;')}
  display: flex;
  align-items: center;
`;

const IconButtonWrap = styled(IconButton)<{
  useMarginRight: boolean;
}>`
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

  /* typography/body1 */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
`;

export const SaveButton = styled(LoadingButton)`
  width: 100%;
`;

export const FlexWrapColumnCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
