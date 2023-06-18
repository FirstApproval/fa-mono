import { makeObservable, observable } from 'mobx';
import {
  type RegistrationRequest,
  type RegistrationResponse,
  type SubmitRegistrationRequest
} from '../../apis/first-approval-api';
import { registrationService } from '../../core/service';
import { authStore } from '../../core/auth';

export class SignUpStore {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  code: string = '';

  lastResponse: RegistrationResponse | undefined;

  isError = false;
  isSubmitting = false;

  constructor() {
    makeObservable(this, {
      email: observable,
      firstName: observable,
      lastName: observable,
      password: observable,
      code: observable,
      isError: observable,
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
    this.isSubmitting = true;
    try {
      const response = await registrationService.confirmRegistration(request);
      authStore.token = response.data.token;
    } catch (e) {
      this.isError = true;
    } finally {
      this.isSubmitting = false;
    }
  }
}
