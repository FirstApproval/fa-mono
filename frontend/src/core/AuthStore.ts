import { makeObservable, observable } from 'mobx';
import { setBearerAuthToObject } from '../apis/first-approval-api/common';

const ACCESS_TOKEN_KEY = 'access-token';

export class AuthStore {
  private _token: string | undefined = undefined;

  constructor() {
    makeObservable<AuthStore, '_token'>(this, {
      _token: observable
    });

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token !== null) {
      this.token = token;
    }
  }

  get token(): string | undefined {
    return this._token;
  }

  set token(value: string | undefined | null) {
    this._token = value ?? undefined;
    if (this._token !== undefined) {
      void setBearerAuthToObject(this._token);
      localStorage.setItem(ACCESS_TOKEN_KEY, this._token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }
}
