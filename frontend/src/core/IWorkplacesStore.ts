import {
  OrganizationDepartment,
  Organization,
  Workplace
} from '../apis/first-approval-api';

export interface IWorkplacesStore {
  workplaces: Workplace[];
  workplacesProps: WorkplaceProps[];
}

export interface WorkplaceProps {
  orgQuery: string;
  departmentQuery: string;
  departmentQueryKey: string;
  organizationOptions: Organization[];
  departmentOptions: OrganizationDepartment[];
}
