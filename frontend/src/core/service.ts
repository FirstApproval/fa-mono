import {
  AuthApi,
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

export const registrationService = new RegistrationApi();

export const userService = new UserApi();

export const authService = new AuthApi();

export const fileService = new FileApi(configuration);

export const publicationService = new PublicationApi(configuration);
