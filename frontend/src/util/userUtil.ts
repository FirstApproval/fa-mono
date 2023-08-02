export function getInitials(firstName?: string, lastName?: string): string {
  const firstNameInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

  return `${firstNameInitial}${lastNameInitial}`;
}
