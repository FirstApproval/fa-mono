import { makeObservable, observable } from 'mobx';
import { type RequestPasswordResetRequest } from '../../apis/first-approval-api';
import { userService } from '../../core/service';

export class RestorePasswordStore {
  email: string = '';

  isError = false;
  isSubmitting = false;

  constructor() {
    makeObservable(this, {
      email: observable,
      isError: observable,
      isSubmitting: observable
    });
  }

  getRequestPasswordResetRequestData(): RequestPasswordResetRequest {
    return {
      email: this.email
    };
  }

  async submitRegistrationRequest(): Promise<void> {
    const request = this.getRequestPasswordResetRequestData();
    this.isError = false;
    this.isSubmitting = true;
    try {
      await userService.requestPasswordReset(request);
    } catch (e) {
      this.isError = true;
    } finally {
      this.isSubmitting = false;
    }
  }
}
