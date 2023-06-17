import { OauthType } from 'src/apis/first-approval-api';

import { authService } from './service';

const ACCESS_TOKEN_KEY = 'access-token';

export class AuthStore {
  token: string | undefined;

  constructor() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token !== null) {
      this.token = token;
    }
  }

  async exchangeToken(code: string): Promise<void> {
    const response = await authService.authorize({
      code,
      type: OauthType.GOOGLE
    });
    this.token = response.data.token;
  }
}

export const loadAuthUrls = async (): Promise<{ google?: string }> => {
  const urls = await authService.authorizationLinks();
  return urls.data;
};
