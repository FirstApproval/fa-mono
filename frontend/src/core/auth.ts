import { AuthStore } from './AuthStore';
import { AuthApi } from '../apis/first-approval-api';

export const authService = new AuthApi();
export const authStore = new AuthStore();
