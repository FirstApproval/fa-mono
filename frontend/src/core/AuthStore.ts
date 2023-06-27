import {
  type AuthorizationLinksResponse,
  type OauthType
} from 'src/apis/first-approval-api';

import { authService } from './service';
import { makeObservable, observable } from 'mobx';

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

  async exchangeToken(code: string, type: OauthType): Promise<void> {
    const response = await authService.authorizeOauth({
      code,
      type
    });
    this.token = response.data.token;
  }

  get token(): string | undefined {
    return this._token;
  }

  set token(value: string | undefined | null) {
    this._token = value ?? undefined;
  }
}

export const loadAuthUrls = async (): Promise<AuthorizationLinksResponse> => {
  const urls = await authService.authorizationLinks();
  return urls.data;
};
