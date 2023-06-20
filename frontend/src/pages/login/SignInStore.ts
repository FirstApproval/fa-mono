import { action, makeObservable, observable } from 'mobx';
import { type AuthorizeRequest } from '../../apis/first-approval-api';
import { authService } from '../../core/service';
import { authStore } from '../../core/auth';

export class SignInStore {
  email: string = '';
  password: string = '';

  isError = false;
  isCodeError = false;
  isSubmitting = false;

  constructor() {
    makeObservable(this, {
      email: observable,
      password: observable,
      isError: observable,
      isCodeError: observable,
      isSubmitting: observable,
      setEmail: action,
      setPassword: action
    });
  }

  setEmail = (value: string): void => {
    this.email = value;
  };

  setPassword = (value: string): void => {
    this.password = value;
  };

  getAuthorizeRequestData(): AuthorizeRequest {
    return {
      email: this.email,
      password: this.password
    };
  }

  async submitAuthorizationRequest(): Promise<void> {
    const request = this.getAuthorizeRequestData();
    this.isError = false;
    this.isSubmitting = true;
    try {
      const response = await authService.authorize(request);
      authStore.token = response.data.token;
    } catch (e) {
      this.isError = true;
    } finally {
      this.isSubmitting = false;
    }
  }
}
