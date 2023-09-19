import { Workplace } from '../apis/first-approval-api';

export function getInitials(firstName?: string, lastName?: string): string {
  const firstNameInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

  return `${firstNameInitial}${lastNameInitial}`;
}

export function getCurrentWorkplacesString(workplaces: Workplace[]): string {
  return (
    workplaces
      ?.filter((workplace) => !workplace.isFormer)
      .map(
        (workplace) =>
          `${workplace.department?.name ?? ''} ${
            workplace.organization?.name ?? ''
          }  ${workplace.address ?? ''}`.trim() ?? ''
      )
      .join(', ') ?? ''
  );
}
