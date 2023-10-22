import { Workplace } from '../apis/first-approval-api';

export function getInitials(firstName?: string, lastName?: string): string {
  const firstNameInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

  return `${firstNameInitial}${lastNameInitial}`;
}

export function getCurrentWorkplacesString(workplaces: Workplace[]): string {
  const formattedWorkplaces = workplaces
    .map((workplace) =>
      [
        workplace.department,
        workplace.organization?.name,
        workplace.address,
        workplace.postalCode
      ]
        .filter(Boolean)
        .join(', ')
    )
    .join('. ');
  return formattedWorkplaces ? `${formattedWorkplaces}.` : '';
}

export const renderProfileImage = (profileImage: string | undefined): string =>
  profileImage
    ? 'data:image/png;base64,' +
      profileImage.substring(profileImage.indexOf(',') + 1)
    : '';
