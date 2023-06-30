import { type OauthType } from 'src/apis/first-approval-api';

import { makeObservable, observable } from 'mobx';
import { setBearerAuthToObject } from '../apis/first-approval-api/common';

const ACCESS_TOKEN_KEY = 'access-token';

export class AuthStore {
  private _token: string | undefined;

  constructor() {
    makeObservable<AuthStore, '_token'>(this, {
      _token: observable
    });

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token !== null) {
      this.token = token;
    }
  }

  async exchangeToken(code: string, type: OauthType): Promise<void> {}

  get token(): string | undefined {
    return this._token;
  }

  set token(value: string | undefined | null) {
    this._token = value ?? undefined;
    if (this._token !== undefined) {
      void setBearerAuthToObject(this._token);
      localStorage.setItem(ACCESS_TOKEN_KEY, this._token);
    }
  }
}
