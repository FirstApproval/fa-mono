import { OauthType } from '../../apis/first-approval-api';

export enum Page {
  LOADING,

  SIGN_IN,
  SIGN_UP,

  HOME_PAGE,

  PUBLICATION,
  SHARING_OPTIONS,

  PROFILE,
  ACCOUNT,

  SIGN_UP_NAME,
  SELF_INFO,
  SIGN_UP_PASSWORD,
  EMAIL_VERIFICATION,

  RESET_PASSWORD,
  RESTORE_PASSWORD_EMAIL
}

export const pathToOauthType: Record<string, OauthType> = {
  '/facebook-callback': OauthType.FACEBOOK,
  '/google-callback': OauthType.GOOGLE,
  '/linkedin-callback': OauthType.LINKEDIN,
  '/orcid-callback': OauthType.ORCID
};
export const shortPublicationPath = '/p/';
export const publicationPath = '/publication/';
export const shortAuthorPath = '/a/';
export const authorPath = '/author/';
export const profilePath = '/profile/';
export const accountPath = '/account/';

export const ACCOUNT_AFFILIATIONS_PATH = '/account/affiliations';
