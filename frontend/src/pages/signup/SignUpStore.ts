import { makeAutoObservable } from 'mobx';
import {
  type RegistrationRequest,
  type RegistrationResponse,
  type SubmitRegistrationRequest
} from '../../apis/first-approval-api';
import { registrationService, userService } from '../../core/service';
import { authStore } from '../../core/auth';
import { type AxiosError } from 'axios';
import { routerStore } from '../../core/router';
import { UTM_SOURCE_KEY } from '../../core/router/RouterStore';

export const REGISTRATION_CONFIRMATION_TOKEN_STORAGE_KEY = 'registration_token';

export class SignUpStore {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  code: string = '';

  lastResponse: RegistrationResponse | undefined;

  isError = false;
  isCodeError = false;
  isSubmitting = false;

  constructor() {
    makeAutoObservable(this);
  }

  getRegistrationRequestData(): RegistrationRequest {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      email: this.email,
      utmSource: localStorage.getItem(UTM_SOURCE_KEY) ?? undefined
    };
  }

  getSubmitRegistrationRequestData(): SubmitRegistrationRequest | undefined {
    if (this.lastResponse === undefined) return undefined;
    return {
      registrationToken: this.lastResponse.registrationToken,
      code: this.code
    };
  }

  async sendCodeAgain(): Promise<void> {
    const request = this.getRegistrationRequestData();
    this.isError = false;
    this.isSubmitting = true;
    try {
      const response = await registrationService.startRegistration(request);
      this.lastResponse = response.data;
      localStorage.setItem(
        REGISTRATION_CONFIRMATION_TOKEN_STORAGE_KEY,
        response.data.registrationToken
      );
    } catch (e) {
      this.isError = true;
    } finally {
      this.isSubmitting = false;
    }
  }

  async submitRegistrationRequest(): Promise<void> {
    const request = this.getSubmitRegistrationRequestData();
    if (request === undefined) {
      return;
    }
    this.isError = false;
    this.isCodeError = false;
    this.isSubmitting = true;
    try {
      const response = await registrationService.confirmRegistration(request);
      authStore.token = response.data.token;
      this.email = '';
      this.firstName = '';
      this.lastName = '';
      this.password = '';
      this.code = '';
      void routerStore.navigateAfterLogin();
    } catch (e) {
      const error = e as AxiosError;
      const code = error.response?.status;
      if (code !== undefined && code === 403) {
        this.isCodeError = true;
      } else {
        this.isError = true;
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    this.isError = false;
    this.isSubmitting = true;

    try {
      const response = await userService.existsByEmail(email);
      return response.data;
    } finally {
      this.isSubmitting = false;
    }
  }
}
