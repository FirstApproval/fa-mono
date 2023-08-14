import {
  AuthApi,
  AuthorApi,
  type Configuration,
  FileApi,
  PublicationApi,
  RegistrationApi,
  UserApi
} from '../apis/first-approval-api';
import { authStore } from './auth';

const configuration: Configuration = {
  accessToken: async () => await Promise.resolve(authStore.token ?? ''),
  isJsonMime(mime: string): boolean {
    return (
      mime.toLowerCase() === 'application/json' ||
      mime.toLowerCase().startsWith('application/json;')
    );
  }
};

export const registrationService = new RegistrationApi(configuration);

export const userService = new UserApi(configuration);

export const authorService = new AuthorApi(configuration);

export const authService = new AuthApi(configuration);

export const fileService = new FileApi(configuration);

export const publicationService = new PublicationApi(configuration);
