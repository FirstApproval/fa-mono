import {makeObservable, observable} from 'mobx';
import {
    type RegistrationRequest,
    type RegistrationResponse,
    type SubmitRegistrationRequest
} from '../../apis/first-approval-api';
import {registrationService, userService} from '../../core/service';
import {authStore} from '../../core/auth';
import {type AxiosError} from 'axios';

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
    makeObservable(this, {
      email: observable,
      firstName: observable,
      lastName: observable,
      password: observable,
      code: observable,
      isError: observable,
      isCodeError: observable,
      isSubmitting: observable
    });
  }

  getRegistrationRequestData(): RegistrationRequest {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      email: this.email
    };
  }

  getSubmitRegistrationRequestData(): SubmitRegistrationRequest | undefined {
    if (this.lastResponse === undefined) return undefined;
    return {
      registrationToken: this.lastResponse.registrationToken,
      code: this.code
    };
  }

  async submitRegistrationRequest(): Promise<void> {
    const request = this.getRegistrationRequestData();
    this.isError = false;
    this.isSubmitting = true;
    try {
      const response = await registrationService.startRegistration(request);
      this.lastResponse = response.data;
    } catch (e) {
      this.isError = true;
    } finally {
      this.isSubmitting = false;
    }
  }

  async submitSubmitRegistrationRequest(): Promise<void> {
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
