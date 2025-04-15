import { OauthType } from '../../apis/first-approval-api';

export enum Page {
  LOADING,

  SIGN_IN,
  SIGN_UP,

  HOME_PAGE,

  CONTACTS_PAGE,

  CHOOSE_DATA_COLLECTION_PAGE,
  PUBLICATION,
  SHARING_OPTIONS,

  PROFILE,
  ACCOUNT,

  SIGN_UP_NAME,
  AFFILIATIONS,
  SIGN_UP_PASSWORD,
  EMAIL_VERIFICATION,

  RESET_PASSWORD,
  RESTORE_PASSWORD_EMAIL,

  NAME,
  EMAIL,
  CHANGE_EMAIL_VERIFICATION,

  CONTEST_PAGE,

  COLLABORATIONS_PAGE,
  COLLABORATIONS_CHAT
}

export const pathToOauthType: Record<string, OauthType> = {
  '/facebook-callback': OauthType.FACEBOOK,
  '/google-callback': OauthType.GOOGLE,
  '/linkedin-callback': OauthType.LINKEDIN,
  '/orcid-callback': OauthType.ORCID
};
export const chooseDataCollectionPath = '/choose-data-collection'
export const shortPublicationPath = '/p/';
export const publicationPath = '/publication';
export const signInPath = '/sign_in';
export const signUpPath = '/sign_up';
export const namePath = '/name';
export const emailPath = '/e-mail';
export const contactsPath = '/contacts';
export const affiliationsPath = '/affiliations';
export const shortAuthorPath = '/a/';
export const authorPath = '/author/';
export const profilePath = '/profile/';
export const accountPath = '/account/';
export const emailChangeConfirmationPath = '/email-change-confirmation/';
export const registrationConfirmationPath = '/registration-confirmation/';
export const contestPath = '/contest';
export const passwordChangeConfirmation = '/password-change-confirmation'
export const collaborationPath = '/collaborations/';
export const collaborationChatPath = '/collaborations/chat/';
