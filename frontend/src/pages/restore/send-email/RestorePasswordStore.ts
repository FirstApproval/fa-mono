import { makeObservable, observable } from 'mobx';
import { type RequestPasswordResetRequest } from '../../../apis/first-approval-api';
import { userService } from '../../../core/service';

export class RestorePasswordStore {
  email: string = '';

  isError = false;
  isSubmitted = false;
  isSentAgain = false;
  isSubmitting = false;

  constructor() {
    makeObservable(this, {
      email: observable,
      isError: observable,
      isSubmitted: observable,
      isSentAgain: observable,
      isSubmitting: observable
    });
  }

  getRequestPasswordResetRequestData(): RequestPasswordResetRequest {
    return {
      email: this.email
    };
  }

  async submitRegistrationRequest(): Promise<void> {
    if (this.isSentAgain) {
      return;
    }
    this.isSubmitting = true;
    const request = this.getRequestPasswordResetRequestData();
    this.isError = false;
    try {
      await userService.requestPasswordReset(request);
    } catch (e) {
      this.isError = true;
    } finally {
      if (this.isSubmitted) {
        this.isSentAgain = true;
      }
      this.isSubmitted = true;
      this.isSubmitting = false;
    }
  }
}
