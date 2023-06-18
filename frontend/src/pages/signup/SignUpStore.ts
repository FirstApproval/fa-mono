import { makeObservable, observable } from 'mobx';
import {
  type RegistrationRequest,
  type RegistrationResponse
} from '../../apis/first-approval-api';
import { registrationService } from '../../core/service';

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

  getRequestData(): RegistrationRequest {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      email: this.email
    };
  }

  async submitRequestData(): Promise<void> {
    const request = this.getRequestData();
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
}
