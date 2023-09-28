import { LicenseType } from '../apis/first-approval-api';

export const getContentLicensingAbbreviation = (
  licenseType: LicenseType | null
): string => {
  switch (licenseType) {
    case LicenseType.ATTRIBUTION_NO_DERIVATIVES: {
      return 'CC BY-ND';
    }
    case LicenseType.ATTRIBUTION_NO_DERIVATIVES_NON_COMMERCIAL: {
      return 'CC BY-NC-ND';
    }
    default: {
      return '';
    }
  }
};
