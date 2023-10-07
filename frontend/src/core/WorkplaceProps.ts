import { Organization, Workplace } from '../apis/first-approval-api';

export interface WorkplaceProps {
  orgQuery: string;
  orgQueryKey: string;
  organizationOptions: Organization[];
}

export interface IWorkplaceStore {
  workplaces: Workplace[];
  workplacesProps: WorkplaceProps[];
  workplacesValidation: WorkplaceValidationState[];
}

export interface WorkplaceValidationState {
  isValidOrganization: boolean;
}
