import { Workplace } from '../apis/first-approval-api';

export function getInitials(firstName?: string, lastName?: string): string {
  const firstNameInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

  return `${firstNameInitial}${lastNameInitial}`;
}

export function getCurrentWorkplaceString(workplaces: Workplace[]): string {
  const workplace = workplaces?.find((workplace) => !workplace.isFormer);
  return (
    `${workplace?.organization?.name ?? ''} ${
      workplace?.department?.name ?? ''
    }`.trim() ?? ''
  );
}
