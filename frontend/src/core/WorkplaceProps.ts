import {
  Organization,
  OrganizationDepartment
} from '../apis/first-approval-api';

export interface WorkplaceProps {
  orgQuery: string;
  departmentQuery: string;
  departmentQueryKey: string;
  organizationOptions: Organization[];
  departmentOptions: OrganizationDepartment[];
}
