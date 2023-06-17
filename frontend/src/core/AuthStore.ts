import { OauthType } from 'src/apis/first-approval-api';
import { authService } from './auth';

export class AuthStore {
  token: string | undefined;

  exchangeToken(code: string): void {
    authService
      .authorize({ code, type: OauthType.GOOGLE })
      .then((response) => {
        this.token = response.data.token;
      })
      .catch((e) => {
        console.error(e);
      });
  }
}

export const loadAuthUrls = async (): Promise<{ google?: string }> => {
  const urls = await authService.authorizationLinks();
  return urls.data;
};
