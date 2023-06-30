import { AuthApi, RegistrationApi, UserApi } from '../apis/first-approval-api';

export const registrationService = new RegistrationApi();

export const userService = new UserApi();

export const authService = new AuthApi();
