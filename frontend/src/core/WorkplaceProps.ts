import {
  Organization,
  OrganizationDepartment,
  Workplace
} from '../apis/first-approval-api';

export interface WorkplaceProps {
  orgQuery: string;
  departmentQuery: string;
  departmentQueryKey: string;
  organizationOptions: Organization[];
  departmentOptions: OrganizationDepartment[];
}

export interface IWorkplaceStore {
  workplaces: Workplace[];
  workplacesProps: WorkplaceProps[];
  workplacesValidation: WorkplaceValidationState[];
}

export interface WorkplaceValidationState {
  isValidOrganization: boolean;
  isValidAddress: boolean;
}
