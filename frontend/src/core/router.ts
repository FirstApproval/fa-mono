import { useEffect, useState } from 'react';
import { usePath } from './history';
import { authStore } from './auth';
import { OauthType } from '../apis/first-approval-api';

export enum Page {
  LOADING,

  SIGN_IN,
  SIGN_UP,

  HOME_PAGE,

  SIGN_UP_NAME,
  SIGN_UP_PASSWORD,
  EMAIL_VERIFICATION
}

const pathToOauthType: Record<string, OauthType> = {
  '/google-callback': OauthType.GOOGLE,
  '/linkedin-callback': OauthType.LINKEDIN
};

export const useRouter = (
  setAuthError: (value: boolean) => void
): { page: Page; setPage: (value: Page) => void } => {
  const [page, setPage] = useState(Page.LOADING);
  const { path, queryParams } = usePath();

  useEffect(() => {
    const authType = pathToOauthType[path] ?? undefined;
    const authCode = queryParams.get('code') ?? undefined;

    if (authType === undefined || authCode === undefined) {
      setPage(authStore.token !== undefined ? Page.HOME_PAGE : Page.SIGN_IN);
    } else {
      authStore
        .exchangeToken(authCode, authType)
        .then(() => {
          window.history.replaceState({}, document.title, '/');
          setPage(Page.HOME_PAGE);
        })
        .catch(() => {
          setAuthError(true);
          setPage(Page.SIGN_IN);
        });
    }
  }, [path, queryParams]);

  return { page, setPage };
};
